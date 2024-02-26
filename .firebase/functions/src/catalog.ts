import {
  onDocumentCreated,
} from "firebase-functions/v2/firestore";
import {logger} from "firebase-functions/v1";
import config from "./config";
import axios from "axios";

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

