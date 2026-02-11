<template>
    <ion-menu content-id="main-content" type="overlay" :disabled="!store.isAuthenticated">

        <ion-header>
            <ion-toolbar color="primary">
                <ion-title>Chocadies</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
            <ion-list>
                <template v-if="!store.isAuthenticated">
                    <ion-menu-toggle auto-hide="false">
                        <ion-item router-link="/apply" lines="none" detail="false" class="menu-item">
                            <ion-icon slot="start" :icon="briefcaseOutline"></ion-icon>
                            <ion-label>Apply</ion-label>
                        </ion-item>
                    </ion-menu-toggle>
                </template>

                <ion-menu-toggle auto-hide="false">
                    <ion-item router-link="/dashboard" lines="none" detail="false" class="menu-item">
                        <ion-icon slot="start" :icon="statsChartOutline"></ion-icon>
                        <ion-label>Dashboard</ion-label>
                    </ion-item>
                </ion-menu-toggle>

            </ion-list>
        </ion-content>

    </ion-menu>
</template>

<script setup>
/**
 * Side Navigation Component
 * * This component manages the application's sidebar. It uses the Pinia 
 * applicantStore to conditionally show or hide navigation items based 
 * on the user's authentication status.
 */

import {
    IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonMenuToggle, IonIcon
} from '@ionic/vue';
import { briefcaseOutline, statsChartOutline } from 'ionicons/icons';
import { useApplicantStore } from '@/stores/applicantStore';

// Initialize the store to track authentication state
const store = useApplicantStore();
</script>

<style scoped>
/**
 * Active link styling
 * Ionic automatically applies the .item-active class when the 
 * router-link matches the current URL.
 */
.menu-item.item-active {
    --color: var(--ion-color-primary);
    font-weight: bold;
}
</style>