<template>
  <div class="row">
    <Menu :avatar="avatar" />
    <div class="notifications">
      <div class="column">
        <h2>Solicitações recebidas</h2>
        <div
          class="lista"
          v-for="recebida in recebidas"
          key="{{ recebida._id }}"
        >
          <div class="lista-item">
            <div>
              <img
                :src="'http://localhost:3000/avatars/' + recebida.sent.avatar"
                width="40"
                height="40"
              />
            </div>
            <div>
              <span class="nome"
                >{{ recebida.sent.nome }}
                <small
                  ><i style="color: #ccc"
                    >({{ recebida.sent.apelido }})</i
                  ></small
                ></span
              >
            </div>
            <div>
              <span @click="accept(recebida._id)" class="accept">Aceitar</span>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <h2>Solicitações feitas</h2>
        <div class="lista" v-for="enviada in enviadas" key="{{ enviada._id }}">
          <div class="lista-item">
            <div>
              <img
                :src="
                  'http://localhost:3000/avatars/' + enviada.received.avatar
                "
                width="40"
                height="40"
              />
            </div>
            <div>
              <span class="nome"
                >{{ enviada.received.nome }}
                <small
                  ><i style="color: #ccc"
                    >({{ enviada.received.apelido }})</i
                  ></small
                ></span
              >
            </div>
            <div>
              <span @click="accept(enviada._id)" class="danger">Cancelar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";

export default {
  name: "Notificacoes",
  components: {
    Menu,
  },
  data() {
    return {
      avatar: "",
      recebidas: "",
      enviadas: "",
    };
  },
  async mounted() {
    this.listarRecebidas();
    this.listarEnviadas();
    this.updateAvatar();
  },
  methods: {
    async updateAvatar() {
      const resposta = await fetch("/server/avatar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.avatar = "http://localhost:3000/avatars/" + data.avatar;
    },
    async accept(id) {
      const resposta = await fetch(`/server/follow/accept/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.recebidas = this.recebidas.filter(
        (recebida) => recebida._id !== data._id
      );
    },
    async listarRecebidas() {
      const resposta = await fetch("/server/follow/received", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.recebidas = await resposta.json();
    },
    async listarEnviadas() {
      const resposta = await fetch("/server/follow/sent", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.enviadas = await resposta.json();
    },
  },
};
</script>

<style scoped>
.notifications {
  width: 75%;
  display: flex;
}

.column {
  width: 50%;
}
.lista {
  display: flex;
}
.lista-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 0 20px;
}
.accept {
  border: 1px solid #000;
  padding: 5px 15px;
  background-color: #2c3e50;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.nome {
  font-size: 20px;
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
.danger {
  background-color: rgb(255, 99, 70);
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  color: #fff;
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
  width: 70px;
  height: 70px;
  border-radius: 50%;
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
