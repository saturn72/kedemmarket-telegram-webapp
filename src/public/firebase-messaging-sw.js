//see: https://github.com/firebase/quickstart-js/blob/master/messaging/firebase-messaging-sw.js
importScripts('/__/firebase/9.23.0/firebase-app-compat.js');
importScripts('/__/firebase/9.23.0/firebase-messaging-compat.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();

messaging.onMessage(function (payload) {
    console.log("this is onMEssage", payload)
});

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});