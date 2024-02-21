<template>
    <div class="flex justify-center items-center h-screen mt-12">
        <div class="loader-fruits">
            <div class="emoji">&#127818;</div>
            <div class="emoji">&#127813;</div>
            <div class="emoji">&#127815;</div>
            <div class="emoji">&#x1F954;</div>
            <div class="emoji">&#x1F9C5;</div>
            <div class="emoji">&#127827;</div>
            <div class="emoji">&#129389;</div>
            <div class="emoji">&#x1F951;</div>
        </div>
    </div>
</template>

<style>
@keyframes falling-fruits {
    0% {
        transform: translateY(-100%);
    }

    100% {
        transform: translateY(100%);
    }
}

.loader-fruits {
    width: 100px;
    height: 100px;
    position: relative;
    margin: 0 auto;
}

.loader-fruits div {
    width: 25px;
    height: 25px;
    position: fixed;
    border-radius: 50%;
    background: #F9D71C;
    /* Yellow */
    animation: falling-fruits 1s infinite alternate;
}

.loader-fruits div:nth-child(1) {
    left: 12.5%;
    animation-delay: 0.125s;
}

.loader-fruits div:nth-child(2) {
    left: 25%;
    animation-delay: 0.25s;
}

.loader-fruits div:nth-child(3) {
    left: 37.5%;
    animation-delay: 0.375s;
}

.loader-fruits div:nth-child(4) {
    left: 50%;
    animation-delay: 0.5s;
}

.loader-fruits div:nth-child(5) {
    left: 62.5%;
    animation-delay: 0.625s;
}

.loader-fruits div:nth-child(6) {
    left: 75%;
    animation-delay: 0.75s;
}

.loader-fruits div:nth-child(7) {
    left: 87.5%;
    animation-delay: 0.875s;
}

.loader-fruits div:nth-child(8) {
    left: 100%;
    animation-delay: 1s;
}
</style>
