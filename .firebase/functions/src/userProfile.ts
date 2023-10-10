import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth} from "./requestUtils";
import {
  getFirestore,
} from "firebase-admin/firestore";


export const getUserProfile = onCall(async (req): Promise<any> => {
  logger.debug("start getUserProfile", {structuredData: true});

  const {uid} = validateAuth(req);

  const profiles = await getFirestore()
    .collection("userProfiles")
    .where("userId", "==", uid)
    .get();

  const profile = profiles.docs[0] ?? {};
  logger.debug("this is user profile:", profile);
  return profile;
});
