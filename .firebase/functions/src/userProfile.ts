import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth} from "./requestUtils";
import {
  DocumentData,
  QueryDocumentSnapshot,
  getFirestore,
} from "firebase-admin/firestore";
import * as _ from "lodash";

const USER_PROFILE_COLLECTION_NAME = "user-profiles";

export async function getUserProfiles(uid: string):
  Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const userCarts = await getFirestore()
    .collection(USER_PROFILE_COLLECTION_NAME)
    .where("userId", "==", uid)
    .limit(1)
    .get();

  return userCarts.docs;
}

export const getUserProfile = onCall(async (req): Promise<any> => {
  logger.debug("start getUserProfile", {structuredData: true});

  const {uid} = validateAuth(req);

  const profiles = await getUserProfiles(uid);
  const profile = profiles.length == 0 ?
    {} :
    _.omit(profiles[0].data, ["userId"]);
  logger.debug("this is user profile:", profile);
  return profile;
});

export const saveUserProfile = onCall(async (req): Promise<any> => {
  logger.debug("start saveUserProfile", {structuredData: true});

  const {uid} = validateAuth(req);

  const profiles = await getUserProfiles(uid);

  if (profiles.length == 0) {
    const col = getFirestore()
      .collection(USER_PROFILE_COLLECTION_NAME);

    const p = {
      userId: uid,
      ownsFirearm: req.data.ownsFirearm,
    };
    await col.add(p);

    logger.debug("user profiles updated");
    return p;
  } else {
    const profile = profiles[0].data();
    profile.ownsFirearm = req.data.ownsFirearm;
    profiles[0].ref.update(profile);

    logger.debug("user profiles created with values:", profile);
    return profile;
  }
});
