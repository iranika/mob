<template>
  <div>
    <v-content width="100%">
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center">
          <Card
            :deck="decks[0]">
          </Card>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Mob from "../Mob.js";
import Card from "../components/Card.vue";
//import firestore from '@/firebase/firestore.js';
//import firebase from "firebase";

export default {
  data: () => ({
    decks: Mob.getDecks(),
  }),
  components: {
    Card
  },
  methods: {
    submit: function() {
      console.log(this.url);
    }
  }
};
</script>
