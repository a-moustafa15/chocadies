<template>
    <BaseLayout page-title="Kandidatenprofil" back-link="/dashboard">

        <div v-if="isLoading" class="ion-padding ion-text-center center-loader">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
        </div>

        <div v-else-if="store.currentApplicant" class="content-wrapper">

            <ion-card class="profile-card">
                <ion-card-content class="ion-text-center">

                    <div class="avatar-circle"
                        :style="{ background: getAvatarColor(store.currentApplicant.first_name) }">
                        {{ getInitials(store.currentApplicant.first_name, store.currentApplicant.last_name) }}
                    </div>

                    <h1 class="candidate-name">
                        {{ store.currentApplicant.first_name }} {{ store.currentApplicant.last_name }}
                    </h1>

                    <div class="contact-row">
                        <ion-icon :icon="mailOutline" color="medium"></ion-icon>
                        <span>{{ store.currentApplicant.email }}</span>
                    </div>

                    <div class="action-grid">
                        <ion-button fill="outline" shape="round" size="small" :href="store.currentApplicant.resume_file"
                            target="_blank">
                            <ion-icon slot="start" :icon="documentTextOutline"></ion-icon>
                            PDF
                        </ion-button>

                        <ion-button v-if="store.currentApplicant.linkedin_profile" fill="outline" shape="round"
                            size="small" color="secondary" :href="store.currentApplicant.linkedin_profile"
                            target="_blank">
                            <ion-icon slot="start" :icon="logoLinkedin"></ion-icon>
                            LinkedIn
                        </ion-button>

                        <ion-button v-if="store.currentApplicant.resume_url" fill="outline" shape="round" size="small"
                            color="dark" :href="store.currentApplicant.resume_url" target="_blank">
                            <ion-icon slot="start" :icon="linkOutline"></ion-icon>
                            Lebenslauf-Link
                        </ion-button>
                    </div>
                </ion-card-content>
            </ion-card>
            <ion-list-header>
                <ion-label>Motivationsschreiben</ion-label>
            </ion-list-header>

            <ion-card class="motivation-card">
                <ion-card-content>
                    <div v-if="store.currentApplicant.cover_letter" class="cover-letter-text">
                        {{ store.currentApplicant.cover_letter }}
                    </div>
                    <div v-else class="ion-text-center ion-padding">
                        <p style="color: var(--ion-color-medium); font-style: italic;">
                            Kein Motivationsschreiben hinterlegt.
                        </p>
                    </div>
                </ion-card-content>
            </ion-card>

            <ion-list-header>
                <ion-label>Bewertung & Entscheidung</ion-label>
            </ion-list-header>

            <ion-card class="evaluation-card">
                <ion-list lines="full">

                    <ion-item>
                        <ion-icon slot="start" :icon="briefcaseOutline" color="medium"></ion-icon>
                        <ion-label>Status</ion-label>

                        <div class="status-dot" :class="form.status" slot="end"></div>

                        <ion-select slot="end" v-model="form.status" interface="popover" placeholder="Auswählen">
                            <ion-select-option value="beworben">Beworben</ion-select-option>
                            <ion-select-option value="geprueft">Geprüft</ion-select-option>
                            <ion-select-option value="vorstellungsgespräch">Vorstellungsgespräch</ion-select-option>
                            <ion-select-option value="eingestellt">Eingestellt</ion-select-option>
                            <ion-select-option value="abgelehnt">Abgelehnt</ion-select-option>
                        </ion-select>
                    </ion-item>

                    <ion-item lines="full" class="rating-container">
                        <ion-label position="stacked">Interview-Bewertung</ion-label>

                        <div class="rating-box">
                            <span class="big-number">{{ form.hr_rating }}</span>
                            <span class="small-text">/ 10</span>
                        </div>

                        <ion-range min="0" max="10" step="1" snaps="true" ticks="true" v-model="form.hr_rating"
                            color="warning">
                            <ion-icon slot="start" :icon="starOutline" size="small" color="medium"></ion-icon>
                            <ion-icon slot="end" :icon="star" color="warning"></ion-icon>
                        </ion-range>
                    </ion-item>

                    <ion-item lines="none" class="notes-item">
                        <ion-label position="stacked">Interne Notizen</ion-label>
                        <ion-textarea v-model="form.hr_notes" rows="6"
                            placeholder="Feedback, Pro/Contra und nächste Schritte eingeben..."></ion-textarea>
                    </ion-item>

                </ion-list>
            </ion-card>

            <div class="ion-padding footer-actions">
                <ion-button expand="block" shape="round" size="large" @click="handleSave" :disabled="isLoading">
                    <ion-icon slot="start" :icon="saveOutline"></ion-icon>
                    Bewertung speichern
                </ion-button>
            </div>

        </div>

    </BaseLayout>
</template>
<script setup>
/**
 * DetailPage View
 * * Provides the interface for viewing and updating a specific applicant's profile.
 * It initializes a local form state from the store's data to allow for editing.
 */
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApplicantStore } from '@/stores/applicantStore';
import { useApplicants } from '@/composables/useApplicants';
import BaseLayout from '@/components/BaseLayout.vue';

import {
    IonItem, IonLabel, IonSelect, IonSelectOption,
    IonTextarea, IonButton, IonRange, IonIcon, IonList, IonCard,
    IonCardContent, IonListHeader, IonSpinner
} from '@ionic/vue';

import {
    star, starOutline, mailOutline, documentTextOutline,
    briefcaseOutline, logoLinkedin, linkOutline, saveOutline
} from 'ionicons/icons';

const route = useRoute();
const router = useRouter();
const store = useApplicantStore();
const { fetchApplicantById, saveApplicant, isLoading } = useApplicants();

/**
 * Local form state to handle HR updates.
 * Initialized with default values and populated in onMounted.
 */
const form = reactive({ status: 'applied', hr_notes: '', hr_rating: 0 });

onMounted(async () => {
    // Fetch data using the ID from the URL parameter
    await fetchApplicantById(route.params.id);

    // Sync local form state with data from the store
    if (store.currentApplicant) {
        form.status = store.currentApplicant.status;
        form.hr_notes = store.currentApplicant.hr_notes || '';
        form.hr_rating = store.currentApplicant.hr_rating || 0;
    }
});

/**
 * Submits the evaluation form back to the server.
 * If successful, redirects the user to the main dashboard.
 */
const handleSave = async () => {
    const success = await saveApplicant(store.currentApplicant.id, { ...form });
    if (success) router.push('/dashboard');
};

/**
 * Utility: Generates initials for the avatar circle.
 */
const getInitials = (first, last) => (first.charAt(0) + last.charAt(0)).toUpperCase();

/**
 * UI Utility: Generates a deterministic color based on the candidate's name.
 * @param {string} name 
 * @returns {string} HEX color code
 */
const getAvatarColor = (name) => {
    const colors = ['#3880ff', '#2dd36f', '#ffc409', '#eb445a', '#7044ff'];
    if (!name) return colors[0];
    const index = name.length % colors.length;
    return colors[index];
};
</script>

<style scoped>
/* Scoped styles for layout, avatar appearance, and status dot logic */
.content-wrapper {
    padding-bottom: 40px;
}

.center-loader {
    margin-top: 50%;
    transform: translateY(-50%);
}

.profile-card {
    margin-top: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.avatar-circle {
    width: 80px;
    height: 80px;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    margin: 0 auto 12px auto;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.candidate-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 5px 0;
    color: var(--ion-color-dark);
}

.contact-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    color: var(--ion-color-medium);
    font-size: 0.95rem;
    margin-bottom: 15px;
}

.action-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
}

.evaluation-card {
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

/* Status Dot: Logic to change color based on selected class from 'form.status' */
.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
    background-color: var(--ion-color-medium);
}

.status-dot.eingestellt {
    background-color: var(--ion-color-success);
}

.status-dot.abgelehnt {
    background-color: var(--ion-color-danger);
}

.status-dot.vorstellungsgespräch {
    background-color: var(--ion-color-warning);
}

.status-dot.geprueft {
    background-color: var(--ion-color-tertiary);
}

.rating-container {
    padding-top: 10px;
}

.rating-box {
    text-align: center;
    margin: 10px 0;
}

.big-number {
    font-size: 2rem;
    font-weight: 800;
    color: var(--ion-color-warning);
}

.small-text {
    font-size: 1rem;
    color: var(--ion-color-medium);
}

.footer-actions {
    margin-top: 10px;
}

.motivation-card {
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    background: #fdfdfd;
}

.cover-letter-text {
    white-space: pre-wrap;
    line-height: 1.6;
    color: var(--ion-color-dark);
    font-size: 0.95rem;
    padding: 8px;
}
</style>