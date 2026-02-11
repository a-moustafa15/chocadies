<template>
    <BaseLayout page-title="Chocadies Karriere">

        <template #actions>
            <ion-button v-if="store.isAuthenticated" router-link="/dashboard">
                <ion-icon slot="start" :icon="statsChartOutline"></ion-icon>
                Dashboard
            </ion-button>
            <ion-button v-else router-link="/login">
                <ion-icon slot="start" :icon="logInOutline"></ion-icon>
                Anmelden
            </ion-button>
        </template>

        <div class="ion-text-center ion-padding-top">
            <ion-icon :icon="briefcase" size="large" color="primary"></ion-icon>
            <h1>Werde Teil unseres Teams</h1>
            <p class="subtitle">Wir suchen leidenschaftliche Chocolatiers!</p>
        </div>

        <ion-card class="form-card">
            <ion-card-content>
                <form @submit.prevent="handleSubmit">

                    <ion-grid class="ion-no-padding">
                        <ion-row>
                            <ion-col size="6">
                                <ion-item class="input-item">
                                    <ion-icon slot="start" :icon="personOutline" color="medium"></ion-icon>
                                    <ion-label position="floating">Vorname</ion-label>
                                    <ion-input v-model="form.first_name" required></ion-input>
                                </ion-item>
                            </ion-col>
                            <ion-col size="6">
                                <ion-item class="input-item">
                                    <ion-label position="floating">Nachname</ion-label>
                                    <ion-input v-model="form.last_name" required></ion-input>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                    </ion-grid>

                    <ion-item class="input-item">
                        <ion-icon slot="start" :icon="mailOutline" color="medium"></ion-icon>
                        <ion-label position="floating">E-Mail-Adresse</ion-label>
                        <ion-input type="email" v-model="form.email" required></ion-input>
                    </ion-item>

                    <ion-grid class="ion-no-padding">
                        <ion-row>
                            <ion-col size="6">
                                <ion-item class="input-item">
                                    <ion-icon slot="start" :icon="logoLinkedin" color="medium"></ion-icon>
                                    <ion-label position="floating">LinkedIn</ion-label>
                                    <ion-input type="url" v-model="form.linkedin_profile"></ion-input>
                                </ion-item>
                            </ion-col>
                            <ion-col size="6">
                                <ion-item class="input-item">
                                    <ion-icon slot="start" :icon="linkOutline" color="medium"></ion-icon>
                                    <ion-label position="floating">Portfolio / Link</ion-label>
                                    <ion-input type="url" v-model="form.resume_url"></ion-input>
                                </ion-item>
                            </ion-col>
                        </ion-row>
                    </ion-grid>

                    <ion-item class="input-item">
                        <ion-icon slot="start" :icon="readerOutline" color="medium" class="textarea-icon"></ion-icon>
                        <ion-label position="floating">Motivationsschreiben</ion-label>
                        <ion-textarea v-model="form.cover_letter" rows="4" auto-grow="true"></ion-textarea>
                    </ion-item>

                    <div class="file-upload-section">
                        <p class="label-text">Lebenslauf (PDF, DOC) <span class="required-star">*</span></p>

                        <input type="file" ref="fileInput" @change="onFileChange" accept=".pdf" style="display: none" />

                        <ion-button :fill="'outline'" :color="hasFileError ? 'danger' : 'primary'" expand="block"
                            @click="triggerFileUpload" class="upload-btn">
                            <ion-icon slot="start" :icon="cloudUploadOutline"></ion-icon>
                            {{ fileName || 'Lebenslauf auswählen' }}
                        </ion-button>
                    </div>

                    <ion-item v-if="error" lines="none" class="error-item">
                        <ion-icon slot="start" :icon="alertCircle" color="danger"></ion-icon>
                        <ion-label color="danger" class="ion-text-wrap">{{ error }}</ion-label>
                    </ion-item>

                    <ion-button expand="block" shape="round" type="submit" size="large"
                        class="ion-margin-top submit-btn" :disabled="isLoading">
                        <span v-if="!isLoading">Bewerbung absenden</span>
                        <ion-spinner v-else name="crescent"></ion-spinner>
                    </ion-button>

                </form>
            </ion-card-content>
        </ion-card>

    </BaseLayout>
</template>

<script setup>
/**
 * ApplyPage Component
 * * Provides the interface for prospective employees to submit applications.
 * Handles:
 * 1. Form state management via 'reactive'.
 * 2. File upload handling and validation.
 * 3. Submission to the backend via 'useApplicants' composable.
 */
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useApplicants } from '@/composables/useApplicants';
import { useApplicantStore } from '@/stores/applicantStore';
import BaseLayout from '@/components/BaseLayout.vue';

import {
    IonButton, IonIcon, IonCard, IonCardContent, IonGrid, IonRow, IonCol,
    IonItem, IonLabel, IonInput, IonTextarea, IonSpinner
} from '@ionic/vue';

import {
    logInOutline, statsChartOutline, briefcase, personOutline, mailOutline,
    logoLinkedin, linkOutline, readerOutline, cloudUploadOutline, alertCircle
} from 'ionicons/icons';

const router = useRouter();
const store = useApplicantStore();
const { submitApplication, isLoading, error } = useApplicants();

// Template refs for the hidden file input
const fileInput = ref(null);
const fileName = ref('');

// Application Form State
const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    linkedin_profile: '',
    resume_url: '',
    cover_letter: '',
    resume_file: null // Holds the File object for multipart submission
});

/**
 * Checks if the current error message is related to the file upload.
 * Used for dynamic UI styling of the upload button.
 */
const hasFileError = computed(() => {
    return error.value && error.value.toLowerCase().includes('resume');
});

/**
 * Proxies the click from the Ionic button to the hidden native file input.
 */
const triggerFileUpload = () => fileInput.value.click();

/**
 * Handles the file selection event.
 */
const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.resume_file = file;
        fileName.value = file.name;
        store.clearError();
    }
};

/**
 * Form Submission Logic
 * Performs local validation, constructs FormData, and attempts API submission.
 */
const handleSubmit = async () => {
    // 1. Manual validation check for required file
    if (!form.resume_file) {
        store.setError("Ein Lebenslauf ist erforderlich. Bitte laden Sie eine PDF Datei hoch.");
        return;
    }

    // 2. Prepare multipart/form-data for the API
    const formData = new FormData();
    Object.keys(form).forEach(key => {
        if (form[key]) formData.append(key, form[key]);
    });

    // 3. Submit via composable logic
    const success = await submitApplication(formData);

    if (success) {
        // Flag for the router guard to allow access to /success
        store.setHasApplyJustSubmitted(true);

        // Reset form to initial state
        resetForm();

        // Navigate to confirmation page
        router.push('/success');
    }
};

/**
 * Clears all form fields and resets file input.
 */
const resetForm = () => {
    form.first_name = '';
    form.last_name = '';
    form.email = '';
    form.linkedin_profile = '';
    form.resume_url = '';
    form.cover_letter = '';
    form.resume_file = null;
    fileName.value = '';
    if (fileInput.value) fileInput.value.value = '';
};
</script>

<style scoped>
/* Scoped styles for form card, file upload layout, and error item visibility */
.subtitle {
    color: var(--ion-color-medium);
    margin-top: 0;
}

.form-card {
    margin-top: 20px;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.input-item {
    --padding-start: 0;
    margin-bottom: 10px;
}

.textarea-icon {
    margin-top: 25px !important;
}

.file-upload-section {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
}

.label-text {
    color: var(--ion-color-medium);
    font-size: 0.9em;
    margin-bottom: 8px;
    text-align: left;
    padding-left: 5px;
}

.required-star {
    color: var(--ion-color-danger);
    font-weight: bold;
}

.submit-btn {
    margin-top: 30px;
}

.error-item {
    --background: #fff4f4;
    border-radius: 8px;
    margin-top: 10px;
    border: 1px solid var(--ion-color-danger);
}

ion-item ion-icon[slot="start"] {
    margin-top: 25px;
    margin-right: 8px;
    align-self: flex-start;
}
</style>