<template>
  <div id="app">
    <HeaderBar />
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
import HeaderBar from './components/NavrBar.vue';
import Footer from './components/Footer.vue';
import store from './store/index';
export default {
  name: 'App',
  store,
  components: { HeaderBar, Footer },
};
</script>

<style lang="scss">
@import './styles/index.scss';
</style>



