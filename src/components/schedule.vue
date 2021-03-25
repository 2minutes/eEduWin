<template>
    <div class="app_container">
        <CommonHeader :blue="true" />
        <div class="course_wrap clearfix">
            <p class="title">{{$t('video.allContent')}}<i class="tip">（{{$t('video.clickToPlay')}}）</i></p>
            <ul class="course_list clearfix">
                <li v-for="item in courseList" 
                    :key="item.courseNo" 
                    :class="[item.clas]"
                    @click="toVideo(item.courseNo)">{{zh ? item.courseNmCn : item.courseNmEn}}</li>
            </ul>
            <p v-show="!courseList.length" class="title empty">{{$t('video.empty')}}</p>
            <p class="title">{{$t('video.ifForgetPassword')}}</p>
        </div>
        <div v-show="daysList.length" class="shedule_wrap clearfix">
            <p class="title">{{$t('video.schedule')}}</p>
            <div class="operators">
                <p class="btns">
                    <span @click="today" class="border_r">{{$t('video.today')}}</span>
                    <span @click="back" class="border_r">{{$t('video.back')}}</span>
                    <span @click="next" >{{$t('video.next')}}</span>
                </p>
                <p class="date">{{monthDesc + ' ' + activeYear}}</p>
                <p class="btns right">
                    <!-- <span class="border_r active">Month</span>
                    <span>Agenda</span> -->
                </p>
            </div>
            <div v-show="daysList.length" class="calcendar_wrap clearfix">
                <ul class="week">
                    <li v-for="item in zh ? week : weekEn" :key="item">{{item}}</li>
                </ul>
                <ul class="days">
                    <li v-for="item in daysList" :key="item.key" :class="[item.clas ? item.clas : '']">
                        <span class="day">{{item.day ? item.day : ''}}</span>
                        <span class="course" 
                            v-for="course in item.courseList" 
                            :class="[course.clas]"
                            :title="zh ? course.courseNmCn : course.courseNmEn">{{zh ? course.courseNmCn : course.courseNmEn}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="app_content"></div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    
    import {Request} from '@/api/request';
    import {colors} from '@/assets/js/data';
    import {padStart} from '@/assets/js/public';
    export default {
        data() {
            return {
                year: 0,
                month: 0,
                activeMonth: 0,
                activeYear: 0,
                week: ['日', '一', '二', '三', '四', '五', '六'],
                weekEn: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                monthList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

                daysList: [],
                colorMap: {},
                courseList: [],
            }
        },
        created() {
            this.getDate();
            this.getCourseList();
        },
        methods: {
            toVideo() {},
            getDate() {
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                this.year = year;
                this.month = month;
                if (this.checkLeapYear(year)) {
                    this.monthList[1] = 29;
                }
            },
            getCourseList() {
                Request({
                    url: 'course/query',
                    params: {
                        hasVideo: 1
                    }
                }).then(res => {
                    if (res.code != 200) {
                        return;
                    }
                    let lists = res.courses ? res.courses : [];
                    let colorMap = {};
                    let copedColors = [].concat(colors);
                    lists = lists.map(list => {
                        let {courseNo, courseNmCn, courseNmEn} = list;
                        let random = parseInt(Math.random() * copedColors.length);
                        let color = copedColors.splice(random, 1);
                        color = 'back_' + color.join(',');
                        let item = {
                            courseNo: courseNo,
                            courseNmCn: courseNmCn,
                            courseNmEn: courseNmEn,
                            clas: color
                        }
                        colorMap[courseNo] = color;
                        return item;
                    });
                    this.colorMap = colorMap;
                    this.courseList = lists;
                    this.queryCalendar(this.year, this.month);
                });
            },
            queryCalendar(year, month) {
                Request({
                    url: 'video/queryCalendar',
                    method: 'post',
                    params: {
                        startTs: `${year}-${month}-01 00:00:00`,
                        endTs: `${year}-${month}-${this.monthList[month - 1]} 23:59:59`,
                    }
                }).then(res => {
                    if (res.code == 1001) {
                        this.$router.push('/');
                        return;
                    }
                    let list = res.calendarVideos ? res.calendarVideos : [];
                    this.getDaysList(year, month, list);

                });
            },
            getDaysList(year, month, courseLists) {
                let firstDay = new Date(`${year}/${month}/1`).getDay();//本月一号是周几
                let weekDay = firstDay === 7 ? 0 : firstDay;
                let list = [];
                let monthDaysNum = this.monthList[month - 1];
                let fullMonth = padStart(month);
                for(let i = 1; i <= weekDay; i++) {
                    list.push({
                        day: '',
                        key: '-' + i,
                        clas: 'disabled',
                        courseList: []
                    });
                }
                for(let i = 1; i <= monthDaysNum; i++) {
                    let fullDay = padStart(i);
                    list.push({
                        day: fullDay,
                        key: fullDay,
                        courseList: this.getCourseByDate(year, fullMonth, fullDay, courseLists)
                    });
                }
                let afterDay = 7 - list.length % 7;
                for(let i = 1; i <= afterDay; i++) {
                    list.push({
                        day: '',
                        key: '+' + i,
                        clas: 'disabled',
                        courseList: []
                    });
                }
                this.activeMonth = month;
                this.activeYear = year;
                this.daysList = list;
            },
            getCourseByDate(year, month, day, lists) {
                let courses = [];
                let colorMap = this.colorMap;
                let date = `${year}-${month}-${day}`;
                if (lists[date]) {
                    for(var item of lists[date]) {
                        courses.length < 3 && courses.push({
                            courseNmCn: item.courseNameCn,
                            courseNmEn: item.courseNameEn,
                            courseNo: item.courseNo,
                            clas: colorMap[item.courseNo]
                        })
                    }
                }
                return courses;
            },

            checkLeapYear(year) {
                if ((this.year % 4 === 0 && this.year % 100 !== 0) ||this.year % 400 === 0) {
                    return true;
                } else {
                    return false;
                }
            },

            toVideo(courseNo) {
                this.$router.push({
                    path: '/videoList',
                    query: {
                        no: courseNo
                    }
                });
            },

            today() {
                this.queryCalendar(this.year, this.month);
            },
            back() {
                let month = this.activeMonth;
                let year = this.activeYear;
                if (month === 1) {
                    month = 12;
                    year -= 1;
                } else {
                    month--;
                }
                this.queryCalendar(year, month);
            },
            next() {
                let month = this.activeMonth;
                let year = this.activeYear;
                if (month === 12) {
                    month = 1;
                    year += 1;
                } else {
                    month++;
                }
                this.queryCalendar(year, month);
            },
        },
        computed: {
            monthDesc() {
                let monthEn = ['', 'January', 'February', 'March ', 'April ', 'May ', 'June ', 'July ', 'August', 'September', 'October', 'November', 'December'];
                let monthCh = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
                return this.zh ? monthCh[this.activeMonth] : monthEn[this.activeMonth];
            },
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
    @import '../assets/css/color.less';
    @defaultWidth: 1200px;
    
    .course_wrap {
        margin: 0 auto;
        width: @defaultWidth;
        flex-shrink: 0;
        .course_list {
            width: 100%;
            li {
                float: left;
                padding-left: 10px;
                padding-right: 10px;
                box-sizing: border-box;
                margin-right: 10px;
                margin-bottom: 16px;
                height: 28px;
                line-height: 28px;
                font-size: 14px;
                color: #fff;
                border-radius: 4px;
                cursor: pointer;
            }
        }
        .empty {
            text-align: center;
            color: #666;
            font-size: 16px;
        }
    }
    .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        font-weight: bold;
        color: #111;
        .tip {
            font-size: 16px;
        }
    }
    .shedule_wrap {
        margin: 40px auto;
        width: @defaultWidth;
        flex-shrink: 0;
        .operators {
            display: flex;
            width: 100%;
            height: 30px;
            line-height: 30px;
            font-size: 16px;
            color: #333;
            .btns {
                box-sizing: border-box;
                float: left;
                height: 30px;
                border: 1px solid #ddd;
                border-radius: 4px;
                &.right {
                    float: right;
                    width: 170px;
                    border: 0;
                }
                span {
                    padding-left: 15px;
                    padding-right: 15px;
                    float: left;
                    height: 28px;
                    line-height: 28px;
                    font-size: 16px;
                    color: #222;
                    cursor: pointer;
                    &.border_r {
                        border-right: 1px solid #ddd;
                    }
                    &.active {
                        box-shadow: 1px 1px 8px #ddd;
                        background: linear-gradient(to bottom, #d2d3d4, #e5e6e7, #e5e6e7);
                    }
                }
            }
            .date {
                flex: 1;
                text-align: center;
            }
        }
    }
    .calcendar_wrap {
        margin-top: 10px;
        box-sizing: border-box;
        width: 100%; 
        border: 1px solid #ddd;
        border-bottom: 0;
        border-radius: 4px;
        .week {
            width: 100%; 
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            color: #222;
            font-weight: bold;
            li {
                text-align: center;
            }
        }
        .days {
            li {
                padding: 5px 10px;
                box-sizing: border-box;
                height: 130px;
                &.disabled {
                    background: #e6e6e6;
                }
                .day {
                    display: inline-block;
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: #222;
                    text-align: right;
                }
                .course {
                    display: inline-block;
                    padding-left: 5px;
                    padding-right: 5px;
                    margin-bottom: 5px;
                    box-sizing: border-box;
                    width: 100%;
                    height: 24px;
                    line-height: 24px;
                    color: #fff;
                    border-radius: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }
            }
        }
        li {
            float: left;
            width: 171px;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            &:nth-child(7n) {
                border-right: 0;
            }
        }
    }
</style>