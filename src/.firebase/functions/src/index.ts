
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

export const submitOrder = onCall(async req => {
    logger.debug("start addOrder", { structuredData: true });

    if (!req.auth) {
        throw new HttpsError("unauthenticated", "user not authenticated");
    }
    if (!req.data) {
        throw new HttpsError("failed-precondition", "missing payload");
    }

    const writeResult = await getFirestore()
        .collection("orders")
        .add({
            userId: req.auth.uid,
            cartItems: req.data,
            status: 'submitted'
        });

    //delete from carts collection
    const carts = await getFirestore()
        .collection("carts")
    const query = await carts
        .where("userId", "==", req.auth.uid)
        .limit(1)
        .get();

    if (query.docs.length > 0) {
        await query.forEach(async doc => {
            await doc.ref.delete();
        });
    }

    logger.debug("end addOrder", { structuredData: true });
    return { data: writeResult.id };
});

export const updateCart = onCall(async (req) => {
    logger.debug("start updateCart", { structuredData: true });

    if (!req.auth) {
        throw new HttpsError("unauthenticated", "user not authenticated");
    }

    const collection = await getFirestore()
        .collection("carts");

    const query = await collection
        .where("userId", "==", req.auth.uid)
        .limit(1)
        .get();

    if (query.docs.length == 0) {
        collection
            .add({
                cartItems: req.data.items,
                userId: req.auth.uid,
            });
    }
    else {
        const doc = query.docs[0];
        let tmp = doc.data();
        tmp.cartItems = req.data.items;

        doc.ref.update(tmp);
    }
});
