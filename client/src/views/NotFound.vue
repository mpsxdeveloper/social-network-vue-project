<template>
  <router-link to="/home">
    <h1 style="margin-bottom: 0; padding-bottom: 0">
      Página não encontrada. Clique para retornar para a página inicial
    </h1>
    <h1 style="margin-top: 0; padding-top: 0">
      <i class="fa-solid fa-triangle-exclamation fa-fade"></i>
    </h1>
  </router-link>
  <router-link to="/home">
    <img src="../assets/notfound_image.jpg" />
  </router-link>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style>
a {
  text-decoration: none;
  color: #000;
}
</style>
