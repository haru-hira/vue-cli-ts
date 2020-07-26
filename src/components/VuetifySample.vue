<template>
  <v-container class="grey lighten-2">
    <v-row class="grey lighten-3" align="center">
      <v-col class="grey lighten-4">
        <v-card
          v-click-outside="onClickOutside"
          :color="active ? 'primary' : undefined"
          :dark="active"
          class="mx-auto"
          height="128"
          rounded="xl"
          width="128"
          @click="active = true"
        >
          <div class="text-h6 text-md-h6 fill-height d-flex align-center justify-center">
            {{ active ? 'Click Outside' : 'Click Me' }}
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'VuetifySample',
  data: () => ({
    active: false,
  }),
  methods: {
    onClickOutside () {
      this.active = false
    },
  }
});
</script>

<style scoped>
</style>
