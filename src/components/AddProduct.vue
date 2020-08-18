<template>
    <div>
        <v-text-field v-model="url" label="サークル枠" hint="サークル名を記入するところです"></v-text-field>
        <v-btn v-on:click="submit">送信</v-btn>
    </div>
</template>

<script>
  import axios from "axios"
  export default {
    props: {
        deck: {}
    },
    data: () => ({
      dialog: false,
      url: "hogehoge"
    }),
    components: {
      //HintsList,
    },
    methods:{
        submit:function(){
            console.log(this.url)
            axios.post("http://n8n.iranika.info/webhook/ping", {"commnet":"もろちん"})
                .then(function (res){
                    console.log(res)
                })
                .catch(function (err){
                    console.log(err)
                })
        }
    }
  }
</script>