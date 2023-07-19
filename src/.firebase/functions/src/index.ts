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

export const addOrder = onRequest(async (req, res) => {
    logger.debug("start addOrder", { structuredData: true });

    const data = req.body;
    if (!data) {
        res.send({ error: "missing cart infos" })
    }

    const writeResult = await getFirestore()
        .collection("orders")
        .add({
            cartItems: data,
            status: 'placed'
        });

    logger.debug("end addOrder", { structuredData: true });
    res.send({ data: writeResult.id });
});

export const updateCart = onRequest((request, response) => {
    logger.info("This is update cart!", { structuredData: true });
    response.send("Hello from updateCart!");
});
