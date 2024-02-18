import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth} from "./requestUtils";
import {
  DocumentData,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";

export async function getUserCarts(uid: string):
  Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const userCarts = await getFirestore()
    .collection("carts")
    .where("userId", "==", uid)
    .get();

  return userCarts.docs;
}

export const getOrCreateCart = onCall({enforceAppCheck: true}, async (req): Promise<any> => {
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

export const updateCart = onCall({enforceAppCheck: true}, async (req) => {
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

export async function deleteUserCarts(uid: string) {
  const userCarts = await getUserCarts(uid);

  if (userCarts.length > 0) {
    await userCarts.forEach(async (doc) => {
      await doc.ref.delete();
    });
  }
}
