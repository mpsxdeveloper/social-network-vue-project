<template>
  <div class="row">
    <Menu :avatar="avatar" />
    <div class="column">
      <div class="linhas" style="display: flex">
        <div style="width: 50%">
          <h2>Seguido por</h2>
          <div
            class="lista"
            v-for="followed in seguido"
            key="{{ followed._id }}"
          >
            <div class="lista-item">
              <div>
                <img
                  :src="'http://localhost:3000/avatars/' + followed.sent.avatar"
                  width="40"
                  height="40"
                />
              </div>
              <div>
                <span class="nome"
                  >{{ followed.sent.nome }}
                  <small
                    ><i style="color: #ccc"
                      >({{ followed.sent.apelido }})</i
                    ></small
                  ></span
                >
              </div>
              <div>
                <span @click="accept(recebida._id)" class="danger"
                  >Cancelar</span
                >
              </div>
            </div>
          </div>
        </div>
        <div style="width: 50%">
          <h2>Seguindo</h2>
          <div
            class="lista"
            v-for="following in seguindo"
            key="{{ following._id }}"
          >
            <div class="lista-item">
              <div>
                <img
                  :src="
                    'http://localhost:3000/avatars/' + following.received.avatar
                  "
                  width="40"
                  height="40"
                />
              </div>
              <div>
                <span class="nome"
                  >{{ following.received.nome }}
                  <small
                    ><i style="color: #ccc"
                      >({{ following.received.apelido }})</i
                    ></small
                  ></span
                >
              </div>
              <div>
                <span @click="accept(recebida._id)" class="danger"
                  >Cancelar</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="publication">
        <div v-for="(publication, i) in publications" key="publication._id">
          <Card
            v-if="userID"
            :url="'http://localhost:3000/pictures/' + publication.url"
            :date="moment(publication.date).format('DD/MM/YYYY - hh:mm:ss')"
            :name="Eu"
          >
            <span>
              <span
                @click="giveLike(publication._id)"
                style="cursor: pointer; font-size: 28px"
              >
                <i
                  class="fa-heart"
                  :class="{
                    'fa-solid': publication.iliked,
                    liked: publication.iliked,
                    'fa-regular': !publication.iliked,
                  }"
                ></i>
                {{ publication.likes }} </span
              >&nbsp;&nbsp;&nbsp;
              <span style="cursor: pointer; font-size: 28px">
                <i class="fa-regular fa-comments"></i>
                {{ publication.comments }} </span
              >&nbsp;&nbsp;&nbsp;
              <span style="cursor: pointer; font-size: 28px">
                <router-link :to="'/publication/' + publication._id">
                  <i class="fa-solid fa-book-open-reader"></i>
                </router-link>
              </span>
            </span>
          </Card>
          <textarea
            class="comment-text"
            rows="2"
            maxlength="200"
            :data-id="'p' + publication._id"
            placeholder="Fazer um comentário (pressione ENTER para enviar)"
            @keypress="sendComment($event, publication._id)"
          ></textarea>
          <div
            class="comments-list"
            v-for="comment in comments"
            key="comment._id"
          >
            <div
              class="comment"
              :class="'comments-' + publication._id"
              v-if="comment.publication_id === publication._id"
            >
              <div style="height: 100%; display: flex; align-items: center">
                <img
                  :src="
                    'http://localhost:3000/avatars/' + comment.user_id.avatar
                  "
                />
                <span style="margin-left: 20px"
                  ><small>{{ comment.user_id.nome }}</small></span
                >
                <span style="margin-left: 20px"
                  ><small
                    ><i>({{ comment.data }})</i></small
                  ></span
                >
                <span
                  style="margin-left: 50px; color: #f00; cursor: pointer"
                  v-if="userID === comment.user_id._id"
                  @click="deleteComment(comment._id, comment.publication_id)"
                >
                  <i class="fa-solid fa-trash"></i>
                </span>
              </div>
              <span
                style="font-weight: bold; font-size: 20px; margin-left: 70px"
                >{{ comment.comment }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu.vue";
import Card from "../components/Card.vue";
import moment from "moment";

export default {
  name: "Perfil",
  components: {
    Menu,
    Card,
  },
  data() {
    return {
      seguido: [],
      seguindo: [],
      publications: [],
      comments: [],
      likes: [],
      avatar: "",
    };
  },
  async mounted() {
    this.seguido_por();
    this.seguindo_a();
    this.updateProfilePicture();
    this.listPublications();
  },
  methods: {
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
    async seguido_por() {
      const resposta = await fetch("/server/profile/followed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.seguido = data.followed;
    },
    async seguindo_a() {
      const resposta = await fetch("/server/profile/following", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.seguindo = data.following;
    },
    async listPublications() {
      const resposta = await fetch("/server/publication/list/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resposta.json();
      this.publications = data.publications;
      this.likes = data.likes;
      this.comments = data.comments;
      this.userID = data.userID;

      let likesids = new Array();
      this.likes.forEach((l) => {
        if (l.liked) {
          likesids.push(l.publication_id);
        }
      });

      let publicationids = new Array();
      this.publications.forEach((p) => {
        publicationids.push(p._id);
      });

      this.publications.forEach((p) => {
        if (likesids.includes(p._id)) {
          p.iliked = true;
        } else {
          p.iliked = false;
        }
      });
    },
    async giveLike(id) {
      const resposta = await fetch(`/server/like/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await resposta.json();
      this.publications.map((publication) => {
        if (publication._id === id) {
          if (data.liked) {
            publication.likes = publication.likes + 1;
            publication.iliked = true;
          } else {
            publication.likes = publication.likes - 1;
            publication.iliked = false;
          }
        }
      });
    },
    async sendComment(event, id) {
      if (event.keyCode === 13) {
        const text = document.querySelectorAll(`[data-id=p${id}]`)[0];
        if (text.value.trim() !== "") {
          const resposta = await fetch("/server/comment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publication_id: id, comment: text.value }),
          });
          const data = await resposta.json();
          if (data.error === 0) {
            text.value = "";
            this.publications.map((publication) => {
              if (publication._id === id) {
                publication.comments = publication.comments + 1;
                let itens = document.getElementsByClassName(
                  `comments-${publication._id}`
                );
                if (itens.length === 2) {
                  this.comments.forEach((comment, index, object) => {
                    if (comment.publication_id === id) {
                      object.splice(index + 1, 1);
                    }
                  });
                }
              }
            });
            this.comments.unshift(data.comment);
          }
        }
      }
    },
    async deleteComment(comment_id, publication_id) {
      const resposta = await fetch(
        `/server/comment/delete/${comment_id}/${publication_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await resposta.json();
      if (data.error === 0) {
        this.comments = this.comments.filter(
          (comment) => comment_id !== comment._id
        );
        this.publications.forEach((publication) => {
          if (publication._id === publication_id) {
            publication.comments = publication.comments - 1;
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
}

.column {
  display: flex;
  flex-direction: column;
  width: 85%;
  overflow-y: auto;
}

.publication {
  padding: 150px;
}

.liked {
  color: #f00;
}
.didnlike {
  color: #fff;
}

.lista-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  padding: 0 20px;
}

.comment-text {
  width: 95%;
  height: 40px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: block;
  margin-bottom: 10px;
  text-align: left;
  resize: none;
  overflow-y: hidden;
}
.comments-list {
  margin-bottom: 10px;
}
.comment {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;
  width: 95%;
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 10px;
}
.comment img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
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
