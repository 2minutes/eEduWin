<template>
    <div class="app_container clearfix">
        <div class="home_top">
            <CommonHeader />
            <div class="home_top_wrap">
                <img class="home_left" src="../assets/images/home_leftImg.png">
                <div class="home_middle clearfix">
                    <span class="middle_top">{{$t('home.inspiringCreativity')}}</span>
                    <span class="middle_top center">{{$t('home.innovation')}}</span>
                    <span class="middle_top right">{{$t('home.entrepreneurship')}}</span>
                    <p class="home_slogon">
                        {{$t('home.slogan')}}
                    </p>
                    <div class="middle_btn" >
                        {{$t('home.seeCourse')}}
                        <div class="wrapper">
                            <div class="nav_about_wrap">
                                <p @click="cliNav('course')">{{this.$t("header.course")}}</p>
                                <p @click="cliNav('enhancement')">{{this.$t("header.enhancement")}}</p>
                                <p @click="cliNav('services')">{{this.$t("header.services")}}</p>
                                <p @click="cliNav('club')">{{this.$t("header.club")}}</p>
                            </div>
                        </div>
                       
                    </div>
                </div>
                <!-- <div class="home_right" @click="showContactModel">Contact Us ></div> -->
            </div>
        </div>

        <div v-show="newsList.length" class="home_news_wrap clearfix">
            <span class="swiper_title">{{$t('home.eEduWinNews')}}</span>
            <swiper class="news_swiper" ref="mySwiper" :options="newsSwiperOptions">
                <swiper-slide class="slide"  v-for="(news, newsIdx) in newsList" :key="newsIdx">
                    <span v-show="!news.newsPic" class="img_empty" @click="showNewModel(newsIdx)"></span>
                    <img v-show="news.newsPic" @click="showNewModel(newsIdx)" :src="news.newsPic">
                    <div class="new_cont_wrap" @click="showNewModel(newsIdx)">
                        <span class="new_cont">{{zh ? news.newsTitleCn : news.newsTitleEn}}</span>
                    </div>
                </swiper-slide>
                <div class="swiper-scrollbar" slot="scrollbar"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
        </div>

        <!--<div class="our_services">
            <div class="left">
                <span class="our_title">{{$t('home.mainServicesTitle')}}</span>
                <div class="our_service_cont">
                    <span class="our_service">+ {{$t('home.enrichmentPrograms')}}</span>
                    <span class="our_service_desc">{{$t('home.enrichmentProgramsDesc')}}</span>
                </div>
                <div class="our_service_cont">
                    <span class="our_service">+ {{$t('home.resourceProvider')}}</span>
                    <span class="our_service_desc">{{$t('home.resourceProviderDesc')}}</span>
                </div>
                <div class="our_service_cont">
                    <span class="our_service">+ {{$t('home.collegePreparationGuidance')}}</span>
                    <span class="our_service_desc">{{$t('home.collegePreparationGuidanceDesc')}}</span>
                </div>
            </div>
            <img class="our_services_bg" src="../assets/images/home_services_bg.jpg">
        </div> -->

        <div v-show="notice.id" class="latest_wrap">
            <div class="latest_top">
                <span class="latest_title">{{$t('home.latestTitle')}}</span>
                <img class="latest_img" src="../assets/images/home_latestImg.png">
            </div>
            <div class="latest_bottom">
                <div class="latest_item">
                    <img v-if="notice.noticePic" class="latest_img" :src="notice.noticePic">
                    <img v-else class="latest_img" src="../assets/images/home_latestDownImg.png">
                    <div class="latest_item_cont">
                        <p class="latest_item_title">{{zh ? notice.noticeTitleZh : notice.noticeTitleEn}}</p>
                        <p class="latest_item_deadline">
                            <span>{{$t('home.SignUpDeadline')}}: </span>
                            <span class="deadline">{{notice.endTs}}</span>
                        </p>
                        <p class="latest_item_desc"
                            v-for="(not, notIdx) in (zh ? notice.noticeContentZhList : notice.noticeContentEnList)"
                            :key="notIdx">{{not}}</p>
                    </div>
                    <div class="latest_next_wrap">
                        <span @click="initNotice(3)"  class="next"
                            :class="{'active': notice.hasNext}"></span>
                        <span @click="initNotice(2)" class="prev"
                            :class="{'active': notice.hasPre}"></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="sign_wrap">
            <div class="sign_map_title">
                <span @click="showRegisterModel">{{$t('home.signUpTitle')}}</span>
                <img src="../assets/images/home_next.png">
            </div>
            <p class="sign_map_bg" ></p>
        </div>
        <New :list="newsList" :idx="newsIdx" />
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import New from '@/components/common/new';
    import {Request} from '@/api/request';
    export default {
        data() {
            return {
                newsList: [],
                newsIdx: -1,
                lastUpdateList: [],
                newsSwiperOptions: {
                    spaceBetween: 30,
                    slidesPerView: 'auto',
                    mousewheel: true,
                    roundLengths: true,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        draggable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                },

                notice: {},
            }
        },
        created() {
            this.initNews();
            this.initNotice();
        },
        methods: {
            initNews() {//获取新闻数据
                Request({
                    url: 'news/query',
                    params: {
                        language: '1',
                    },
                }).then(res => {
                    let newsList = res.news ? res.news : [];
                    this.newsList = newsList;
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
            initNotice(type = 1) {
                //type,1 latest, 2 pre, 3 next
                let url = type == 1 ? 'notice/latest' : (type == 2 ? 'notice/pre' : 'notice/next');
                let params = type == 1 ? {} : {endTs: this.notice.endTs};
                if (type == 2 && !this.notice.hasPre) {
                    return;
                }
                if (type == 3 && !this.notice.hasNext) {
                    return;
                }
                Request({
                    url: url,
                    params: params,
                }).then(res => {
                    if (res.notice && res.notice.id) {
                        let notice = res.notice;
                        notice.noticeContentEnList = notice.noticeContentEn.split('#');
                        notice.noticeContentZhList = notice.noticeContentZh.split('#');
                        this.notice = notice;
                    }
                });
            },
            showNewModel(newsIdx) {
                this.newsIdx = newsIdx;
                this.$store.dispatch('handleNewModel', true);
            },
            showContactModel() {
                this.$store.dispatch('handleContactModel', true);
            },
            showRegisterModel() {
                this.$store.dispatch('handleRegisterModel', true);
            },
            toCourse() {
                this.$router.push({
                    path: '/course',
                });
            },
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.$swiper
            },
            zh() {
                return this.$i18n.locale == 'zh';
            }
        },
        components: {
            CommonHeader, CommonFooter,
            New,
        },
    }
</script>
<style lang="less" scoped>
    @borderColor: #25315E;
    @defaultColor: #303461;
    .zh {
        .home_top {
            .home_top_wrap {
                .home_middle {
                    width: 300px;
                    .middle_top {
                        font-size: 32px;
                        &.center {
                            text-align: center;
                        }
                        &.right {
                            text-align: right;
                        }
                    }
                    .home_slogon {
                        font-size: 20px;
                        line-height: 46px;
                        font-weight: bold;
                    }
                }
            }
        }
        .our_services {
            .left {
                span {
                    &.our_service {
                        font-size: 18px;
                    }
                    &.our_service_desc {
                        font-size: 14px;
                    }
                }
            }
        }
        .sign_wrap {
            .sign_map_title span {
                font-size: 30px;
            }
        }
    }
    .home_top {
        position: relative;
        margin-bottom: 50px;
        width: 100%;
        height: 660px;
        box-sizing: border-box;
        background: #a8d0e6 url('../assets/images/home_topImg.png') no-repeat left top;
        background-size: cover;
        flex-shrink: 0;
        .home_top_wrap {
            margin: 30px auto 0;
            width: 800px;
            height: 500px;
            .home_left {
                float: left;
                width: 370px;
                height: 350px;
            }
            .home_middle {
                position: relative;
                margin-top: 20px;
                margin-left: 30px;
                float: left;
                width: 400px;
                .middle_top {
                    float: left;
                    padding-left: 20px;
                    width: 100%;
                    height: 40px;
                    line-height: 50px;
                    font-size: 24px;
                    color: #374784;
                    font-weight: bold;
                }
                .home_slogon {
                    margin-top: 30px;
                    float: left;
                    padding-left: 20px;
                    width: 100%;
                    height: 46px;
                    line-height: 23px;
                    font-size: 12px;
                }
                .middle_btn {
                    float: left;
                    margin-left: 20px;
                    margin-top: 40px;
                    width: 150px;
                    height: 40px;
                    line-height: 40px;
                    font-weight: bold;
                    font-size: 14px;
                    background: #F8E8A0;
                    border-radius: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition-duration: 0.3s;
                    transition-property: box-shadow;
                    -webkit-tap-highlight-color: transparent;
                    transform: translateZ(0);
                    padding-right: 10px;
                    &:after {
                        position: absolute;
                        right: 15px;
                        top: 18px;
                        display: block;
                        content: '';
                        border: 4px solid transparent;
                        border-top-color: @defaultColor;
                    }
                }
                .middle_btn:hover {
                    box-shadow: inset 0 0 0 1px #666, 0 0 1px transparent;
                }

                .middle_btn:hover  .wrapper{
                    display: block;
                }

                .wrapper {
                    display: none;
                    position: absolute;
                    left: 0px;
                    top: 0px;
                    padding-top: 50px;
                }
                
                .nav_about_wrap {
                    padding: 5px 10px;
                    width: 200px;
                    height: 110px;
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
                
            }
        }
        .home_right {
            position: absolute;
            right: 0;
            bottom: 20px;
            width: 200px;
            height: 125px;
            line-height: 140px;
            font-size: 16px;
            font-weight: bold;
            color: #292929;
            background: url('~@/assets/images/home_contactImg.png') center center no-repeat;
            background-size: 200px 125px;
            cursor: pointer;
            text-align: center;
        }
    }
    .home_news_wrap{
        margin: 0 auto;
        flex-shrink: 0;
        width: 1200px;
        .swiper_title {
            float: left;
            padding-left: 90px;
            width: 100%;
            height: 90px;
            line-height: 90px;
            font-size: 30px;
            font-weight: bold;
        }
        .news_swiper {
            padding: 0 30px;
            margin-top: 40px;
            width: 100%;
            height: 430px;
        }
        .slide {
            width: 410px;
            height: 410px;
            cursor: pointer;
            .swiper_right {
                float: right;
                cursor: pointer;
                span {
                    margin-top: 10px;
                    margin-right: 120px;
                    font-weight: bold;
                }
            }
            img {
                width: 410px;
                height: 270px;
            }
            .img_empty {
                display: block;
                width: 410px;
                height: 270px;
                background: url('../assets/images/news_bg.jpg') no-repeat center;
                background-size: 410px 270px;
            }
            .new_cont_wrap {
                padding-top: 20px;
                width: 100%;
                height: 120px;
                .new_cont {
                    float: left;
                    padding: 0 10px;
                    margin-right: 40px;
                    width: 330px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #202a6c;
                }
                .new_arrow {
                    margin-top: 28px;
                    float: left;
                    width: 16px;
                    height: 16px;
                    border-top: 4px solid #202a6c;
                    border-right: 4px solid #202a6c;
                    transform: rotate(45deg);
                    cursor: pointer;
                }
            }
        }
        .swiper-scrollbar {
            left: 50%;
            margin-left: -110px;
            width: 220px;
            height: 4px;
        }
    }
    .our_services {
        padding: 30px 85px;
        margin: 100px auto;
        width: 990px;
        height: 390px;
        background: #fff;
        flex-shrink: 0;
        .left {
            float: left;
            width: 380px;
            .our_service_cont {
                float: left;
                margin-bottom: 20px;
            }
            span {
                float: left;
                width: 100%;
                float: left;
                &.our_title {
                    height: 70px;
                    line-height: 70px;
                    color: #25315E;
                    font-weight: bold;
                    font-size: 30px;
                }
                &.our_service {
                    height: 56px;
                    line-height: 56px;
                    color: #25315E;
                    font-weight: bold;
                    font-size: 18px;
                }
                &.our_service_desc {
                    padding-left: 20px;
                    margin-top: 10px;
                    font-size: 12px;
                    line-height: 16px;
                }
            }
        }
        .our_services_bg {
            margin-top: 80px;
            margin-left: 100px;
            width: 330px;
            height: 220px;
        }
    }
    .latest_wrap {
        width: 100%;
        height: 590px;
        flex-shrink: 0;
        .latest_top {
            width: 100%;
            height: 160px;
            .latest_title {
                float: left;
                padding-left: 70px;
                width: 50%;
                height: 160px;
                line-height: 160px;
                color: #374784;
                font-size: 32px;
                font-weight: bold;
            }
            .latest_img {
                float: right;
                padding-top: 2px;
                margin-right: 90px;
                width: 242px;
                height: 160px;
            }
        }
        .latest_bottom {
            padding-top: 25px;
            width: 100%;
            height: 420px;
            border-top: 3px solid #374784;
            background: #d6e4ef;
            .latest_item {
                margin: 0 auto;
                width: 1030px;
                height: 360px;
                img {
                    float: left;
                    margin-right: 40px;
                    width: 480px;
                    height: 360px;
                }
                .latest_item_cont {
                    float: left;
                    width: 480px;
                    height: 100%;
                    color: #333d7b;
                    .latest_item_title {
                        width: 100%;
                        line-height: 40px;
                        font-size: 26px;
                        font-weight: bold;
                    }
                    .latest_item_deadline {
                        margin-top: 20px;
                        margin-bottom: 10px;
                        width: 100%;
                        height: 34px;
                        line-height: 34px;
                        font-size: 14px;
                        font-weight: bold;
                        span {
                            float: left;
                            &.deadline {
                                padding-left: 7px;
                                padding-right: 25px;
                                box-sizing: border-box;
                                margin-left: 10px;
                                height: 30px;
                                line-height: 28px;
                                font-size: 12px;
                                border: 2px solid #333d7b;
                                background: url('../assets/images/icon_deadline.png') no-repeat right 5px center;
                                background-size: 14px 14px;
                                border-radius: 2px;
                            }
                        }
                    }
                    .latest_item_desc {
                        display: block;
                        width: 100%;
                        line-height: 20px;
                        font-size: 12px;
                    }
                }
                .latest_next_wrap {
                    position: relative;
                    float: left;
                    margin-left: 5px;
                    margin-top: 160px;
                    width: 20px;
                    height: 40px;
                    span {
                        display: block;
                        width: 20px;
                        height: 20px;
                        border-top: 5px solid #f0f0f0;
                        border-left: 5px solid #f0f0f0;
                        cursor: pointer;
                        &.next {
                            transform: rotate(135deg);
                        }
                        &.prev {
                            margin-top: 20px;
                            margin-left: 10px;
                            transform: rotate(-45deg);
                        }
                        &.active {
                            border-top-color: @borderColor;
                            border-left-color: @borderColor;
                        }
                    }
                }
            }
        }
    }
    .sign_wrap {
        padding-top: 60px;
        width: 100%;
        height: 406px;
        background:  no-repeat 0 bottom;
        background-size: 100% 280px;
        flex-shrink: 0;
        .sign_map_bg {
            display: block;
            width: 100%;
            height: 280px;
            background: url('../assets/images/home_downImg.png') no-repeat left top;
            background-size: cover;
        }
        .sign_map_title {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 70px;
            cursor: pointer;
            span {
                height: 70px;
                line-height: 70px;
                color: #25315E;
                font-size: 24px;
                font-weight: bold;
            }
            img {
                margin-left: 10px;
                width: 28px;
                height: 28px;
            }
        }
    }
    .swiper-container{
        --swiper-theme-color: #ff6600;
        --swiper-navigation-color: #25315E;
        --swiper-navigation-size: 30px;
    }
    .swiper-button-prev, .swiper-button-next {
        top: 30%;
        width: 30px;
        height: 30px;
        border-top: 4px solid @borderColor;
        border-left: 4px solid @borderColor;
        background: none;
    }
    .swiper-button-prev {
        left: 40px;
        transform: rotate(-45deg);
    }
    .swiper-button-next {
        right: 10px;
        transform: rotate(135deg);
    }
</style>
