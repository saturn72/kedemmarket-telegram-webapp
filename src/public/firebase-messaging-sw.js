//see: https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js
importScripts('/__/firebase/9.23.0/firebase-app-compat.js');
importScripts('/__/firebase/9.23.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();

messaging.onMessage(function (payload) {
    console.log("this is onMEssage", payload)
});

messaging.onBackgroundMessage(function (payload) {
    const { body, link, title, } = payload.notification;
    const notificationOptions = {
        body,
        icon: "/icon.png",
        link
    };

    self.registration.showNotification(title, notificationOptions);
});