/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

export const placeOrder = onRequest(async (req, res) => {
    logger.info("start placeOrder", { structuredData: true });

    const body = req.body;

    const writeResult = await getFirestore()
        .collection("orders")
        .add({
            data: body,
            status: 'placed'
        });
    // Send back a message that we've successfully written the message
    res.json({ orderId: writeResult.id });
    res.send(writeResult.id);
});

export const updateCart = onRequest((request, response) => {
    logger.info("This is update cart!", { structuredData: true });
    response.send("Hello from updateCart!");
});
