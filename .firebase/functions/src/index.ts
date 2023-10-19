import * as orders from "./orders";
import * as cart from "./cart";
import * as catalog from "./catalog";
import * as core from "./core";
import * as userProfile from "./userProfile";
import {initializeApp} from "firebase-admin/app";

const app = initializeApp();
catalog.init(app);

export const prepareCartForCheckout = cart.prepareCartForCheckout;
export const getOrCreateCart = cart.getOrCreateCart;
export const updateCart = cart.updateCart;

export const getOrders = orders.getOrders;
export const getOrderById = orders.getOrderById;
export const submitOrder = orders.submitOrder;

export const getUserProfile = userProfile.getUserProfile;
export const saveUserProfile = userProfile.saveUserProfile;

export const subscribeToTopics = core.subscribeToTopics;
// on cloud firestore update
export const onProductWritten = catalog.onProductWritten;
