import Vue from "vue";
import VueRouter from "vue-router";
//import Home from "../views/Home.vue";
//import CardList from "../components/CardList";
import Top from "../Top.vue";
import CreateDeck from "../CreateDeck.vue";
import Deck from "../Deck.vue";
//import { component } from "vue/types/umd";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Top,
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
    component: CreateDeck
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
