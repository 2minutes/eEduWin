<template>
    <div class="app_container">
        <CommonHeader :blue="true" />
        <div class="breadcrumb" >
            <span @click="toPage('/')">{{zh ? '首页' : 'Home'}}</span>
            <i></i>
            <span @click="toPage('/course')">{{$t('header.course')}}</span>
            <i></i>
            <span>{{zh ? detail.courseNmCn : detail.courseNmEn}}</span>
        </div>
        <div class="course_wrap app_content">
            <template v-if="courseType != '' && courseType != 'Talk'">
                <div class="course_info  clearfix">
                    <div class="left clearfix">
                        <p class="course_title">{{zh ? detail.courseNmCn : detail.courseNmEn}}</p>
                        <p class="course_desc">{{zh ? detail.descCn : detail.descEn}}</p>
                        <div class="course_other_info clearfix">
                            <p class="other_item"><b>{{$t('detail.subjectArea')}}:</b>{{zh ? detail.typeNmCn : detail.typeNmEn}}</p>
                            <p class="other_item"><b>{{$t('common.targetAgeGroup')}}:</b>{{zh ? detail.gradeCn : detail.gradeEn}}</p>
                            <p class="other_item"><b>{{$t('common.courseCapacity')}}:</b>{{zh ? detail.capacityCn : detail.capacityEn}}</p>
                            <p class="other_item"><b>{{$t('common.teamSize')}}:</b>{{zh ? detail.teamSizeCn : detail.teamSizeEn}}</p>
                            <p class="other_item"><b>{{$t('detail.projectDuration')}}:</b>{{zh ? detail.durationCn : detail.durationEn}}</p>
                        </div>
                        <!-- <div class="course_btns clearfix">
                            <span class="btn_checkout" @click="checkOut">Checkout Now</span>
                            <span class="btn_cart" @click="addCart">Add to Cart <i class="icon_cart"></i></span>
                            <span class="btn_share" @click="share">Share<i class="icon_share"></i></span>
                        </div> -->
                        <span class="course_status" :class="{'active': detail.courseSt === 1, 'disabled': detail.courseSt === 0}">{{detail.courseSt === 1 ? $t("detail.statusOpen") : $t("detail.statusClose")}}</span>
                    </div>
                    <img v-if="detail.typeImg" class="right" :src="require(`../assets/images/course_${detail.typeImg}.png`)">
                </div>
                
                <div class="course_intro clearfix">
                    <p class="course_intro_title">{{$t('detail.courseRequirement')}}</p>
                    <p class="course_intro_li" v-for="(requ) in (zh ? detail.requirementCn : detail.requirementEn)">+ {{requ}}</p>
                </div>
                <div class="course_intro clearfix">
                    <p class="course_intro_title">{{$t('detail.instructor')}}:</p>
                    <p class="course_intro_li" v-for="(inst) in (zh ? detail.instructorCn : detail.instructorEn)">+ {{inst}}</p>
                </div>
                <div class="course_objectives clearfix">
                    <p class="objective_title">{{$t('detail.courseObjectives')}}</p>
                    <p class="objective_li">{{zh ? detail.objectivesCn : detail.objectivesEn}}</p>
                </div>
                <div class="takeaways_and_features clearfix">
                    <p class="course_intro_title">{{$t('detail.courseHighlights')}}:</p>
                    <p class="course_intro_li" v-for="(high) in (zh ? detail.highlightsCn : detail.highlightsEn)">+ {{high}}</p>
                </div>
            </template>
        
            <template v-if="courseType != '' && courseType === 'Talk'">
                <div class="course_info talk clearfix">
                    <p class="course_title">{{zh ? detail.courseNmCn : detail.courseNmEn}}</p>
                    
                    <div class="course_intro clearfix" v-for="list in detail.descList" :key="list.id">
                        <p class="course_intro_title">{{zh ? list.descTitleCn : list.descTitleEn}}</p>
                        <p class="course_intro_li" v-for="(item, idx) in (zh ? list.courseDescCn : list.courseDescEn)" :key="list.id + idx">{{item}}</p>
                    </div>
                </div>
                <video-player v-if="src"  class="video-player-box"
                    ref="videoPlayer"
                    :options="playerOptions"
                    :playsinline="true"
                    customEventName="customstatechangedeventname"

                    @statechanged="playerStateChanged($event)"
                    @ready="playerReadied">
                </video-player>
            </template>
        </div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {Request} from '@/api/request';
    import {getCourseTypeShort, joinNum} from '@/assets/js/public';
    import {videoPlayer} from 'vue-video-player';
    export default {
        data() {
            return {
                detail: {
                    type: 'Math',
                    status: 1,
                },
                courseNo: '',
                courseType: '',

                video: null,
                src: '',
                playerOptions: {
                    // videojs options
                    muted: true,
                    language: 'en',
                    playbackRates: [0.7, 1.0, 1.5, 2.0],
                    sources: [{
                        type: "video/mp4",
                        src: '',
                    }],
                    width: '820px',
                    height: '460px',
                    poster: "",
                    notSupportedMessage: this.$i18n.locale == 'zh' ? '此视频暂无法播放，请稍后再试' : "This video can't play right now. Please try again later",
                },
            }
        },
        created() {
            let query = this.$route.query;
            if (query.cno) {
                this.courseNo = query.cno;
                this.initData();
            }
        },
        methods: {
            initData() {
                Request({
                    url: 'course/query',
                    params: {
                        courseNo: this.courseNo
                    }
                }).then(res => {
                    if (res.code == 200) {
                        let course = res.courses && res.courses.length ? res.courses[0] : {};
                        let detail = {};
                        detail.courseNmCn = course.courseNmCn;
                        detail.courseNmEn = course.courseNmEn;
                        detail.courseNo = course.courseNo;
                        detail.courseDuration = course.courseDuration;
                        detail.courseSt = course.courseSt;
                        let typeShort;
                        if (course.courseType && course.courseType.typeNo) {
                            detail.typeNmCn = course.courseType.typeNmCn;
                            detail.typeNmEn = course.courseType.typeNmEn;
                            typeShort = getCourseTypeShort(course.courseType.typeNmEn);
                            detail.typeImg = typeShort === 'Science' ? 'Math' : typeShort;
                        }
                        if (typeShort === 'Talk') {
                            detail.descList = this.formatCouseDesc(course.courseDesc);
                            this.detail = detail;
                            this.courseType = typeShort;  
                            this.getVideoList(detail.courseNo);
                            return;
                        }
                        let grades = joinNum(course.targetAgeGroupMin, course.targetAgeGroupMax);
                        let capacity = joinNum(course.courseCapacityMin, course.courseCapacityMax);
                        let teamSize = joinNum(course.teamSizeMin, course.teamSizeMax);
                        let duration = joinNum(course.courseDurationMin, course.courseDurationMax);

                        detail.gradeCn = grades ? grades + ' 年级' : '-';
                        detail.gradeEn = grades ? 'Grades ' + grades  : '-';
                        detail.capacityCn = capacity ? capacity + ' 人' : '-';
                        detail.capacityEn = capacity ? capacity + ' students' : '-';
                        detail.teamSizeCn = teamSize ? teamSize + ' 人' : '-';
                        detail.teamSizeEn = teamSize ? teamSize + ' students' : '-';
                        if(teamSize == 1) {
                            detail.teamSizeCn = '个人项目';
                            detail.teamSizeEn = 'Individual';
                        } else if (detail.typeNmEn == 'Tutoring') {
                            detail.teamSizeCn = '一对一';
                            detail.teamSizeEn = '1 on 1';
                        }
                        detail.durationCn = duration ? duration + ' 周' : '-';
                        detail.durationEn = duration ? duration + ' Weeks' : '-';
                        Object.assign(detail, this.getCourseDesc(course.courseDesc));
                        this.detail = detail;
                        this.courseType = typeShort;
                    }
                });
            },
            getVideoList(courseNo) {
                Request({
                    url: 'video/queryByChair',
                    method: 'post',
                    params: {
                        courseNo: courseNo
                    }
                }).then(res => {
                    if (res.code == 1001) {
                        this.$router.push('/');
                        return;
                    } else if (res.code == 200) {
                        let list = res.videos ? res.videos : [];
                        if (!list.length) {
                            return;
                        }
                        let video = list[list.length - 1];
                        this.video = video;
                        this.getVideoSource(video.videoUrl);
                    }
                })
            },
            getCourseDesc(descList) {//获取课程的各种描述
                if (!descList) {
                    return {};
                }
                let desc = {};
                for(let key in descList) {
                    let item = descList[key];
                    switch(item.showRank) {
                        case '1': 
                            desc.descCn = item.courseDescCn;
                            desc.descEn = item.courseDescEn;
                            break;
                        case '2': 
                            desc.requirementCn = item.courseDescCn.split('#');
                            desc.requirementEn = item.courseDescEn.split('#');
                            break;
                        case '3': 
                            desc.instructorCn = item.courseDescCn.split('#');
                            desc.instructorEn = item.courseDescEn.split('#');
                            break; 
                        case '4': 
                            desc.objectivesCn = item.courseDescCn;
                            desc.objectivesEn = item.courseDescEn;
                            break; 
                        case '5': 
                            desc.highlightsCn = item.courseDescCn.split('#');
                            desc.highlightsEn = item.courseDescEn.split('#');
                            break;
                    }
                }
                return desc;
            },
            formatCouseDesc(descList) {
                descList = descList.map(item => {
                    item.courseDescCn = item.courseDescCn.split('#');
                    item.courseDescEn = item.courseDescEn.split('#');
                    return item;
                });
                return descList;
            },
            checkOut() {
                this.$router.push({
                    path: '/payment'
                });
            },
            addCart() {
                this.$router.push({
                    path: 'cart'
                });
            },
            share() {},
            toPage(url) {
                this.$router.replace({
                    path: url
                });
            },

            getVideoSource(url) {
                if (!url) {
                    return false;
                }
                let split = url.split('.');
                let suffix = split[split.length - 1];
                if (suffix && ['webm', 'ogg', '3gp', 'mp4'].includes(suffix)) {
                    this.src = url;
                    this.playerOptions.sources = [{
                        type: `video/${suffix}`,
                        src: url
                    }];
                } else {
                    error(this.zh ? '视频格式错误' : 'Video format error')
                }
            },
            playerReadied() {
            }
        },
        computed: {
            zh() {
                return this.$i18n.locale == 'zh';
            }
        },
        components: {
            CommonHeader, CommonFooter, videoPlayer
        },
    }
</script>
<style lang="less" scoped>
    @defaultColor: #303461;
    @defaultWidth: 980px;
    .breadcrumb {
        margin: 0 auto;
        width: @defaultWidth;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        color: #8b8b8b;
        span {
            float: left;
            cursor: pointer;
        }
        i {
            float: left;
            margin-top: 5px;
            margin-left: 4px;
            margin-right: 8px;
            width: 8px;
            height: 8px;
            border-top: 1px solid #7c7c7c;
            border-left: 1px solid #7c7c7c;
            transform: rotate(135deg);
        }
    }
    .course_wrap {
        margin: 20px auto;
        width: @defaultWidth;
        flex-shrink: 0;
    }
    .course_info {
        margin: 20px auto;
        width: @defaultWidth;
        color: #000;
        .left {
            float: left;
            width: 550px;
            height: 100%;
            .course_desc {
                width: 100%;
                line-height: 20px;
                font-size: 12px;
                color: #535353;
            }
            .course_other_info {
                margin-top: 16px;
                width: 100%;
                .other_item {
                    float: left;
                    padding-right: 4px;
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    font-size: 12px;
                    b {
                        margin-right: 10px;
                    }
                }
            }
            .course_btns {
                margin-top: 10px;
                width: 100%; 
                span {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    float: left;
                    margin-right: 10px;
                    box-sizing: border-box;
                    width: 160px;
                    height: 40px;
                    line-height: 40px;
                    border: 2px solid @defaultColor;
                    color: @defaultColor;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 4px;
                    cursor: pointer;
                    i {
                        margin-left: 4px;
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                    }
                    &.btn_checkout {
                        background-color: @defaultColor;
                        color: #fff;
                    }
                    &.btn_cart {
                        i {
                            background: url('../assets/images/icon_cart.png') no-repeat;
                            background-size: 16px 16px;
                        }
                    }
                    &.btn_share {
                        width: 90px;
                        i {
                            background: url('../assets/images/icon_share.png') no-repeat;
                            background-size: 16px 16px;
                        }
                    }
                }
            }
            .course_status {
                width: 100%;
                height: 34px;
                line-height: 34px;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                &.active {
                    color: #2EAA1D;
                }
                &.disabled {
                    color: #f00;
                }
            }
        }
        .right {
            float: right;
            width: 370px;
            height: 240px;
        }
        &.talk {
            background: url('../assets/images/course_Talk.png') no-repeat top right;
        }
    }
    .video-player-box {
        float: left;
        margin: 20px auto;
        width: @defaultWidth;
    }
    .course_title {
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
        line-height: 36px;
        font-size: 26px;
        color: @defaultColor;
        font-weight: bold;
    }
    .course_intro {
        position: relative;
        padding-left: 20px;
        box-sizing: border-box;
        margin: 20px auto;
        width: @defaultWidth;
        &:before {
            position: absolute;
            left: 0;
            top: 10px;
            content: '';
            width: 2px;
            height: 40px;
            background-color: @defaultColor;
            border-radius: 1px;
        }
    }
    .course_objectives {
        margin: 0 auto;
        padding: 20px 40px;
        box-sizing: border-box;
        width: @defaultWidth;
        background-color: #f0f0f0;
        border: 2px solid #848484;
        border-radius: 4px;
        .objective_title {
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            font-weight: bold;
            color: #000;
        }
        .objective_li {
            float: left;
            padding-left: 60px;
            padding-right: 60px;
            box-sizing: border-box;
            width: 920px;
            line-height: 22px;
            font-size: 12px;
            color: #434343;
            font-weight: bold;
        }
    }
    .takeaways_and_features {
        margin: 40px auto;
        width: @defaultWidth;
        .course_intro_title {
            font-size: 20px;
        }
        .course_intro_li {
            padding-left: 20px;
            width: 830px;
        }
    }
    .course_intro_title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #000;
    }
    .course_intro_li {
        width: 100%;
        font-size: 12px; 
        line-height: 20px;
        color: #000;
        font-weight: bold;
    }
</style>