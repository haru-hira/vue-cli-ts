<template>
  <div>
    <p>いいね({{ halfNumber }})</p>
    <button @click="increment">+1</button>
  </div>
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
div {
  border: 1px solid red;
}
</style>
