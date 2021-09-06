<template>
    <div class="app_container clearfix" ref="head">
        <div class="services_header">
            <CommonHeader />
            <p class="services_title">
                {{$t('services.admissionServices')}}
                <a ref="down_a" class="down_a" :href="downloadUrl" 
                    download="创赢-规划服务手册.pdf"></a>
                <span class="down_btn" @click="download">{{$t('services.down')}}</span>
            </p>
            <p class="services_overview_title">{{$t('services.overview')}}:</p>
            <p>{{$t('services.overviewDesc')}}</p>
            <span class="tip">{{$t('services.fullServicesDesc')}}</span>
        </div>

        <div class="goals_wrap">
            <img class="left" src="../assets/images/services_goal.png" />
            <div class="right">
                <p class="services_common_title">{{$t('services.ourGoals')}}:</p>
                <p class="services_common_li">{{$t('services.goalsProvide')}}</p>
                <p class="services_common_li">{{$t('services.goalsDevelop')}}</p>
                <p class="services_common_li">{{$t('services.goalsAssign')}}</p>
            </div>
        </div>

        <div class="why_wrap clearfix">
            <p class="services_common_title">{{$t('services.whyChooseUs')}}:</p>
            <p class="services_common_li">{{$t('services.why1')}}</p>
            <p class="services_common_li">{{$t('services.why2')}}</p>
            <p class="services_common_li">{{$t('services.why3')}}</p>
            <p class="services_common_li">{{$t('services.why4')}}</p>
            <p class="services_common_li">{{$t('services.why5')}}</p>
        </div>

        <div class="cont_wrap clearfix">
            <p class="services_common_title">{{$t('services.serviceContents')}}:</p>
            <p class="cont_tip">{{$t('services.discover')}}:</p>
            <div class="cont_tabs">
                <span v-for="(tab, tabIdx) in tabList" class="cont_tab"
                    :class="activeTabIdx === tabIdx ? 'active' : ''"
                    @click="selectTab(tabIdx)">{{tab}}</span>
            </div>
            <div class="cont_list_wrap">
                <img class="left" :src="require(`../assets/images/services_${tabImgs[activeTabIdx]}.png`)" />
                <ul class="cont_list">
                    <li v-for="(list, idx) in contList[activeTabIdx]">{{`${idx+1}. ${list}`}}</li>
                </ul>
            </div>
        </div>
        <CommonFooter />

    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {error} from '@/assets/js/public';
    import {mapGetters} from 'vuex';
    export default {
        data() {
            return {
                activeTabIdx: 0,
                tabImgs: ['advise', 'guidance', 'enhance', 'support', 'communicate'],
                downloadUrl: '../../static/files/ServicePackage.pdf',
            }
        },
        created() {
            this.$root.addTj(6);
        },
        methods: {
            selectTab(idx) {
                this.activeTabIdx = idx;
            },
            download() {
                if (this.userName) {
                    this.$refs.down_a.click();
                } else {
                    error('请先登录!');
                    this.$store.dispatch('handleLoginModel', true);
                    this.$root.addTj(9);
                }
            },
        },
        computed: {
            ...mapGetters(['userName']),
            tabList() {
                return [
                    this.$t('services.advise'),
                    this.$t('services.guidance'),
                    this.$t('services.enhance'),
                    this.$t('services.support'),
                    this.$t('services.communicate')
                ];
            },
            contList() {
                let contList = [
                    [
                        this.$t('services.advise1'),
                        this.$t('services.advise2'),
                        this.$t('services.advise3'),
                        this.$t('services.advise4'),
                        this.$t('services.advise5'),
                    ], [
                        this.$t('services.guidance1'),
                        this.$t('services.guidance2'),
                        this.$t('services.guidance3'),
                        this.$t('services.guidance4'),
                        this.$t('services.guidance5'),
                        this.$t('services.guidance6'),
                    ], [
                        this.$t('services.enhance1'),
                        this.$t('services.enhance2'),
                        this.$t('services.enhance3'),
                        this.$t('services.enhance4'),
                        this.$t('services.enhance5'),
                    ], [
                        this.$t('services.support1'),
                        this.$t('services.support1'),
                        this.$t('services.support1'),
                        this.$t('services.support1'),
                    ], [
                        this.$t('services.communicate1'),
                        this.$t('services.communicate2'),
                        this.$t('services.communicate3'),
                        this.$t('services.communicate4'),
                    ]
                ];
                return contList;
            },
            // downloadUrl() {
            //     return `../../static/files/ServicePackage.pdf`;
            // },
        },
        components: {
            CommonHeader, CommonFooter,
        }
    }
</script>
<style lang="less" scoped>
    @defaultColor: #25315e;
    .services_header {
        position: relative;
        width: 100%;
        height: 560px;
        background: #a8d0e8;
        border-bottom: 78px solid #fff;
        flex-shrink: 0;
        p {
            margin: 0 auto;
            width: 1000px;
            line-height: 24px;
            font-size: 14px;
            color: @defaultColor;
        }
        .services_title {
            height: 70px;
            line-height: 70px;
            font-size: 30px;
            font-weight: bold;
            .down_btn {
                padding: 0 20px;
                display: inline-block;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
                background-color: #f8f8a0;
                cursor: pointer;
                border-radius: 20px;
            }
            .down_a {
                visibility: hidden;
            }
        }
        .services_overview_title {
            height: 56px;
            line-height: 56px;
            font-weight: bold;
            font-size: 16px;
        }
        .tip {
            padding: 40px 190px;
            box-sizing: border-box;
            position: absolute;
            left: 50%;
            bottom: -78px;
            transform: translateX(-50%);
            width: 730px;
            height: 150px;
            line-height: 30px;
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            text-align: center;
            background: @defaultColor;
            border-radius: 2px;
        }
    }
    .goals_wrap {
        flex-shrink: 0;
        margin: 80px auto 0;
        width: 760px;
        height: 300px;
        .left {
            float: left;
            margin-top: 30px;
            width: 280px;
            height: 210px;
        }
        .right {
            float: right;
            width: 390px;
            height: 100%;
        }
    }
    .why_wrap {
        flex-shrink: 0;
        margin: 80px auto 110px;
        width: 690px;
    }
    .cont_wrap {
        flex-shrink: 1;
        padding: 40px 0;
        margin: 0 auto;
        width: 990px;
        height: 520px;
        background: #fff;
        .services_common_title {
            height: 70px;
            line-height: 70px;
            text-align: center;
        }
        .cont_tip {
            width: 100%;
            height: 24px;
            line-height: 24px;
            color: @defaultColor;
            text-align: center;
        }
        .cont_tabs {
            position: relative;
            padding: 2px;
            margin: 30px auto 0;
            width: 780px;
            height: 44px;
            border-radius: 22px;
            background: @defaultColor;
            cursor: pointer;
            .cont_tab {
                float: left;
                width: 155px;
                height: 40px;
                line-height: 40px;
                font-size: 12px;
                font-weight: bold;
                color: #A7A4A4;
                text-align: center;
                border-radius: 20px;
                font-weight: bold;
                transition: all .3s;
                &.active {
                    background: #fff;
                    color: @defaultColor;
                }
            }
        }
        .cont_list_wrap {
            margin-top: 40px;
            width: 100%;
            height: 200px;
            .left {
                float: left;
                margin-left: 135px;
                width: 210px;
                height: 150px;
            }
            .cont_list {
                float: left;
                margin-left: 60px;
                margin-top: 25px;
                width: 470px;
                height: 200px;
                li {
                    width: 100%;
                    line-height: 22px;
                    font-size: 12px;
                    color: @defaultColor;
                }
            }
        }
    }
    .services_common_title {
        width: 100%;
        height: 90px;
        line-height: 90px;
        font-size: 30px;
        font-weight: bold;
        text-indent: 30px;
    }
    .services_common_li {
        position: relative;
        padding-left: 24px;
        width: 100%;
        line-height: 20px;
        font-size: 12px;
        color: @defaultColor;
        &:before {
            position: absolute;
            left: 0;
            top: 0;
            display: block;
            content: '+';
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
        }
    }
</style>
