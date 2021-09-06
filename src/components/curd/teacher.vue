<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">
                新增
            </el-button>
            <Table v-show="teaList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="teaList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>

        <el-dialog
            :title="(form.userNo ? '修改' : '新增') + '导师'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="160px">
                <el-form-item label="Full Name" prop="userNm">
                    <el-input v-model="form.userNm" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="导师简介（中文）" prop="descCn">
                    <el-input type="textarea" :autoSize="{minRows:2, maxRows: 6}" v-model="form.descCn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="导师简介（英文）" prop="descEn">
                    <el-input type="textarea" :autoSize="{minRows:2, maxRows: 6}" v-model="form.descEn" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.userNo ? '修改' : '新增'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import Table from '@/components/common/table';
    import {success} from '@/assets/js/public';
    
    export default {
        data() {
            return {
                form: {
                    userNm: '',
                    descCn: '',
                    descEn: '',
                },
                rules: {
                    userNm: {required: true, message: '请输入Full Name', trigger: 'blur'},
                    descCn: {required: true, message: '请输入中文简介', trigger: 'blur'},
                    descEn: {required: true, message: '请输入英文简介', trigger: 'blur'},
                },

                teaList: [],
                tableHeader: [],

                addVisible: false,
            };
        },
        created() {
            this.initData();
            this.setTableHeader();
        },
        methods: {
            setTableHeader() {
                this.tableHeader = [
                    {
                        label: '教师编号',
                        prop: 'userNo',
                        width: '300'
                    }, {
                        label: '姓名',
                        prop: 'userNm',
                        width: '200'
                    }, {
                        label: '中文简介',
                        prop: 'descCn',
                        width: '600'
                    }, {
                        label: '英文简介',
                        prop: 'descEn',
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
                                action: 'del'
                            }
                        ]
                    }
                ];
            },
            initData() {
                Request({
                    url: 'teacher/query',
                }).then(res => {
                    let teaList = res.teachers ? res.teachers : [];
                    this.teaList = teaList;
                });
            },
            edit(row) {
                this.form = {
                    userNo: row.userNo,
                    userNm: row.userNm,
                    descCn: row.descCn,
                    descEn: row.descEn,
                }
                this.addVisible = true;
            },
            showAddModal() {
                this.addVisible = true;
            },
            handleCancel() {
                this.addVisible = false;
                this.form = {
                    userNm: '',
                    descCn: '',
                    descEn: '',
                }
            },
            handleSubmit(e) {
                e.preventDefault();
                this.$refs.form.validate(valid => {
                    let form = this.form;
                    if (valid) {
                        let params = {
                            userNm: form.userNm,
                            descCn: form.descCn,
                            descEn: form.descEn,
                        };
                        let url = 'teacher/add';
                        let desc = '新增成功!';
                        if (form.userNo) {
                            params.userNo = form.userNo;
                            url = 'teacher/update';
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
        },
        components: {
            Table,
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