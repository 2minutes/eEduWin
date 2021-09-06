<template>
    <div class="header_wrap" :class="$i18n.locale=='zh' ? 'zh' : ''" ref="head">
        <div class="logo_wrap" @click="toHome">
            <img v-if="blue" class="logo_icon" src="../../assets/images/logo_blue.png" />
            <img v-else class="logo_icon" src="../../assets/images/logo.png" />
            <span class="logo_name">{{$t("header.logoName")}}</span>
        </div>

        <div class="nav_wrap">
            <div class="nav_item" v-for="nav in setNavList"
                @click="cliNav(nav.route)"
                :key="nav.route"
                :class="{'active': currRoute === nav.route || routeName === nav.route, 'about': nav.route === 'about'}"
                >
                {{nav.name}}
                <div v-if="nav.route === 'about'" class="nav_about_wrap">
                    <p @click="toAboutPage('aboutUs')">{{$t("header.ourVision")}}</p>
                    <p @click="toAboutPage('aboutTeam')">{{$t("header.ourTeamJoinUs")}}</p>
                    <p @click="toAboutPage('stories')">{{$t("header.ourStories")}}</p>
                </div>
            </div>
        </div>

        <div class="header_right">
            <b @click="setLang('zh')">中文</b>
            <b class="line">/</b>
            <b @click="setLang('en')">EN</b>
            <!-- <img class="icon_lang" src="../../assets/images/icon_lang_zh.png"
                 />
            <img class="icon_lang" src="../../assets/images/icon_lang_en.png"
                /> -->
            <template v-if="userName">
                <span @click="handlePanel" class="avator pointer">{{userName[0]}}</span>
                <div v-show="panelFlag" class="panel clearfix">
                    <p class="panel_item" @click="toAccount">
                        <span class="panel_icon list"></span>
                        <span class="panel_txt">{{$t('header.hi')}}, {{userName}}!</span>
                    </p>
                    <p class="panel_item" @click="toSchedule">
                        <span class="panel_icon people"></span>
                        <span class="panel_txt">{{$t('header.myCourses')}}</span>
                    </p>
                    <p class="panel_item" @click="loginOut">
                        <span class="panel_icon exit"></span>
                        <span class="panel_txt">{{$t('header.exit')}}</span>
                    </p>
                </div>
            </template>
            <template v-else>
                <span class="sign_btn" @click="handleLoginModel">{{$t("header.login")}}</span>
                <span class="sign_btn register" @click="handleRegisterModel">{{$t("header.register")}}</span>
                <!-- <img class="icon_cart" src="../../assets/images/icon_cart.png" @click="toCart" /> -->
            </template>
        </div>


        <div class="float_tool clearfix"
            :class="{'disabled': !topFlag}">
            <p class="tool_item" @click="toTop">
                <span class="tool_icon_top"></span>
                <b>{{$t("header.top")}}</b>
            </p>
            <p class="tool_item" @click="showContactModel">
                <img class="tool_icon_contact" src="../../assets/images/icon_contact.png" />
                <b>{{$t("header.contact")}}</b>
            </p>
        </div>

        <Contact />
        <Login />
        <Register />
    </div>
</template>
<script>
    import Contact from '@/components/common/contact';
    import Login from '@/components/common/login';
    import Register from '@/components/common/register';
    import {loginClear} from '@/assets/js/public';
    import {Request} from '@/api/request';
    import {mapGetters} from 'vuex';
    export default {
        props: {
            routeName: String,
            blue: Boolean,
            top: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                currRoute: this.$route.name,
                topFlag: false,

                panelFlag: false,
            }
        },
        created() {
        },
        mounted() {
            if (this.top) {
                window.addEventListener('scroll', this.scroll, true);
            }
        },
        methods: {
            toHome() {
                this.$router.push({
                    path: '/',
                });
            },
            toAccount() {
                this.panelFlag = false;
                this.$router.push({
                    path: '/account',
                });
            },
            cliNav(path) {//点击nav选项，跳转至相应页面
                switch(path) {
                    case 'contact':
                        this.showContactModel();
                        break;
                    case 'about':
                        break;
                    default:
                        this.$router.replace({
                            path: `/${path}`
                        });
                }
            },
            toAboutPage(pageName = '') {//点击about跳转相应页面
                this.$router.replace({
                    path: `/${pageName}`
                });
            },
            handleContactModel(flag) {
                this.showContactFlag = flag;
            },
            handleLoginModel(flag) {
                this.$store.dispatch('handleLoginModel', true);
                if (flag) {
                    this.$root.addTj(9);
                }
            },
            handleRegisterModel(flag) {
                this.$store.dispatch('handleRegisterModel', true);
                if (flag) {
                    this.$root.addTj(10);
                }
            },
            loginOut() {//退出登录
                Request({
                    url: 'login/loginOut',
                }).then(res => {
                    if (res.code == 200) {
                        loginClear();
                        this.handlePanel();
                    }
                })
            },
            toCart() {
                this.$router.push({
                    path: '/cart',
                });
            },
            toSchedule() {
                this.$router.push({
                    path: '/schedule'
                });
                this.handlePanel();
            },

            showContactModel() {
                this.$store.dispatch('handleContactModel', true);
                this.$root.addTj(8);
            },
            toTop() { //返回顶部
                let dom = this.$refs.head;
                if (!dom) return;
                dom.scrollIntoView({behavior: 'smooth'});
            },

            setLang(lang) {//切换语言
                localStorage.lang = lang;
                this.$i18n.locale = lang;
            },

            scroll() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if (scrollTop > parseInt(1.5 * clientHeight)) {
                    this.topFlag = true;
                } else {
                    this.topFlag = false;
                }
            },

            handlePanel() {
                this.panelFlag = !this.panelFlag;
            }
        },
        destroyed() {
            window.removeEventListener('scroll', this.scroll);
        },
        computed: {
            ...mapGetters(['userName']),
            setNavList() {
                return [
                    {
                        name: this.$t("header.about"),
                        route: 'about',
                    }, {
                        name: this.$t("header.course"),
                        route: 'course',
                    }, {
                        name: this.$t("header.enhancement"),
                        route: 'enhancement',
                    }, {
                        name: this.$t("header.services"),
                        route: 'services',
                    }, {
                        name: this.$t("header.club"),
                        route: 'club',
                    }, {
                        name: this.$t("header.contact"),
                        route: 'contact',
                    }
                ]
            },
        },
        components: {
            Contact,
            Login, Register,
        },
    }
</script>
<style lang="less" scoped>
    @defaultColor: #303461;
    .zh {
        .header_wrap {
            .logo_name {
                font-size: 40px;
            }
            .nav_wrap .nav_item {
                margin-right: 20px;
                font-size: 16px;
            }
            .header_right {
                span, b {
                    font-size: 16px;
                }
            }
        }
    }
    .header_wrap {
        display: flex;
        justify-content: space-between;
        flex: 0 0 auto;
        padding: 15px 30px;
        box-sizing: border-box;
        width: 100%;
        height: 130px;
        .logo_wrap {
            float: left;
            width: 210px;
            height: 100%;
            cursor: pointer;
            .logo_icon {
                float: left;
                width: 76px;
                height: 90px;
            }
            .logo_name {
                margin-left: 10px;
                height: 100px;
                line-height: 100px;
                color: @defaultColor;
                font-size: 24px;
                font-weight: bold;
            }
        }

        .nav_wrap {
            height: 30px;
            line-height: 30px;
            .nav_item {
                position: relative;
                float: left;
                margin-right: 15px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                color: @defaultColor;
                &.active {
                    border-bottom: 2px solid @defaultColor;
                }
                &.about {
                    padding-right: 10px;
                    &:after {
                        position: absolute;
                        right: 0;
                        top: 14px;
                        display: block;
                        content: '';
                        border: 4px solid transparent;
                        border-top-color: @defaultColor;
                    }
                }
                .nav_about_wrap {
                    display: none;
                    position: absolute;
                    left: -10px;
                    top: 30px;
                    padding: 5px 10px;
                    width: 160px;
                    height: 85px;
                    background: #f0f0f0;
                    border-radius: 6px;
                    p {
                        font-size: 12px;
                        color: #2F2F2F;
                        line-height: 25px;
                        font-weight: normal;
                        cursor: pointer;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
                &:hover .nav_about_wrap {
                    display: block;
                }
            }
          .nav_item:hover {
            text-decoration: underline;
          }
        }
        .header_right {
            position: relative;
            float: right;
            .icon_lang, icon_cart, .icon_exit {
                float: left;
                margin-top: 5px;
                margin-right: 10px;
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            span, b {
                float: left;
                margin-left: 10px;
                margin-right: 10px;
                height: 30px;
                font-size: 12px;
                line-height: 26px;
                color: @defaultColor;
                font-weight: bold;
                &.line {
                    margin: 0 5px;
                }
            }
            b {
                margin: 0;
                line-height: 30px;
                cursor: pointer;
            }
            b:hover {
              text-decoration: underline;
            }
            .sign_btn {
                width: 80px;
                border: 2px solid @defaultColor;
                border-radius: 15px;
                text-align: center;
                cursor: pointer;
                &.register {
                    background-color: @defaultColor;
                    color: #fff;
                }
            }
            .sign_btn:hover {
              text-decoration: underline;
            }
            .icon_cart, .icon_exit {
                margin-left: 20px;
            }
            .username {
                height: 30px;
                line-height: 30px;
                cursor: pointer;
            }
            .avator {
                width: 30px;
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                text-align: center;
                background: #887066;
                color: #fff;
                border-radius: 50%;
            }
        }
        .panel {
            position: absolute;
            right: 10px;
            bottom: -80px;
            padding-bottom: 10px;
            padding-top: 10px;
            width: 200px;
            background: #fff;
            border-radius: 2px;
            .panel_item {
                width: 100%;
                height: 40px;
                cursor: pointer;
                &:hover {
                    .panel_txt {
                        color: #8f7445;
                    }
                    .panel_icon.list {
                        background: url('../../assets/images/icon_list_active.png') no-repeat center;
                        background-size: 16px 16px;
                    }
                    .panel_icon.people {
                        background: url('../../assets/images/icon_peoples_active.png') no-repeat center;
                        background-size: 16px 16px;
                    }
                    .panel_icon.exit {
                        background: url('../../assets/images/icon_exit_active.png') no-repeat center;
                        background-size: 16px 16px;
                    }
                }
                .panel_icon {
                    float: left;
                    margin-top: 12px;
                    margin-right: 0;
                    width: 16px;
                    height: 16px;
                    &.list {
                        background: url('../../assets/images/icon_list.png') no-repeat center;
                        background-size: 16px 16px;
                    }
                    &.people {
                        background: url('../../assets/images/icon_peoples.png') no-repeat center;
                        background-size: 16px 16px;
                    }
                    &.exit {
                        background: url('../../assets/images/icon_exit.png') no-repeat center;
                        background-size: 16px 16px;
                    }
                }
                .panel_txt {
                    float: left;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    color: #666;
                }
            }
        }
    }
    .float_tool {
        position: fixed;
        right: 30px;
        bottom: 170px;
        width: 80px;
        z-index: 100;
        transition: opacity .3s linear;
        &.disabled {
            opacity: 0;
        }
        .tool_item {
            margin-top: 10px;
            width: 100%;
            height: 60px;
            cursor: pointer;
            .tool_icon_top {
                display: block;
                margin: 0 auto;
                width: 30px;
                height: 30px;
                border-top: 6px solid @defaultColor;
                border-right: 6px solid @defaultColor;
                transform: rotate(-45deg);
            }
            b {
                display: block;
                width: 100%;
                height: 24px;
                line-height: 24px;
                font-size: 12px;
                text-align: center;
                color: @defaultColor;
            }
            .tool_icon_contact {
                display: block;
                margin: 0 auto;
                width: 30px;
                height: 30px;
            }
        }
    }
</style>
