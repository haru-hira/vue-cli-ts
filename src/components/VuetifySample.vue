<template>
  <v-container>
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
        <v-card>
          <v-responsive :aspect-ratio="16/4">
            <v-card-text>
              aspect 16:4 
            </v-card-text>
          </v-responsive>
        </v-card>
      </v-col>
      <v-col>
        <v-checkbox
          color="subColor"
          label="checkbox"
        ></v-checkbox>
        <v-radio-group>
          <v-radio
            v-for="n in 2"
            :key="n"
            :label="`Radio ${n}`"
            :value="n"
            color="subColor"
          ></v-radio>
        </v-radio-group>
        <v-switch
          color="subColor"
          label="switch"
        ></v-switch>
        <input id="sample-input" v-model="inputValue">
        <p>value = {{ inputValue }}</p>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <div>
        <v-btn
          class="mx-1"
          color="primary"
          @click="messages++"
        >
          Send Message
        </v-btn>

        <v-btn
          class="mx-1"
          color="error"
          @click="messages = 0"
        >
          Clear Notifications
        </v-btn>
      </div>

      <v-badge
        :content="messages"
        :value="messages"
        color="green"
        overlap
      >
        <v-btn>Messages</v-btn>
      </v-badge>
      <v-badge
        :content="messages"
        :value="messages"
        color="green"
        overlap
      >
        <v-icon large>mdi-email</v-icon>
      </v-badge>
    </v-row>
    <v-row>
      <v-btn
        color="blue"
        dark
        @click="sheet = !sheet"
      >
        Open v-model
      </v-btn>
    </v-row>
    <v-row>
      <v-btn class="sample-btn" color="primary">primary</v-btn>
      <v-btn class="sample-btn" color="secondary">secondary</v-btn>
      <v-btn class="sample-btn" color="accent">accent</v-btn>
      <v-btn class="sample-btn" color="success">success</v-btn>
      <v-btn class="sample-btn" color="warning">warning</v-btn>
      <v-btn class="sample-btn" color="error">error</v-btn>
      <v-btn class="sample-btn" color="info">info</v-btn>
      <v-btn class="sample-btn" color="subColor">subColor</v-btn>
    </v-row>
    <v-row>
      <p id="text-primary" class="sample-text">primary</p>
      <p id="text-secondary" class="sample-text">secondary</p>
      <p id="text-accent" class="sample-text">accent</p>
      <p id="text-success" class="sample-text">success</p>
      <p id="text-warning" class="sample-text">warning</p>
      <p id="text-error" class="sample-text">error</p>
      <p id="text-info" class="sample-text">info</p>
      <p id="text-subcolor" class="sample-text">subColor</p>
    </v-row>
    <v-divider></v-divider>
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn
          class="mt-6"
          outlined
          color="red"
          @click="sheet = !sheet"
        >close</v-btn>
        <div class="py-3">This is a bottom sheet using the controlled by v-model instead of activator</div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'VuetifySample',
  data: () => ({
    active: false,
    inputValue: '',
    messages: 0,
    sheet: false,
  }),
  methods: {
    onClickOutside () {
      this.active = false
    },
  }
});
</script>

<style scoped>
#sample-input {
  background-color: #ffffff;
  outline-style: solid;
  outline-color: #888888;
  outline-width: 1px;
}
#sample-input:hover {
  background-color: #eeeeee;
}
#sample-input:focus {
  background-color: #ffffff;
  outline-color: var(--v-subColor-base);
  outline-width: 2px;
}
.sample-btn {
  margin: 16px;
}
.sample-text {
  margin: 0px 40px;
}
#text-primary {
  color: var(--v-primary-base);
}
#text-secondary {
  color: var(--v-secondary-base);
}
#text-accent {
  color: var(--v-accent-base);
}
#text-success {
  color: var(--v-success-base);
}
#text-warning {
  color: var(--v-warning-base);
}
#text-error {
  color: var(--v-error-base);
}
#text-info {
  color: var(--v-info-base);
}
#text-subcolor {
  color: var(--v-subColor-base);
}
</style>
