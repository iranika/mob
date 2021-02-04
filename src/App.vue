<template>
  <v-app id="inspire">
    <v-app-bar
      app
      clipped-right
      color="blue"
      dark
      fade-img-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>MoB verβ.012</v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="firebase-auth-ui" style="height='100%'" v-if="isSignIn == false"></div>
      <div v-else>
        <v-menu
          bottom
          offset-y
          rounded
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
            >
              <v-avatar color="light-blue" ><img :src="firebaseApp.auth().currentUser.photoURL" /> </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list-item>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <p>{{ firebaseApp.auth().currentUser.displayName }}</p>
                  <v-divider class="my-4"></v-divider>
                  <v-btn
                    text
                    v-on:click="signOut()"
                  >
                    ログアウト
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-menu>
      </div>
      <template v-slot:extension>
        <v-tabs align-with-title>
          <v-tab to="/">Home</v-tab>
          <v-tab to="/create-deck">Create</v-tab>
          <v-tab>MyPage</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      temporary
    >
      <v-list dense>
        <v-list-item @click.stop="drawer = !drawer">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Close</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="create-deck">
          <v-list-item-action>
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>デッキを作る（要ログイン）</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action to="deck">
            <v-icon>mdi-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>WIP：マイデッキ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action to="#/fav">
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
  import Mob from "./Mob.js";
  import firebaseApp from "@/firebase/firebaseApp"
  import * as firebaseui from 'firebaseui'
  import 'firebaseui/dist/firebaseui.css'

  export default {
    props: {
      source: String,
    },
    data: () => ({
      firebaseApp: firebaseApp,
      isSignIn: false,
      decks: Mob.getDecks(),
      drawer: null,
      drawerRight: null,
      right: false,
      left: false,

    }),
    components: {
      //CardList
    },
    methods:{
      setUser(user){
        this.user = user;
      },
      setSignIn(bool){
        this.isSignIn = bool;
      },
      signOut(){
        firebaseApp.auth().signOut().then(()=>{
          console.log("ログアウトしました")
          this.isSignIn = false
          location.reload() //Note: 汚いけどリロードすればステータスを初期化できるので暫定策
        }).catch((error)=>{
          console.log("ログアウトエラー", error)
        })
      }
    },
    mounted(){
      firebaseApp.auth().onAuthStateChanged((user)=>{
        var ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseApp.auth());
        if (user) {
          Mob.setUserInfo()
          this.isSignIn = true
          console.log(user) 
        } else {
          this.isSignIn = false
          ui.start("#firebase-auth-ui", {
            //signInSuccessUrl: '#/',
            signInOptions: [
              {
                provider: firebaseApp.auth.TwitterAuthProvider.PROVIDER_ID,
                fullLabel: "Signin"
              }
            ],
            tosUrl: 'http://iranika.info/kiyaku',
            //privacyPolicyUrl: 'http://iranika.info/kiyaku'
          })
        }
      });
    }
  }
</script>