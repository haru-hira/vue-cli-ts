import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        subColor: '#64e3da',
      },
      dark: {
        subColor: '#f57af3',
      },
    },
    options: {
      customProperties: true,
    },
  },
});
