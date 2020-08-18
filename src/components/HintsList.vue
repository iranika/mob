<template>
    <ul>
        <li v-for="item in hints" :key="item">
            {{ item }}
        </li>
    </ul>
</template>

<script>
  export default {
    props: {
      hints: Array,
    },
  }
</script>