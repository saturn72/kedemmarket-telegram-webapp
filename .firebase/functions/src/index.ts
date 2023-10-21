import * as orders from "./orders";
import * as cart from "./cart";
import * as orderNotifications from "./order-notifications";
import * as core from "./core";
import * as userProfile from "./userProfile";
import {initializeApp} from "firebase-admin/app";

const app = initializeApp();
orderNotifications.init(app);

export const prepareCartForCheckout = cart.prepareCartForCheckout;
export const getOrCreateCart = cart.getOrCreateCart;
export const updateCart = cart.updateCart;

export const getOrders = orders.getOrders;
export const getOrderById = orders.getOrderById;
export const submitOrder = orders.submitOrder;

export const getUserProfile = userProfile.getUserProfile;
export const saveUserProfile = userProfile.saveUserProfile;

export const subscribeToNotifications = core.subscribeToNotifications;
// on cloud firestore update
export const onOrderUpdated = orderNotifications.onOrderUpdated;
