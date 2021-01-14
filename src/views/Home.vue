<template>
  <div>
    <v-carousel height="200" width="100%" hide-delimiter-background show-arrows-on-hover cycle>
      <v-carousel-item v-for="(slide, index) in slides" :key="index">
        <v-sheet :color="colors[index]" height="100%">
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">{{ slide }} Slide</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
    <CardList :decks="decks"></CardList>
  </div>
</template>

<script>
import CardList from "../components/CardList";
export default {
  props: {
    decks: {}
  },
  data: () => ({
    panel: [0, 1],
    disabled: false,
    readonly: false,
    slides: ["First", "Second", "Third"],
    colors: [
      "indigo",
      "warning",
      "pink darken-2",
      "red lighten-1",
      "deep-purple accent-4"
    ]
  }),
  components: {
    CardList
  }
};
</script>