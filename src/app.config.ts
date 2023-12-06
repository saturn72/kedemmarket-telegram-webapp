export default defineAppConfig({
    reCaptcha: '6LeGYmwnAAAAAHATMfKr91nVJKL53CDLjYPXRcto',
    firebase: {
        apiKey: "AIzaSyA-511ETL_Jy7jNGC-TNxpD2Dc5Zo883Dg",
        authDomain: "kedem-market.firebaseapp.com",
        databaseURL: "https://kedem-market.firebaseio.com",
        projectId: "kedem-market",
        storageBucket: "kedem-market.appspot.com",
        messagingSenderId: "157042094760",
        appId: "1:157042094760:web:0d0130baaa768af4e4489d",
        measurementId: "G-XS6Z5FS3Q5",
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
        accountOpenOrders: "/account/orders/open",
        accountProfile: "/account/profile",
        checkout: "/checkout",
        home: "/",
        login: "/login",
        postPurchaseRoute: "/checkout/order-placed",
        store: "kedemmarket.co.il",
    }
})
