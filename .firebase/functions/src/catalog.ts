import {
  onDocumentWritten,
} from "firebase-functions/v2/firestore";
import {getMessaging} from "firebase-admin/messaging";
import {logger} from "firebase-functions/v1";
import {App} from "firebase-admin/app";

let _app: App | undefined = undefined;
export const init = (app: App): void => {
  _app = app;
};
export const onProductWritten = onDocumentWritten("products/{docId}",
  async (event) => {
    logger.debug("onProductWritten was triggered with event:", event);

    const messaging = getMessaging(_app);

    const message = {
      topic: "catalog",
      data: {
        action: "updated",
      },
    };

    const sendResult = await messaging.send(message);
    logger.debug("this is send message result:", sendResult);
  });

