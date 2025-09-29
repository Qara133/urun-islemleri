<template>
  <div>
    <app-header></app-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <app-footer></app-footer>
  </div>
</template>

<script>
  import Header from "./components/shared/header";
  import Footer from "./components/shared/Footer";
  export default {
    components: {
      appHeader : Header,
      appFooter : Footer,
    },
    created() {
      this.$store.dispatch("getTradeResult");
      this.$store.dispatch("initApp");
    }
  }
</script>

<style>
  body {
    background-color: rgb(218, 235, 235);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease-out;
  }
  .fade-enter {
    opacity: 0;
  }
</style>