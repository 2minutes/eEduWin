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
            :title="(editRow.id ? '修改' : '新增') + '活动介绍'"
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
                        <a-select-option 
                            v-for="(rank, rankIdx) in rankList"
                            :value="rank.value"
                            :key="rankIdx" >
                            {{rank.label}}
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
                            'activityDescCn',
                            { 
                                rules: [{ required: true, message: '请输入描述（中）' }],
                                initialValue: editRow.activityDescCn 
                            },
                        ]"
                        placeholder="多条#号分隔"
                        :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true" />
                </a-form-item>
                <a-form-item label="描述（英）">
                    <a-textarea 
                        v-decorator="[
                            'activityDescEn',
                            { 
                                rules: [{ required: true, message: '请输入描述（英）' }],
                                initialValue: editRow.activityDescEn 
                            },
                        ]"
                        placeholder="多条#号分隔" 
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
            key: 'activityDescCn',
            dataIndex: 'activityDescCn',
        }, {
            title: '描述（英）',
            key: 'activityDescEn',
            dataIndex: 'activityDescEn',
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

                detail: {},
                descList: [],
                activityNo: '',
                detailVisible: false,

                editRow: {},
                tableHeader: columns,
            };
        },
        created() {
            let query = this.$route.query;
            if (query.ano) {
                this.activityNo = query.ano;
                this.initData();
            }
        },
        methods: {
            initData() {
                Request({
                    url: 'activity/query',
                    params: {
                        activityNo: this.activityNo
                    }
                }).then(res => {
                    let detail = res.activities.length ? res.activities[0] : [];
                    let descList = detail.activityDescs ? detail.activityDescs : [];
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
                                url: 'activity/deleteDesc',
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
                        params.activityNo = this.activityNo;
                        let url = 'activity/addDesc';
                        let desc = '新增成功!';
                        if (this.editRow.id) {
                            params.id = this.editRow.id;
                            url = 'activity/updateDesc';
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
                        descTitleCn = '申请指南';
                        descTitleEn = 'Submission Guidance'; 
                        break;
                    case '2':
                        descTitleCn = '活动时间段';
                        descTitleEn = 'Volunteer Duration'; 
                        break;
                    case '3':
                        descTitleCn = '活动概述';
                        descTitleEn = 'Descriptions'; 
                        break;
                    case '4':
                        descTitleCn = '报名方式';
                        descTitleEn = 'Sign Up Details'; 
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
        },
        computed: {
            rankList() {
                if (this.detail.activityTp == undefined) {
                    return [];
                }
                let activityTp = this.detail.activityTp;
                return activityTp == 1 ? 
                    [
                        {
                            label: '活动时间段',
                            value: '2',
                        }, {
                            label: '活动概述',
                            value: '3',
                        }, {
                            label: '报名方式',
                            value: '4',
                        }
                    ]  :  [
                        {
                            label: '申请指南',
                            value: '1',
                        }
                    ];
            }
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