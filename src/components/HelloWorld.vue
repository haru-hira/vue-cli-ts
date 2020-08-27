<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
          <v-dialog
            v-model="dialog"
            persistent
            scrollable
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="red lighten-2"
                dark
                v-bind="attrs"
                v-on="on"
              >
                Click Me
              </v-btn>
            </template>
      
            <v-card>
              <v-card-title class="headline grey lighten-2">
                Privacy Policy
              </v-card-title>
      
              <v-card-text style="height: 300px;">
                <v-btn
                  color="primary"
                  @click="subDialog = true"
                >
                  Sub Dialog
                </v-btn>
                <v-radio-group v-model="dialogm1" column>
                  <v-radio label="Bahamas, The" value="bahamas"></v-radio>
                  <v-radio label="Bahrain" value="bahrain"></v-radio>
                  <v-radio label="Bangladesh" value="bangladesh"></v-radio>
                  <v-radio label="Barbados" value="barbados"></v-radio>
                </v-radio-group>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </v-card-text>
      
              <v-divider></v-divider>
      
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="dialog = false"
                >
                  I accept
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="subDialog"
            max-width="500px"
          >
            <v-card>
              <v-card-title>
                <span>Sub Dialog</span>
              </v-card-title>
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click="subDialog = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row>
          <v-speed-dial
            v-model="fab"
            top
            left
            direction="right"
            transition="slide-x-transition"
          >
            <template v-slot:activator>
              <v-btn
                v-model="fab"
                color="blue darken-2"
                dark
                fab
              >
                <v-icon v-if="fab">mdi-close</v-icon>
                <v-icon v-else>mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <v-btn
              fab
              dark
              small
              color="green"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="indigo"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn
              fab
              dark
              small
              color="red"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-speed-dial>
        </v-row>
        <v-row>
          <v-carousel
            cycle
            height="400"
            hide-delimiter-background
            show-arrows-on-hover
          >
            <v-carousel-item
              v-for="(slide, i) in slides"
              :key="i"
            >
              <v-sheet
                :color="slideColors[i]"
                height="100%"
              >
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <div class="display-3">{{ slide }} Slide</div>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-expansion-panels
          accordion
          hover
          focusable
        >
          <v-expansion-panel
            v-for="(item, i) in 4"
            :key="i"
            :disabled="i === 2"
          >
            <v-expansion-panel-header>Item</v-expansion-panel-header>
            <v-expansion-panel-content>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12">
        <v-chip
          class="ma-2"
          color="indigo"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>mdi-account-circle</v-icon>
          </v-avatar>
          Ranee
        </v-chip>
        <v-chip
          class="ma-2"
          color="orange"
          text-color="white"
        >
          Premium
          <v-icon right>mdi-star</v-icon>
        </v-chip>
        <v-chip
          class="ma-2"
          color="green"
          text-color="white"
        >
          <v-avatar
            left
            class="green darken-4"
          >
            1
          </v-avatar>
          Years
        </v-chip>
        <v-chip
          class="ma-2"
          close
          color="teal"
          text-color="white"
          @click:close="closeChip"
        >
          <v-avatar left>
            <v-icon>mdi-checkbox-marked-circle</v-icon>
          </v-avatar>
          Confirmed
        </v-chip>
        <v-chip
          class="ma-2"
          close
          color="teal"
          text-color="white"
          close-icon="mdi-delete"
          @click:close="closeChip"
        >
          <v-avatar left>
            <v-icon>mdi-checkbox-marked-circle</v-icon>
          </v-avatar>
          Confirmed
        </v-chip>
        <v-chip
          class="ma-2"
          color="success"
          outlined
        >
          <v-icon left>mdi-server-plus</v-icon>
          Server Status
        </v-chip>
        <v-chip
          class="ma-2"
          color="primary"
          outlined
          pill
        >
          User Account
          <v-icon right>mdi-account-outline</v-icon>
        </v-chip>
        <v-chip
          class="ma-2"
          close
          color="indigo darken-3"
          outlined
          @click:close="closeChip"
        >
          <v-icon left>mdi-fire</v-icon>
          New Posts Available
        </v-chip>
      </v-col>
      <v-col cols="12">
        <FileUpload></FileUpload>
      </v-col>
      <v-col cols="12">
        <LikeNumber :total-number="number" @my-click="incrementNumber" @my-click2="incrementNumber2"></LikeNumber>
      </v-col>
      <v-col cols="12">
        <VuetifySample></VuetifySample>
      </v-col>
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4 text-center">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community</a>
        </p>
      </v-col>

      <v-col
        class="mb-5 text-center"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          What's next?
        </h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5 text-center"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Important Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5 text-center"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import FileUpload from './FileUpload.vue';
  import LikeNumber from './LikeNumber.vue';
  import VuetifySample from './VuetifySample.vue';

  export default Vue.extend({
    name: 'HelloWorld',

    components: {
      FileUpload,
      LikeNumber,
      VuetifySample
    },

    data: () => ({
      number: 14,
      breadcrumbItems: [
        {
          text: 'Dashboard',
          disabled: false,
          href: 'breadcrumbs_dashboard',
        },
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ],
      dialog: false,
      subDialog: false,
      fab: false,
      slideColors: [
        'indigo',
        'warning',
        'pink darken-2',
        'red lighten-1',
        'deep-purple accent-4',
      ],
      slides: [
        'First',
        'Second',
        'Third',
        'Fourth',
        'Fifth',
      ],
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
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
      },
      closeChip() {
        alert('v-chip close clicked');
      }
    }
  })
</script>
