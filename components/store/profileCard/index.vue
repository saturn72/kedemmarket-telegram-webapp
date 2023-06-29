<template>
    <v-card flat>
        <StoreProfileCardTitle :store="store"></StoreProfileCardTitle>
    </v-card>
</template>
    
<script>

export default {
    props: {
        store: { type: Object }
    },
}
</script>