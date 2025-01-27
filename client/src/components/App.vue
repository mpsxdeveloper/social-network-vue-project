<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
* {
  font-family: "Annie Use Your Telescope", Helvetica, Arial, sans-serif;
  background-color: #fff;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 0;
  overflow-y: hidden;
}

.row {
  display: flex;
  height: 100vh;
  width: 100%;
  padding-top: 10px;
  background-color: #fff;
  overflow-y: hidden;
}
</style>
