<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增描述
            </a-button>
            <a-table :columns="tableHeader" :data-source="descList">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <a-tag color="red" @click="del(record)">删除</a-tag>
                </span>
            </a-table>
        </div>
        <!-- 新增课程介绍 -->
        <a-modal
            :title="(editRow.id ? '修改' : '新增') + '课程介绍'"
            :visible="detailVisible"
            @cancel="closeDetail"
            :footer="null"
            :width="800"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="描述类型">
                    <a-select @change="handleTypeChange"
                        v-decorator="[
                            'showRank',
                            { 
                                rules: [{ required: true, message: '请选择描述类型' }],
                                initialValue: editRow.showRank 
                            },
                        ]"
                        >
                        <a-select-option value="1">
                            课程描述
                        </a-select-option>
                        <a-select-option value="2">
                            课程要求
                        </a-select-option>
                        <a-select-option value="3">
                            教师背景
                        </a-select-option>
                        <a-select-option value="4">
                            课程目标
                        </a-select-option>
                        <a-select-option value="5">
                            课程亮点
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="描述标题（中）">
                    <a-input
                        :disabled="true" 
                        v-decorator="[
                            'descTitleCn',
                            { 
                                rules: [{ required: true, message: '请输入描述标题（中）' }],
                                initialValue: editRow.descTitleCn 
                            },
                        ]"/>
                </a-form-item>
                <a-form-item label="描述标题（英）">
                    <a-input
                        :disabled="true" 
                        v-decorator="[
                            'descTitleEn',
                            { 
                                rules: [{ required: true, message: '请输入描述标题（英）' }],
                                initialValue: editRow.descTitleEn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="描述（中）">
                    <a-textarea 
                        v-decorator="[
                            'courseDescCn',
                            { 
                                rules: [{ required: true, message: '请输入描述（中）' }],
                                initialValue: editRow.courseDescCn 
                            },
                        ]"
                        placeholder="#号分隔"
                        :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true" />
                </a-form-item>
                <a-form-item label="描述（英）">
                    <a-textarea 
                        v-decorator="[
                            'courseDescEn',
                            { 
                                rules: [{ required: true, message: '请输入描述（英）' }],
                                initialValue: editRow.courseDescEn 
                            },
                        ]"
                        placeholder="#号分隔" 
                        :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true"/>
                </a-form-item>
                <!-- <a-form-item label="显示排序">
                    <a-input v-model="detail.showRank" />
                </a-form-item> -->
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.id ? '修改' : '新增'}}
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
            title: '描述标题（中）',
            dataIndex: 'descTitleCn',
            key: 'descTitleCn',
        }, {
            title: '描述标题（英）',
            dataIndex: 'descTitleEn',
            key: 'descTitleEn',
        }, {
            title: '描述（中）',
            key: 'courseDescCn',
            dataIndex: 'courseDescCn',
        }, {
            title: '描述（英）',
            key: 'courseDescEn',
            dataIndex: 'courseDescEn',
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

                detail: [],
                descList: [],
                courseNo: '',
                detailVisible: false,

                editRow: {},
                tableHeader: columns,
            };
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
                    let detail = res.courses.length ? res.courses[0] : [];
                    let descList = detail.courseDesc ? detail.courseDesc : [];
                    descList = descList.map(item => {
                        item.key = item.showRank;
                        return item;
                    });
                    this.descList = descList;
                    this.detail = detail;
                });
            },
            edit(record) {
                this.editRow = record;
                this.detailVisible = true;
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
                                url: 'course/deleteDesc',
                                params: {
                                    id: record.id
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
            showAddModal() {
                this.detailVisible = true;
            },
            closeDetail() {
                this.detailVisible = false;
                this.editRow = {};
                this.form.resetFields();
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = values;
                        params.courseNo = this.courseNo;
                        let url = 'course/addCourseDesc';
                        let desc = '新增成功!';
                        if (this.editRow.id) {
                            params.id = this.editRow.id;
                            url = 'course/updateCourseDesc';
                            desc = '修改成功!';
                        }
                        Request({
                            url: url,
                            params: params,
                        }).then(res => {
                            if (res.code == 200) {
                                this.$message.success(desc);
                                this.detailVisible = false;
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
                this.form.setFieldsValue({
                    descTitleCn: descTitleCn,
                    descTitleEn: descTitleEn
                });
            }
        },
        components: {
            Menu,
        }
    }
</script>
<style lang="less">
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