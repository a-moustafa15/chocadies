<template>
    <BaseLayout page-title="Bestätigung">

        <div class="success-wrapper ion-text-center">

            <div class="icon-circle bounce-in">
                <ion-icon :icon="checkmark" color="white"></ion-icon>
            </div>

            <h1 class="fade-in">Bewerbung gesendet!</h1>

            <p class="subtitle fade-in-delay">
                Vielen Dank für deine Bewerbung bei <strong>Chocadies</strong>.
                <br>
                Wir haben deine Unterlagen erhalten und eine Bestätigungs-E-Mail verschickt.
            </p>

            <ion-card class="info-card fade-in-delay-2">
                <ion-card-content>
                    <ion-icon :icon="timeOutline" color="primary"></ion-icon>
                    <p><strong>Nächste Schritte:</strong><br>Unser HR-Team prüft Bewerbungen in der Regel innerhalb von
                        3-5 Werktagen.</p>
                </ion-card-content>
            </ion-card>

            <div class="button-group fade-in-delay-3">
                <ion-button @click="goHome" expand="block" shape="round" size="large">
                    Zur Startseite
                </ion-button>
            </div>

        </div>

    </BaseLayout>
</template>
<script setup>
/**
 * SuccessPage View
 * * Displayed after a successful application submission.
 * Enforces security rules to prevent accidental or malicious direct access.
 */
import { onIonViewWillEnter, onIonViewDidLeave } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useApplicantStore } from '@/stores/applicantStore';
import BaseLayout from '@/components/BaseLayout.vue';
import { IonIcon, IonButton, IonCard, IonCardContent } from '@ionic/vue';
import { checkmark, timeOutline } from 'ionicons/icons';

const router = useRouter();
const store = useApplicantStore();

/**
 * Navigates back to the main application form.
 * Uses router.replace to overwrite history, preventing the user 
 * from clicking 'Back' to return to this success screen.
 */
const goHome = () => {
    router.replace('/apply');
};

/**
 * Ionic Security Guard (Enter)
 * 1. Prevents logged-in HR staff from seeing this public success page.
 * 2. Redirects users who try to access this URL directly without submitting a form.
 */
onIonViewWillEnter(() => {
    // If user is staff, they belong on the dashboard
    if (store.isAuthenticated) {
        router.replace('/dashboard');
        return;
    }
    // Access check: did they actually just submit?
    if (!store.hasApplyJustSubmitted) {
        router.replace('/apply');
        return;
    }
});

/**
 * Ionic Cleanup (Leave)
 * Resets the 'hasApplyJustSubmitted' flag in the store.
 * This ensures that if the user goes back to /apply, they cannot return 
 * to /success unless they submit the form again.
 */
onIonViewDidLeave(() => {
    store.setHasApplyJustSubmitted(false);
});
</script>

<style scoped>
/* Animation & Layout Summary:
   - success-wrapper: Centers content vertically for a hero-style confirmation.
   - icon-circle: Uses a custom 'bounce-in' keyframe for high visual impact.
   - fade-in-delay: Staggers the text appearance to guide the user's eye.
*/
.success-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.icon-circle {
    width: 100px;
    height: 100px;
    background-color: var(--ion-color-success);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 25px rgba(var(--ion-color-success-rgb), 0.4);
    margin-bottom: 25px;
}

.icon-circle ion-icon {
    font-size: 50px;
    color: white;
}

h1 {
    font-weight: 800;
    color: var(--ion-color-dark);
    margin-bottom: 10px;
    font-size: 2rem;
}

.subtitle {
    color: var(--ion-color-medium);
    font-size: 1.05rem;
    line-height: 1.5;
    margin-bottom: 30px;
}

.info-card {
    width: 100%;
    box-shadow: none;
    border: 1px solid #e0e0e0;
    background: white;
    margin-bottom: 30px;
}

.info-card ion-icon {
    font-size: 24px;
    margin-bottom: 8px;
}

/* CSS Keyframes for smooth UI entry */
@keyframes bounceIn {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    60% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bounce-in {
    animation: bounceIn 0.8s ease-out forwards;
}

.fade-in {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.3s;
}

.fade-in-delay {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.5s;
}

.fade-in-delay-2 {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.7s;
}

.fade-in-delay-3 {
    animation: fadeIn 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.9s;
}

.button-group {
    width: 100%;
}
</style>