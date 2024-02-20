import * as functions from "firebase-functions/v1";
import {deleteUserCartsInternal} from "./cart";

export const onAnonymousUserDeleted =
    functions.auth.user().onDelete(async (user): Promise<any> => {
      const uid = user.uid;
      await deleteUserCartsInternal(uid);
    });
