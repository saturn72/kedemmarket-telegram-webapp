import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth, validateData} from "./requestUtils";
import {
  FieldPath,
  getFirestore,
  Timestamp,
} from "firebase-admin/firestore";

import {deleteUserCarts} from "./cart";
import {getUserProfiles} from "./userProfile";

export const submitOrder = onCall(async (req) => {
  logger.debug("start submitOrder", {structuredData: true});

  const {uid} = validateAuth(req);
  validateData(req);

  const profiles = await getUserProfiles(req.data.userId);
  const userProfile = profiles[0].data();

  const o = {
    createdOnUtc: Timestamp.now(),
    ipAddress: req.rawRequest.ip,
    items: req.data.items,
    orderTotal: req.data.orderTotal,
    originalSentItems: req.data.originalSentItems,
    paymentMethod: req.data.paymentMethod || "cash",
    shippingAddress: req.data.shippingAddress,
    status: "submitted",
    submitterUserId: req.auth?.uid,
    totalDiscounts: req.data.totalDiscounts,
    user: userProfile,
    userId: req.data.userId,
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

const getOrdersInternal =
  (uid: string, status: string[] | undefined = undefined) => {
    let f = getFirestore()
      .collection("orders")
      .where("userId", "==", uid);

    if (status) {
      f = f.where("status", "in", status);
    }

    return f.orderBy("createdOnUtc", "desc");
  };

export const getOrders = onCall(async (req): Promise<any> => {
  logger.debug("start getOrderById", {structuredData: true});

  const {uid} = validateAuth(req);
  const {pageSize = 10, skip = 0, status = []} = req.data;
  logger.debug("pageSize, skip, status", pageSize, skip, status);

  const t = await getOrdersInternal(uid, status)
    .count()
    .get();

  const total = t.data().count;
  logger.debug("this is total", total);

  if (total == 0) {
    return {
      total,
      pageSize,
      skip,
      orders: [],
    };
  }

  let tmpOrders;
  const prev = getOrdersInternal(uid, status);

  if (skip == 0) {
    tmpOrders = prev.limit(pageSize);
  } else {
    logger.debug("this is the total records: ", total);
    const g = await prev.limit(skip).get();
    const startAfter = g.docs[skip - 1];
    tmpOrders = getOrdersInternal(uid, status)
      .startAfter(startAfter)
      .limit(pageSize);
  }

  const orders = await tmpOrders.get();
  logger.debug("this is data:", orders.docs);

  const o = orders.docs.map((d) => {
    return {
      orderId: d.id,
      ...d.data(),
    };
  });

  return {
    orders: o,
    total,
    pageSize,
    skip,
  };
});

export const getOrderById = onCall(async (req): Promise<any> => {
  logger.debug("start 'getOrderById'", {structuredData: true});
  const {uid} = validateAuth(req);
  validateData(req);

  const orderId = req.data?.orderId;
  if (!orderId) {
    logger.error("orderId is missing");
    return null;
  }
  logger.debug("orderId:", orderId);

  const orders = await getFirestore()
    .collection("orders")
    .where(FieldPath.documentId(), "==", orderId)
    .where("userId", "==", uid)
    .get();

  const docs = orders.docs;
  if (!docs || docs.length == 0) {
    return null;
  }

  logger.debug("this is data:", orders.docs);
  const d = docs[0];

  return {
    orderId: d.id,
    ...d.data(),
  };
});
