
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

const validateAuth = (req: { auth?: any }): { uid: string } => {
    if (!req.auth) {
        throw new HttpsError("unauthenticated", "user not authenticated");
    }

    return req.auth;
}

const validateData = (req: { data?: any }) => {
    if (!req.data) {
        throw new HttpsError("failed-precondition", "missing payload");
    }
}

const getUserCarts = async (uid: string):
    Promise<FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]> => {
    const userCarts = await getFirestore()
        .collection("carts")
        .where("userId", "==", uid)
        .limit(1)
        .get();

    return userCarts.docs;
}

export const submitOrder = onCall(async req => {
    logger.debug("start submitOrder", { structuredData: true });

    const { uid } = validateAuth(req);
    validateData(req);

    const writeResult = await getFirestore()
        .collection("orders")
        .add({
            utcTimestamp: new Date().getTime(),
            userId: uid,
            items: req.data,
            status: 'submitted'
        });

    const userCarts = await getUserCarts(uid);

    if (userCarts.length > 0) {
        await userCarts.forEach(async doc => {
            await doc.ref.delete();
        });
    }

    logger.debug("end submitOrder", { structuredData: true });
    return { data: writeResult.id };
});

export const getOrCreateCart = onCall(async (req): Promise<any> => {
    logger.debug("start getOrCreateCart", { structuredData: true });

    const { uid } = validateAuth(req);
    const userCarts = await getUserCarts(uid);
    let items: any[] = [];

    if (userCarts.length > 0) {
        items = userCarts[0].data().items;
    }
    else {
        await getFirestore()
            .collection("carts")
            .add({
                items
            });
    }

    logger.debug("start getOrCreateCart", { structuredData: true });

    return {
        items
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
    }
    else {

        let tmp = userCarts[0].data();
        tmp.items = req.data.items;

        userCarts[0].ref.update(tmp);
    }
});
