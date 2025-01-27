<template>
  <Modal
    v-if="showModal"
    :title="title"
    :avatar="homeAvatar"
    @close="fecharModal"
  >
    <form enctype="multipart/form-data" @submit.prevent="updateAvatar">
      <input type="file" name="avatar" />
      <button type="submit">Enviar</button>
      <div
        :class="{ error: errorUploadProfileMsg }"
        v-if="{ errorUploadProfileMsg }"
      >
        {{ errorUploadProfileMsg }}
      </div>
    </form>
  </Modal>
  <ModalPost v-if="showModalPost" @close="fecharModalPost">
    <form
      id="formPublicacao"
      enctype="multipart/form-data"
      @submit.prevent="criarPublicacao"
    >
      <input type="file" name="publicacao" />
      <button type="submit">Enviar</button>
      <div
        :class="{ error: errorUploadPubliMsg }"
        v-if="{ errorUploadPubliMsg }"
      >
        {{ errorUploadPubliMsg }}
      </div>
    </form>
  </ModalPost>
  <div class="row">
    <div>
      <Menu :avatar="homeAvatar" />
      <span class="create" @click="openModalPost">
        <i class="fa-regular fa-square-plus"></i> Criar
      </span>
    </div>
    <div class="feed">
      <div class="publication">
        <div v-for="(publication, i) in publications" key="publication._id">
          <Card
            v-if="publication.user_id"
            :url="'http://localhost:3000/pictures/' + publication.url"
            :date="moment(publication.date).format('DD/MM/YYYY - hh:mm:ss')"
            :name="publication.user_id.nome"
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
      <div class="extra">
        <div class="info">
          <div>
            <img
              :src="homeAvatar"
              width="50"
              height="50"
              style="border-radius: 50%; cursor: pointer"
              @click="openModal"
            />
          </div>
          <div
            class="names"
            style="
              font-size: 20px;
              display: flex;
              width: 100%;
              flex-direction: column;
              align-items: start;
            "
          >
            <div style="margin-left: 10px; font-weight: bold">
              @{{ apelido }}
            </div>
            <div
              style="
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
              "
            >
              <div style="margin-left: 10px">{{ nome }}</div>
              <div style="margin-left: 10px">
                <router-link to="/logout">
                  <i
                    class="fa-solid fa-person-walking-dashed-line-arrow-right"
                  ></i>
                  Sair
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            font-size: 20px;
            margin-top: 15px;
          "
        >
          <span>Sugestões para você</span>
          <span style="font-weight: bold">Ver tudo</span>
        </div>
        <div
          v-for="suggestion in suggestions"
          class="suggestions"
          :key="suggestions.id"
          style="
            overflow-y: hidden;
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <img
            :src="'http://localhost:3000/avatars/' + suggestion.avatar"
            style="width: 45px; height: 45px; border-radius: 50%"
          />
          <span style="margin-left: 10px; font-size: 18px">{{
            suggestion.nome
          }}</span>
          <span
            style="
              margin-left: auto;
              color: blue;
              font-size: 18px;
              cursor: pointer;
            "
            @click="sendRequest(suggestion._id)"
            >Seguir</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/Menu";
import Modal from "../components/Modal";
import ModalPost from "../components/ModalPost";
import Card from "../components/Card";
import moment from "moment";
import router from "@/router";

export default {
  name: "Home",
  components: {
    Menu,
    Modal,
    ModalPost,
    Card,
    router,
  },
  data() {
    return {
      userID: "",
      publications: [],
      likes: [],
      comments: [],
      all: "",
      nome: "",
      apelido: "",
      homeAvatar: "",
      suggestions: [],
      title: "Atualizar foto do seu perfil",
      tips: "Essa imagem será visível para todos",
      errorUploadProfileMsg: "",
      errorUploadPubliMsg: "",
      showModal: false,
      showModalPost: false,
    };
  },
  hasLiked() {
    return false;
  },
  async mounted() {
    await fetch("/server/home", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) =>
        res.json().then((json) => ({ status: res.status, body: json }))
      )
      .then((obj) => {
        if (obj.status === 403) {
          window.location.href = "/";
        } else {
          this.nome = obj.body.user.nome;
          this.apelido = obj.body.user.apelido;
          this.suggestions = obj.body.suggestions;
          this.homeAvatar =
            "http://localhost:3000/avatars/" + obj.body.user.avatar;
        }
      });
    this.listPublications();
  },
  methods: {
    async updateAvatar() {
      const form = document.querySelector("form");
      const file = form.avatar;
      if (file.files[0] === undefined) {
        this.errorUploadProfileMsg =
          "Selecione uma imagem no formato PNG ou JPG";
        return;
      }
      const formData = new FormData();
      formData.append("avatar", file.files[0]);
      try {
        const resposta = await fetch("/server/picture", {
          method: "POST",
          body: formData,
        });
        const data = await resposta.json();
        if (data.error === 0) {
          this.showModal = false;
          this.homeAvatar = "http://localhost:3000/avatars/" + data.avatar;
        } else {
          this.errorUploadProfileMsg =
            "Erro ao atualizar foto. As imagens deve ser do tipo PNG ou JPG e devem ter no máximo 1MB";
        }
      } catch (error) {
        console.log(error);
      }
    },
    async criarPublicacao() {
      const form = document.querySelector("#formPublicacao");
      const file = form.publicacao;
      if (file.files[0] === undefined) {
        this.errorUploadPubliMsg = "Selecione uma imagem no formato PNG ou JPG";
        return;
      }
      const formData = new FormData();
      formData.append("publicacao", file.files[0]);
      try {
        const resposta = await fetch("/server/publication", {
          method: "POST",
          body: formData,
        });
        const data = await resposta.json();
        if (data.error === 0) {
          this.showModalPost = false;
          this.publications.unshift(data.publication);
        } else {
          this.errorUploadPubliMsg =
            "Erro ao criar publicação. As imagens deve ser do tipo PNG ou JPG e devem ter no máximo 1MB";
        }
      } catch (error) {
        console.log(error);
      }
    },
    openModal() {
      this.showModal = true;
    },
    openModalPost() {
      this.showModalPost = true;
    },
    fecharModal() {
      this.showModal = false;
    },
    fecharModalPost() {
      this.showModalPost = false;
    },
    moment: function () {
      return moment();
    },
    async sendRequest(id) {
      this.suggestions = this.suggestions.filter(
        (suggestion) => suggestion._id !== id
      );
      const resposta = await fetch(`/server/follow/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await resposta.json();
    },
    async listPublications() {
      const resposta = await fetch("/server/publication/list", {
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
.feed {
  display: flex;
  width: 80%;
  padding: 30px;
  height: 80vh;
  margin-bottom: 50px;
  background-color: #fff;
  overflow-y: auto;
}

.publication {
  width: 70%;
}

.extra {
  width: 30%;
  height: 100vh;
  background-color: #fff;
  padding: 20px;
}

.info {
  display: flex;
}

button {
  background-color: #2c3e50;
  border: none;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  width: 50%;
  cursor: pointer;
  padding: 10px;
  margin-top: 20px;
}

.create {
  cursor: pointer;
  text-decoration: none;
  color: #000;
  font-size: 26px;
  text-align: justify;
  padding: 0.5em 1em;
  display: block;
}

.error {
  padding: 10px;
  margin-top: 10px;
  background-color: #de3163;
  text-align: justify;
  font-weight: bold;
  color: #fff;
  font-size: 18px;
}

.liked {
  color: #f00;
}

.didnlike {
  color: #fff;
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
</style>
