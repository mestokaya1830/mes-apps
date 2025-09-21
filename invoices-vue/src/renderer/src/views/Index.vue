<template lang="">
  <div>
    <h1>{{ title }}</h1>
    <h3 v-if="$store.state.auth">{{ $store.state.auth }}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Home Page'
    }
  },
  mounted() {},
  methods: {}
}
</script>
