import {
  onDocumentCreated,
} from "firebase-functions/v2/firestore";
import {logger} from "firebase-functions/v1";
import {App} from "firebase-admin/app";
import config from "./config";
import axios from "axios";

let _app: App | undefined = undefined;
export const init = (app: App): void => {
  _app = app;
};

export const onCatalogCreated = onDocumentCreated("catalog/{docId}",
  async (event) => {
    logger.debug("onDocumentCreated was triggered with event:", event);

    const url = `${config.bffUrl}hooks`;
    await axios({
      method: "put",
      url,
      data: {
        key: "catalog:updated",
      },
    });
  });

