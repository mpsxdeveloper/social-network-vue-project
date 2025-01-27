<template>
  <div class="row">
    <div class="column">
      <img
        class="logo"
        src="../assets/login_image.jpg"
        style="object-fit: cover"
      />
    </div>
    <div class="column">
      <h1>Social Network Vue Project</h1>
      <form @submit.prevent="handleSubmit">
        <input type="text" name="email" placeholder="E-mail" v-model="email" />
        <div :class="{ error: emailError }">{{ emailError }}</div>
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          v-model="senha"
        />
        <div :class="{ error: senhaError }">{{ senhaError }}</div>
        <button type="submit">Entrar</button>
        <div v-if="messages" :class="loginError ? 'error' : 'info'">
          <i
            class="fa-solid fa-circle-info fa-fade"
            style="background-color: #ffbaba"
          ></i>
          {{ messages }}
        </div>
        <h3><router-link to="/forgot">Esqueceu a senha?</router-link></h3>
      </form>
      <div class="bottom">
        <h3>
          Não tem uma conta?
          <router-link to="/register">Cadastre-se</router-link>
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      senha: "",
      emailError: "",
      senhaError: "",
      loginError: false,
      messages: "",
      errors: false,
    };
  },
  methods: {
    async handleSubmit() {
      const form = document.querySelector("form");
      const email = form.email.value;
      const senha = form.senha.value;
      if (email.trim() === "") {
        this.emailError = "Informe o e-mail";
        this.errors = true;
      } else {
        this.emailError = "";
        this.errors = false;
      }
      if (senha === "") {
        this.senhaError = "Informe a senha";
        this.errors = true;
      } else {
        this.senhaError = "";
        this.errors = false;
      }

      if (!this.errors) {
        await fetch("/server/login", {
          method: "POST",
          body: JSON.stringify({ email, senha }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            this.messages = json.msg;
            if (json.error === 0) {
              this.email = "";
              this.senha = "";
              this.loginError = false;
              localStorage.setItem("accessToken", json.token);
              localStorage.setItem("_id", json._id);
              window.location.href = "/home";
            } else {
              this.loginError = true;
            }
          });
      }
    },
  },
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
  background-color: #fff;
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
  margin-bottom: 20px;
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
