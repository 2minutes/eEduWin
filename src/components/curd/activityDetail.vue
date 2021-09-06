<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal">
                新增描述
            </el-button>
            <Table v-show="descList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="descList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <!-- 新增课程介绍 -->
        <el-dialog
            :title="(form.id ? '修改' : '新增') + '活动介绍'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px">
                <el-form-item label="描述类型" prop="showRank">
                    <el-select v-model="form.showRank" placeholder="请选择" @change="handleTypeChange">
                        <el-option
                            v-for="item in rankList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述标题（中）" prop="descTitleCn">
                    <el-input v-model="form.descTitleCn" autocomplete="off" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="描述标题（英）" prop="descTitleEn">
                    <el-input v-model="form.descTitleEn" autocomplete="off" :disabled="true" ></el-input>
                </el-form-item>
                <el-form-item label="描述（中）" prop="activityDescCn">
                    <el-input v-model="form.activityDescCn" placeholder="#号分隔" type="textarea" :autosize="{minRows: 2}"></el-input>
                </el-form-item>
                <el-form-item label="描述（英）" prop="activityDescEn">
                    <el-input v-model="form.activityDescEn" placeholder="#号分隔" type="textarea" :autosize="{minRows: 2}"></el-input>
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
    import {success, warn} from '@/assets/js/public';
    
    export default {
        data() {
            return {
                form: {
                    showRank: '',
                    descTitleCn: '',
                    descTitleEn: '',
                    activityDescCn: '',
                    activityDescEn: '',
                },
                rules: {
                    showRank: {required: true, message: '请选择描述类型', trigger: 'blur'},
                    descTitleCn: {required: true, message: '请输入描述标题（中）', trigger: 'blur'},
                    descTitleEn: {required: true, message: '请输入描述标题（英）', trigger: 'blur'},
                    activityDescCn: {required: true, message: '请输入描述（中）', trigger: 'blur'},
                    activityDescEn: {required: true, message: '请输入描述（英）', trigger: 'blur'},
                },

                tableHeader: [],
                detail: {},
                descList: [],
                activityNo: '',
                addVisible: false,
            };
        },
        created() {
            this.setTableHeader();
            let query = this.$route.query;
            if (query.ano) {
                this.activityNo = query.ano;
                this.initData();
            }
        },
        methods: {
            setTableHeader() {
                this.tableHeader = [
                    {
                        label: '描述标题（中）',
                        prop: 'descTitleCn',
                        width: '140'
                    }, {
                        label: '描述标题（英）',
                        prop: 'descTitleEn',
                        width: '200'
                    }, {
                        label: '描述（中）',
                        prop: 'activityDescCn',
                        width: '400'
                    }, {
                        label: '描述（英）',
                        prop: 'activityDescEn',
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
                                btnType: 'danger',
                                action: 'del'
                            }
                        ]
                    }
                ];
            },
            initData() {
                Request({
                    url: 'activity/query',
                    params: {
                        activityNo: this.activityNo
                    }
                }).then(res => {
                    let detail = res.activities.length ? res.activities[0] : [];
                    let descList = detail.activityDescs ? detail.activityDescs : [];
                    this.descList = descList;
                    this.detail = detail;
                });
            },
            edit(row) {
                this.form = {
                    id: row.id,
                    showRank: row.showRank,
                    descTitleCn: row.descTitleCn,
                    descTitleEn: row.descTitleEn,
                    activityDescCn: row.activityDescCn,
                    activityDescEn: row.activityDescEn,
                }
                this.showAddModal();
            },
            del(record) {
                warn('确认删除，删除后数据不可恢复？', () => {
                    Request({
                        url: 'activity/deleteDesc',
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
                    activityDescCn: '',
                    activityDescEn: '',
                };
            },
            handleSubmit(e) {
                e.preventDefault();
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let params = Object.assign({}, this.form);
                        params.activityNo = this.activityNo;
                        let url = 'activity/addDesc';
                        let desc = '新增成功!';
                        if (params.id) {
                            url = 'activity/updateDesc';
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
                this.form.descTitleCn = descTitleCn;
                this.form.descTitleEn = descTitleEn;
            }
        },
        components: {
            Table,
        },
        computed: {
            rankList() {
                let activityTp = this.detail.activityTp;
                if (activityTp == undefined) {
                    return [];
                }
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