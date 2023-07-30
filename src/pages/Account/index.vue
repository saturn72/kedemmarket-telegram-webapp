<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" v-for="item in items" :key="item.route">
                <v-card @click="onClick(item)">
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
import { useUserStore } from '@/stores/user'

export default {
    data: () => {
        return {
            items:
                [{
                    displayText: 'myOrders',
                    route: 'orders',
                    icon: 'mdi-shopping-outline'
                }, {
                    displayText: 'profile',
                    route: 'profile',
                    icon: 'mdi-account-outline'
                }, {
                    displayText: 'logout',
                    onClick: () => { useUserStore().logout() },
                    icon: 'mdi-logout'
                }]
        }
    },
    methods: {
        onClick(item) {
            if (item.onClick) {
                item.onClick()
            }
            else {
                this.$router.push(item.route)
            }
        }
    }
}
</script>