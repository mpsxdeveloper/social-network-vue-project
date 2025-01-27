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
      <div class="column">
        <img src="../assets/logout_image.jpg" />
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Logout",
  data() {
    return {
      message: "Você fez logout, volte sempre que possível!",
    };
  },
  async mounted() {
    const resposta = await fetch("/server/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await resposta.json();
    if (data.error === 1) {
      this.message = "Erro ao tentar fazer logout.";
    }
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

.error {
  background-color: #ffbaba;
  width: 90%;
  margin: 0 auto;
  padding: 1px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #000;
}

.info {
  background-color: #2b7515;
  width: 90%;
  margin: 0 auto;
  padding: 1px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}

img {
  width: 80%;
  height: auto;
  overflow: hidden;
}

h1 {
  font-size: 42px;
  font-weight: bold;
}

form input[type="text"],
input[type="password"],
button {
  font-size: 20px;
  width: 90%;
  padding: 5px;
  margin-bottom: 15px;
}

button {
  background-color: #2c3e50;
  border: none;
  color: #fff;
  font-weight: bold;
  width: 90%;
  cursor: pointer;
}

.bottom {
  border: 1px solid #000;
  width: 95%;
  margin: 0 auto;
}
</style>
