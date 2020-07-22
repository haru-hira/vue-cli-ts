<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
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
      <FileUpload></FileUpload>
      <LikeNumber :total-number="number" @my-click="incrementNumber" @my-click2="incrementNumber2"></LikeNumber>
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import LikeNumber from './components/LikeNumber.vue';
import FileUpload from './components/FileUpload.vue';

export default Vue.extend({
  name: 'App',

  components: {
    HelloWorld,
    LikeNumber,
    FileUpload
  },

  data: () => ({
    displayVueLogo: true,
    number: 14
  }),

  methods: {
    incrementNumber(num: number, value1: string, value2: string, value3: string) {
      console.log(value1);
      console.log(value2);
      console.log(value3);
      this.number = num;
    },
    incrementNumber2(value: {
        hoge: string;
        piyo: string;
        fuga: string;
      }) {
      console.log(value);
    }
  }
});
</script>
