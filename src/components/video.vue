<template>
    <div class="app_container">
        <CommonHeader :blue="true" />
        <div class="breadcrumb" >
            <span @click="toSchedule">{{zh ? '课程' : 'Courses'}}</span>
            <i></i>
            <span @click="toVideoList()">{{zh ? detail.courseNmCn : detail.courseNmEn}}</span>
            <i></i>
            <span>{{zh ? videoDetail.videoNmCn : videoDetail.videoNmEn}}</span>
        </div>
        <div class="detail">
            <p class="course_name">{{zh ? detail.courseNmCn : detail.courseNmEn}}</p>
            <p class="desc">{{zh ? videoDetail.timeCn : videoDetail.timeEn}}</p>
        </div>
        <div class="video_wrap app_content clearfix">
            <div v-show="!src" class="pass_wrap">
                <p class="tip bold">{{$t('video.passwordRequired')}}</p>
                <p class="tip">{{$t('video.gotPassword')}}</p>
                <div class="pass">
                    <input class="pass_input" type="text" v-model="password" :placeholder="$t('video.password')"/>
                    <span @click="watch" class="pass_btn bold pointer">{{$t('video.watch')}}</span>
                    <span class="tip" :class="{'active': active}">{{errorTip}}</span>
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
            <div class="notes">
                <p class="title">{{$t('video.notesAndLinks')}}</p>
            </div>
        </div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {Request} from '@/api/request';
    import {videoPlayer} from 'vue-video-player';
    import 'video.js/dist/video-js.css';
    import {error} from '@/assets/js/public';
    export default {
        data() {
            return {
                detail: {
                    type: 'Math',
                    status: 1,
                },
                videoDetail: {
                    videoNmCn: '',
                    videoNmEn: '',
                    timeCn: '', 
                    timeEn: ''
                },
                courseNo: '',
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

                videoId: '',

                password: '',
                active: false,
                errorTip: '',
            }
        },
        created() {
            let query = this.$route.query;
            if (query.id) {
                this.videoId = query.id;
                this.getVideoDetail(query.id);
                let url = this.$store.state.url;
                if (url) {
                    this.getVideoSource(url);
                    this.$store.commit('setUrl', '');
                }
            }
            if (query.cno) {
                this.courseNo = query.cno;
                this.initData(query.cno);
            }
        },
        methods: {
            initData(courseNo) {
                Request({
                    url: 'course/query',
                    params: {
                        courseNo: courseNo
                    }
                }).then(res => {
                    if (res.code == 200) {
                        let course = res.courses && res.courses.length ? res.courses[0] : {};
                        let detail = {};
                        detail.courseNmCn = course.courseNmCn;
                        detail.courseNmEn = course.courseNmEn;
                        detail.courseNo = course.courseNo;
                        this.detail = detail;
                    }
                });
            },
            getVideoDetail(id) {
                Request({
                    url: 'video/query',
                    method: 'post',
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.code == 200) {
                        let list = res.videos ? res.videos : [];
                        if (list.length) {
                            let video = list[0];
                            let videoDetail = {
                                videoNmCn: video.videoNameCn,
                                videoNmEn: video.videoNameEn,
                            };
                            Object.assign(videoDetail, this.formatVideoList(video.startTs, video.endTs));
                            this.videoDetail = videoDetail;
                        }
                    } else if (res.code == 1001) {
                        this.$router.push('/');
                    }
                })
            },

            watch() {
                let password = this.password;
                if (!password) {
                    this.tip(1);
                    return;
                }
                Request({
                    url: `video/play`,
                    params: {
                        id: this.videoId,
                        videoPassword: password,
                    },
                }).then(res => {
                    if (res.code == 200) {
                        if (!res.msg) {
                            error(this.zh ? '暂无视频' : 'No Video.');
                            return;
                        }
                        this.getVideoSource(res.msg);
                    } else {
                        this.tip(2, res.msg);
                    }
                    
                });
            },
            tip(type, txt) {//type: 1为空，2错误
                let errorTip = type == 1 ? 
                    this.zh ? '请输入密码!' : 'Please enter the password.' :
                    this.zh ? '密码不正确!' : 'Incorrect password.';
                if (txt) {
                    errorTip = txt;
                }
                this.errorTip = errorTip;
                this.active = true;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    this.active = false;
                }, 1000);
            },
            formatVideoList(startTs, endTs) {
                let monthEnShort = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                let year = startTs.substr(0, 4) - 0,
                    month = startTs.substr(5, 2) - 0,
                    day = startTs.substr(8, 2) - 0,
                    hour = startTs.substr(11, 2) - 0,
                    endHour = endTs.substr(11, 2) - 0,
                    minute = startTs.substr(14, 2),
                    endMinute = endTs.substr(14, 2),
                    second = startTs.substr(17, 2),
                    endSecond = endTs.substr(17, 2);
                let timeCn = `${month}月${day}日 ${hour}:${minute}:${second} - ${endHour}:${endMinute}:${endSecond}`,
                    timeEn = `${monthEnShort[month]} ${day} ${hour > 12 ? 'PM ' + (hour - 12) : 'AM ' + hour}:${minute}:${second} - ${endHour > 12 ? 'PM ' + (endHour - 12) : 'AM ' + endHour}:${endMinute}:${endSecond}`;
                return {
                    timeCn, timeEn
                };
            },

            playerStateChanged(event) {
            },
            playerReadied(event) {
            },

            toVideoList() {
                if (this.courseNo) {
                    this.$router.push({
                        path: '/videoList',
                        query: {
                            no: this.courseNo
                        }
                    });
                }
            },
            toSchedule() {
                this.$router.push({
                    path: '/schedule'
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
            }
        },
        computed: {
            zh() {
                return this.$i18n.locale == 'zh';
            },
            player() {
                return this.$refs.videoPlayer.player;
            }
        },
        components: {
            CommonHeader,
            CommonFooter,
            videoPlayer
        }
    }
</script>
<style lang="less" scoped>
    @defaultWidth: 1100px;
    .breadcrumb {
        width: @defaultWidth;
        user-select: none;
    }
    .detail {
        padding-bottom: 10px;
        margin: 10px auto;
        width: @defaultWidth;
        border-bottom: 1px solid #ddd;
        .course_name {
            height: 40px;
            line-height: 40px;
            font-size: 18px;
            color: #222;
            font-weight: bold;
        }
        .desc {
            width: 100%;
            line-height: 20px;
            font-size: 14px;
            color: #666;
        }
    }
    .video_wrap {
        margin: 0 auto 20px;
        width: @defaultWidth;
        .video-player-box {
            float: left;
        }
        .notes {
            float: right;
            width: 260px;
            .title {
                position: relative;
                width: 100%;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #8f6520;
                border-bottom: 1px solid #ddd;
                text-indent: 15px;
                &:before {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    content: '';
                    width: 120px;
                    height: 2px;
                    background: #8f6520;
                }
            }
        }
    }
    .pass_wrap {
        float: left;
        width: 820px;
        height: 460px;
        background: #000;
        .tip {
            width: 100%;
            height: 34px;
            line-height: 34px;
            font-size: 14px;
            text-align: center;
            color: #fff;
            user-select: none;
            &.bold {
                margin-top: 114px;
                font-size: 18px;
            }
        }
        .pass {
            position: relative;
            margin: 10px auto;
            width: 290px;
            .pass_input {
                padding-left: 10px;
                padding-right: 10px;
                box-sizing: border-box;
                float: left;
                width: 140px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                background: #fff;
                color: #999;
                border-radius: 2px;
            }
            .pass_btn {
                float: right;
                width: 140px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #fff;
                background: #47ace9;
                text-align: center;
                border-radius: 4px;
            }
            .tip {
                display: none;
                position: absolute;
                left: 0;
                top: 50px;
                padding-left: 10px;
                padding-right: 10px;
                width: auto;
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                color: #fff;
                text-align: center;
                background: #e95660;
                border-radius: 4px;
                &:before {
                    position: absolute;
                    left: 10px;
                    top: -10px;
                    content: '';
                    border: 5px solid transparent;
                    border-bottom-color: #e95660;
                }
                &.active {
                    display: block;
                    animation: shake 800ms ease-in-out;
                }
            }
        }
    }
    @keyframes shake {
        10%, 90% {transform: translate3d(-1px, 0, 0);}
        20%, 80% {transform: translate3d(+2px, 0, 0);}
        30%, 70% {transform: translate3d(-4px, 0, 0);}
        40%, 60% {transform: translate3d(+4px, 0, 0);}
        50% {transform: translate3d(-4px, 0, 0);}
    }
</style>