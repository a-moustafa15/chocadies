<template>
    <BaseLayout page-title="Anmelden" back-link="/apply">

        <div class="login-container">

            <div class="ion-text-center ion-margin-bottom">
                <div class="icon-circle">
                    <ion-icon :icon="lockClosed" size="large"></ion-icon>
                </div>
                <h1 class="page-title">Willkommen zurück</h1>
                <p class="subtitle">Bitte anmelden, um Bewerber zu verwalten</p>
            </div>

            <ion-card class="login-card">
                <ion-card-content>
                    <form @submit.prevent="handleLogin">

                        <ion-item class="input-item" lines="full">
                            <ion-icon slot="start" :icon="personCircleOutline" color="medium"></ion-icon>
                            <ion-label position="floating">Benutzername</ion-label>
                            <ion-input v-model="creds.username" type="text" required></ion-input>
                        </ion-item>

                        <ion-item class="input-item" lines="full">
                            <ion-icon slot="start" :icon="keyOutline" color="medium"></ion-icon>
                            <ion-label position="floating">Passwort</ion-label>
                            <ion-input v-model="creds.password" type="password" required></ion-input>
                        </ion-item>

                        <div v-if="error" class="error-box ion-margin-top">
                            <ion-icon :icon="alertCircle" color="danger"></ion-icon>
                            <ion-text color="danger">{{ error }}</ion-text>
                        </div>

                        <ion-button expand="block" type="submit" shape="round" size="large"
                            class="ion-margin-top submit-btn" :disabled="isLoading">
                            <span v-if="!isLoading">Anmelden</span>
                            <ion-spinner v-else name="crescent"></ion-spinner>
                        </ion-button>

                    </form>
                </ion-card-content>
            </ion-card>

            <div class="ion-text-center ion-padding-top">
                <ion-text color="medium" style="font-size: 0.9em;">
                    <p>Nur für autorisiertes Personal</p>
                </ion-text>
            </div>

        </div>

    </BaseLayout>
</template>
<script setup>
/**
 * LoginPage View
 * * Handles the user authentication interface.
 * Leverages the useApplicants composable to manage raw API calls and state.
 */
import BaseLayout from '@/components/BaseLayout.vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicants } from '@/composables/useApplicants';

import {
    IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardContent,
    IonIcon, IonSpinner
} from '@ionic/vue';
import { lockClosed, personCircleOutline, keyOutline, alertCircle } from 'ionicons/icons';

const router = useRouter();

/**
 * Destructure logic and reactive state from the central composable.
 * - login: The function that calls the backend.
 * - error: A reactive string containing backend/validation error messages.
 * - isLoading: A boolean tracking the request status.
 */
const { login, error, isLoading } = useApplicants();

/** @type {Object} Local state for form inputs */
const creds = reactive({ username: '', password: '' });

/**
 * Orchestrates the login attempt.
 * If successful, uses router.replace to navigate to the dashboard 
 * (replace prevents users from "going back" to the login screen after logging in).
 */
const handleLogin = async () => {
    const success = await login(creds);

    if (success) {
        router.replace('/dashboard');
    }
};
</script>

<style scoped>
/**
 * CSS Layout:
 * - login-container: Flex-centered layout for the login card.
 * - icon-circle: Custom branding element for the lock icon.
 * - error-box: High-visibility styling for authentication failures.
 */
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 80vh;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
}

.icon-circle {
    width: 70px;
    height: 70px;
    background-color: var(--ion-color-primary-tint);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px auto;
    color: var(--ion-color-primary-contrast);
}

.page-title {
    font-weight: 700;
    margin-bottom: 5px;
    color: var(--ion-color-dark);
}

.subtitle {
    color: var(--ion-color-medium);
    margin-top: 0;
}

.login-card {
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.input-item {
    --padding-start: 0;
    margin-bottom: 10px;
}

.submit-btn {
    margin-top: 25px;
    font-weight: 600;
}

.error-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #ffecec;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    border: 1px solid var(--ion-color-danger);
}

/* Align icons vertically with floating labels */
ion-item ion-icon[slot="start"] {
    margin-top: 25px;
    margin-right: 10px;
    align-self: flex-start;
}
</style>