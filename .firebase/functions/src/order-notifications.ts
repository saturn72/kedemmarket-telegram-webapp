import {
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions/v1";
import { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Message, getMessaging } from "firebase-admin/messaging";

let _app: App | undefined = undefined;
export const init = (app: App): void => {
  _app = app;
};

export const onOrderUpdated = onDocumentUpdated("orders/{docId}",
  async (event) => {
    logger.debug("onDocumentUpdated was triggered with event:", event);

    const doc = event.data?.after.data();
    if (!doc) {
      return;
    }

    const userId = doc.userId;
    if (!userId) {
      return;
    }

    const ut = await getFirestore()
      .collection("tokens")
      .where("userId", "==", userId)
      .get();

    const tokens = ut.docs;
    if (!tokens || tokens.length == 0) {
      return;
    }

    const messaging = getMessaging(_app);
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].data().token;

      const message: Message = {
        token,
        notification: {
          title: "Kedem Market",
          body: "yourOrderHasUpdated"
        },
        webpush: {
          fcmOptions: {
            link: `https://kedemmarket.co.il/account/orders/${doc.id}`,
          },
        },
      };

      const sendResult = await messaging.send(message);
      logger.debug("Notify user on order update:", sendResult);
    }
  });

