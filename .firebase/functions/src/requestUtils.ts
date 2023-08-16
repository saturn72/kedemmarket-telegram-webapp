import {HttpsError} from "firebase-functions/v2/https";

export function validateAuth(req: { auth?: any }): { uid: string } {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "user not authenticated");
  }

  return req.auth;
}

export function validateData(req: { data?: any }) {
  if (!req.data) {
    throw new HttpsError("failed-precondition", "missing payload");
  }
}

