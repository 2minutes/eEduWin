<template>
    <div class="app_container clearfix" ref="head">
        <CommonHeader :blue="true" />
        <div class="about_top clearfix" ref="about">
            <div class="about_top_left" :style="{top: aboutTop + 'px'}">
                <p class="about_top_title">1.{{$t('aboutUs.aboutUs')}} <span></span> </p>
                <p class="about_top_title_desc" @click="toPositionByRef('who')">+ {{$t('aboutUs.who')}}?</p>
                <p class="about_top_title_desc" @click="toPositionByRef('why')">+ {{$t('aboutUs.why')}}?</p>
                <p class="about_top_title_desc" @click="toPositionByRef('what')">+ {{$t('aboutUs.what')}}?</p>
            </div>
            <div class="about_top_right">
                <div class="clearfix" ref="mission">
                    <p class="about_top_title_middle" :class="activeTabIdx === 0 ? 'active' : ''" @click="toPosition('mission', 0)">1.1 {{$t('aboutUs.ourMission')}}:</p>
                    <p class="about_top_title_desc" :class="activeTabIdx === 0 ? 'active' : ''">{{$t('aboutUs.ourMissionDesc')}}</p>
                </div>
                <div class="about_aim clearfix" ref="ouraim">
                    <p class="about_top_title_middle" :class="activeTabIdx === 1 ? 'active' : ''" @click="toPosition('ouraim', 1)">1.2 {{$t('aboutUs.ourAim')}}:</p>
                    <p class="about_top_title_desc" :class="activeTabIdx === 1 ? 'active' : ''">{{$t('aboutUs.ourAimDesc')}}</p>
                </div>
            </div>
        </div>

        <div class="about_who" ref="who">
            <div class="about_who_cont">
                <p class="about_who_title">
                    <img src="../assets/images/icon_plane.png" />
                    <span>{{$t('aboutUs.aDiverseTeam')}}</span>
                </p>
                <p class="about_who_desc">{{$t('aboutUs.members')}}</p>
                <ul class="about_who_list clearfix">
                    <li v-for="who in whoList" class="about_who_li">
                        <p>{{who.title}}</p>
                        <span v-show="$i18n.locale=='en'">{{who.desc}}</span>
                    </li>
                    <li class="about_who_li zh_more" v-if="$i18n.locale=='zh'">以及正在追梦、不断成长的你！</li>
                </ul>
                <p class="about_who_tip">{{$t('aboutUs.whoCommon')}}</p>
            </div>
            <Pagination :refList="refList" :idx="1" @toposition="toPositionByRef" />
        </div>

        <div class="about_why" ref="why">
            <div class="about_what_why_list clearfix">
                <p class="about_list_title">{{$t('aboutUs.why')}}?</p>
                <p class="about_li">{{$t('aboutUs.whyAdvocates')}}</p>
                <p class="about_li">{{$t('aboutUs.whyPrograms')}}</p>
                <p class="about_li">{{$t('aboutUs.whyServices')}}</p>
            </div>
            <img src="../assets/images/course_Visual.png" />
            <Pagination :refList="refList" :idx="2" @toposition="toPositionByRef" />
        </div>

        <div class="about_what" ref="what">
            <img src="../assets/images/about_advantage.png" />
            <div class="about_what_why_list clearfix">
                <p class="about_list_title">{{$t('aboutUs.what')}}?</p>
                <p class="about_li">{{$t('aboutUs.whatProfessional')}}</p>
                <p class="about_li">{{$t('aboutUs.whatUnderstanding')}}</p>
                <p class="about_li">{{$t('aboutUs.whatParticipated')}}</p>
                <p class="about_li">{{$t('aboutUs.whatSuccessful')}}</p>
                <p class="about_li">{{$t('aboutUs.whatExperiences')}}</p>
                <p class="about_li">{{$t('aboutUs.whatPassionate')}}</p>
                <p class="about_li">{{$t('aboutUs.whatCombination')}}</p>
                <!-- <p class="about_li" v-if="$i18n.locale=='en'">{{$t('aboutUs.whatPassionate')}}</p> -->
                <!-- <p class="about_li" v-if="$i18n.locale=='en'">{{$t('aboutUs.whatCombination')}}</p> -->
            </div>
            <Pagination :refList="refList" :idx="3" @toposition="toPositionByRef" />
        </div>

        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import Pagination from '@/components/common/pagination';
    export default {
        data() {
            return {
                aboutTop: 0,//about us介绍左侧css的top值
                activeTabIdx: 0,
                refList: ['about', 'who', 'why', 'what'],
            }
        },
        mounted() {
        },
        methods: {
            toPosition(refName, idx) {//点击about us的1.1, 1.2左侧滚动到相应位置
                if (!refName) return;
                let dom = this.$refs[refName];
                if (!dom) return;
                let offsetTop = dom.offsetTop;
                this.aboutTop = offsetTop;
                this.activeTabIdx = idx;
            },
            toPositionByRef(refName) {
                if (!refName) return;
                let dom = this.$refs[refName];
                if (!dom) return;
                dom.scrollIntoView({behavior: 'smooth'});
            },
        },
        computed: {
            whoList() {
                return [
                    {
                        title: this.$t('aboutUs.seasonedEducators'),
                        desc: 'With experiences ranging from K-12 to universities in the US'
                    }, {
                        title: this.$t('aboutUs.experiencedStudents'),
                        desc: 'Aspiring US College Students with specialties and motivations for continuing development'
                    }, {
                        title: this.$t('aboutUs.practicingProfessionals'),
                        desc: 'Experts with insight and connections in their fields.'
                    }, {
                        title: this.$t('aboutUs.devotedParents'),
                        desc: 'With successful experiences in raising their children in the States'
                    }
                ]
            }
        },
        components: {
            CommonHeader, CommonFooter,
            Pagination,
        },
    }
</script>
<style lang="less" scoped>
    @defaultWidth: 800px;
    @defaultHeight: 600px;
    @defaultColor: #2e345d;
    .zh {
        .app_container {
            .about_who {
                .about_who_list {
                    li {
                        height: 50px;
                        p {
                            font-size: 18px;
                        }
                        &:before {
                            position: absolute;
                            left: 0;
                            top: 8px;
                            content: '';
                            display: block;
                            width: 2px;
                            height: 20px;
                            background: #000;
                            border-radius: 4px;
                        }
                        &.zh_more {
                            margin-left: 50px;
                            width: 500px;
                            font-size: 24px;
                            font-weight: bold;
                        }
                    }
                }
            }
        }
    }
    .about_top {
        position: relative;
        width: 100%;
        height: @defaultHeight;
        flex-shrink: 0;
        p {
            width: 400px;
            float: right;
        }
        .about_top_left {
            position: absolute;
            right: 50%;
            float: left;
            width: 400px;
            transition: top .5s;
            .about_top_title_desc {
                cursor: pointer;
            }
        }
        .about_top_right {
            float: left;
            margin-left: 50%;
            width: 400px;
            height: 100%;
            p {
                float: left;
            }
            .about_aim {
                margin-top: 50px;
            }
        }
        .about_top_title, .about_top_title_middle {
            height: 70px;
            line-height: 70px;
            font-size: 28px;
            color: #242d5d;
            font-weight: bold;
        }
        .about_top_title {
            position: relative;
            span {
                position: absolute;
                left: 180px;
                top: 35px;
                display: block;
                width: 140px;
                border-bottom: 2px solid #000;
                &:after {
                    position: absolute;
                    right: 0;
                    top: -2px;
                    content: '';
                    display: block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #000;
                }
            }
        }
        .about_top_title_middle {
            font-size: 20px;
            color: #959191;
            cursor: pointer;
            &.active {
                color: #242d5d;
            }
        }
        .about_top_title_desc {
            line-height: 30px;
            font-size: 12px;
            color: #959191;
            &.active {
                color: #374784;
            }
        }
    }
    .about_who {
        position: relative;
        width: 100%;
        height: @defaultHeight;
        flex-shrink: 0;
        .about_who_cont {
            padding-top: 40px;
            width: 100%;
            height: 600px;
            background-color: #f4e7a1;
            border-bottom: 80px solid #fff;
            .about_who_title {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 110px;
                line-height: 110px;
                font-size: 28px;
                color: #2d355d;
                font-weight: bold;
                margin-left: -40px;
                img {
                    margin-right: 20px;
                    width: 70px;
                    height: 40px;
                }
            }
            .about_who_desc {
                margin: 0 auto ;
                width: 400px;
                line-height: 24px;
                font-weight: bold;
                color: #25315E;
                text-align: center;
            }
            .about_who_list {
                margin: 40px auto;
                width: 500px;
                li {
                    position: relative;
                    padding-left: 15px;
                    float: left;
                    margin-left: 30px;
                    width: 220px;
                    height: 100px;
                    p {
                        width: 100%;
                        line-height: 34px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #25315E;
                    }
                    span {
                        display: block;
                        width: 100%;
                        line-height: 16px;
                        font-size: 12px;
                        color: #393939;
                    }
                    &:before {
                        position: absolute;
                        left: 0;
                        top: 10px;
                        content: '';
                        display: block;
                        width: 3px;
                        height: 40px;
                        background: #000;
                        border-radius: 4px;
                    }
                }
            }
            .about_who_tip {
                padding: 40px 160px;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 0;
                width: 730px;
                height: 150px;
                background: #2d345e;
                line-height: 30px;
                font-size: 18px;
                color: #fff;
                font-weight: bold;
                text-align: center;
            }
        }
    }
    .about_what {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: @defaultHeight;
        flex-shrink: 0;
        margin: -50px 0 100px;
        img {
            margin-right: 100px;
            width: 280px;
            height: auto;
        }
    }
    .about_why {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: @defaultHeight;
        flex-shrink: 0;
        .about_what_why_list {
            width: 300px;
        }
        img {
            margin-left: 100px;
            width: 300px;
            height: 200px;
        }
    }

    .about_what_why_list {
        width: 380px;
        color: @defaultColor;
        .about_list_title {
            margin-bottom: 15px;
            width: 100%;
            line-height: 50px;
            font-size: 34px;
            font-weight: bold;
        }
        .about_li {
            position: relative;
            padding-left: 20px;
            width: 100%;
            line-height: 22px;
            font-size: 12px;
            color: #2b3576;
            b {
                text-decoration: under-line;
                font-weight: normal;
            }
            &:before {
                position: absolute;
                left: 0;
                content: '+';
                float: left;
                width: 20px;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
            }
        }
    }
    .slide {
        height: 100%;
        border: 1px solid #eee;
    }
</style>
