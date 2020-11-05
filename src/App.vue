<template>
    <div id="app" :class="{zh: $i18n.locale == 'zh'}">
        <!-- <a-spin size="large" :spinning="loading" > -->
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title" ></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title" >
        </router-view>
        <!-- </a-spin> -->
    </div>
</template>

<script>
    // import {mapGetters} from 'vuex';
    export default {
        name: 'App',
        // computed: {
        //     ...mapGetters(['loading']),
        // }
    }
</script>

<style>
    #app {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        min-width: 1300px;
        min-height: 100%;
        font-family: 'Open Sans', sans-serif, 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

</style>
// padding-bottom: 160px;
