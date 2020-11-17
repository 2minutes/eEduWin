<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增
            </a-button>
            <a-table :columns="tableHeader" :data-source="typeList">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <!-- <a-tag color="red" @click="del(record)">删除</a-tag> -->
                </span>
            </a-table>
        </div>
        <a-modal
            :title="(editRow.typeNo ? '修改' : '新增' ) + '课程类别'"
            :visible="addVisible"
            @cancel="handleCancel"
            :footer="null"
            :width="800"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="类型名称（中）">
                    <a-input
                        v-decorator="[
                            'typeNmCn',
                            { 
                                rules: [{ required: true, message: '请输入类型名称（中文）' }],
                                initialValue: editRow.typeNmCn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="类型名称（英）">
                    <a-input
                        v-decorator="[
                            'typeNmEn',
                            { 
                                rules: [{ required: true, message: '请输入类型名称（英文）' }],
                                initialValue: editRow.lastNm 
                            },
                        ]"
                        />
                </a-form-item>
                <!-- <a-form-item label="父类型名称">
                    <a-input
                        v-decorator="[
                            'parentNo',
                            { 
                                rules: [{ required: true, message: '请输入父类型名称' }],
                                initialValue: editRow.lastNm 
                            },
                        ]"
                        />
                </a-form-item> -->
                <!-- <a-form-item v-show="!editRow.newsNo" label="类别图片">
                    <input class="file_btn" name="file" type="file" 
                        accept="image/png,image/gif,image/jpeg" 
                        @change="handleChange"/>
                </a-form-item> -->
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.typeNo ? '修改' : '新增'}}
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
            title: '类型编号',
            dataIndex: 'typeNo',
            key: 'typeNo',
        }, {
            title: '类型名称（中）',
            dataIndex: 'typeNmCn',
            key: 'typeNmCn',
        }, {
            title: '类型名称（英）',
            dataIndex: 'typeNmEn',
            key: 'typeNmEn',
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
                form: this.$form.createForm(this, { name: 'type' }),
                headers: {
                    authorization: 'authorization-text',
                },
                file: [],

                typeList: [],
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
                    url: 'courseType/query',
                }).then(res => {
                    let typeList = res.types ? res.types : [];
                    typeList = typeList.map(item => {
                        item.key = item.typeNo;
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
                            typeNmCn: values.typeNmCn,
                            typeNmEn: values.typeNmEn,
                            parentNo: values.parentNo,
                        };
                        let url = 'courseType/add';
                        let desc = '新增成功!';
                        if (this.editRow.typeNo) {
                            params.typeNo = this.editRow.typeNo;
                            url = 'courseType/update';
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