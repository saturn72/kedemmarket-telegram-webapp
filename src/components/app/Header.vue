<template>
    <v-app-bar flat>
        <template v-slot:image>
            <v-img style=" opacity:0.35" cover :src="useAppConfig().defaults.thumbnail"></v-img>
        </template>

        <template v-slot:append>
            <v-btn variant='outlined' density="compact" icon="mdi-arrow-left" @click="$router.back()"></v-btn>
        </template>
        <template v-slot:prepend>
            <v-sheet rounded color="grey-lighten-5">
                <v-row>
                    <v-col>
                        <a :href="`tel:${useAppConfig().defaults.whatsappPhone}`">
                            <v-icon color="success">mdi-phone</v-icon></a>
                    </v-col>
                    <v-col>
                        <v-btn color="success" density="compact" icon="mdi-whatsapp" @click="toChat"></v-btn>
                    </v-col>
                </v-row>
            </v-sheet>
        </template>
    </v-app-bar>
</template>

<script>
import { startChat } from "~/services/whatsapp";
export default {
    methods: {
        toChat() {
            startChat();
        }
    }

}
</script>