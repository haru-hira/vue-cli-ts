<template>
  <v-container class="grey lighten-2">
    <v-row class="grey lighten-3" align="center">
      <v-col class="grey lighten-4">
        <v-card outlined>いいね({{ halfNumber }})</v-card>
      </v-col>
      <v-col class="grey lighten-5">
        <v-btn @click="increment" color="success">+1</v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LikeNumber',
  props: { 
    totalNumber: {
      type: Number,
      required: true
    }
  },
  computed: {
    halfNumber(): number {
      return this.totalNumber;
    }
  },
  methods: {
    increment() {
      const hoge = 1;
      const piyo = 2;
      const fuga = 3;
      this.$emit("my-click", this.totalNumber + 1, hoge, piyo, fuga);
      this.$emit("my-click2", {
        hoge: hoge,
        piyo: piyo,
        fuga: fuga
      });
    }
  }
});
</script>

<style scoped>
</style>
