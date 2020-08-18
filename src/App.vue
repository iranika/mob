<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-right
      color="blue"
      dark
      absolute
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">        
      </v-app-bar-nav-icon>
      <v-toolbar-title>MoB verβ.012</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-avatar color="light-blue">Nika</v-avatar>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
    >
      <v-list dense>
        <v-list-item @click.stop="left = !left">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Close</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>WIP：マイデッキ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>WIP：お気に入りデッキ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content fluid>
      <router-view
        :decks=decks
      ></router-view>
    </v-content>

    <v-navigation-drawer
      v-model="right"
      fixed
      right
      temporary
    ></v-navigation-drawer>

    <v-footer
      app
      color="blue-grey"
      class="white--text"
    >
      <span>いらにかのなにか</span>
      <v-spacer></v-spacer>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
  //import Card from "./components/Card.vue"
  import Mob from "./Mob.js"
  export default {
    props: {
      source: String,
    },
    data: () => ({
      decks: Mob.getDecks(),
      drawer: null,
      drawerRight: null,
      right: false,
      left: false,

    }),
    components: {
      //CardList
    },
  }
</script>