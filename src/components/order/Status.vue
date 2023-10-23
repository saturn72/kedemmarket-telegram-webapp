<template>
    <v-chip size="small" :color="statusInfo.color" :append-icon="statusInfo.icon">{{ order.status }}</v-chip>
</template>
<script>
export default {
    props: {
        order: { type: Object }
    },
    computed: {
        statusInfo() {
            switch (this.order.status) {
                case "submitted": return { color: "info", icon: "mdi-email-fast" };
                case "pending": return { color: "secondary", icon: "mdi-timer-sand-paused" };
                case "processing": return { color: "primary", icon: "mdi-timer-sand" };
                case "complete": return { color: "green", icon: "mdi-check" };
                case "cancelled": return { color: "error", icon: "mdi-cancel" };
                default:
                    return { color: undefined, icon: "mdi-error" };
            }
        }
    }
}
</script>