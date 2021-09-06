<template>
    <div class="app_container">
        <CommonHeader :blue="true" />
        <div class="team_header clearfix">
            <p class="team_header_title">{{$t('aboutTeam.ourTeam')}}</p>
            <p class="team_header_desc">{{$t('aboutTeam.ourTeamDesc')}}</p>
        </div>

        <!-- 行政与导师团队 -->
        <template v-if="false">
            <div class="team_tabs">
                <span class="team_tab_slide"></span>
                <span v-for="(tab, tabIdx) in tabList" class="team_tab"
                    :class="activeTabIdx === tabIdx ? 'active' : ''"
                    @click="selectTab(tabIdx)">{{tab}}</span>
            </div>

            <p class="team_list_title">{{activeTabIdx ? $t('aboutTeam.ourInstructors') : $t('aboutTeam.executiveTeam')}}</p>
            <ul class="team_list clearfix" >
                <li class="team_li" v-for="(list, listIdx) in teamList">
                    <img :src="require(`../assets/images/${list.img}`)" />
                    <p class="team_li_name">{{list.name}}</p>
                    <p class="team_li_title">{{list.title}}</p>
                    <p class="team_li_other"
                        v-for="(other, oidx) in list.other"
                        :key="oidx">{{other}}</p>
                </li>
            </ul>
        </template>

        <p class="team_join_title">{{$t('aboutTeam.joinUs')}}</p>
        <p class="team_join_desc">{{$t('aboutTeam.joinDesc')}}</p>
        <div class="team_job clearfix">
            <div class="left clearfix" :style="{top: jobTitleTop+'px'}">
                <p class="team_job_title"
                    :class="jobTitleArrowIdx === posIdx ? 'active' : ''"
                    v-for="(pos, posIdx) in positionTitleList"
                    @click="toPosition(`job${posIdx+1}`, posIdx)" >
                    {{`${posIdx+1}.${pos}`}}
                </p>
                <span class="team_job_arrow" :style="{top: (jobTitleArrowIdx * 30 + 30) + 'px'}"></span>
            </div>
            <div class="right clearfix">
                <div class="job_desc clearfix"
                    v-for="(position, posIdx) in positionDescList"
                    :class="jobTitleArrowIdx === posIdx ? 'active' : ''"
                    :id="`job${posIdx + 1}`">
                    <p>{{(posIdx + 1) + '. ' + $t('aboutTeam.jobDescription')}}:</p>
                    <span>{{position}}</span>
                </div>
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
                activeTabIdx: 0,
                jobTitleTop: 0,
                jobTitleArrowIdx: 0,
            }
        },
        created() {
            this.$root.addTj(2);
        },
        methods: {
            selectTab(idx) {
                this.activeTabIdx = idx;
            },
            toPosition(refName, idx) {
                if (!refName) return;
                let dom = document.getElementById(refName);
                if (!dom) return;
                let offsetTop = dom.offsetTop;
                this.jobTitleTop = offsetTop - idx * 30;
                this.jobTitleArrowIdx = idx;
            },
        },
        computed: {
            teamList() {
                let activeTabIdx = this.activeTabIdx;
                return activeTabIdx ? this.instructorList : this.directorList ;
            },
            tabList() {
                return [
                    this.$t('aboutTeam.executiveTeamCaps'),
                    this.$t('aboutTeam.ourInstructorsCaps'),
                ]
            },
            directorList() { //行政团队
                return [];
                let zh = this.$i18n.locale === 'zh';
                return [
                    {
                        img: 'team_img3.jpg',
                        name: 'Ying Cao',
                        title: zh ? '创办人' : 'Founder',
                        other: zh ? ['37年中美高校经验', '工作领域：录取，职业规划，', '国际交流和总裁培训'] : ['Seasoned Educator', 'Field: Admissions, Career Development', 'and International Communications'],
                    }, {
                        img: 'team_img7.jpg',
                        name: 'Sophia Li',
                        title: zh ? '首席执行官兼申学总监' : 'CEO & Admissions Director',
                        other: zh ? ['布朗大学, 2021 届', '应⽤数学-经济以及', '计算机科学双专业'] : ['Brown University, Class of 2021', 'Applied Math - Economics', '& Computer Science'],
                    }, {
                        img: 'team_img2.jpg',
                        name: 'Amy Xu',
                        title: zh ? '首席运营官' :'Chief Operating Officer',
                        other: zh ? ['南加州大学，2019届', '建筑设计专业'] : ['University of Southern California', 'Class of 2019', 'Architecture'],
                    }, {
                        img: 'team_img4.jpg',
                        name: 'Sally Kang',
                        title: zh ? '信息总监' : 'Information Director',
                        other: zh ? ['多伦多大学（圣乔治）, 2021届', '认知科学, 计算机科学', '以及经济专业'] : ['University of Toronto (St. George)', 'Class of 2021', 'Cognitive Science, Computer Science', '& Economics'],
                    }, {
                        img: 'team_img5.jpg',
                        name: 'Neil Chen',
                        title: zh ? '课程总监' : 'Program Director',
                        other: zh ? ['布朗大学, 2021 届', '应⽤数学-经济专业'] : ['Brown University, Class of 2021', 'Applied Math – Economics'],
                    }, {
                        img: 'team_img1.jpg',
                        name: 'Hanpu Wei',
                        title: zh ? '技术总监' : 'Technology Director',
                        other: zh ? ['南加州大学，2020 届', '字节跳动', '计算机科学研究生'] : ['University of Southern California', 'Class of 2020', 'Computer Science, Master'],
                    }
                ]
            },
            instructorList() {//导师团队
                return [];
                let zh = this.$i18n.locale === 'zh';
                return [
                    {
                        img: 'team_img8.jpg',
                        name: 'Steven Man',
                        other: zh ? ['计算机科学/计算机工程', '机械工程背景'] : ['Computer Science/Computer Engineer', 'Mechanical Engineer Background'],
                    }, {
                        img: 'team_img9.jpg',
                        name: 'Xiaochun Lv',
                        other: zh ? ['计算机科学/计算机工程', '计算机科学背景'] : ['Computer Science/Computer Engineer', 'Computer Science Background'],
                    }, {
                        img: 'icon_default.png',
                        name: 'Jerry',
                        other: zh ? ['计算机科学/计算机工程', '计算机科学背景'] : ['Computer Science/Computer Engineer', 'Computer Science Background'],
                    }, {
                        img: 'team_img10.jpg',
                        name: 'Brian Xiao',
                        other: zh ? ['视觉艺术与设计', '品牌策略师/产品设计师'] : ['Visual Arts & Design', 'Product Designer / Brand Strategist'],
                    }, {
                        img: 'icon_default.png',
                        name: 'Daniel Zhou',
                        other: zh ? ['数学', '数学 & 生物统计学背景'] : ['Mathematics', 'Mathematics & Biostatistics Background'],
                    }, {
                        img: 'team_img11.jpg',
                        name: 'Wenjie Fu',
                        other: zh ? ['数学', '数据科学背景'] : ['Mathematics', 'Data Science Background'],
                    }, {
                        img: 'team_img7.jpg',
                        name: 'Sophia Li',
                        other: zh ? ['商业与金融', '应⽤数学-经济 &', '计算机科学背景'] : ['Business & Finance', 'Applied Math - Economics &', 'Computer Science Background'],
                    }, {
                        img: 'team_img5.jpg',
                        name: 'Neil Chen',
                        other: zh ? ['商业与金融', '应⽤数学-经济背景'] : ['Business & Finance', 'Applied Math - Economics Background'],
                    }
                ];
            },
            positionTitleList() {
                return [
                    this.$t('aboutTeam.positionOne'),
                    this.$t('aboutTeam.positionTwo'),
                    this.$t('aboutTeam.positionThree'),
                ]
            },
            positionDescList() {
                return [
                    this.$t('aboutTeam.positionOneDesc'),
                    this.$t('aboutTeam.positionTwoDesc'),
                    this.$t('aboutTeam.positionThreeDesc'),
                ]
            },
        },
        components: {
            CommonHeader, CommonFooter,
        },
    }
</script>
<style lang="less" scoped>
    @defaultColor: #25315E;
    .zh {
        .team_tabs {
            .team_tab {
                font-size: 16px;
            }
        }
    }
    .team_header {
        margin: 0 auto;
        width: 100%;
        height: 250px;
        color: @defaultColor;
        .team_header_title {
            width: 100%;
            height: 90px;
            line-height: 90px;
            font-size: 30px;
            text-align: center;
            font-weight: bold;
        }
        .team_header_desc {
            margin: 0 auto;
            width: 490px;
            line-height: 22px;
            font-size: 12px;
            text-align: center;
        }
    }
    .team_tabs {
        position: relative;
        padding: 2px;
        margin: 80px auto 0;
        width: 324px;
        height: 44px;
        border-radius: 22px;
        background: @defaultColor;
        .team_tab {
            float: left;
            width: 160px;
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            color: #A7A4A4;
            text-align: center;
            border-radius: 20px;
            font-weight: bold;
            transition: all .3s;
            cursor: pointer;
            &.active {
                background: #fff;
                color: @defaultColor;
            }
        }
    }
    .team_join_text {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 12px;
        color: @defaultColor;
        text-align: center;
        text-decoration: underline;
        cursor: pointer;
    }
    .team_list_title {
        width: 100%;
        height: 200px;
        line-height: 200px;
        font-size: 24px;
        color: @defaultColor;
        text-align: center;
        font-weight: bold;
    }
    .team_list {
        margin: 0 auto;
        width: 1040px;
        .team_li {
            float: left;
            width: 260px;
            height: 300px;
            color: #25315E;
            img {
                display: block;
                margin: 0 auto 20px;
                width: 130px;
                height: 130px;
                border-radius: 50%;
            }
            p {
                width: 100%;
                line-height: 20px;
                font-size: 12px;
                text-align: center;
            }
            .team_li_name {
                line-height: 30px;
                font-size: 14px;
                font-weight: bold;
            }
            .team_li_title {

            }
            .team_li_other {

            }
        }
    }
    .team_join_title {
        margin-top: 60px;
        width: 100%;
        height: 90px;
        line-height: 90px;
        font-size: 28px;
        color: @defaultColor;
        text-align: center;
        font-weight: bold;
    }
    .team_join_desc {
        margin: 0 auto;
        width: 480px;
        line-height: 24px;
        font-size: 12px;
    }
    .team_job {
        position: relative;
        margin: 80px auto 0;
        padding-bottom: 100px;
        width: 100%;
        background: url('../assets/images/about_bg.png') no-repeat left bottom;
        background-size: 100%;
        color: @defaultColor;
        .left {
            position: absolute;
            left: 50%;
            transform: translateX(-400px);
            width: 390px;
            transition: top .5s;
            .team_job_title {
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                color: #959191;
                cursor: pointer;
                &.active {
                    height: 60px;
                    line-height: 60px;
                    font-size: 20px;
                    color: #374784;
                    font-weight: bold;
                }
            }
            .team_job_arrow {
                position: absolute;
                left: 230px;
                top: 30px;
                display: block;
                width: 140px;
                height: 2px;
                background: #000;
                transition: top .5s;
                &:after {
                    display: block;
                    position: absolute;
                    right: 0;
                    top: -1px;
                    content: '';
                    width: 4px;
                    height: 4px;
                    background: #000;
                    border-radius: 50%;
                }
            }
        }
        .right {
            margin-left: 50%;
            width: 420px;
            .job_desc {
                width: 100%;
                color: #959191;
                p {
                    font-weight: bold;
                    line-height: 60px;
                    font-size: 18px;
                }
                span {
                    padding-left: 25px;
                    display: block;
                    width: 100%;
                    line-height: 24px;
                    font-size: 12px;
                }
                &.active {
                    color: #374784;
                }
            }
        }
    }
</style>
