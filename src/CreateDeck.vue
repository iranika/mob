<template>
  <div>
    <v-content width="100%">
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
                  <v-text-field v-model="auther" label="作成者" hint="あなたの名前を入力してください"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" v-for="n in urls" :key="n">
                  <v-text-field v-model="url[n - 1]" label="作品" hint="作品のURLを貼り付けてください"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn v-on:click="submit">送信</v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
//import axios from "axios";
export default {
  props: {
    deck: {}
  },
  data: () => ({
    urls: 3,
    url: [],
    title: "",
    auther: ""
  }),
  components: {
    //HintsList,
  },
  methods: {
    submit: function() {
      console.log(this.url);
    }
  }
};
</script>