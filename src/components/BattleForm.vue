<template>
  <v-row justify="center">
    <loading
    :active.sync="isLoading"
    :can-cancel="false"
    :on-cancel="onCancel"
    :is-full-page="fullPage"></loading>
    <v-dialog v-model="battleDialog" max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          color="pink accent-4"
          v-bind="attrs"
          v-on="on"
        >
          対戦する
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ deck.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <HintsList :hints="deck.hints"></HintsList>
            <v-row dense>
                <v-col cols="12" sm="6" md="4" 
                    v-for="n in deck.answertype.cv" :key="n"
                >
                    <v-text-field label="声優枠" v-model="answerData.cv[n-1]" hint="声優名を記入するところです"></v-text-field>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col cols="12" sm="6" md="4"
                    v-for="n in deck.answertype.circle" :key="n"
                >
                    <v-text-field label="サークル枠" v-model="answerData.circle[n-1]" hint="サークル名を記入するところです"></v-text-field>
                </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="battleDialog = false">閉じる</v-btn>
          <v-btn color="blue darken-1" text v-on:click="submit">回答する</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="answerDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">バトル結果</span>
        </v-card-title>
        <v-card-text>
          <template v-if="BattleResult.hitAnswers.length > 0">
            "{{deck.title}}"とのバトルで{{BattleResult.hitAnswers.length}}枚ブレイクに成功！！<br>
            <ul>
              <li v-for="(answer, i) in BattleResult.hitAnswers" :key="i">
                <a :href="BattleResult.hitAnswers[i].Url">{{BattleResult.hitAnswers[i].Title}}</a>
              </li>
            </ul>
          </template>
          <br>
          <template v-if="BattleResult.unhitAnswers.length > 0">
            残ったカードはこれでした！！<br>
            <ul>
              <li v-for="(_, i) in BattleResult.unhitAnswers" :key="i">
                <a :href="BattleResult.unhitAnswers[i].Url">{{BattleResult.unhitAnswers[i].Url}}</a>
              </li>
            </ul>

          </template>
          
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="answerDialog = false">閉じる</v-btn>
          <v-btn color="blue darken-1" text ><v-icon v-bind="attrs" v-on="on">mdi-twitter</v-icon>結果をツイート</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  import HintsList from "./HintsList.vue";
  import Loading from "vue-loading-overlay";
  import 'vue-loading-overlay/dist/vue-loading.css';
  import Mob from "../Mob.js"
  export default {
    props: {
        deck: {}
    },
    data: () => ({
      battleDialog: false,
      answerDialog: false,
      isLoading: false,
      fullPage: true,
      answerData: {
        cv: [],
        circle: [],
      },
      BattleResult: {
        isAllHit: false,
        score: 0,
        hitAnswers: [],
        unhitAnswers: [],
      }
    }),
    methods: {
      submit: function (){
        let self = this
        self.isLoading = true;
        console.log(self.answerData);
        console.log(self.deck);
        self.BattleResult = Mob.getBattleResult(self.answerData, self.deck.answers)
        console.log(self.BattleResult)
        setTimeout(function(){
          self.isLoading = false;
          console.log('load off');
          self.battleDialog = false;
          self.answerDialog = true;
        }, 1000);
      },
      onCancel: function(){
        console.log("User cancelled loading.");
      }
    },
    components: {
      HintsList,
      Loading,
    }
  }
</script>