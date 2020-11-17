<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增
            </a-button>
            <a-table :columns="tableHeader" :data-source="courseList"
                >
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="red" @click="detail(record)">课程描述</a-tag>
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <a-tag color="red" @click="del(record)">删除</a-tag>
                </span>
            </a-table>
        </div>
        <!-- 课程新增 -->
        <a-modal
            :title="editRow.courseNo ? '修改课程' : '新增课程'"
            :visible="addVisible"
            @cancel="handleCancel"
            :footer="null"
            :width="800"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="课程名称（中）">
                    <a-input
                        v-decorator="[
                            'courseNmCn',
                            {
                                rules: [{ required: true, message: '请输入课程名称（中文）' }],
                                initialValue: editRow.courseNmCn
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="类型名称（英）">
                    <a-input
                        v-decorator="[
                            'courseNmEn',
                            {
                                rules: [{ required: true, message: '请输入课程名称（英文）' }],
                                initialValue: editRow.courseNmEn
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="课程级别">
                    <a-select
                        v-decorator="[
                            'courseLevel',
                            {
                                rules: [{ required: true, message: '请选择课程级别' }],
                                initialValue: editRow.courseLevel
                            },
                        ]"
                        >
                        <a-select-option v-for="(level) in courseLevelList"
                            :value="level.value" :key="level.value">
                            {{level.label}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="课程类型">
                    <a-select
                        v-decorator="[
                            'typeNo',
                            {
                                rules: [{ required: true, message: '请选择课程类型' }],
                                initialValue: editRow.typeNo
                            },
                        ]"
                        >
                        <a-select-option v-for="(type) in typeList"
                            :value="type.typeNo" :key="type.typeNo">
                            {{type.typeNmCn}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="课程教师">
                    <a-select
                        v-decorator="[
                            'courseOwner',
                            {
                                rules: [{ required: true, message: '请选择导师' }],
                                initialValue: editRow.courseOwner
                            },
                        ]"
                        >
                        <a-select-option v-for="(teach) in teacherList"
                            :value="teach.userNo" :key="teach.userNo">
                            {{teach.userNm}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="课程状态">
                    <a-select
                        v-decorator="[
                            'courseSt',
                            {
                                rules: [{ required: true, message: '请选择课程状态' }],
                                initialValue: editRow.courseSt
                            },
                        ]"
                        >
                        <a-select-option :value="0">
                            下架
                        </a-select-option>
                        <a-select-option :value="1">
                            上架
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="收费状态">
                    <a-select
                        v-decorator="[
                            'feeSt',
                            {
                                rules: [{ required: true, message: '请选择收费状态' }],
                                initialValue: editRow.feeSt
                            },
                        ]"
                        >
                        <a-select-option :value="0">
                            免费
                        </a-select-option>
                        <a-select-option :value="1">
                            收费
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="课程价格（分）">
                    <a-input
                        v-decorator="[
                            'coursePrice',
                            {
                                rules: [{ required: true, message: '请输入课程价格' }],
                                initialValue: editRow.coursePrice
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="小组最小人数">
                    <a-input
                        v-decorator="[
                            'teamSizeMin',
                            {
                                rules: [{ required: true, message: '请输入小组最小人数' }],
                                initialValue: editRow.teamSizeMin
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="小组最大人数">
                    <a-input
                        v-decorator="[
                            'teamSizeMax',
                            {
                                rules: [{ required: true, message: '请输入小组最大人数' }],
                                initialValue: editRow.teamSizeMax
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="适合最小人群">
                    <a-input
                        v-decorator="[
                            'targetAgeGroupMin',
                            {
                                rules: [{ required: true, message: '请输入适合最小人群' }],
                                initialValue: editRow.targetAgeGroupMin
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="适合最大人群">
                    <a-input
                        v-decorator="[
                            'targetAgeGroupMax',
                            {
                                rules: [{ required: true, message: '请输入适合最大人群' }],
                                initialValue: editRow.targetAgeGroupMax
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="课程规模最小人数">
                    <a-input
                        v-decorator="[
                            'courseCapacityMin',
                            {
                                rules: [{ required: true, message: '请输入课程规模最小人数' }],
                                initialValue: editRow.courseCapacityMin
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="课程规模最大人数">
                    <a-input
                        v-decorator="[
                            'courseCapacityMax',
                            {
                                rules: [{ required: true, message: '请输入课程规模最大人数' }],
                                initialValue: editRow.courseCapacityMax
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="课程时长最小(周)">
                    <a-input
                        v-decorator="[
                            'courseDurationMin',
                            {
                                rules: [{ required: true, message: '请输入课程时长' }],
                                initialValue: editRow.courseDurationMin
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="课程时长最大(周)">
                    <a-input
                        v-decorator="[
                            'courseDurationMax',
                            {
                                rules: [{ required: true, message: '请输入课程时长' }],
                                initialValue: editRow.courseDurationMax
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.courseNo ? '修改' : '新增'}}
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script>
    import {Request, Post} from '@/api/request';
    import axios from 'axios';
    import baseUrl from '@/utils/baseUrl';
    import Menu from '@/components/common/menu';
    import {Modal} from 'ant-design-vue';
    const columns = [
        {
            title: '课程编号',
            dataIndex: 'courseNo',
            key: 'courseNo',
        }, {
            title: '课程名称（中）',
            dataIndex: 'courseNmCn',
            key: 'courseNmCn',
        }, {
            title: '课程名称（英）',
            dataIndex: 'courseNmEn',
            key: 'courseNmEn',
        }, {
            title: '课程类别编号',
            key: 'typeNo',
            dataIndex: 'typeNo',
        }, {
            title: '课程导师编号',
            key: 'courseOwner',
            dataIndex: 'courseOwner',
        }, {
            title: '课程级别',
            key: 'courseLevel',
            dataIndex: 'courseLevel',
        }, {
            title: '课程状态',
            key: 'courseSt',
            dataIndex: 'courseSt',
        }, {
            title: '收费状态',
            key: 'feeSt',
            dataIndex: 'feeSt',
        }, {
            title: '课程价格（分）',
            key: 'coursePrice',
            dataIndex: 'coursePrice',
        }, {
            title: '小组最小人数',
            key: 'teamSizeMin',
            dataIndex: 'teamSizeMin',
        }, {
            title: '小组最大人数',
            key: 'teamSizeMax',
            dataIndex: 'teamSizeMax',
        }, {
            title: '适合最小人群',
            key: 'targetAgeGroupMin',
            dataIndex: 'targetAgeGroupMin',
        }, {
            title: '适合最大人群',
            key: 'targetAgeGroupMax',
            dataIndex: 'targetAgeGroupMax',
        }, {
            title: '课程规模最小人数',
            key: 'courseCapacityMin',
            dataIndex: 'courseCapacityMin',
        }, {
            title: '课程规模最大人数',
            key: 'courseCapacityMax',
            dataIndex: 'courseCapacityMax',
        }, {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'tags' }
        }
    ];
    export default {
        data() {
            return {
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'course' }),
                headers: {
                    authorization: 'authorization-text',
                },
                file: [],

                courseList: [],
                typeList: [],
                teacherList: [],
                courseLevelList: [
                    {label: '基础课程', value: 0},
                    {label: '开拓课程', value: 1},
                    {label: '飞跃课程', value: 2},
                ],

                editRow: {},
                tableHeader: columns,

                addVisible: false,
            };
        },
        created() {
            this.initData();
            this.getTeachList();
            this.getTypeList();
        },
        methods: {
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
            edit(record) {
                this.editRow = record;
                this.addVisible = true;
            },
            del(record) {
                let _this = this;
                Modal.confirm({
                    title: '确认删除?',
                    content: '删除后数据不可恢复!',
                    cancelText: '取消',
                    okText: '确认',
                    onOk() {
                        return new Promise((resolve, reject) => {
                            Request({
                                url: 'course/delete',
                                params: {
                                    courseNo: record.courseNo
                                }
                            }).then(res => {
                                if (res.code == 200) {
                                    _this.$message.success('删除成功!');
                                    _this.initData();
                                }
                                resolve();
                            })
                        }).catch(() => console.log('Oops errors!'));
                    },
                    onCancel() {},
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
                this.editRow = {};
                this.form.resetFields();
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = values;
                        let url = 'course/addCourse';
                        let desc = '新增成功!';
                        if (this.editRow.courseNo) {
                            params.courseNo = this.editRow.courseNo;
                            url = 'course/updateCourse';
                            desc = '修改成功!';
                        }
                        Request({
                            url: url,
                            params: params,
                        }).then(res => {
                            if (res.code == 200) {
                                this.$message.success(desc);
                                this.addVisible = false;
                                this.form.resetFields();
                                this.editRow = {};
                                this.initData();
                            } else {
                                this.$message.error(res.desc);
                            }
                        })
                    }

                });
            },
        },
        components: {
            Menu,
        }
    }
</script>
<style lang="less">
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
</style>
