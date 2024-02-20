import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {validateAuth} from "./requestUtils";
import {
  DocumentData,
  QueryDocumentSnapshot,
  getFirestore,
  Timestamp,
} from "firebase-admin/firestore";
import {
  deleteUserCartsInternal,
  getUserCartsInternal,
  updateCartInternal,
} from "./cart";

const USER_PROFILE_COLLECTION_NAME = "user-profiles";

export async function getUserProfilesInternal(uid: string):
  Promise<QueryDocumentSnapshot<DocumentData>[]> {
  const userCarts = await getFirestore()
    .collection(USER_PROFILE_COLLECTION_NAME)
    .where("userId", "==", uid)
    .limit(1)
    .get();

  return userCarts.docs;
}

export const fromAnonymousUser = onCall({enforceAppCheck: true}, async (req):
  Promise<any> => {
  logger.debug("start fromAnonymousUser", {structuredData: true});
  const {uid} = validateAuth(req);

  const auid = req.data.anonymousUid;

  const q = getUserCartsInternal(auid);
  const p = await q.limit(1).get();
  const allAnonymousUserCarts = p.docs;

  if (allAnonymousUserCarts.length > 0) {
    const items = allAnonymousUserCarts[0].data().items;
    await updateCartInternal(uid, items);
    await deleteUserCartsInternal(auid);
  }

  await deleteUserProfileInternal(auid);
});

export const deleteUserProfileInternal = async (uid: string) => {
  const profiles = await getUserProfilesInternal(uid);

  if (profiles.length == 0) {
    profiles.forEach(async (doc) => {
      await doc.ref.delete();
    });
  }
};

export const getUserProfile =
  onCall({enforceAppCheck: true}, async (req): Promise<any> => {
    logger.debug("start getUserProfile", {structuredData: true});

    const {uid} = validateAuth(req);

    const profiles = await getUserProfilesInternal(uid);

    if (profiles.length == 0) {
      const msg = `no user profile was found for uid:${uid}`;
      logger.debug(msg, {structuredData: true});
      return {};
    }

    const p = profiles[0].data();
    const res = {
      billingInfo: p.billingInfo,
      shipping: p.shipping,
    };

    const msg = `user profile found for uid:${uid} = ${res}`;
    logger.debug(msg, {structuredData: true});
    return res;
  });

export const saveUserProfile =
  onCall({enforceAppCheck: true}, async (req): Promise<any> => {
    logger.debug("start saveUserProfile", {structuredData: true});

    const {uid} = validateAuth(req);

    const profiles = await getUserProfilesInternal(uid);

    if (profiles.length == 0) {
      const col = getFirestore()
        .collection(USER_PROFILE_COLLECTION_NAME);

      const p = {
        userId: uid,
        billingInfo: req.data.billingInfo || {},
        shipping: req.data.shipping || {},
        updatedOnUtc: Timestamp.now(),
      };
      await col.add(p);

      logger.debug("user profiles updated");
      return p;
    } else {
      const profile = profiles[0].data();
      profile.billingInfo = req.data.billingInfo;
      profile.shipping = req.data.shipping;
      profile.updatedOnUtc = Timestamp.now();

      profiles[0].ref.update(profile);

      logger.debug("user profiles created with values:", profile);
      return profile;
    }
  });
