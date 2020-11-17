<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增
            </a-button>
            <a-table :columns="tableHeader" :data-source="newsList">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <a-tag color="red" @click="del(record)">删除</a-tag>
                </span>
            </a-table>
        </div>
        <a-modal
            :title="(editRow.newsNo ? '修改' : '新增') + '新闻'"
            :visible="addVisible"
            @ok="handleOk"
            @cancel="handleCancel"
            :footer="null"
            :width="800"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="新闻标题（中文）">
                    <a-input
                        v-decorator="[
                            'newsTitleCn',
                            { 
                                rules: [{ required: true, message: '请输入中文标题' }],
                                initialValue: editRow.newsTitleCn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="新闻标题（英文）">
                    <a-input
                        v-decorator="[
                            'newsTitleEn',
                            { 
                                rules: [{ required: true, message: '请输入英文标题' }],
                                initialValue: editRow.newsTitleEn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="新闻内容（中文）">
                    <a-textarea  :autoSize="true"
                        :allowClear="true"
                        placeholder="多段数据用#分隔"
                        v-decorator="[
                            'newsContextCn',
                            { 
                                rules: [{ required: true, message: '请输入中文新闻内容' }],
                                initialValue: editRow.newsContextCn
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="新闻内容（英文）">
                    <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true"
                        placeholder="多段数据用#分隔"
                        v-decorator="[
                            'newsContextEn',
                            { 
                                rules: [{ required: true, message: '请输入英文新闻内容' }],
                                initialValue: editRow.newsContextEn
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="新闻图片">
                    <img class="news_pic" v-if="editRow.newsPic" :src="editRow.newsPic" @click="handlePreview(editRow.newsPic)" />
                    <input class="file_btn" name="file" type="file" 
                        accept="image/png,image/gif,image/jpeg" 
                        @change="handleChange"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.newsNo ? '修改' : '新增'}}
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal> 

        <a-modal :visible="previewVisible" :footer="null" 
            @cancel="handlePreview()">
            <img alt="example" style="width: 100%" :src="previewImgUrl" />
        </a-modal>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import axios from 'axios';
    import Menu from '@/components/common/menu';
    import {Modal} from 'ant-design-vue';
    const columns = [
        {
            title: '新闻编号',
            dataIndex: 'newsNo',
            key: 'newsNo',
        }, {
            title: '中文标题',
            dataIndex: 'newsTitleCn',
            key: 'newsTitleCn',
        }, {
            title: '英文标题',
            dataIndex: 'newsTitleEn',
            key: 'newsTitleEn',
        }, {
            title: '中文内容',
            key: 'newsContextCn',
            dataIndex: 'newsContextCn',
        }, {
            title: '英文内容',
            key: 'newsContextEn',
            dataIndex: 'newsContextEn',
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
                form: this.$form.createForm(this, { name: 'news' }),
                file: null,

                newsList: [],
                editRow: {},
                tableHeader: columns,

                addVisible: false,
                previewVisible: false,
                previewImgUrl: '',
            };
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                Request({
                    url: 'news/query',
                }).then(res => {
                    let newsList = res.news ? res.news : [];
                    newsList = newsList.map(item => {
                        item.key = item.newsNo;
                        return item;
                    });
                    this.newsList = newsList;
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
                                url: 'news/delete',
                                params: {
                                    newsNo: record.newsNo
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
                this.addVisible = true;
            },
            handleOk() {},
            handleCancel() {
                this.addVisible = false;
                this.editRow = {};
                this.form.resetFields();
                this.file = null;
            },
            handleSubmit(e) {//size
                e.preventDefault();
                let file = this.file;
                if (file && file.size > 1024 * 1024) {
                    this.$message.error('图片过大，请选择小于1M的图片!');
                    return;
                }
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = new FormData();
                        formData.append('newsTitleCn', values.newsTitleCn);
                        formData.append('newsContextCn', values.newsContextCn);
                        formData.append('newsTitleEn', values.newsTitleEn);
                        formData.append('newsContextEn', values.newsContextEn);
                        if (this.file) {
                            formData.append('file', file);
                        }
                        let url = 'news/add';
                        let msg = '新增成功!';
                        if (this.editRow.newsNo) {
                            url = 'news/update';
                            formData.append('newsNo', this.editRow.newsNo);
                            msg = '修改成功!';
                        }
                        Request({
                            method: 'post',
                            url: url,
                            params: formData,
                        }).then(res => {
                            if (res.code == 200) {
                                this.$message.success(msg);
                                this.initData();
                                this.handleCancel();
                            }
                        })
                    }

                });
            },
            handleChange(e) {
                this.file = e.target.files[0];
            },
            beforeUpload(file) {
                return false;
                let reader = new FileReader();
                reader.readAsText(file);
                reader.onload = e => {
                    let uids = e.target.result.split('\r\n');
                    return false;
                }
            },
            handlePreview(imgUrl = '') {
                this.previewImgUrl = imgUrl;
                this.previewVisible = imgUrl ? true : false;
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
            float: left;
            width: 80px;
            height: 30px;
        }
    }
    .news_pic {
        float: left;
        margin-right: 10px;
        width: 80px;
        height: 80px;
        cursor: pointer;
    }
</style>