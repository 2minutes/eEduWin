import Vue from 'vue';
import Vuex from 'vuex';
import {decodeStr} from '@/assets/js/public';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        token: '',
        userName: localStorage[window.btoa('userName')] ? decodeStr(localStorage[window.btoa('userName')], true) : '',
        showContactFlag: false, //是否显示联系我们弹窗
        showLoginFlag: false, //是否显示登录弹窗
        showRegisterFlag: false, //是否显示注册弹窗
        showNewFlag: false, //是否显示新闻弹窗
        loading: false, //是否显示加载状态
        url: '',//视频url
    },
    getters: {
        showContactFlag: state => state.showContactFlag,
        showLoginFlag: state => state.showLoginFlag,
        showRegisterFlag: state => state.showRegisterFlag,
        showNewFlag: state => state.showNewFlag,
        token: state => state.token,
        userName: state => state.userName,
        loading: state => state.loading,
        url: state => state.url,
    },
    actions: {//异步，
        setUserName({commit}, name) {
            if (name) {
                commit('setUserName', name);
            } else {
                commit('clearUserName');
            }
        },
        setToken({commit}, token) {
            commit('setToken', token);
        },
        handleContactModel({commit}, flag) {
            commit('setShowContactFlag', flag);
        },
        handleLoginModel({commit}, flag) {
            commit('setShowLoginFlag', flag);
        },
        handleRegisterModel({commit}, flag) {
            commit('setShowRegisterFlag', flag);
        },
        handleNewModel({commit}, flag) {
            commit('setShowNewFlag', flag);
        },
        handleLoading({commit}, flag) {
            commit('setLoading', flag);
        },
        setUrl({commit}, url) {
            commit('setUrl', url);
        }
    },
    mutations: {
        setUserName(state, name) {
            if (!name) {
                let userNameKey = window.btoa('userName');
                if (localStorage[userNameKey]) {
                    name = window.atob(localStorage[userNameKey]);
                } else {
                    name = '';
                }
            }
            state.userName = name;
        },
        clearUserName(state) {
            state.userName = '';
        },
        setShowContactFlag(state, flag) {
            state.showContactFlag = flag;
        },
        setShowLoginFlag(state, flag) {
            state.showLoginFlag = flag;
        },
        setShowRegisterFlag(state, flag) {
            state.showRegisterFlag = flag;
        },
        setShowNewFlag(state, flag) {
            state.showNewFlag = flag;
        },
        setToken(state, token) {
            state.token = token;
        },
        setLoading(state, flag) {
            state.loading = flag;
        },
        setUrl(state, url) {
            state.url = url;
        }
    },
});

export default store;