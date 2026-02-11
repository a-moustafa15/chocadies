<template>
    <ion-header>
        <ion-toolbar color="primary">

            <ion-buttons slot="start">
                <ion-back-button v-if="backUrl" :default-href="backUrl"></ion-back-button>

                <ion-menu-button v-else-if="showMenu"></ion-menu-button>
            </ion-buttons>

            <ion-title>{{ title }}</ion-title>

            <ion-buttons slot="end">
                <slot name="actions"></slot>
            </ion-buttons>

        </ion-toolbar>
    </ion-header>
</template>

<script setup>
/**
 * Shared Header Component
 * Encapsulates the standard Ionic toolbar structure.
 */

import {
    IonHeader, IonToolbar, IonTitle, IonButtons,
    IonMenuButton, IonBackButton
} from '@ionic/vue';

/**
 * @property {String} title - The text shown in the center of the toolbar.
 * @property {Boolean} showMenu - Controls visibility of the IonMenuButton (hamburger icon).
 * @property {String} backUrl - The fallback route for the Back button. 
 * Note: Presence of backUrl overrides the Menu button.
 */
defineProps({
    title: {
        type: String,
        default: 'Chocadies'
    },
    showMenu: {
        type: Boolean,
        default: false
    },
    backUrl: {
        type: String,
        default: ''
    }
});
</script>