import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth, validateData} from "./requestUtils";
import {getMessaging} from "firebase-admin/messaging";

export const subscribeToTopics = onCall(async (req): Promise<any> => {
  logger.debug("start subscribeToTopics", {structuredData: true});
  validateAuth(req);
  validateData(req);

  const {tokens, topics} = req.data;

  if (!tokens || tokens.length == 0 ||
        !topics || topics.length == 0) {
    return;
  }

  const messaging = getMessaging();
  topics.forEach(async (t: string) => {
    const response = await messaging.subscribeToTopic(tokens, t);
    logger.debug(`topic: ${t}, tokens: ${tokens}`);
    logger.debug("response:", response);
  });
});
