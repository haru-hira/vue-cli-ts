<template>
  <v-container class="grey lighten-5">
    <v-row class="grey lighten-4" justify="center">
      <v-col class="grey lighten-3">
        <p>いいね({{ halfNumber }})</p>
      </v-col>
      <v-col class="grey lighten-2">
        <v-btn @click="increment">+1</v-btn>
      </v-col>
    </v-row>
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
