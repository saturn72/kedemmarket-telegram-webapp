import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth, validateData} from "./requestUtils";
import {getMessaging} from "firebase-admin/messaging";
import {
  getFirestore,
  Timestamp,
} from "firebase-admin/firestore";

export const subscribeToNotifications = onCall({enforceAppCheck: true}, async (req): Promise<any> => {
  logger.debug("start subscribeToNotifications", {structuredData: true});

  const {uid} = validateAuth(req);
  validateData(req);

  const {tokens, topics} = req.data;

  if (!tokens || tokens.length == 0) {
    return;
  }

  if (topics || topics.length > 0) {
    const messaging = getMessaging();
    topics.forEach(async (t: string) => {
      const response = await messaging.subscribeToTopic(tokens, t);
      const m = `topic: ${t}, tokens: ${tokens}, response`;
      logger.debug(m, response);
    });
  }

  const collection = getFirestore()
    .collection("tokens");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    const ut = await collection
      .where("token", "==", token)
      .get();

    const userTokens = ut.docs;

    if (userTokens.length > 0) {
      const tmp = userTokens[0].data();
      tmp.subscribedOnUtc = Timestamp.now();
      userTokens[0].ref.update(tmp);
    } else {
      await collection
        .add({
          token,
          userId: uid,
          subscribedOnUtc: Timestamp.now(),
        });
    }
  }
});
