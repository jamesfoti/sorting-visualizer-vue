<template>
  <div id="navbar">
    <v-app-bar height="90">
      <v-container fluid>
        <v-row align="center">
          <v-col class="overline">
            <v-toolbar-title class="font-weight">
              Sorting <br />
              Visualizer
            </v-toolbar-title>
          </v-col>

          <v-spacer></v-spacer>

          <v-col>
            <v-btn x-large width="170" @click="createArray()">
              Generate Array
            </v-btn>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="2">
            <p class="font-weight-black" style="height: 15px">Size</p>
            <v-slider
              v-model="arraySize"
              thumb-label
              min="3"
              max="50"
              :value="arraySize"
              @input="createArray()"
            ></v-slider>
          </v-col>

          <v-col cols="2">
            <p class="font-weight-black" style="height: 15px">Speed</p>
            <v-slider
              v-model="sortingDelay"
              thumb-label
              min="0"
              :max="sortindDelayMax"
              :value="sortingDelay"
              @input="updateDelay()"
            ></v-slider>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="2">
            <v-row style="height: 40px">
              <v-select
                :items="sortingOptions"
                v-model="selectedSortOption"
                label="Sorting Algorithms"
              ></v-select
            ></v-row>
          </v-col>

          <v-spacer></v-spacer>

          <v-col cols="1">
            <v-btn x-large width="80" @click="sort()">Sort </v-btn>
          </v-col>

          <v-col>
            <v-row no-gutters style="height: 70px">
              <v-switch
                v-model="soundSwitch"
                label="Sound"
                dense
                @click="toggleSound()"
                true-value="true"
              ></v-switch>
              <v-switch
                v-model="$vuetify.theme.dark"
                label="Theme"
                dense
                @click="toggleTheme()"
              ></v-switch>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { serverBus } from "../main";

export default {
  data() {
    return {
      sortingOptions: [
        "Selection Sort",
        "Bubble Sort",
        "Insertion Sort",
        "Quick Sort",
      ],
      selectedSortOption: undefined,
      arraySize: 10,
      sortingDelay: 900,
      sortindDelayMax: 1000,
      soundSwitch: true,
    };
  },
  methods: {
    createArray() {
      serverBus.$emit("createArray", this.arraySize);
    },

    updateDelay() {
      // Not really a speed. This is used to make UI simpler for user and for await(delay).
      let speed = this.sortindDelayMax - this.sortingDelay;
      serverBus.$emit("updateDelay", speed);
    },

    toggleTheme() {
      serverBus.$emit("toggleTheme", this.$vuetify.theme.dark);
    },

    toggleSound() {
      serverBus.$emit("toggleSound");
    },

    sort() {
      serverBus.$emit("sort", this.selectedSortOption);
    },
  },
};
</script>




