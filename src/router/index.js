import Vue from "vue";
import VueRouter from "vue-router";
//import Home from "../views/Home.vue";
//import CardList from "../components/CardList";
import Home from "../views/Home.vue";
//import CreateDeck from "../views/CreateDeck.vue";
import Deck from "../views/Deck.vue";
import CreateDeckRaw from "../views/CreateDeckRaw.vue";
import Login from "../views/Login.vue";
//import { component } from "vue/types/umd";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    props: true
  },
  {
    path: "/deck",
    name: "Deck",
    component: Deck,
    props: true,
  },
  {
    path: "/create-deck",
    name: "CreateDeck",
    component: CreateDeckRaw
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
