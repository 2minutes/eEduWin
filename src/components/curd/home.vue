<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <div class="search_wrap clearfix">
                <div class="search_item">
                    时间：
                    <el-tag class="tag" @click="selectTag(index)"
                        v-for="(item, index) in timeList"
                        :key="item.label"
                        :effect="activeTag === index ? 'dark' : 'plain'">
                        {{ item.label }}
                    </el-tag>
                    <el-date-picker
                        v-model="datetime"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptions"
                        :default-time="['00:00:00', '23:59:59']"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </div>
            </div>
            <div class="search_wrap clearfix">
                <div class="search_item">
                    查询key：
                    <el-select v-model="searchInfo.key" placeholder="请选择">
                        <el-option
                            v-for="item in keyList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item" v-show="searchInfo.key === 11">
                    课程编号：
                    <el-select v-model="searchInfo.courseNo" placeholder="请选择">
                        <el-option
                            v-for="item in courseList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="search_wrap clearfix">
                <div class="search_item">
                    查询subkey：
                    <el-select v-model="searchInfo.subkey" placeholder="请选择">
                        <el-option
                            v-for="item in subkeyList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <el-button @click="initData" type="primary">查询</el-button>
                </div>
            </div>

            <div id="chart"></div>
        </div>
        
    </div>
</template>
<script>
    import * as echarts from 'echarts/core';
    import { LineChart, } from 'echarts/charts';
    import { TitleComponent, TooltipComponent, GridComponent, LegendComponent} from 'echarts/components';
    import { CanvasRenderer } from 'echarts/renderers';
    require('echarts/lib/component/dataset');

    import {Request} from '@/api/request';
    import Table from '@/components/common/table';
    import {success, error, warn, formatSelectData} from '@/assets/js/public';
    echarts.use(
        [
            TitleComponent, TooltipComponent, GridComponent, LineChart, CanvasRenderer,
            LegendComponent, 
        ]
    );
    export default {
        data() {
            return {
                datetime: [],
                timeList: [
                    {
                        label: '1小时',
                        value: 0,
                    }, {
                        label: '1天',
                        value: 1,
                    }
                ],
                keyList: [
                   {label: '首页', value: 0}, 
                   {label: '愿景', value: 1}, 
                   {label: '团队', value: 2}, 
                   {label: '故事', value: 3}, 
                   {label: '学习', value: 4}, 
                   {label: '课外扩展', value: 5}, 
                   {label: '大学录取', value: 6}, 
                   {label: '俱乐部', value: 7}, 
                   {label: '联系我们', value: 8}, 
                   {label: '登录', value: 9}, 
                   {label: '注册', value: 10}, 
                   {label: '我的课程', value: 11}, 
                //    {label: '全局变量', value: 12}, 
                ],
                subkeyList: [
                    {label: '总量', value: '0'},
                    // {label: '成功量', value: '1'},
                    // {label: '成功率', value: '2'},
                    // {label: '总平均耗时', value: '3'},
                    // {label: '失败数', value: '4'},
                ],
                courseList: [],
                searchInfo: {
                    key: 0,
                    subkey: '0',
                    courseNo: '',
                },
                activeTag: 0,

                pickerOptions: {
                    onPick:time => {
                        //当第一时间选中才设置禁用
                        if (time.minDate && !time.maxDate) {
                            this.timeOptionRange = time.minDate;
                        }
                        if (time.maxDate) {
                            this.timeOptionRange = null;
                        }
                    },
                    disabledDate:time => {
                        let timeOptionRange = this.timeOptionRange;
                        let secondNum = 60 * 60 * 24 * 7 * 1000;
                        if (timeOptionRange) {
                            if((timeOptionRange.getTime()+secondNum)>(Date.now() - 8.64e6))
                            {
                                return time.getTime() > Date.now() - 8.64e6 || time.getTime() < timeOptionRange.getTime() - secondNum;
                            }
                            return time.getTime() > timeOptionRange.getTime() + secondNum || time.getTime() < timeOptionRange.getTime() - secondNum;
                        }
                    }
                },
            };
        },
        chart: null,
        created() {
            // this.initData();
            this.getCourseList();
        },
        mounted() {
            this.chart = echarts.init(document.getElementById('chart'));
            // this.$nextTick(() => {
            //     this.setOption(this.chart);
            // });
        },
        methods: {
            initData() {
                // Request({
                //     url: 'news/query',
                // }).then(res => {
                //     let newsList = res.news ? res.news : [];
                //     this.newsList = newsList;
                // });
            },
            setOption(data) {
                this.chart.setOption({
                    title: {
                        text: ''
                    },
                    legend: {bottom: 0},
                    tooltip: {},
                    dataset: {
                        dimensions: [
                            'dt', 
                            {name: 'num', displayName: '浏览量'}
                        ],
                        source: data
                    },
                    xAxis: {type: 'category'},
                    yAxis: {},
                    series: [
                        {type: 'line'},
                    ]
                }, true);
            },
            selectTag(index) {
                if (index != this.activeTag) {
                    this.activeTag = index;
                }
            },
            initData() {
                let {datetime, activeTag, searchInfo} = this;
                let errmsg = '';
                if (!this.datetime[0]) {
                    errmsg = '请选择起止时间!';
                }
                if (errmsg) {
                    error(errmsg);
                    return;
                }
                let params = {
                    type: activeTag,
                    startTs: datetime[0],
                    endTs: datetime[1],
                    country: '',
                    accesstype: searchInfo.key
                }
                if (searchInfo.key === 11) {
                    params.courseNo = searchInfo.courseNo;
                }
                Request({
                    url: 'accessTj/query',
                    params: params,
                }).then(res => {
                    console.log('query:', res);
                    if (res.code != 200) {
                        error(res.msg);
                        return;
                    }
                    let list = res.list;
                    if (!list.length) {
                        error('暂无数据!');
                        return;
                    }
                    this.setOption(list.reverse());
                })
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
                    lists = formatSelectData(lists, 'courseNmCn', 'courseNo');
                    this.courseList = lists;
                });
            },
        },
        components: {
            Table,
        }
    }
</script>
<style lang="less" scoped>
    #chart {
		margin-bottom:30px;
        margin-top: 20px;
		width: 1000px;
		height: 600px;
		margin:0 auto;
    }
    .search_wrap {
        margin-top: 20px;
        margin-bottom: 20px;
        width: 100%;
        .search_item {
            float: left;
            margin-right: 20px;
            .tag {
                margin-right: 10px;
            }
        }
    }
</style>