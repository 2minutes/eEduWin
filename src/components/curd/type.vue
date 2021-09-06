<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">
                新增
            </el-button>
            <Table v-show="typeList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="typeList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <el-dialog
            :title="(form.typeNo ? '修改' : '新增') + '课程类别'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px">
                <el-form-item label="类型名称（中）" prop="typeNmCn">
                    <el-input v-model="form.typeNmCn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类型名称（英）" prop="typeNmEn">
                    <el-input v-model="form.typeNmEn" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.typeNo ? '修改' : '新增'}}</el-button>
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
                file: [],

                tableHeader: [],
                typeList: [],

                addVisible: false,
                form: {
                    typeNmCn: '',
                    typeNmEn: '',
                },
                rules: {
                    typeNmCn: {required: true, message: '请输入类型名称（中文）', trigger: 'blur'},
                    typeNmEn: {required: true, message: '请输入类型名称（英文）', trigger: 'blur'},
                },
            };
        },
        created() {
            this.setTableHeader();
            this.initData();
        },
        methods: {
            setTableHeader() {
                this.tableHeader = [
                    {
                        label: '类型编号',
                        prop: 'typeNo',
                        width: '300'
                    }, {
                        label: '类型名称（中）',
                        prop: 'typeNmCn',
                        width: '300'
                    }, {
                        label: '类型名称（英）',
                        prop: 'typeNmEn',
                        width: '400'
                    }, {
                        label: '操作',
                        prop: '',
                        slot: true,
                        slotArr: [
                            {
                                type: 'btn',
                                btnText: '修改',
                                action: 'edit'
                            }
                        ]
                    }
                ];
            },
            initData() {
                Request({
                    url: 'courseType/query',
                }).then(res => {
                    let typeList = res.types ? res.types : [];
                    this.typeList = typeList;
                });
            },
            edit(row) {
                this.form = {
                    typeNo: row.typeNo,
                    typeNmCn: row.typeNmCn,
                    typeNmEn: row.typeNmEn
                };
                this.addVisible = true;
            },
            del(row) {
            },
            showAddModal() {
                this.addVisible = true;
            },
            handleCancel() {
                this.addVisible = false;
                this.form = {
                    typeNmCn: '',
                    typeNmEn: '',
                };
            },
            handleSubmit(e) {
                e.preventDefault();
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let form = this.form;
                        let params = {
                            typeNmCn: form.typeNmCn,
                            typeNmEn: form.typeNmEn,
                            parentNo: '',
                        };
                        let url = 'courseType/add';
                        let desc = '新增成功!';
                        if (form.typeNo) {
                            params.typeNo = form.typeNo;
                            url = 'courseType/update';
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