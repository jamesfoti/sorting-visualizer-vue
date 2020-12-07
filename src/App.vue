<template>
  <v-app>
    <Navbar />
    <Canvas />
  </v-app>
</template>

<script>
import Canvas from "./components/p5/Canvas";
import Navbar from "./components/Navbar";

export default {
  name: "App",

  components: {
    Navbar,
    Canvas,
  },

  data() {
    return {};
  },
};
</script>


<style>
html {
  overflow-y: hidden;
}
</style>
