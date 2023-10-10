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
import account from './account';

export default {
    mounted() {
        this.items = Object.values(account);
    },
    data: () => {
        return {
            items: []
        }
    },
    methods: {
        onClick(item) {
            if (item.onClick) {
                item.onClick()
            }
            else {
                navigateTo(item.route);
            }
        }
    }
}
</script>