<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增
            </a-button>
            <a-table :columns="tableHeader" :data-source="teaList">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <a-tag color="red" @click="del(record)">删除</a-tag>
                </span>
            </a-table>
        </div>

        <a-modal
            title="新增导师"
            :visible="addVisible"
            @cancel="handleCancel"
            :footer="null"
            :width="800"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="Full Name">
                    <a-input
                        v-decorator="[
                            'userNm',
                            { 
                                rules: [{ required: true, message: '请输入Full Name' }],
                                initialValue: editRow.userNm 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="导师简介（中文）">
                    <a-textarea  :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true"
                        v-decorator="[
                            'descCn',
                            { 
                                rules: [{ required: true, message: '请输入中文简介' }],
                                initialValue: editRow.descCn
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="导师简介（英文）">
                    <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true"
                        v-decorator="[
                            'descEn',
                            { 
                                rules: [{ required: true, message: '请输入英文简介' }],
                                initialValue: editRow.descEn
                            },
                        ]"
                        />
                </a-form-item>
                <!-- <a-form-item v-show="!editRow.newsNo" label="新闻图片">
                    <input class="file_btn" name="file" type="file" 
                        accept="image/png,image/gif,image/jpeg" 
                        @change="handleChange"/>
                </a-form-item> -->
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.userNo ? '修改' : '新增'}}
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
    const columns = [
        {
            title: '教师编号',
            dataIndex: 'userNo',
            key: 'userNo',
        }, {
            title: '姓名',
            dataIndex: 'userNm',
            key: 'userNm',
        }, {
            title: '中文简介',
            key: 'descCn',
            dataIndex: 'descCn',
        }, {
            title: '英文简介',
            key: 'descEn',
            dataIndex: 'descEn',
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
                form: this.$form.createForm(this, { name: 'tea' }),
                headers: {
                    authorization: 'authorization-text',
                },
                file: [],

                teaList: [],
                editRow: {},
                tableHeader: columns,

                addVisible: false,
            };
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                Request({
                    url: 'teacher/query',
                }).then(res => {
                    let teaList = res.teachers ? res.teachers : [];
                    teaList = teaList.map(item => {
                        item.key = item.userNo;
                        return item;
                    });
                    this.teaList = teaList;
                });
            },
            edit(record) {
                this.editRow = record;
                this.addVisible = true;
            },
            del(record) {
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
                        let params = {
                            userNm: values.userNm,
                            descCn: values.descCn,
                            descEn: values.descEn,
                        };
                        let url = 'teacher/add';
                        let desc = '新增成功!';
                        if (this.editRow.userNo) {
                            params.userNo = this.editRow.userNo;
                            url = 'teacher/update';
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
                            }
                        })
                    }

                });
            },
            handleSelectChange(value) {
                console.log(value);
                this.form.setFieldsValue({
                    note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
                });
            },
            handleChange(e) {
                this.file = e.target.files[0];
                // this.fileList = [info.file];
            },
            beforeUpload(file) {
                return false;
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = e => {
                    let uids = e.target.result.split('\r\n');
                    return false;
                }
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