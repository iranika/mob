<template>
<div>
  <v-content
    width="100%"
    class="pa-0"
  >
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        justify="center"
        align="center"
      >
        <v-col class="shrink"
          v-for="(deck, i) in decks" :key=i
        >
          <Card
            :deck=decks[i]
          ></Card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</div>
</template>

<script>
  import Card from "./Card";
  export default {
    props: {
      decks: {},
    },
    data: () => ({
      panel: [0, 1],
      disabled: false,
      readonly: false,
    }),
    components: {
      Card
    },
  }
</script>