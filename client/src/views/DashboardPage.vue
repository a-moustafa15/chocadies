<template>
    <BaseLayout page-title="Dashboard" :show-menu="true">

        <template #actions>
            <ion-button @click="handleLogout">
                <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
                Abmelden
            </ion-button>
        </template>

        <ion-progress-bar v-if="isLoading" type="indeterminate"></ion-progress-bar>

        <div class="dashboard-header">
            <h2>Kandidaten</h2>
            <p>{{ store.applicants.length }} aktive Bewerbungen</p>
        </div>

        <div class="card-list">
            <ion-card v-for="app in store.applicants" :key="app.id" :router-link="'/detail/' + app.id" button
                class="candidate-card">
                <ion-card-content class="card-content-wrapper">

                    <div class="avatar-box">
                        {{ getInitials(app.first_name, app.last_name) }}
                    </div>

                    <div class="info-box">
                        <div class="name-row">
                            <h3>{{ app.first_name }} {{ app.last_name }}</h3>
                            <span v-if="app.hr_rating" class="rating-star">
                                <ion-icon :icon="star" color="warning"></ion-icon> {{ app.hr_rating }}
                            </span>
                        </div>

                        <p class="role-text">{{ app.email }}</p>
                        <p class="date-text">Beworben am: {{ formatDate(app.created_at) }}</p>
                    </div>

                    <div class="status-box">
                        <ion-badge :color="getStatusColor(app.status)">
                            {{ app.status }}
                        </ion-badge>
                    </div>

                </ion-card-content>
            </ion-card>
        </div>

        <div v-if="!isLoading && store.applicants.length === 0" class="empty-state">
            <ion-icon :icon="fileTrayOutline" size="large"></ion-icon>
            <h3>Noch keine Bewerbungen</h3>
            <p>Neue Kandidaten werden hier erscheinen.</p>
        </div>

    </BaseLayout>
</template>

<script setup>
/**
 * Dashboard View
 * * Displays a filterable list of job applicants.
 * Uses the 'useApplicants' composable to handle data fetching and authentication checks.
 */
import BaseLayout from '@/components/BaseLayout.vue';
import { onIonViewWillEnter } from '@ionic/vue';
import { useApplicantStore } from '@/stores/applicantStore';
import { useApplicants } from '@/composables/useApplicants';
import {
    IonProgressBar, IonCard, IonCardContent, IonBadge, IonIcon, IonButton
} from '@ionic/vue';
import { star, fileTrayOutline, logOutOutline } from 'ionicons/icons';

const store = useApplicantStore();
const { fetchApplicants, isLoading, logout } = useApplicants();

/**
 * Ionic Lifecycle Hook
 * Runs every time the view is navigated to. 
 * Ensures the list is fresh when returning from a detail page or login.
 */
onIonViewWillEnter(() => {
    fetchApplicants();
});

/**
 * Utility: Formats ISO strings for UI display.
 * @param {string} dateString 
 * @returns {string} e.g. "Oct 24"
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
    });
};

/**
 * Utility: Generates two-letter initials for the avatar.
 * @param {string} first 
 * @param {string} last 
 */
const getInitials = (first, last) => {
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
};

/**
 * Status Logic: Maps backend status strings to Ionic color variables.
 * @param {string} status 
 * @returns {string} Ionic color name
 */
const getStatusColor = (status) => {
    switch (status) {
        case 'eingestellt': return 'success';
        case 'abgelehnt': return 'danger';
        case 'vorstellungsgespräch': return 'warning';
        case 'geprueft': return 'tertiary';
        default: return 'medium';
    }
};

/**
 * Logs out the user and redirects to login via the composable.
 */
const handleLogout = () => {
    logout();
};
</script>

<style scoped>
/*
  CSS Summary:
  - dashboard-header: Spacing for the page title.
  - avatar-box: Circular placeholder for candidate photos/initials.
  - card-content-wrapper: Flexbox layout to align avatar, info, and badge horizontally.
  - info-box: Flexible container using 'min-width: 0' to handle long emails with ellipsis.
*/
.dashboard-header h2 {
    margin: 16px 16px 0;
    /* Adjusted for better alignment */
    font-weight: 700;
    color: var(--ion-color-dark);
}

.dashboard-header p {
    margin: 5px 16px 0;
    color: var(--ion-color-medium);
}

.candidate-card {
    margin: 10px 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-content-wrapper {
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 12px;
}

.avatar-box {
    width: 50px;
    height: 50px;
    background: #e0e4eb;
    color: #505c6e;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.info-box {
    flex: 1;
    min-width: 0;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.name-row h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--ion-color-dark);
}

.rating-star {
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 2px;
    font-weight: bold;
    color: var(--ion-color-dark);
}

.role-text {
    margin: 2px 0 0;
    font-size: 0.85rem;
    color: var(--ion-color-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.date-text {
    margin: 2px 0 0;
    font-size: 0.75rem;
    color: var(--ion-color-medium-tint);
}

.status-box {
    display: flex;
    align-items: center;
}

.empty-state {
    text-align: center;
    margin-top: 50px;
    color: var(--ion-color-medium);
}

.empty-state h3 {
    margin-bottom: 5px;
    font-weight: 600;
}
</style>