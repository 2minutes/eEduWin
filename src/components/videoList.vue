<template>
    <div class="app_container">
        <CommonHeader :blue="true" />
        <div class="breadcrumb" >
            <span @click="toSchedule">{{zh ? '课程' : 'Courses'}}</span>
            <i></i>
            <span>{{zh ? detail.courseNmCn : detail.courseNmEn}}</span>
        </div>
        <div class="detail">
            <p class="course_name">{{zh ? detail.courseNmCn : detail.courseNmEn}}</p>
            <p class="desc">{{zh ? detail.descCn : detail.descEn}}</p>
        </div>
        <div v-for="(list, listIdx) in videoList" :key="list.date" class="list_wrap">
            <p class="date pointer" :class="{active: list.show}" @click="handleShow(listIdx)">{{zh ? list.dateCn : list.dateEn}}</p>
            <ul class="video_list clearfix">
                <li v-for="(item, itemIdx) in (list.show ? list.lists : [])" :key="item.id" class="video_li">
                    <div class="password_wrap">
                        <input v-model="item.password" class="pass_input" type="text" 
                            :placeholder="$t('video.password')">
                        <span class="pass_btn pointer" @click="watch(listIdx, itemIdx)">{{$t('video.watch')}}</span>
                        <span class="tip" :class="{'active': item.active}">{{errorTip}}</span>
                    </div>
                    <p class="video_time">{{zh ? item.timeCn : item.timeEn}}</p>
                    <p class="video_sort pointer" @click="toView(item.id)">{{zh ? item.videoNmCn : item.videoNmEn}}</p>
                </li>
            </ul>
        </div>
        <div class="app_content"></div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {Request} from '@/api/request';
    import {error} from '@/assets/js/public';
    export default {
        data() {
            return {
                detail: {
                    type: 'Math',
                    status: 1,
                },
                courseNo: '',

                videoList: [],
                errorTip: '',
            }
        },
        created() {
            let query = this.$route.query;
            if (query.no) {
                this.courseNo = query.no;
                this.initData(query.no);
                this.getVideoList(query.no);
                this.$root.addTj(4, query.no);
            } else {
                this.$router.replace({
                    path: '/schedule'
                });
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
                        detail.courseDuration = course.courseDuration;

                        Object.assign(detail, this.getCourseDesc(course.courseDesc));
                        this.detail = detail;
                    }
                });
            },
            getVideoList(courseNo) {
                Request({
                    url: 'video/query',
                    method: 'post',
                    params: {
                        courseNo: courseNo
                    }
                }).then(res => {
                    if (res.code == 1001) {
                        this.$route.push('/');
                        return;
                    } else if (res.code == 200) {
                        let list = res.videos ? res.videos : [];
                        list = this.formatVideoList(list);
                        this.videoList = list;
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
                            desc.descCn = item.courseDescCn.split('#').join('');
                            desc.descEn = item.courseDescEn.split('#').join('');
                            break;
                    }
                }
                return desc;
            },
            watch(listIdx, itemIdx) {
                let videoList = this.videoList;
                let videoItem = videoList[listIdx].lists[itemIdx];
                if (!videoItem.password) {
                    this.tip(listIdx, itemIdx, 1);
                    return;
                }
                Request({
                    url: `video/play`,
                    params: {
                        id: videoItem.id,
                        videoPassword: videoItem.password,
                    },
                }).then(res => {
                    if (res.code == 200) {
                        if (!res.msg) {
                            error(this.zh ? '暂无视频' : 'No Video.');
                            return;
                        }
                        this.$store.commit('setUrl', res.msg);
                        this.$router.push({
                            path: '/video',
                            query: {
                                id: videoItem.id,
                                cno: this.courseNo
                            }
                        });
                    }
                }, res => {
                    this.tip(listIdx, itemIdx, 2);
                });
            },
            toView(id) {
                this.$router.push({
                    path: '/video',
                    query: {
                        id: id,
                        cno: this.courseNo
                    }
                });
            },
            toSchedule() {
                this.$router.push({
                    path: '/schedule'
                });
            },
            handleShow(listIdx) {
                this.videoList[listIdx].show = !this.videoList[listIdx].show;
            },

            formatVideoList(lists) {
                let dateList = [];
                let videoList = [];
                let monthEnShort = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for(var item of lists) {
                    let startTs = item.startTs,
                        endTs = item.endTs;
                    let year = startTs.substr(0, 4) - 0,
                        month = startTs.substr(5, 2) - 0,
                        day = startTs.substr(8, 2) - 0,
                        hour = startTs.substr(11, 2) - 0,
                        endHour = endTs.substr(11, 2) - 0,
                        minute = startTs.substr(14, 2),
                        endMinute = endTs.substr(14, 2),
                        second = startTs.substr(17, 2),
                        endSecond = endTs.substr(17, 2);
                    if (dateList.indexOf(`${year}-${month}`) === -1) {
                        dateList.push(`${year}-${month}`);
                        videoList.push({
                            dateCn: `${year}年${month}月`,
                            dateEn: `${monthEnShort[month - 1]} ${year}`,
                            show: true,
                            lists: [],
                        });
                    }
                    videoList[dateList.indexOf(`${year}-${month}`)].lists.push({
                        id: item.id,
                        password: '',
                        active: false,
                        timeCn: `${month}月${day}日 ${hour}:${minute}:${second} - ${endHour}:${endMinute}:${endSecond}`,
                        timeEn: `${monthEnShort[month]} ${day} ${hour > 12 ? 'PM ' + (hour - 12) : 'AM ' + hour}:${minute}:${second} - ${endHour > 12 ? 'PM ' + (endHour - 12) : 'AM ' + endHour}:${endMinute}:${endSecond}`,
                        videoNmCn: item.videoNameCn,
                        videoNmEn: item.videoNameEn
                    });
                }
                return videoList;
            },

            tip(firIdx, secIdx, type) {//type: 1为空，2错误
                this.errorTip = type == 1 ? 
                    this.zh ? '请输入密码!' : 'Please enter the password.' :
                    this.zh ? '密码不正确!' : 'Incorrect password.';
                this.videoList[firIdx].lists[secIdx].active = true;
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    this.videoList[firIdx].lists[secIdx].active = false;
                }, 1000);
            }
        },
        computed: {
            zh() {
                return this.$i18n.locale == 'zh';
            }
        },
        components: {
            CommonHeader,
            CommonFooter,
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
        margin: 10px auto;
        width: @defaultWidth;
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
    .list_wrap {
        padding: 15px;
        box-sizing: border-box;
        margin: 10px auto;
        width: @defaultWidth;
        color: #000;
        background: #f9fafb;
        border-radius: 2px;
        .date {
            position: relative;
            width: 100%;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            text-indent: 20px;
            user-select: none;
            &:before {
                position: absolute;
                left: 0;
                top: 8px;
                content: '';
                width: 6px;
                height: 6px;
                border-bottom: 1px solid #000;
                border-left: 1px solid #000;
                transform: rotate(135deg);
            }
            &.active:before {
                top: 5px;
                transform: rotate(-45deg);
            }
        }
        .video_list {
            margin-top: 10px;
            .video_li {
                float: left;
                margin-bottom: 20px;
                margin-right: 15px;
                width: 260px;
                height: 230px;
                background: #fff;
                .password_wrap {
                    position: relative;
                    padding-top: 30px;
                    box-sizing: border-box;
                    width: 100%;
                    height: 140px;
                    background: #000;
                    .pass_input {
                        display: block;
                        margin: 0 auto 10px;
                        width: 140px;
                        height: 40px;
                        line-height: 40px;
                        font-size: 16px;
                        color: #9a9b9c;
                        border-radius: 4px;
                        text-indent: 10px;
                    }
                    .pass_btn {
                        margin: 0 auto;
                        display: block;
                        width: 140px;
                        height: 40px;
                        line-height: 40px;
                        font-size: 16px;
                        color: #fff;
                        background: #48abeb;
                        border-radius: 4px;
                        text-align: center;
                        border: 1px solid #54c5ff;
                    }
                    .tip {
                        display: none;
                        position: absolute;
                        left: 60px;
                        top: 74px;
                        padding-left: 10px;
                        padding-right: 10px;
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
                @keyframes shake {
                    10%, 90% {transform: translate3d(-1px, 0, 0);}
                    20%, 80% {transform: translate3d(+2px, 0, 0);}
                    30%, 70% {transform: translate3d(-4px, 0, 0);}
                    40%, 60% {transform: translate3d(+4px, 0, 0);}
                    50% {transform: translate3d(-4px, 0, 0);}
                }
                .video_time {
                    padding-left: 10px;
                    padding-right: 10px;
                    box-sizing: border-box;
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                }
                .video_sort {
                    padding-left: 10px;
                    box-sizing: border-box;
                    width: 100%;
                    line-height: 20px;
                    font-size: 14px;
                    color: #8d5811;
                }
            }
        }
    }
</style>