<template>
  <v-card class="d-flex flex-column" max-width="250" width="250" min-height="250" v-if="deck">
    <v-card-title>
      {{ deck.title }}
    </v-card-title>
    <v-card-subtitle style="text-align: left;">
      <a href style="color:gray;text-decoration: none !important;">{{ deck.autherName }}</a>
    </v-card-subtitle>

    <v-card-text>
      <HintsList :hints="deck.hints"></HintsList>
    </v-card-text>
    <v-spacer></v-spacer>
    <v-card-actions >
      <BattleForm
        :deck=deck
      ></BattleForm>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="pink">
            <v-icon v-bind="attrs" v-on="on">mdi-heart</v-icon>
          </v-btn>
        </template>
        <span>いいね</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="light-blue">
            <v-icon v-bind="attrs" v-on="on">mdi-twitter</v-icon>
          </v-btn>
        </template>
        <span>share</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import HintsList from "./HintsList.vue";
import BattleForm from "./BattleForm.vue";
//import Mob from "../Mob";

export default {
  props: {
    deck: {},
  },
  data: () => ({
    answertype: {'cv':2,'circle': 2},
    disabled: false,
    readonly: false
  }),
  methods:{
    /*
    getUserName: async function(uid){
      const name = await Mob.getUserName(uid)
      console.log(JSON.stringify(name))
      return JSON.stringify(name)
    }
    */
  },
  components: {
    HintsList,
    BattleForm,
  }
};
</script>