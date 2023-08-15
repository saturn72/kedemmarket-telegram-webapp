
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import {
  DocumentData,
  FieldPath,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";

initializeApp();

const validateAuth = (req: { auth?: any }): { uid: string } => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "user not authenticated");
  }

  return req.auth;
};

const validateData = (req: { data?: any }) => {
  if (!req.data) {
    throw new HttpsError("failed-precondition", "missing payload");
  }
};

const getUserCarts = async (uid: string):
  Promise<QueryDocumentSnapshot<DocumentData>[]> => {
  const userCarts = await getFirestore()
    .collection("carts")
    .where("userId", "==", uid)
    .limit(1)
    .get();

  return userCarts.docs;
};


export const prepareCartForCheckout = onCall(async (req) => {
  logger.debug("start prepareCartForCheckout", { structuredData: true });

  validateAuth(req);
  validateData(req);

  const userCart = req.data;
  const productIds = userCart.items.map((i: any) => i.product.id);
  const dbProducts = await getFirestore()
    .collection("products")
    .where(FieldPath.documentId(), "in", productIds)
    .get();

  const docs = dbProducts.docs;

  const items = [];

  for (let index = 0; index < userCart.items.length; index++) {
    const curItem = userCart.items[index];

    const curDoc = docs.find((pt) => pt.id == curItem.product.id);

    const p = curDoc?.data();
    if (!p) {
      curItem.message = "item not found";
      curItem.priceBeforeDiscounts = 0;
      curItem.priceAfterDiscounts = 0;
      curItem.numericDiscount = 0;
      curItem.percentageDiscount = 0;

      continue;
    }

    curItem.priceBeforeDiscounts = curItem.orderedQuantity * curItem.product.price
    curItem.priceAfterDiscounts = curItem.priceBeforeDiscounts;
    curItem.numericDiscount = 0;
    curItem.percentageDiscount = 0

    // only tier price is supportted at this point
    if (p.tierPrices && p.tierPrices.length > 0) {
      let lastTier = { quantity: 0 };
      for (let idx = 0; idx < p.tierPrices.length; idx++) {
        const curTier = p.tierPrices[idx];

        if (lastTier.quantity < curTier.quantity &&
          curItem.orderedQuantity >= curTier.quantity) {
          lastTier = { ...curTier };
          curItem.priceAfterDiscounts = curItem.orderedQuantity * curTier.price;
          curItem.percentageDiscount = curItem.priceAfterDiscounts / curItem.priceBeforeDiscounts;
          curItem.numericDiscount = curItem.priceBeforeDiscounts - curItem.priceAfterDiscounts;
        }
      }
    }
    items.push(curItem);
  }

  let cartTotal = 0
  let totalDiscounts = 0;
  items.map(x => {
    cartTotal += x.priceAfterDiscounts;
    totalDiscounts += x.numericDiscount;
  });

  const o = { userCart, items, cartTotal, totalDiscounts };
  logger.debug("end prepareCartForCheckout. output object: ", o, { structuredData: true });
  return o;
});

export const submitOrder = onCall(async (req) => {
  logger.debug("start submitOrder", { structuredData: true });

  const { uid } = validateAuth(req);
  validateData(req);

  const writeResult = await getFirestore()
    .collection("orders")
    .add({
      utcTimestamp: new Date().getTime(),
      userId: uid,
      items: req.data,
      status: "submitted",
    });

  const userCarts = await getUserCarts(uid);

  if (userCarts.length > 0) {
    await userCarts.forEach(async (doc) => {
      await doc.ref.delete();
    });
  }

  logger.debug("end submitOrder", { structuredData: true });
  return {
    orderId: writeResult.id,
    items: req.data.items
  };
});

export const getOrCreateCart = onCall(async (req): Promise<any> => {
  logger.debug("start getOrCreateCart", { structuredData: true });

  const { uid } = validateAuth(req);
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

  logger.debug("start getOrCreateCart", { structuredData: true });

  return {
    items,
  };
});

export const updateCart = onCall(async (req) => {
  logger.debug("start updateCart", { structuredData: true });
  const { uid } = validateAuth(req);

  const userCarts = await getUserCarts(uid);

  if (userCarts.length == 0) {
    const carts = getFirestore()
      .collection("carts");
    carts.add({
      items: req.data.items,
      userId: uid,
    });
  } else {
    const tmp = userCarts[0].data();
    tmp.items = req.data.items;

    userCarts[0].ref.update(tmp);
  }
});
