<template>
  <ion-app>
    <ion-split-pane content-id="main-content" when="md">
      <AppMenu />
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script setup>
import {
  IonApp, IonSplitPane, IonRouterOutlet
} from '@ionic/vue';
import AppMenu from '@/components/AppMenu.vue';
</script>

<style>
ion-menu ion-content {
  --background: #ffffff;
}

ion-menu ion-item {
  --background: #ffffff;
  --color: var(--ion-color-dark);
}

ion-split-pane {
  background: #ffffff;
}
</style>