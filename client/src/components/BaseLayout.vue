<template>
    <ion-page>
        <TheHeader :title="pageTitle" :show-menu="showMenu" :back-url="backLink">
            <template #actions>
                <slot name="actions"></slot>
            </template>
        </TheHeader>

        <ion-content :color="contentColor" class="ion-padding">
            <slot></slot>
        </ion-content>
    </ion-page>
</template>

<script setup>
/**
 * BaseLayout Component
 * Used as a wrapper for all application pages to ensure consistent 
 * header behavior, padding, and background coloring.
 */
import { IonPage, IonContent } from '@ionic/vue';
import TheHeader from '@/components/TheHeader.vue';
/**
 * Component Props
 * @property {String} pageTitle - The text displayed in the center of the toolbar.
 * @property {Boolean} showMenu - Whether to display the side-menu (hamburger) toggle.
 * @property {String} backLink - If provided, shows a back button pointing to this URL.
 * @property {String} contentColor - Sets the background color using Ionic color variables (e.g., 'light', 'primary').
 */
defineProps({
    pageTitle: {
        type: String,
        default: ''
    },
    showMenu: {
        type: Boolean,
        default: false
    },
    backLink: {
        type: String,
        default: ''
    },
    contentColor: {
        type: String,
        default: 'light'
    }
});
</script>