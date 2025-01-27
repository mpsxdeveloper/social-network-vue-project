<template>
  <div class="row">
    <div class="column">
      <img src="../assets/register_image.jpg" />
    </div>
    <div class="column">
      <h1>Insta<i class="fa-brands fa-vuejs"></i>ue</h1>
      <form @submit.prevent="handleSubmit">
        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          v-model="nome"
        />
        <div :class="{ error: nomeError }">{{ nomeError }}</div>
        <input
          type="text"
          name="apelido"
          placeholder="Seu nome de usuário"
          v-model="apelido"
        />
        <div :class="{ error: apelidoError }">{{ apelidoError }}</div>
        <input type="text" name="email" placeholder="E-mail" v-model="email" />
        <div :class="{ error: emailError }">{{ emailError }}</div>
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          v-model="senha"
        />
        <div :class="{ error: senhaError }">{{ senhaError }}</div>
        <button type="submit">Registrar-se</button>
        <div v-if="messages" :class="registerError ? 'error' : 'info'">
          <i
            class="fa-solid fa-circle-info fa-fade"
            style="background-color: #ffbaba"
          ></i>
          {{ messages }}
        </div>
      </form>
      <div class="bottom">
        <h3>Tem uma conta? <router-link to="/">Conecte-se</router-link></h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      nome: "",
      apelido: "",
      email: "",
      senha: "",
      nomeError: "",
      apelidoError: "",
      emailError: "",
      senhaError: "",
      registerError: false,
      messages: "",
      errors: false,
    };
  },
  methods: {
    async handleSubmit() {
      const form = document.querySelector("form");
      const nome = form.nome.value;
      const apelido = form.apelido.value;
      const email = form.email.value;
      const senha = form.senha.value;
      if (nome.trim() === "") {
        this.nomeError = "Informe o nome";
        this.errors = true;
      } else {
        this.nomeError = "";
        this.errors = false;
      }
      if (apelido.trim() === "") {
        this.apelidoError = "Informe o nome de usuário";
        this.errors = true;
      } else {
        this.apelidoError = "";
        this.errors = false;
      }
      if (email.trim() === "") {
        this.emailError = "Informe um e-mail";
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
        await fetch("/server/register", {
          method: "POST",
          body: JSON.stringify({ nome, apelido, email, senha }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            this.messages = json.msg;
            if (json.error === 0) {
              this.nome = "";
              this.apelido = "";
              this.email = "";
              this.senha = "";
            } else {
              this.registerError = true;
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
