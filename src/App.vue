<template>
    <div class="app-container">
        <RouterView/>
    </div>
</template>

<script setup>
    import { RouterView } from "vue-router";
</script>

<style lang="scss" scoped>
    .app-container {
      max-width: 1280px;
      height: 100vh;
      overflow: auto;
      margin: 0 auto;
    }
</style>
