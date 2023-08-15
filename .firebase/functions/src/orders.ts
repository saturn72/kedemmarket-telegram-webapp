import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { validateAuth } from "./requestUtils";

import {
    getFirestore,
} from "firebase-admin/firestore";

export const getOrders = onCall(async (req): Promise<any> => {
    logger.debug("start getOrderById", { structuredData: true });

    const { uid } = validateAuth(req);
    const pageSize = req.data?.pageSize || 10;
    const skip = req.data?.skip || 0;

    const orders = await getFirestore()
        .collection("orders")
        .where("userId", "==", uid)
        .orderBy("utcTimestamp")
        .limit(pageSize)
        .startAt(skip)
        .get();

    console.log("this is data:", orders.docs)
    return orders.docs.map(d => d.data());

});

export const getOrderById = onCall(async (req): Promise<any> => {
    logger.debug("start getOrderById", { structuredData: true });

    const { uid } = validateAuth(req);

    console.log(uid, req)

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

    logger.debug("start getOrderById", { structuredData: true });

    // return {
    //     items,
    // };
});