<template>
  <div class="center">
    <div>
      <h1>504 Server not responding</h1>
      <b-button @click="onClick()">Retry</b-button>
    </div>
  </div>
</template>
<script>

export default {
  components: {},
  methods: {
    onClick() {
      this.$router.push('/');
    }
  }
}
</script>
