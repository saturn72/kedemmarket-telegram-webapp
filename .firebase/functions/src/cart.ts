import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth, validateData} from "./requestUtils";
import {
  DocumentData,
  FieldPath,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";
import {getUserProfiles} from "./userProfile";

export async function getUserCarts(uid: string):
  Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const userCarts = await getFirestore()
    .collection("carts")
    .where("userId", "==", uid)
    .get();

  return userCarts.docs;
}

export const getOrCreateCart = onCall(async (req): Promise<any> => {
  logger.debug("start getOrCreateCart", {structuredData: true});

  const {uid} = validateAuth(req);
  const userCarts = await getUserCarts(uid);
  let items: any[] = [];

  if (userCarts.length > 0) {
    items = userCarts[0].data().items;
  } else {
    await getFirestore()
      .collection("carts")
      .add({
        items,
      });
  }

  logger.debug("start getOrCreateCart", {structuredData: true});

  return {
    items,
  };
});

export const updateCart = onCall(async (req) => {
  logger.debug("start updateCart", {structuredData: true});
  const {uid} = validateAuth(req);

  const userCarts = await getUserCarts(uid);

  if (userCarts.length == 0) {
    const carts = getFirestore()
      .collection("carts");
    await carts.add({
      items: req.data.items,
      userId: uid,
    });
  } else {
    const tmp = userCarts[0].data();
    tmp.items = req.data.items;

    userCarts[0].ref.update(tmp);
  }
});

export const prepareCartForCheckout = onCall(async (req) => {
  logger.debug("start prepareCartForCheckout", {structuredData: true});

  validateAuth(req);
  validateData(req);

  const userCart = req.data;
  const o = await getCheckoutCart(userCart);

  logger.debug("end prepareCartForCheckout. output object: ",
    o, {structuredData: true});
  return o;
});

type CartItem = {
  orderedQuantity: number;
  percentageDiscount: number;
  numericDiscount: number;
  priceAfterDiscounts: number;
  priceBeforeDiscounts: number;
  message: string;
  product: {
    id: any
    price: number;
  },
}

type UserCart = {
  items: CartItem[],
  paymentMethod: string;
  userId: any;
}

export async function deleteUserCarts(uid: string) {
  const userCarts = await getUserCarts(uid);

  if (userCarts.length > 0) {
    await userCarts.forEach(async (doc) => {
      await doc.ref.delete();
    });
  }
}
export async function getCheckoutCart(userCart: UserCart) {
  const productIds = userCart.items.map((i: any) => i.product.id);
  const dbProducts = await getFirestore()
    .collection("products")
    .where(FieldPath.documentId(), "in", productIds)
    .get();

  const docs = dbProducts.docs;

  const items = [];

  for (let index = 0; index < userCart.items.length; index++) {
    const cur = userCart.items[index];

    const curDoc = docs.find((pt) => pt.id == cur.product.id);

    const p = curDoc?.data();
    if (!p) {
      cur.message = "item not found";
      cur.priceBeforeDiscounts = 0;
      cur.priceAfterDiscounts = 0;
      cur.numericDiscount = 0;
      cur.percentageDiscount = 0;

      continue;
    }

    cur.priceBeforeDiscounts = cur.orderedQuantity * cur.product.price;
    cur.priceAfterDiscounts = cur.priceBeforeDiscounts;
    cur.numericDiscount = 0;
    cur.percentageDiscount = 0;

    // only tier price is supportted at this point
    if (p.tierPrices && p.tierPrices.length > 0) {
      let lastTier = {quantity: 0};
      for (let idx = 0; idx < p.tierPrices.length; idx++) {
        const curTier = p.tierPrices[idx];

        if (lastTier.quantity < curTier.quantity &&
          cur.orderedQuantity >= curTier.quantity) {
          lastTier = {...curTier};
          cur.priceAfterDiscounts = cur.orderedQuantity * curTier.price;
          cur.percentageDiscount =
            cur.priceAfterDiscounts / cur.priceBeforeDiscounts;
          cur.numericDiscount =
            cur.priceBeforeDiscounts - cur.priceAfterDiscounts;
        }
      }
    }
    items.push(cur);
  }

  let cartTotal = 0;
  let totalDiscounts = 0;
  items.map((x) => {
    cartTotal += x.priceAfterDiscounts;
    totalDiscounts += x.numericDiscount;
  });

  const profiles = await getUserProfiles(userCart.userId);
  const userProfile = profiles[0].data();
  return {userProfile, userCart, items, cartTotal, totalDiscounts};
}
