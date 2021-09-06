<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">
                新增描述
            </el-button>
            <Table v-show="descList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="descList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <!-- 新增课程介绍 -->
        <el-dialog
            :title="(form.id ? '修改' : '新增') + '课程介绍'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px">
                <el-form-item v-if="courseType !== 'Talk'" label="描述类型" prop="showRank">
                    <el-select v-model="form.showRank" placeholder="请选择" @change="handleTypeChange">
                        <el-option
                            v-for="item in descTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述标题（中）" prop="descTitleCn">
                    <el-input v-model="form.descTitleCn" autocomplete="off" :disabled="courseType !== 'Talk'" ></el-input>
                </el-form-item>
                <el-form-item label="描述标题（英）" prop="descTitleEn">
                    <el-input v-model="form.descTitleEn" autocomplete="off" :disabled="courseType !== 'Talk'" ></el-input>
                </el-form-item>
                <el-form-item label="描述（中）" prop="courseDescCn">
                    <el-input v-model="form.courseDescCn" placeholder="#号分隔" type="textarea" :autosize="{minRows: 2}"></el-input>
                </el-form-item>
                <el-form-item label="描述（英）" prop="courseDescEn">
                    <el-input v-model="form.courseDescEn" placeholder="#号分隔" type="textarea" :autosize="{minRows: 2}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.id ? '修改' : '新增'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import Table from '@/components/common/table';
    import {success, error, warn, getCourseTypeShort} from '@/assets/js/public';
    
    export default {
        data() {
            return {
                form: {
                    showRank: '',
                    descTitleCn: '',
                    descTitleEn: '',
                    courseDescCn: '',
                    courseDescEn: '',
                },
                rules: {
                    showRank: {required: true, message: '请选择描述类型', trigger: 'blur'},
                    descTitleCn: {required: true, message: '请输入描述标题（中）', trigger: 'blur'},
                    descTitleEn: {required: true, message: '请输入描述标题（英）', trigger: 'blur'},
                    courseDescCn: {required: true, message: '请输入描述（中）', trigger: 'blur'},
                    courseDescEn: {required: true, message: '请输入描述（英）', trigger: 'blur'},
                },
                descTypeList: [
                    {label: '课程描述', value: '1',},
                    {label: '课程要求', value: '2',},
                    {label: '教师背景', value: '3',},
                    {label: '课程目标', value: '4',},
                    {label: '课程亮点', value: '5',},
                ],
                maxRank: '',

                tableHeader: [],
                detail: [],
                descList: [],
                courseNo: '',

                addVisible: false,
                courseType: '',
            };
        },
        created() {
            this.setTableHeader();
            let query = this.$route.query;
            if (query.cno) {
                this.courseNo = query.cno;
                this.initData();
            }
        },
        methods: {
            setTableHeader() {
                this.tableHeader = [
                    {
                        label: '描述标题（中）',
                        prop: 'descTitleCn',
                        width: '300'
                    }, {
                        label: '描述标题（英）',
                        prop: 'descTitleEn',
                        width: '300'
                    }, {
                        label: '描述（中）',
                        prop: 'courseDescCn',
                        width: '600'
                    }, {
                        label: '描述（英）',
                        prop: 'courseDescEn',
                        width: '600'
                    }, {
                        label: '操作',
                        prop: '',
                        width: '200',
                        slot: true,
                        slotArr: [
                            {
                                type: 'btn',
                                btnText: '修改',
                                action: 'edit'
                            }, {
                                type: 'btn',
                                btnText: '删除',
                                action: 'del',
                                btnType: 'danger'
                            }
                        ]
                    }
                ];
            },
            initData() {
                Request({
                    url: 'course/query',
                    params: {
                        courseNo: this.courseNo
                    }
                }).then(res => {
                    let detail = res.courses.length ? res.courses[0] : [];
                    let descList = detail.courseDesc ? detail.courseDesc : [];
                    this.descList = descList;
                    this.detail = detail;
                    let type = detail.courseType ? getCourseTypeShort(detail.courseType.typeNmEn) : '';
                    this.courseType = type;
                    if (type === 'Talk') {
                        this.setMaxRank(descList);
                    }
                });
            },
            edit(row) {
                this.form = {
                    id: row.id,
                    showRank: row.showRank,
                    descTitleCn: row.descTitleCn,
                    descTitleEn: row.descTitleEn,
                    courseDescCn: row.courseDescCn,
                    courseDescEn: row.courseDescEn,
                };
                this.showAddModal();
            },
            del(record) {
                warn('确认删除，删除后数据不可恢复？', () => {
                    Request({
                        url: 'course/deleteDesc',
                        params: {
                            id: record.id
                        }
                    }).then(res => {
                        if (res.code == 200) {
                            success('删除成功!');
                            this.initData();
                        }
                    })
                });
            },
            showAddModal() {
                this.addVisible = true;
            },
            handleCancel() {
                this.addVisible = false;
                this.form = {
                    showRank: '',
                    descTitleCn: '',
                    descTitleEn: '',
                    courseDescCn: '',
                    courseDescEn: '',
                };
            },
            handleSubmit(e) {
                e.preventDefault();
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let params = this.form;
                        if (this.courseType === 'Talk') {
                            params.showRank = this.maxRank;
                        }
                        params.courseNo = this.courseNo;
                        let url = 'course/addCourseDesc';
                        let desc = '新增成功!';
                        if (params.id) {
                            url = 'course/updateCourseDesc';
                            desc = '修改成功!';
                        }
                        Request({
                            url: url,
                            params: params,
                        }).then(res => {
                            if (res.code == 200) {
                                success(desc);
                                this.handleCancel();
                                this.initData();
                            } else {
                                error(res.desc);
                            }
                        })
                    }

                });
            },
            handleTypeChange(rank) {
                let descTitleCn = '',
                    descTitleEn = '';
                switch(rank) {
                    case '1':
                        descTitleCn = '课程描述';
                        descTitleEn = 'course detail'; 
                        break;
                    case '2':
                        descTitleCn = '课程要求';
                        descTitleEn = 'Course Requirement/Pre-requisites'; 
                        break;
                    case '3':
                        descTitleCn = '教师背景';
                        descTitleEn = 'Instructor'; 
                        break;
                    case '4':
                        descTitleCn = '课程目标';
                        descTitleEn = 'Course Objectives'; 
                        break;
                    case '5':
                        descTitleCn = '课程亮点';
                        descTitleEn = 'Course Highlights'; 
                        break;
                }
                this.form.descTitleCn = descTitleCn;
                this.form.descTitleEn = descTitleEn;
            },
            setMaxRank(list) {
                let rank = '6';
                list.forEach(item => {
                    if (item.showRank > rank) {
                        rank = item.showRank;
                    }
                });
                this.maxRank = rank - 0 + 1 + '';
            }
        },
        components: {
            Table
        },
    }
</script>
<style lang="less" scoped>
    .news {
        .ant-upload-list {
            display: none !important;
        }
        .ant-upload {
            float: left;
        }
        .file_list {
            float: left;
            margin-left: 10px;
        }
        .file_btn {
            width: 80px;
            height: 30px;
        }
    }
</style>