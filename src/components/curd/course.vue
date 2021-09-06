<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">
                新增
            </el-button>
            <Table v-show="courseList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="courseList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <!-- 课程新增 -->
        <el-dialog
            :title="(form.id ? '修改' : '新增') + '课程'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="160px">
                <el-form-item label="课程名称（中）" prop="courseNmCn">
                    <el-input v-model="form.courseNmCn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程名称（英）" prop="courseNmEn">
                    <el-input v-model="form.courseNmEn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程级别" prop="courseLevel">
                    <el-select v-model="form.courseLevel" placeholder="请选择">
                        <el-option
                            v-for="item in courseLevelList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程类型" prop="typeNo">
                    <el-select v-model="form.typeNo" placeholder="请选择">
                        <el-option
                            v-for="item in typeList"
                            :key="item.typeNo"
                            :label="item.typeNmCn"
                            :value="item.typeNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程教师">
                    <el-select v-model="form.courseOwner" placeholder="请选择">
                        <el-option
                            v-for="item in teacherList"
                            :key="item.userNo"
                            :label="item.userNm"
                            :value="item.userNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程状态" prop="courseSt">
                    <el-select v-model="form.courseSt" placeholder="请选择">
                        <el-option label="下架" value="0"></el-option>
                        <el-option label="上架" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="收费状态" prop="feeSt">
                    <el-select v-model="form.feeSt" placeholder="请选择">
                        <el-option label="免费" value="0"></el-option>
                        <el-option label="收费" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程价格（分）" prop="coursePrice">
                    <el-input v-model="form.coursePrice" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小组最小人数" prop="teamSizeMin">
                    <el-input v-model="form.teamSizeMin" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小组最大人数" prop="teamSizeMax">
                    <el-input v-model="form.teamSizeMax" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="适合最小人群" prop="targetAgeGroupMin">
                    <el-input v-model="form.targetAgeGroupMin" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="适合最大人群" prop="targetAgeGroupMax">
                    <el-input v-model="form.targetAgeGroupMax" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程规模最小人数" prop="courseCapacityMin">
                    <el-input v-model="form.courseCapacityMin" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程规模最大人数" prop="courseCapacityMax">
                    <el-input v-model="form.courseCapacityMax" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程时长最小(周)" prop="courseDurationMin">
                    <el-input v-model="form.courseDurationMin" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程时长最大(周)" prop="courseDurationMax">
                    <el-input v-model="form.courseDurationMax" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="卡片颜色" prop="courseColor">
                    <el-input v-model="form.courseColor" class="color_input" placeholder="#开头十六进制颜色值"></el-input>
                    <el-color-picker v-model="form.courseColor" class="color_picker"></el-color-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.courseNo ? '修改' : '新增'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import Table from '@/components/common/table';
    import {success, error, warn} from '@/assets/js/public';
    
    export default {
        data() {
            return {
                form: {
                    courseNmCn: '',
                    courseNmEn: '',
                    courseLevel: '',
                    typeNo: '',
                    courseOwner: '',
                    courseSt: '',
                    feeSt: '',
                    coursePrice: '',
                    teamSizeMin: '',
                    teamSizeMax: '',
                    targetAgeGroupMin: '',
                    targetAgeGroupMax: '',
                    courseCapacityMin: '',
                    courseCapacityMax: '',
                    courseDurationMin: '',
                    courseDurationMax: '',
                    courseColor: '#409EFF',
                },
                rules: {
                    courseNmCn: {required: true, message: '请输入课程名称(中文)', trigger: 'blur'},
                    courseNmEn: {required: true, message: '请输入课程名称(英文)', trigger: 'blur'},
                    courseLevel: {required: true, message: '请选择课程级别', trigger: 'blur'},
                    typeNo: {required: true, message: '请输入课程类型', trigger: 'blur'},
                    courseSt: {required: true, message: '请选择课程状态', trigger: 'blur'},
                    feeSt: {required: true, message: '请选择收费状态', trigger: 'blur'},
                    coursePrice: {required: true, message: '请输入课程价格', trigger: 'blur'},
                    teamSizeMin: {required: true, message: '请输入小组最小人数', trigger: 'blur'},
                    teamSizeMax: {required: true, message: '请输入小组最大人数', trigger: 'blur'},
                    targetAgeGroupMin: {required: true, message: '请输入适合最小人群', trigger: 'blur'},
                    targetAgeGroupMax: {required: true, message: '请输入适合最大人群', trigger: 'blur'},
                    courseCapacityMin: {required: true, message: '请输入课程规模最小人数', trigger: 'blur'},
                    courseCapacityMax: {required: true, message: '请输入课程规模最大人数', trigger: 'blur'},
                    courseDurationMin: {required: true, message: '请输入课程时长', trigger: 'blur'},
                    courseDurationMax: {required: true, message: '请输入课程时长', trigger: 'blur'},
                    courseColor: {required: true, message: '请选择卡片颜色', trigger: 'blur'},
                },

                tableHeader: [],
                courseList: [],
                typeList: [],
                teacherList: [],
                courseLevelList: [
                    {label: '基础课程', value: 0},
                    {label: '开拓课程', value: 1},
                    {label: '飞跃课程', value: 2},
                    {label: '“创赢说”讲座', value: 3},
                ],

                addVisible: false,
            };
        },
        created() {
            this.setTableHeader();
            this.initData();
            this.getTeachList();
            this.getTypeList();
        },
        methods: {
            setTableHeader() {
                this.tableHeader = [
                    {
                        label: '课程编号',
                        prop: 'courseNo',
                        width: '260'
                    }, {
                        label: '课程名称（中）',
                        prop: 'courseNmCn',
                        width: '400'
                    }, {
                        label: '课程名称（英）',
                        prop: 'courseNmEn',
                        width: '400'
                    }, {
                        label: '课程类别编号',
                        prop: 'typeNo',
                        width: '300'
                    }, {
                        label: '课程导师编号',
                        prop: 'courseOwner',
                        width: '300'
                    }, {
                        label: '课程级别',
                        prop: 'courseLevel',
                    }, {
                        label: '课程状态',
                        prop: 'courseSt',
                    }, {
                        label: '收费状态',
                        prop: 'feeSt',
                    }, {
                        label: '课程价格（分）',
                        prop: 'coursePrice',
                        width: '140'
                    }, {
                        label: '小组最小人数',
                        prop: 'teamSizeMin',
                        width: '120'
                    }, {
                        label: '小组最大人数',
                        prop: 'teamSizeMax',
                        width: '120'
                    }, {
                        label: '适合最小人群',
                        prop: 'targetAgeGroupMin',
                        width: '120'
                    }, {
                        label: '适合最大人群',
                        prop: 'targetAgeGroupMax',
                        width: '120'
                    }, {
                        label: '课程规模最小人数',
                        prop: 'courseCapacityMin',
                        width: '140'
                    }, {
                        label: '课程规模最大人数',
                        prop: 'courseCapacityMax',
                        width: '140'
                    }, {
                        label: '卡片颜色',
                        prop: 'courseColor',
                        width: '100'
                    }, {
                        label: '操作',
                        prop: '',
                        width: '300',
                        slot: true,
                        slotArr: [
                            {
                                type: 'btn',
                                btnText: '课程描述',
                                action: 'detail'
                            }, {
                                type: 'btn',
                                btnText: '修改',
                                action: 'edit'
                            }, {
                                type: 'btn',
                                btnText: '删除',
                                btnType: 'danger',
                                action: 'del'
                            }
                        ]
                    }
                ];
            },
            initData() {
                Request({
                    url: 'course/query',
                }).then(res => {
                    let courseList = res.courses ? res.courses : [];
                    courseList = courseList.map(item => {
                        item.key = item.courseNo;
                        if (item.courseType && item.courseType.typeNo) {
                            item.typeNo = item.courseType.typeNo;
                        }
                        item.feeSt += '';
                        item.courseSt += '';
                        return item;
                    });
                    this.courseList = courseList;
                });
            },
            getTeachList() {
                Request({
                    url: 'teacher/query',
                }).then(res => {
                    let teaList = res.teachers ? res.teachers : [];
                    teaList = teaList.map(item => {
                        item.key = item.userNo;
                        return item;
                    });
                    this.teacherList = teaList;
                });
            },
            getTypeList() {
                Request({
                    url: 'courseType/query',
                }).then(res => {
                    let typeList = res.types ? res.types : [];
                    typeList = typeList.map(item => {
                        item.key = item.typeNo;
                        item.value = item.typeNo;
                        return item;
                    });
                    this.typeList = typeList;
                });
            },
            edit(row) {
                this.form = {
                    courseNo: row.courseNo,
                    courseNmCn: row.courseNmCn,
                    courseNmEn: row.courseNmEn,
                    courseLevel: row.courseLevel,
                    typeNo: row.typeNo,
                    courseOwner: row.courseOwner,
                    courseSt: row.courseSt,
                    feeSt: row.feeSt,
                    coursePrice: row.coursePrice,
                    teamSizeMin: row.teamSizeMin,
                    teamSizeMax: row.teamSizeMax,
                    targetAgeGroupMin: row.targetAgeGroupMin,
                    targetAgeGroupMax: row.targetAgeGroupMax,
                    courseCapacityMin: row.courseCapacityMin,
                    courseCapacityMax: row.courseCapacityMax,
                    courseDurationMin: row.courseDurationMin,
                    courseDurationMax: row.courseDurationMax,
                    courseColor: row.courseColor
                };
                this.addVisible = true;
            },
            del(record) {
                warn('确认删除,删除后数据不可恢复?', () => {
                    Request({
                        url: 'course/delete',
                        params: {
                            courseNo: record.courseNo
                        }
                    }).then(res => {
                        if (res.code == 200) {
                            success('删除成功!');
                            this.initData();
                        }
                    })
                });
            },
            detail(record) {
                this.$router.push({
                    path: '/curd/courseDetail',
                    query: {
                        cno: record.courseNo,
                    }
                });
            },
            showAddModal() {
                this.addVisible = true;
            },
            handleCancel() {
                this.addVisible = false;
                this.form = {
                    courseNmCn: '',
                    courseNmEn: '',
                    courseLevel: '',
                    typeNo: '',
                    courseOwner: '',
                    courseSt: '',
                    feeSt: '',
                    coursePrice: '',
                    teamSizeMin: '',
                    teamSizeMax: '',
                    targetAgeGroupMin: '',
                    targetAgeGroupMax: '',
                    courseCapacityMin: '',
                    courseCapacityMax: '',
                    courseDurationMin: '',
                    courseDurationMax: '',
                    courseColor: '#409EFF'
                };
            },
            handleSubmit(e) {
                e.preventDefault();
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let params = this.form;
                        if (!params.courseOwner) {
                            params.courseOwner = '';
                        }
                        let url = 'course/addCourse';
                        let desc = '新增成功!';
                        if (params.courseNo) {
                            url = 'course/updateCourse';
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
                            } else if (res.code !== '1001') {
                                error(res.msg);
                            }
                        })
                    }
                });
            },
        },
        components: {
            Table,
        }
    }
</script>
<style lang="less" scoped>
    .curd {
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
    .color_input {
        float: left;
        margin-right: 10px;
        width: 200px;
    }
</style>
