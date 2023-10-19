export default defineAppConfig({
    reCaptcha: '6LeGYmwnAAAAAHATMfKr91nVJKL53CDLjYPXRcto',
    firebase: {
        apiKey: "AIzaSyA-511ETL_Jy7jNGC-TNxpD2Dc5Zo883Dg",
        authDomain: "kedemmarket.co.il",
        projectId: "kedem-market",
        appId: "1:157042094760:web:9cbf91abe34cf03ce4489d",
        storageBucket: "kedem-market.appspot.com",
        messagingSenderId: "157042094760",
        measurementId: "G-N9B0KZT7QR",
        vapidKey: "BMp01e3CFwhlO7uq6EEegvZcf3pev0l88SQVVtWGKomGWB1MlUB_ysPHbze1lNusB3QlwO7OSf1WqDif9-9hg3g"
    },
    defaults: {
        thumbnail: '/logo.jpg',
        logo: '/logo.jpg',
        whatsappPhone: '972542204119'
    },
    routes: {
        account: "/account",
        accountOrders: "/account/orders",
        accountProfile: "/account/profile",
        checkout: "/checkout",
        home: "/",
        login: "/login",
        postPurchaseRoute: "/checkout/order-placed",
        store: "kedemmarket.co.il",
    }
})
