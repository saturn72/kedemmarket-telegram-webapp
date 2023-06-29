<template>
    <v-card>
        <v-card-text>{{payload.address}}</v-card-text>
    </v-card>
</template>
    
<script>

export default {
    props: {
        payload: { type: Object }
    },
}
</script>