<template>
  <div class="row">
    <div class="column">
      <img src="../assets/forgot_image.jpg" />
    </div>
    <div class="column">
      <h1>Social Network Vue Project</h1>
      <form>
        <h3>Informe o e-mail que você utilizou para registro</h3>
        <input type="text" placeholder="E-mail" />
        <button type="submit">Enviar</button>
      </form>
      <div class="bottom">
        <h2>Recuperou a senha? <router-link to="/">Login</router-link></h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
};
</script>

<style scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 800px;
  margin: 0 auto;
  padding-top: 0;
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

.column {
  flex: 50%;
  height: 600px;
}

img {
  width: 100%;
  height: auto;
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
