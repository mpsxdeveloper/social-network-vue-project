<template>
  <p>Você está: {{ status }}</p>
  <div class="row">
    <Menu :avatar="avatar" />
    <TicTacToe
      v-if="tictactoe"
      @move="play"
      @close-game="fecharJogo"
      :p1sid="p1"
      :p2sid="p2"
      :player="player"
      :turn="turn"
      :symbol="symbol"
      :currentMove="currentMove"
    />
    <div class="notifications">
      <div class="column1">
        <h2>Usuários</h2>
        <input
          type="text"
          id="pesquisaInput"
          placeholder="pesquisar nome"
          @keydown="pesquisar($event)"
        />
        <div class="lista" v-for="user in friends" key="{{ user._id }}">
          <div
            class="lista-item"
            @click="selectChat(user._id, user.avatar, user.apelido)"
            :id="user.apelido"
            data-sid
          >
            <div>
              <img
                :src="'http://localhost:3000/avatars/' + user.avatar"
                :class="
                  this.online.includes(user.apelido) ? 'online' : 'offline'
                "
              />
            </div>
            <div>
              <span class="nome"
                >{{ user.nome }}
                <small
                  ><i style="color: #ccc">({{ user.apelido }})</i></small
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="column2">
        <h2>
          Conversas
          <span
            v-if="chatAvatar"
            @click="invite"
            style="
              width: 100px;
              height: 30px;
              margin-top: 0;
              margin-bottom: 0;
              background-color: aquamarine;
              padding: 5px;
              border: 1px solid seagreen;
              cursor: pointer;
            "
            >Convidar para jogar</span
          >
        </h2>
        <h1 v-if="chatAvatar">
          <img
            :src="'http://localhost:3000/avatars/' + chatAvatar"
            width="40"
            height="40"
            style="border-radius: 50%"
          />
        </h1>
        <div v-else>Selecione alguém para listar as mensagens</div>
        <div
          class="mensagens"
          v-for="mensagem in mensagens"
          key="{{ mensagem._id }}"
        >
          <div
            class="mensagem"
            :class="
              mensagem.sender_id === this.otherID
                ? 'receiver-msg'
                : 'sender-msg'
            "
          >
            <span class="msg-data">{{
              moment(mensagem.data).format("DD/MM/YYYY - hh:mm:ss")
            }}</span>
            <span class="msg-avatar"
              ><img
                :src="
                  mensagem.sender_id === this.otherID
                    ? 'http://localhost:3000/avatars/' + this.chatAvatar
                    : this.avatar
                "
            /></span>
            <span class="msg-text" style="display: block">{{
              mensagem.message
            }}</span>
          </div>
        </div>
        <div v-if="chatAvatar !== ''" style="margin-bottom: 50px">
          <textarea
            style="
              width: 70%;
              height: 40px;
              border-radius: 15px;
              resize: none;
              padding: 10px;
              overflow-y: hidden;
            "
            placeholder="Digite a mensagem e pressione ENTER"
            @keydown="sendMessage"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import TicTacToe from "@/components/TicTacToe.vue";
import io from "socket.io-client";
import moment from "moment";

export default {
  name: "Mensagem",
  components: {
    Menu,
    TicTacToe,
  },
  data() {
    return {
      socket: "",
      status: "Offline",
      chatMsg: "",
      avatar: "",
      users: [],
      friends: [],
      online: [],
      user: "",
      chatAvatar: "",
      otherID: "",
      otherSID: "",
      otherApelido: "",
      otherSocketID: "",
      mySocketID: "",
      mensagens: [],
      tictactoe: false,
      gameRoom: "",
      turn: "",
      p1: "",
      p2: "",
      player: "",
      symbol: "",
      currentMove: "",
    };
  },
  async mounted() {
    this.listarAmigos(), (this.socket = io("http://localhost:3000"));
    this.socket.on("start", (data) => {
      this.status = data;
      this.chatMsg = data;
      setTimeout(() => {
        this.mySocketID = this.socket.id;
        this.socket.emit("username", {
          SID: this.socket.id,
          SNICK: this.user.apelido,
        });
      }, 1000);
    });
    this.socket.on("friend-online", (data, lista) => {
      lista.forEach((user) => {
        if (!this.friends.includes(user.SNICK)) {
          let divUser = document.getElementById(user.SNICK);
          if (divUser !== undefined && divUser !== null) {
            divUser.setAttribute("data-sid", user.SID);
            if (!this.online.includes(user.SNICK)) {
              this.online.push(user.SNICK);
            }
          }
        }
      });
    });
    this.socket.on("friend-offline", (data, lista) => {
      lista.forEach((user) => {
        this.online = this.online.map((nick) => nick !== user.SNICK);
      });
    });
    this.socket.on("message-to-me", (OTHERID, MESSAGE) => {
      if (OTHERID === this.mySocketID) {
        this.mensagens.push(MESSAGE);
      }
    });
    this.socket.on("send-game-invite", (SID_CREATOR, ROOM, MESSAGE) => {
      this.tictactoe = true;
      this.turn = this.otherSID;
      this.p1 = this.otherSID;
      this.p2 = this.mySocketID;
      this.player = this.mySocketID;
      this.symbol = "o";
      this.socket.emit(
        "game-server-accepted",
        this.mySocketID,
        this.otherSID,
        ROOM
      );
    });
    this.socket.on("game-client-move", (symbol, theturn, position, room) => {
      this.check(symbol, theturn, position, room);
    });
    this.updateProfilePicture();
  },
  methods: {
    check(symbol, theturn, position, room) {
      if (theturn === this.mySocketID) {
        this.turn = this.otherSID;
      } else {
        this.turn = this.mySocketID;
      }
      this.symbol = symbol;
      this.currentMove = position;
    },
    moment: function () {
      return moment();
    },
    async updateProfilePicture() {
      const resposta = await fetch("/server/avatar", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.avatar = "http://localhost:3000/avatars/" + data.avatar;
    },
    async pesquisar(e) {
      const pesquisa = document.querySelector("#pesquisaInput");
      if (e.keyCode === 13) {
        if (pesquisa.value.trim() !== "") {
          this.users = [];
          this.friends.forEach((friend) => {
            let search = pesquisa.value.trim().toLowerCase();
            let pos = friend.apelido.search(search);
            if (pos !== -1) {
              this.users.push(friend);
            }
          });
        }
      }
    },
    async listarAmigos() {
      const resposta = await fetch("/server/friends/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.friends = data.users;
      this.user = data.user;
    },
    async selectChat(userID, userAvatar, userApelido) {
      this.chatAvatar = userAvatar;
      this.otherID = userID;
      const divUser = document.getElementById(userApelido);
      this.otherApelido = userApelido;
      this.otherSID = divUser.getAttribute("data-sid");
      this.listMessages();
    },
    async sendMessage(e) {
      if (e.keyCode === 13) {
        const textarea = document.querySelector("textarea");
        if (textarea.value.trim() !== "") {
          const resposta = await fetch("/server/message/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: textarea.value.trim(),
              receiver_id: this.otherID,
            }),
          });
          const data = await resposta.json();
          if (data.error === 0) {
            const column2 = document.querySelector(".column2");
            column2.scrollTop = column2.scrollHeight;
            this.mensagens.push(data.message);
            if (this.otherSID !== "") {
              this.socket.emit(
                "send-message",
                this.mySocketID,
                this.otherSID,
                data.message
              );
            }
            textarea.value = "";
          }
        }
      }
    },
    async listMessages() {
      const resposta = await fetch("/server/message/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherID: this.otherID }),
      });
      const data = await resposta.json();
      this.mensagens = [];
      this.mensagens = data.messages;
    },
    fecharJogo() {
      this.tictactoe = false;
    },
    invite() {
      if (this.online.includes(this.otherApelido)) {
        this.tictactoe = true;
        this.gameRoom = Math.floor(Math.random() * 99999);
        this.turn = this.mySocketID;
        this.p1 = this.mySocketID;
        this.p2 = this.otherSID;
        this.player = this.mySocketID;
        this.symbol = "x";
        this.socket.emit(
          "create-room",
          this.mySocketID,
          this.otherSID,
          "room-" + this.gameRoom
        );
      } else {
        alert("Somente quem estiver online pode ser convidado para jogar");
      }
    },
    play(symbol, theturn, position) {
      this.socket.emit(
        "game-server-move",
        symbol,
        theturn,
        position,
        "room-" + this.gameRoom
      );
    },
  },
};
</script>

<style scoped>
.notifications {
  width: 75%;
  display: flex;
}
.column1 {
  width: 35%;
}
.column2 {
  width: 65%;
  height: 90vh;
  overflow-y: auto;
}
.lista {
  display: flex;
}
.lista-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 5px 10px;
  border: 1px solid #ccc;
  margin-bottom: 1px;
  margin-left: 1px;
  cursor: pointer;
}
.lista-item:hover {
  border: 2px double #2b7515;
  border-right: 8px solid #2b7515;
}
.lista-item img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.mensagem {
  border: 1px solid #ccc;
  width: 70%;
  padding: 10px;
  margin: 0 auto;
  margin-bottom: 10px;
  text-align: right;
}
.online {
  border: 2px solid #0f0;
}
.offline {
  border: 2px solid #f00;
}
.mensagens {
  max-height: 500px;
}
.sender-msg,
.sender-msg span,
.sender-msg div {
  background-color: #98fb98;
  text-align: right;
}
.sender-msg img {
  margin-left: 10px;
}
.receiver-msg,
.receiver-msg span,
.receiver-msg div {
  background-color: #6495ed;
  text-align: left;
}
.receiver-msg img {
  float: left;
  margin-right: 10px;
}

.msg-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
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
h1 {
  font-size: 42px;
  font-weight: bold;
}
input[type="text"],
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
