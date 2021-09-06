<template>
    <div class="app_container">
        <div class="stories_top clearfix">
            <CommonHeader />
            <div class="stories_top_wrap clearfix">
                <div class="our_stories clearfix">
                    <p class="stories_title">{{$t('stories.ourStories')}}</p>
                    <p class="stories_desc">{{$t('stories.ourStoriesDesc1')}}</p>
                </div>
                <div class="stories_btns">
                    <span class="stories_btn" @click="toPosition('cases')">{{$t('stories.topOffersCaps')}}<i></i></span>
                    <!-- <span class="stories_btn" @click="toPosition('cases')">{{$t('stories.successfulCasesCaps')}}<i></i></span> -->
                </div>
            </div>
        </div>

        <div class="expertise">
           {{$t('stories.ourExpertise')}} : <span><b>100%</b> {{$t('stories.successRate')}}  <b>100+</b> {{$t('stories.topUSOffers')}}</span>
        </div>

        <div class="stories_map clearfix" ref="offers">
            <img src="../assets/images/stories_map.png" />
            <!-- <span class="more">{{$t('stories.andAnyMore')}}...</span> -->
        </div>

        <div class="cases clearfix" ref="cases">
            <!-- <p class="cases_title">{{$t('stories.successfulCasesCaps')}}</p> -->
            <div class="case clearfix" v-for="item in caseList" :key="item.name">
                <div class="left" :class="item.list && item.list.length ? '' : 'empty'">
                    <p class="case_name">{{item.name}}</p>
                    <p class="case_li" v-for="caseItem in item.list">{{caseItem}}</p>
                    <template v-if="$i18n.locale=='en'">
                        <p class="case_li_other" v-for="caseOther in item.other">{{caseOther}}</p>
                    </template>
                </div>
                <img v-if="item.icon" :src="require(`../assets/images/${item.icon}.png`)" />
            </div>
        </div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    export default {
        data() {
            return {
                backTopActive: false,//返回到顶部按钮是否显示
            }
        },
        created() {
            this.$root.addTj(3);
        },
        methods: {
            toPosition(idName) {//滚动到指定位置
                this.$refs[idName].scrollIntoView({behavior: 'smooth'});
            },
        },
        components: {
            CommonHeader, CommonFooter,
        },
        computed: {
            caseList() {
                return [
                    {
                        name: this.$t('stories.harvardChemistry'),
                        list: [
                            this.$t('stories.harvardChemistryAcademic'),
                            this.$t('stories.harvardChemistryActivities'),
                            this.$t('stories.harvardChemistryAchievements')
                        ],
                        icon: 'icon_harvard',
                    }, {
                        name: this.$t('stories.HarvardEconomyGovernment'),
                        list: [
                            this.$t('stories.HarvardEconomyGovernmentLeadership'),
                            this.$t('stories.HarvardEconomyGovernmentAchievements'),
                        ],
                        icon: 'icon_harvard',
                    }, {
                        name: this.$t('stories.pennsylvaniaScience'),
                        list: [
                            this.$t('stories.pennsylvaniaScienceAcademic'),
                            this.$t('stories.pennsylvaniaScienceLeadership'),
                            this.$t('stories.pennsylvaniaScienceAchievements')
                        ],
                        icon: 'icon_penn',
                    }, {
                        name: this.$t('stories.cornellScience'),
                        list: [
                            this.$t('stories.cornellScienceAcademic'),
                            this.$t('stories.cornellScienceLeadership'),
                            this.$t('stories.cornellScienceArchievements')
                        ],
                        icon: 'icon_cornell',
                    }, {
                        name: this.$t('stories.UCBerkeley'),
                        list: [
                            this.$t('stories.UCBerkeleyAcademic'),
                            this.$t('stories.UCBerkeleyLeadership'),
                            this.$t('stories.UCBerkeleyArchievements')
                        ],
                        other: [
                            this.$t('stories.UCBerkeleyGuided')
                        ],
                        icon: 'icon_berkeley',
                    }, {
                        name: this.$t('stories.columbiaEconomics'),
                        list: [
                            this.$t('stories.columbiaEconomicsAcademic'),
                            this.$t('stories.columbiaEconomicsActivities'),
                            this.$t('stories.columbiaEconomicsAchievements'),
                        ],
                        icon: 'icon_columbia',
                    }, {
                        name: this.$t('stories.MITComputerScience'),
                        list: [
                            this.$t('stories.MITComputerScienceAcademic'),
                            this.$t('stories.MITComputerScienceActivities'),
                            this.$t('stories.MITComputerScienceAchievements'),
                        ],
                        icon: 'icon_mit',
                    }, {
                        name: this.$t('stories.California'),
                        list: [
                            this.$t('stories.CaliforniaAcademic'),
                            this.$t('stories.CaliforniaActivities'),
                            this.$t('stories.CaliforniaAchievements'),
                        ],
                        icon: 'icon_california',
                    }, {
                        name: this.$t('stories.andMore'),
                        list: [],
                    }
                ]
            }
        }
    }
</script>
<style lang="less" scoped>
    @defaultColor: #1b1e4c;
    .zh {
        .stories_top {
            .our_stories {
                .stories_desc {
                    font-size: 14px;
                    /*text-indent: 2em;*/
                }
            }
        }
    }
    .stories_top {
        width: 100%;
        height: 540px;
        background: url('../assets/images/stories_back.png') no-repeat left center;
        background-size: cover;
        .stories_top_wrap {
            margin: 0 auto;
            width: 1000px;
        }
        .our_stories {
            padding: 20px 40px;
            box-sizing: border-box;
            width: 690px;
            height: auto;
            background-color: rgba(189, 212, 228, .8);
            .stories_title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                font-size: 28px;
                color: @defaultColor;
                font-weight: bold;
            }
            .stories_desc {
                line-height: 25px;
                font-size: 14px;
                color: @defaultColor;
                b {
                    font-size: 18px;
                }
            }
        }
        .stories_btns {
            margin-top: 20px;
            margin-bottom: 80px;
            width: 640px;
            height: 50px;
            .stories_btn {
                padding: 0 20px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                float: left;
                margin-right: 30px;
                height: 40px;
                line-height: 40px;
                font-size: 16px;
                color: #fff;
                background-color: rgba(27, 30, 76, .8);
                border-radius: 4px;
                cursor: pointer;
                i {
                    margin-left: 10px;
                    width: 10px;
                    height: 15px;
                    background: url('../assets/images/icon_cornor.png') no-repeat center;
                    background-size: 10px 15px;
                }
            }
        }
    }
    .expertise {
        box-sizing: border-box;
        width: 100%;
        height: 130px;
        line-height: 130px;
        background: #b3cfe4;
        font-size: 16px;
        color: @defaultColor;
        text-align: center;
        span {
            font-size: 22px;
            font-weight: bold;
            b {
                font-size: 30px;
            }
        }
    }
    .stories_map {
        margin: 60px auto;
        width: 1040px;
        img {
            width: 100%;
        }
        .more {
            padding-left: 40px;
            box-sizing: border-box;
            width: 100%;
            height: 120px;
            line-height: 120px;
            font-size: 18px;
            color: @defaultColor;
        }
    }
    .cases {
        margin: 0 auto;
        padding-left: 40px;
        box-sizing: border-box;
        width: 1040px;
        .cases_title {
            height: 90px;
            line-height: 90px;
            font-size: 28px;
            color: @defaultColor;
            font-weight: bold;
        }
        .case {
            padding-left: 40px;
            margin-bottom: 30px;
            box-sizing: border-box;
            width: 100%;
            .left {
                position: relative;
                padding-left: 10px;
                box-sizing: border-box;
                float: left;
                width: 700px;
                min-height: 44px;
                &:before {
                    position: absolute;
                    left: 0;
                    top: 10px;
                    content: '';
                    width: 2px;
                    height: 40px;
                    background-color: @defaultColor;
                }
                &.empty:before {
                    top: 0;
                }
                .case_name {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 20px;
                    color: @defaultColor;
                    font-weight: bold;
                }
                .case_li, .case_li_other {
                    position: relative;
                    padding-left: 20px;
                    box-sizing: border-box;
                    width: 100%;
                    line-height: 26px;
                    font-size: 14px;
                    color: @defaultColor;
                    &:before {
                        position: absolute;
                        left: 0;
                        content: '+';
                        width: 16px;
                        height: 16px;
                        color: @defaultColor;
                        font-size: 12px;
                        font-weight: bold;
                    }
                }
                .case_li_other {
                    font-style: italic;
                    &:before {
                        content: '*';
                    }
                }
            }
            img {
                float: right;
                width: 170px;
                height: auto;
            }
        }
    }
</style>
