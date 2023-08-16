import * as orders from "./orders";
import * as cart from "./cart";
import {initializeApp} from "firebase-admin/app";

initializeApp();

export const prepareCartForCheckout = cart.prepareCartForCheckout;
export const getOrCreateCart = cart.getOrCreateCart;
export const updateCart = cart.updateCart;

export const getOrders = orders.getOrders;
export const getOrderById = orders.getOrderById;
export const submitOrder = orders.submitOrder;
