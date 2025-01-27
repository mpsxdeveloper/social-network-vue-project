import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login";
import Register from "../views/Register";
import Forgot from "../views/Forgot";
import Home from "../views/Home";
import Notifications from "../views/Notifications";
import Profile from "../views/Profile";
import Publication from "../views/Publication";
import Message from "../views/Message";
import Logout from "../views/Logout";
import NotFound from "../views/NotFound";

const routes = [
  {
    path: "/",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    component: Register,
    meta: {
      title: "Register",
    },
  },
  {
    path: "/forgot",
    component: Forgot,
    meta: {
      title: "Esqueci",
    },
  },
  {
    path: "/home",
    component: Home,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/notifications",
    component: Notifications,
    meta: {
      title: "Notificações",
    },
  },
  {
    path: "/profile",
    component: Profile,
    meta: {
      title: "Perfil",
    },
  },
  {
    path: "/messages",
    component: Message,
    meta: {
      title: "Mensagem",
    },
  },
  {
    path: "/publication/:id",
    component: Publication,
    props: true,
    meta: {
      title: "Publicação",
    },
  },
  {
    path: "/logout",
    component: Logout,
    meta: {
      title: "Logout",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: {
      title: "Not Found",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const title = to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default router;
