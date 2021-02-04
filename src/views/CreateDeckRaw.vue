<template>
  <div>
    <loading
    :active.sync="isLoading"
    :can-cancel="false"
    :is-full-page="fullPage"></loading>
    <v-content
      width="100%"
      class="pa-0"
      v-if="isSignIn == true"
    >
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <v-card class="d-flex flex-column" max-width="600">
            <v-card-title>
              デッキ作成
              <v-icon>mdi-book-multiple</v-icon>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6" md="12">
                  <v-text-field v-model="title" label="デッキタイトル" hint="デッキのタイトルを入力してください"></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" md="3" v-for="n in 3" :key="n">
                  <v-text-field v-model="answers[n - 1]" label="作品のURL" hint="DLサイトの作品URLを貼り付けてください。"></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="answerType.circle" label="回答できるサークル数" hint="回答でサークルを使用できる回数"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="answerType.cv" label="回答できる声優数" hint="回答で声優を使用できる回数"></v-text-field>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12" sm="6" md="4" v-for="n in 5" :key="n">
                  <v-text-field v-model="hints[n - 1]" label="デッキのヒント" hint="デッキのヒントを自由に入力してください"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn v-on:click="submit">確認</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-content>
    <v-content v-else>
      <!-- ログインしていない場合はログインページを表示 -->
      <LoginPage redirectUrl="#/create-deck"></LoginPage>
    </v-content>
  </div>
</template>

<script>
import Mob from "../Mob.js";
import Loading from "vue-loading-overlay";
import 'vue-loading-overlay/dist/vue-loading.css';
import firebaseApp from "@/firebase/firebaseApp"
import LoginPage from "./Login"

export default {
  props: {
    deck: {}
  },
  data: () => ({
    isLoading: false,
    fullPage: true,
    dialog: false,
    urls: 3,
    answers: [],
    answerType: {
        circle: 2,
        cv: 2,
    },
    hints: [],
    url: [],
    title: "",
    auther: "",
    isSignIn: false,
  }),
  components: {
    //HintsList,
    Loading,
    LoginPage,
  },
  methods: {
    submit: function() {
      let self = this;
      self.isLoading = true;
      self.hints = self.hints.filter(v => v);
      Mob.addProductRequest(self.answers)
      let answers = self.answers.map(function(answer){
          return Mob.getProductCode(answer)
      })
      Mob.setDeck(self.title, firebaseApp.auth().currentUser.uid , answers, self.answerType, self.hints)
      console.log(this.url);
      alert("送信しました");
      self.isLoading = false;

    },
    productCodeValid: function(){
        let self = this;
        self.answers = self.answers.map(function(answer){
            return Mob.getProductCode(answer)
        });
    }, 
  },
  mounted(){
    firebaseApp.auth().onAuthStateChanged((user)=>{
      if (user) {
        this.isSignIn = true
        console.log(user)      
      } else {
        this.isSignIn = false
      }
    });
  }
};
</script>