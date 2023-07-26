
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

export const addOrder = onCall(async req => {
    logger.debug("start addOrder new", { structuredData: true });

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
            status: 'placed'
        });

    logger.debug("end addOrder", { structuredData: true });
    return { data: writeResult.id };
});

export const updateCart = onRequest((request, response) => {
    logger.info("This is update cart!", { structuredData: true });
    response.send("Hello from updateCart!");
});
