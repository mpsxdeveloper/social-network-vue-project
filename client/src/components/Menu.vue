<template class="menu">
  <nav>
    <ul>
      <li>        
        <router-link to="/home">
          <i class="fa-solid fa-house"></i> Página Inicial
        </router-link>        
        <router-link to="/messages">
          <i class="fa-solid fa-comment"></i> Mensagens
        </router-link>
        <router-link to="/notifications">
          <i class="fa-regular fa-heart"></i> Notificações
        </router-link>
        <router-link to="/profile">
          <img
            :src="avatar"
            width="40"
            height="40"
            style="border-radius: 50%"
          />
          Perfil
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Menu",
  props: {
    avatar: {
      type: String,
    },
  },
  async mounted() {
    const resposta = await fetch("/server/avatar", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resposta.json();
    try {
      this.avatar = "http://localhost:3000/avatars/" + data.avatar;
    } catch (error) {}
  },
};
</script>

<style scoped>
nav {
  background-color: #fff;
  border-right: 1px solid #ccc;
  height: auto;
}

h1 {
  font-size: 32px;
}

h1 i {
  color: #0f0;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

li {
  flex-grow: 1;
}

a {
  text-decoration: none;
  color: #000;
  font-size: 26px;
  text-align: justify;
  padding: 0.5em 1em;
  display: block;
}

.menu {
  width: 30%;
  height: 100vh;
}
</style>
