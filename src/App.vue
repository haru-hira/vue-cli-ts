<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <LikeNumber :total-number="number" @my-click="incrementNumber" @my-click2="incrementNumber2"></LikeNumber>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import LikeNumber from './components/LikeNumber.vue';

export default Vue.extend({
  name: 'App',
  data() {
    return {
      number: 14
    };
  },
  components: {
    HelloWorld,
    LikeNumber
  },
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
