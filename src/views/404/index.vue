<template>
  <div class="center">
    <div>
      <h1>404</h1>
      <b-button @click="onClick()">Home</b-button>
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
