<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" v-for="item in items" :key="item.name">
                <v-card @click="$router.push(item.route)">
                    <v-card-title class="d-flex justify-center">
                        <v-icon>{{ item.icon }}</v-icon>
                        &nbsp;
                        {{ $t(item.displayText) }}
                        <v-spacer></v-spacer>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>

export default {
    data: () => {
        return {
            items:
                [{
                    name: "orders",
                    displayText: 'myOrders',
                    route: 'orders',
                    icon: 'mdi-shopping-outline'
                }, {
                    name: "profile",
                    displayText: 'profile',
                    route: 'profile',
                    icon: 'mdi-account-outline'
                }]
        }
    }
}
</script>