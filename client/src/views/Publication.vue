<template style="overflow: hidden">
  <router-link to="/">
    <div class="row">
      <div class="column">
        <h1 style="margin-bottom: 0; padding-bottom: 0">
          {{ message }}
          <h1 style="margin-top: 0; padding-top: 0">
            <i class="fa-solid fa-home fa-fade"></i>
          </h1>
        </h1>
      </div>
      <div class="column"></div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Publication",
  data() {
    return {
      message: "Publication page",
    };
  },
};
</script>

<style scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

.column {
  flex: 50%;
  overflow: hidden;
}

h1 {
  font-size: 42px;
  font-weight: bold;
}
</style>
