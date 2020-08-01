<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          id="app-bar-name"
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />

        <v-switch
          v-model="$vuetify.theme.dark"
          hide-details
          inset
          label="Theme Dark"
        ></v-switch>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-alert
        type="success"
        dismissible
        v-model="alert"
      >
         Serve: success
      </v-alert>
      <div id="alert-reset" class="text-center">
        <v-btn
          v-if="!alert"
          color="deep-purple accent-4"
          dark
          @click="alert = true"
        >
          Reset
        </v-btn>
      </div>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    alert: true
  }),
});
</script>

<style scoped>
#app-bar-name {
  margin-right: 16px;
}
#alert-reset {
  margin: 19px;
}
</style>