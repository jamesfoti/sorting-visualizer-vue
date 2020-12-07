/* eslint-disable no-unused-vars */
<template>
  <div id="canvas"></div>
</template>

<script>
import P5 from "p5";
import { sketch } from "./sketch";
import { serverBus } from "../../main";

export default {
  name: "App",

  data() {
    return {
      p5: null,
    };
  },
  mounted() {},
  created() {
    this.p5 = new P5(sketch, "canvas");
    serverBus.$on("createArray", (arraySize) => {
      this.p5.createArray(arraySize);
    });
    serverBus.$on("updateDelay", (sortingDelay) => {
      this.p5.updateDelay(sortingDelay);
    });
    serverBus.$on("toggleTheme", (isDark) => {
      this.p5.toggleTheme(isDark);
    });
    serverBus.$on("toggleSound", () => {
      this.p5.toggleSound();
    });
    serverBus.$on("sort", (sortOption) => {
      if (sortOption != null) {
        if (sortOption == "Bubble Sort") this.p5.bubbleSort();
        else if (sortOption == "Selection Sort") this.p5.selectionSort();
        else if (sortOption == "Insertion Sort") this.p5.insertionSort();
        else if (sortOption == "Quick Sort") this.p5.quickSort();
      }
    });
  },
  beforeDestroy() {
    serverBus.$off("createArray");
    serverBus.$off("updateDelay");
    serverBus.$off("toggleTheme");
    serverBus.$off("toggleSound");
    serverBus.$off("sort");
  },
};
</script>