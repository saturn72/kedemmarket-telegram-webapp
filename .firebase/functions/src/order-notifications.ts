import {
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import {logger} from "firebase-functions/v1";
import {App} from "firebase-admin/app";

// let _app: App | undefined = undefined;
export const init = (app: App): void => {
  // _app = app;
};

export const onOrderUpdated = onDocumentUpdated("orders/{docId}",
  async (event) => {
    logger.debug("onDocumentUpdated was triggered with event:", event);

    const doc = event.data?.after.data();
    if (!doc) {
      return;
    }

    // const token =
    //   logger.debug("doc:", doc.userId);


    // const messaging = getMessaging(_app);

    // const message = {
    //   topic: "order",
    //   data: {
    //     action: "updated",
    //   },
    // };

    // const sendResult = await messaging.send(message);
    // logger.debug("this is send message result:", sendResult);
  });

