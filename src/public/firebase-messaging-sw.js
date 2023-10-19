// import { onMessage } from "firebase/messaging";
// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// const fcm = getMessaging();
// console.log("this is fcm", fcm)
// onMessage(fcm, (payload) => {
//     console.log('[firebase-messaging-sw.js] NOT IN PUBLIC Received message ', payload);
//     console.log('onMessage. ', payload);
//     // ...
// });

// onBackgroundMessage(fcm, (payload) => {

//     console.log('[firebase-messaging-sw.js] NOT IN PUBLIC  Received background message ', payload);
//     // Customize notification here
//     // const notificationTitle = 'Background Message Title';
//     // const notificationOptions = {
//     //     body: 'Background Message body.',
//     //     icon: '/firebase-logo.png'
//     // };

//     // self.registration.showNotification(notificationTitle,
//     //     notificationOptions);
// });