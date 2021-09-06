<template>
    <div class="app_container">
        <div class="course_header clearfix">
            <CommonHeader />
            <div class="course_header_pbl clearfix">
                <p class="pbl_title">{{$t('course.projectBasedLearning')}}</p>
                <p class="pbl_desc">{{$t('course.projectBasedLearningDesc')}}</p>
                <a class="pbl_learn" :href="pblUrl" 
                    :download="(zh ? 'PBL简介' : 'PBL_Introduction') + '.pdf'">
                    {{$t('course.learnAboutPbl')}}</a>
            </div>
            <div class="pbl_intro clearfix">
                <ul class="pbl_charas clearfix">
                    <li class="pbl_chara" v-for="(chara) in pblCharaList" :key="chara.img">
                        <div class="pbl_icon_wrap">
                            <img :src="require(`../assets/images/icon_${chara.img}.png`)" :class="chara.img" />
                        </div>
                        <span>{{chara.text}}</span>
                    </li>
                </ul>
                <ul class="pbl_courses clearfix">
                    <li class="pbl_course clearfix"
                        v-for="type in pblCourseTypeList"
                        :key="type.id">
                        <p class="pbl_course_type">{{type.name}}</p>
                        <p class="pbl_course_type_desc">{{type.desc}}</p>
                        <span class="pbl_course_see" @click="toPosition(type.id)">{{$t('course.seeCourses')}} ></span>
                    </li>
                </ul>
            </div>
        </div>

        <CourseList :level="'0'" :typeList="typeList" :courTitle="$t('course.foundationCourses')" :elemId="'foundation'" />
        <CourseList :level="'1'" :typeList="typeList" :courTitle="$t('course.capstoneCourses')" :elemId="'capstone'" />
        <CourseList :level="'2'" :typeList="typeList" :courTitle="$t('course.enrichmentCourses')" :elemId="'enrichment'" />
        <CourseList :level="'3'" :typeList="typeList" :courTitle="$t('course.talkCourses')" :elemId="'talk'" />

        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import CourseList from '@/components/common/courseList';
    import {Request} from '@/api/request';
    export default {
        data() {
            return {
                typeList: [],

                foundational: [],
                enrichment: [],
                master: [],
            }
        },
        created() {
            this.getCourseType();
            this.$root.addTj(4);
        },
        methods: {
            getCourseType() {//获取课程类型
                Request({
                    url: 'courseType/query',
                }).then(res => {
                    if (res.code == 200) {
                        let typeList = res.types ? res.types : [];
                        this.typeList = typeList;
                    }
                });
            },
            toPBLPoster() {//跳转到PBL海报页
                let url = this.pblUrl;
                
                // window.open('http://www.eeduwin.com/static/files/PBL-en.pdf')
            },
            toPosition(refName) {//跳转到页面相应位置
                document.getElementById(refName).scrollIntoView({behavior: 'smooth'});
            },
        },
        components: {
            CommonHeader, CommonFooter, CourseList
        },
        computed: {
            pblCharaList() {
                return [
                    {
                        img: 'student',
                        text: this.$t('course.student'),
                    }, {
                        img: 'doing',
                        text: this.$t('course.doing'),
                    }, {
                        img: 'inquriy',
                        text: this.$t('course.inquiry'),
                    }, {
                        img: 'creative',
                        text: this.$t('course.creative'),
                    }, {
                        img: 'realworld',
                        text: this.$t('course.realworld'),
                    }, {
                        img: 'team',
                        text: this.$t('course.team'),
                    }, {
                        img: 'public',
                        text: this.$t('course.public'),
                    }, {
                        img: 'application',
                        text: this.$t('course.application'),
                    }, {
                        img: 'competition',
                        text: this.$t('course.competition'),
                    }, {
                        img: 'academic',
                        text: this.$t('course.academic'),
                    }
                ];
            },
            pblCourseTypeList() {
                return [
                    {
                        name: this.$t('course.foundationCourses'),
                        desc: this.$t('course.foundationCoursesDesc'),
                        id: 'foundation',
                    }, {
                        name: this.$t('course.capstoneCourses'),
                        desc: this.$t('course.capstoneCoursesDesc'),
                        id: 'capstone',
                    }, {
                        name: this.$t('course.enrichmentCourses'),
                        desc: this.$t('course.enrichmentCoursesDesc'),
                        id: 'enrichment',
                    }, {
                        name: this.$t('course.talkCourses'),
                        desc: this.$t('course.talkCoursesDesc'),
                        id: 'talk',
                    }
                ]
            },
            filterList() {
                return [
                    {
                        label: this.$t('course.math'),
                        value: 'math',
                    }, {
                        label: this.$t('course.computerScience'),
                        value: 'comp',
                    }, {
                        label: this.$t('course.visual'),
                        value: 'visual',
                    }, {
                        label: this.$t('course.businessFinance'),
                        value: 'busi',
                    }, {
                        label: this.$t('course.research'),
                        value: 'research',
                    }, {
                        label: this.$t('course.tutoring'),
                        value: 'tuto',
                    }
                ];
            },
            pblUrl() {
                return `../../static/files/PBL-${this.zh ? 'zh' : 'en'}.pdf`;
            },
            zh() {
                return this.$i18n.locale == 'zh';
            },
        },
    }
</script>
<style lang="less" scoped>
    @defaultWidth: 1000px;
    .zh {
        .course_content {
            .course_list {
                .course_item {
                    .course_item_intro {
                        p {
                        }
                    }
                }
            }
        }
    }
    .course_header {
        padding-bottom: 50px;
        width: 100%;
        background: #b3cfe5 url('../assets/images/course_bg.png') no-repeat 0 0;
        background-size: 100% 100%;
        .course_header_pbl {
            margin: 0 auto;
            width: @defaultWidth;
            .pbl_title {
                width: 100%;
                height: 60px;
                line-height: 60px;
                font-size: 26px;
                font-weight: bold;
                color: #25315E;
            }
            .pbl_desc {
                width: 550px;
                line-height: 20px;
                font-size: 14px;
                color: #374784;
            }
            .pbl_learn {
                padding: 0 24px;
                margin-top: 30px;
                display: inline-block;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
                color: #25315E;
                background-color: #f8f8a0;
                cursor: pointer;
            }
        }
        .pbl_intro {
            margin: 0 auto;
            width: @defaultWidth;
            .pbl_charas {
                padding-top: 50px;
                float: left;
                width: 600px;
                .pbl_chara {
                    float: left;
                    margin-bottom: 10px;
                    width: 300px;
                    height: 55px;
                    .pbl_icon_wrap {
                        float: left;
                        box-sizing: border-box;
                        width: 54px;
                        height: 54px;
                        border: 2px solid #25315e;
                        border-radius: 50%;
                        img {
                            display: block;
                            margin: auto;
                            width: 100%;
                            height: 100%;
                            &.student, &.inquriy, &.team, &.application {
                                margin-top: 6px;
                                width: 24px;
                                height: 38px;
                            }
                            &.doing, &.competition {
                                margin-top: 8px;
                                width: 36px;
                                height: 34px;
                            }
                            &.creative {
                                margin-top: 6px;
                                width: 38px;
                                height: 40px;
                            }
                            &.realworld, &.public {
                                margin-top: 10px;
                                width: 30px;
                                height: 30px;
                            }
                            &.team {
                                width: 40px;
                            }
                            &.public {
                                width: 36px;
                            }
                            &.application {
                                width: 30px;
                            }
                            &.competition {
                                width: 32px;
                            }
                            &.academic {
                                margin-top: 10px;
                                width: 26px;
                                height: 32px;
                            }
                        }
                    }
                    span {
                        float: left;
                        margin-left: 10px;
                        height: 55px;
                        line-height: 55px;
                        font-size: 12px;
                        font-weight: bold;
                        color: #25315E;
                    }
                }
            }
            .pbl_courses {
                padding-top: 50px;
                float: left;
                width: 400px;
                .pbl_course {
                    position: relative;
                    padding-left: 16px;
                    box-sizing: border-box;
                    margin-bottom: 20px;
                    width: 100%;
                    &:before {
                        position: absolute;
                        left: 0;
                        top: 8px;
                        display: block;
                        content: '';
                        width: 4px;
                        height: 44px;
                        background-color: #000;
                        border-radius: 2px;
                    }
                    .pbl_course_type {
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #222653;
                    }
                    .pbl_course_type_desc {
                        width: 250px;
                        line-height: 18px;
                        font-size: 12px;
                        color: #374784;
                    }
                    .pbl_course_see {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                        color: #000;
                        cursor: pointer;
                    }
                }
            }
        }
    }

</style>
// rgba(132, 130, 130, .7)
