export default defineAppConfig({
    reCaptcha: '6LeGYmwnAAAAAHATMfKr91nVJKL53CDLjYPXRcto',
    firebase: {
        apiKey: "AIzaSyA-511ETL_Jy7jNGC-TNxpD2Dc5Zo883Dg",
        authDomain: "kedem-market.firebaseapp.com",
        databaseURL: "https://kedem-market.firebaseio.com",
        projectId: "kedem-market",
        storageBucket: "kedem-market.appspot.com",
        messagingSenderId: "157042094760",
        appId: "1:157042094760:web:9cbf91abe34cf03ce4489d",
        measurementId: "G-N9B0KZT7QR"
    },
    defaults: {
        thumbnail: '/logo.jpg',
        logo: '/logo.jpg',
    },
    routes: {
        home: "/",
        postPurchaseRoute: "/",
        login: "/login",
    }
})
