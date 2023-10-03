import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth, validateData} from "./requestUtils";
import {
  getFirestore,
} from "firebase-admin/firestore";

import {deleteUserCarts, getCheckoutCart} from "./cart";

export const submitOrder = onCall(async (req) => {
  logger.debug("start submitOrder", {structuredData: true});

  const {uid} = validateAuth(req);
  validateData(req);

  const checkoutCart = await getCheckoutCart(req.data);
  const o = {
    utcTimestamp: new Date().getTime(),
    ipAddress: req.rawRequest.ip,
    userId: req.auth?.uid,
    status: "submitted",
    items: checkoutCart.items,
    totalDiscounts: checkoutCart.totalDiscounts,
    sentItems: checkoutCart.userCart,
    orderTotal: checkoutCart.cartTotal,
  };

  const orders = getFirestore()
    .collection("orders");
  const writeResult = await orders.add(o);
  await deleteUserCarts(uid);

  logger.debug("end submitOrder", {structuredData: true});
  return {
    orderId: writeResult.id,
    items: req.data.items,
  };
});

export const getOrders = onCall(async (req): Promise<any> => {
  logger.debug("start getOrderById", {structuredData: true});

  const {uid} = validateAuth(req);

  const pageSize = req.data?.pageSize || 10;
  const skip = req.data?.skip || 0;

  const orders = await getFirestore()
    .collection("orders")
    .where("userId", "==", uid)
    .orderBy("utcTimestamp")
    .limit(pageSize)
    .startAt(skip)
    .get();

  console.log("this is data:", orders.docs);
  return orders.docs.map((d) => {
    return {
      orderId: d.id,
      ...d.data(),
    };
  });
});

export const getOrderById = onCall(async (req): Promise<any> => {
  logger.debug("start getOrderById", {structuredData: true});

  const {uid} = validateAuth(req);

  console.log(uid, req);

  // const userCarts = await getUserCarts(uid);
  // let items: any[] = [];

  // if (userCarts.length > 0) {
  //     items = userCarts[0].data().items;
  // } else {
  //     await getFirestore()
  //         .collection("carts")
  //         .add({
  //             items,
  //         });
  // }

  logger.debug("start getOrderById", {structuredData: true});

  // return {
  //     items,
  // };
});
