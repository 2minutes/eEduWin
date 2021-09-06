<template>
    <div class="app_container clearfix">
        <div class="enha_top">
            <CommonHeader />
            <div class="enha_top_wrap">
                <p class="page_title">{{$t('enha.enhaOpportunities')}}</p>
                <p class="page_desc">{{$t('enha.enhaOpportunitiesDesc')}}</p>
                <ul class="page_sub clearfix">
                    <li class="page_sub_li">
                        <p>{{$t('enha.eEduWinCompetitions')}}</p>
                        <span>{{$t('enha.eEduWinCompetitionsDesc')}}</span>
                    </li>
                    <li class="page_sub_li">
                        <p>{{$t('enha.eEduWinVolunteers')}}</p>
                        <span>{{$t('enha.eEduWinVolunteersDesc')}}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="tabs clearfix">
            <span v-for="(tab, tabIdx) in tabList" class="tab" 
                :class="activeTabIdx === tabIdx ? 'active' : ''"
                @click="selectTab(tabIdx)">{{tab}}</span>
        </div>

        <div class="current_wrap clearfix">
            <p class="current_wrap_title">{{activeTabIdx ? $t('enha.currentVolunteers') : $t('enha.currentCompetitions')}}</p>
            <!-- <p class="current_desc"></p> -->
            <ul class="current_list clearfix">
                <li class="current_li current_li_header">
                    <span class="left">{{$t('enha.list')}}</span>
                    <!-- <span>{{$t('enha.signUpDeadline')}}</span> -->
                </li>
                <li class="current_li" v-for="(item) in list"
                    @click="toEnhaDetail(item.activityNo)">
                    <span class="left">{{zh ? item.activityNmZh : item.activityNmEn}}</span>
                    <!-- <span>{{zh ? item.submitEndTsCn : item.submitEndTsEn}}</span> -->
                </li>
            </ul>
        </div>

        <div v-show="pastList.length" class="past_wrap clearfix">
            <p class="past_title">{{$t('enha.past')}}</p>
            <swiper ref="mySwiper" :options="swiperOptions" class="past_list">
                <swiper-slide class="past_li"  v-for="(past, pastIdx) in pastList" :key="pastIdx">
                    <img :src="past.activityLogo"  @click="toEnhaDetail(past.activityNo)"/>
                    <p>{{zh ? past.activityNmZh : past.activityNmEn}}</p>
                    <span>{{zh ? past.submitEndTsCn : past.submitEndTsEn}}</span>
                </swiper-slide>
                
                <div class="swiper-scrollbar" slot="scrollbar"></div>
            </swiper>
        </div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {Request} from '@/api/request';
    import {formatActivityDate} from '@/assets/js/public';
    export default {
        name: 'enhancement',
        data() {
            return {
                activeTabIdx: 0,
                competitionList: [],
                voluteerList: [],
                pastList: [],

                swiperOptions: {
                    spaceBetween: 20,
                    slidesPerView: 3.2,
                    mousewheel: true,
                    mousewheelControl: true,
                    roundLengths: true,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        draggable: true,
                        // dragSize: 50,
                    },
                },

            }
        },
        created() {
            this.initData();
            this.$root.addTj(5);
        },
        methods: {
            selectTab(idx) {
                this.activeTabIdx = idx;
            },
            initData() {
                Request({
                    url: 'activity/home',
                    params: {},
                }).then(res => {
                    if (res.code == 200) {
                        let competitionList = res.competitions ? res.competitions : [];
                        let voluteerList = res.activities ? res.activities : [];
                        let pastList = res.hisActivitys ? res.hisActivitys : [];
                        competitionList = this.formatActivityData(competitionList);
                        voluteerList = this.formatActivityData(voluteerList);
                        pastList = this.formatActivityData(pastList);
                        this.competitionList = competitionList;
                        this.voluteerList = voluteerList;
                        this.pastList = pastList;
                    }
                });
            },
            toEnhaDetail(activityNo) {
                this.$router.push({
                    path: '/enhaDetail',
                    query: {
                        ano: activityNo,
                    }
                });
            },
            formatActivityData(list) {
                list = list.map(item => {
                    let formatedDate = formatActivityDate(item.submitEndTs);
                    item.submitEndTsCn = formatedDate.dateCn;
                    item.submitEndTsEn = formatedDate.dateEn;
                    return item;
                });
                return list;
            },
        },
        computed: {
            list() {
                let activeTabIdx = this.activeTabIdx;
                return activeTabIdx ? this.voluteerList : this.competitionList;
            },
            tabList() {
                return [this.$t('enha.ourCompetitions'), this.$t('enha.ourVolunteers')];
            },
            zh() {
                return this.$i18n.locale == 'zh';
            }
        },
        components: {
            CommonHeader, CommonFooter,
        },
    }
</script>
<style lang="less" scoped>
    @defaultColor: #25315E;
    .enha_top {
        width: 100%;
        height: 520px;
        background: #a8d0e6;
        color: @defaultColor;
        flex-shrink: 0;
        .enha_top_wrap {
            margin: 0 auto;
            width: 1000px;
            height: 400px;
            background: url('../assets/images/oppprt_img.png') no-repeat right 0 bottom 60px;
            background-size: 300px 230px;
        }
        .page_title {
            margin-bottom: 30px;
            width: 620px;
            height: 40px;
            line-height: 40px;
            font-size: 28px;
            font-weight: bold;
        }
        .page_desc {
            margin-bottom: 60px;
            width: 620px;
            line-height: 20px;
            font-size: 12px;
        }
        .page_sub {
            width: 460px; 
            .page_sub_li {
                position: relative;
                padding-left: 15px;
                margin-bottom: 10px;
                width: 100%;
                height: 90px;
                p {
                    line-height: 40px;
                    font-size: 20px;
                    font-weight: bold;
                }
                span {
                    display: block;
                    width: 100%;
                    line-height: 16px;
                    font-size: 12px;
                }
                &:before {
                    position: absolute;
                    left: 0;
                    top: 10px;
                    content: '';
                    width: 4px;
                    height: 40px;
                    background: @defaultColor;
                    border-radius: 2px;
                }
            }
        }
    }
    .tabs {
        display: block;
        padding: 2px;
        margin: 50px auto;
        width: 324px;
        height: 44px;
        border-radius: 22px;
        background: @defaultColor;
        flex-shrink: 0;
        .tab {
            float: left;
            width: 160px;
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            color: #A7A4A4;
            text-align: center;
            border-radius: 20px;
            font-weight: bold;
            transition: all .2s;
            &.active {
                background: #fff;
                color: @defaultColor;
            }
        }
    }
    .current_wrap {
        padding: 40px 66px 60px;
        margin: 0 auto;
        width: 990px;
        background: #fff;
        border-radius: 2px;
        color: #000;
        flex-shrink: 0;
        .current_wrap_title {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            font-weight: bold;
        }
        .current_desc {
            width: 390px;
            line-height: 40px;
            font-size: 12px;
        }
        .current_list {
            margin-top: 30px;
            width: 100%;
            color: #858585;
            cursor: pointer;
            .current_li {
                width: 100%;
                height: 30px;
                line-height: 30px;
                font-size: 12px;  
                span {
                    float: left;
                } 
                .left {
                    width: 590px;
                }
                &.current_li_header {
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    font-weight: bold;
                    border-bottom: 2px solid #eee;
                }
            }
        }
    }
    .past_wrap {
        margin: 40px auto;
        padding: 30px 66px;
        width: 990px;
        height: 390px;
        background: #fff;
        border-radius: 2px;
        overflow: hidden;
        flex-shrink: 0;
        .past_title {
            width: 100%;
            height: 60px;
            line-height: 60px;
            font-size: 20px;
            font-weight: bold;
            color: #000;
        }
        .past_list {
            .past_li {
                float: left;
                width: 100%;
                height: 240px;
                cursor: pointer;
                img {
                    margin-bottom: 4px;
                    display: block;
                    width: 100%;
                    height: 150px;
                    background: #f3f3f3;
                    border-radius: 2px;
                }
                p {
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #000;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-weight: bold;
                }
                span {
                    display: block;
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #868686;
                }
            }
            .swiper-scrollbar {
                left: 50%;
                margin-left: -110px;
                width: 220px;
                height: 4px;
            }
        }
    }
    .app_container {
        padding-bottom: 1px;
    }
</style>