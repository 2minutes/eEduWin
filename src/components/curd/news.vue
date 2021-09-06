<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">新增</el-button>
            <Table v-show="newsList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="newsList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <el-dialog
            :title="(form.newsNo ? '修改' : '新增') + '新闻'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="160px">
                <el-form-item label="新闻标题（中文）" prop="newsTitleCn">
                    <el-input v-model="form.newsTitleCn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻标题（英文）" prop="newsTitleEn">
                    <el-input v-model="form.newsTitleEn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容（中文）" prop="newsContextCn">
                    <el-input type="textarea" v-model="form.newsContextCn" autocomplete="off"
                        placeholder="多段数据用#分隔"
                        :autosize="{minRows: 2, maxRows: 6}"></el-input>
                </el-form-item>
                <el-form-item label="新闻内容（英文）" prop="newsContextEn">
                    <el-input type="textarea" v-model="form.newsContextEn" autocomplete="off"
                        placeholder="多段数据用#分隔"
                        :autosize="{minRows: 2, maxRows: 6}"></el-input>
                </el-form-item>
                <el-form-item label="封面图片">
                    <el-image  v-if="form.newsPic" class="news_pic"
                        :src="form.newsPic" @click="handlePreview(form.newsPic)" >
                    </el-image>
                    <input class="file_btn" name="file" type="file" ref="file"
                        accept="image/png,image/gif,image/jpeg" 
                        @change="handleChange"/>
                </el-form-item>
                <el-form-item label="新闻图片/视频">
                    <el-image  v-if="form.contentPic" class="news_pic"
                        :src="form.contentPic" @click="handlePreview(form.contentPic)" >
                    </el-image>
                    <input class="file_btn" name="file" type="file" ref="contentFile"
                        accept="image/*,video/*" 
                        @change="handleContentFileChange"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.newsNo ? '修改' : '新增'}}</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="previewVisible" :footer="null" 
            @cancel="handlePreview()">
            <img alt="example" style="width: 100%" :src="previewImgUrl" />
        </el-dialog>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import Table from '@/components/common/table';
    import {Modal} from 'ant-design-vue';
    import {success, error, warn} from '@/assets/js/public';
    export default {
        data() {
            return {
                form: {
                    newsTitleCn: '',
                    newsTitleEn: '',
                    newsContextCn: '',
                    newsContextEn: '',
                },
                rules: {
                    newsTitleCn: {required: true, message: '请输入中文标题', trigger: 'blur'},
                    newsTitleEn: {required: true, message: '请输入英文标题', trigger: 'blur'},
                    newsContextCn: {required: true, message: '请输入中文新闻内容', trigger: 'blur'},
                    newsContextEn: {required: true, message: '请输入英文新闻内容', trigger: 'blur'},
                },
                file: null,
                contentFile: null,

                newsList: [],
                tableHeader: [],

                addVisible: false,
                previewVisible: false,
                previewImgUrl: '',
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
                        label: '新闻编号',
                        prop: 'newsNo',
                        width: '260'
                    }, {
                        label: '中文标题',
                        prop: 'newsTitleCn',
                        width: '300'
                    }, {
                        label: '英文标题',
                        prop: 'newsTitleEn',
                        width: '300'
                    }, {
                        label: '中文内容',
                        prop: 'newsContextCn',
                        width: '800'
                    }, {
                        label: '英文内容',
                        prop: 'newsContextEn',
                        width: '800'
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
                    url: 'news/query',
                }).then(res => {
                    let newsList = res.news ? res.news : [];
                    this.newsList = newsList;
                });
            },
            edit(row) {
                this.form = {
                    newsNo: row.newsNo,
                    newsTitleCn: row.newsTitleCn,
                    newsTitleEn: row.newsTitleEn,
                    newsContextCn: row.newsContextCn,
                    newsContextEn: row.newsContextEn,
                    newsPic: row.newsPic
                };
                this.addVisible = true;
            },
            del(record) {
                warn('确认删除，删除后数据不可恢复？', () => {
                    Request({
                        url: 'news/delete',
                        params: {
                            newsNo: record.newsNo
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
                    newsTitleCn: '',
                    newsTitleEn: '',
                    newsContextCn: '',
                    newsContextEn: '',
                };
                this.file = null;
                this.$refs.file.value = '';
            },
            handleSubmit(e) {//size
                e.preventDefault();
                let file = this.file;
                if (file && file.size > 1024 * 1024) {
                    error('图片过大，请选择小于1M的图片!');
                    return;
                }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let form = this.form;
                        let formData = new FormData();
                        formData.append('newsTitleCn', form.newsTitleCn);
                        formData.append('newsContextCn', form.newsContextCn);
                        formData.append('newsTitleEn', form.newsTitleEn);
                        formData.append('newsContextEn', form.newsContextEn);
                        if (file) {
                            formData.append('file', file);
                        }
                        if (this.contentFile) {
                            formData.append('file1', this.contentFile);
                        }
                        let url = 'news/add';
                        let msg = '新增成功!';
                        if (form.newsNo) {
                            url = 'news/update';
                            formData.append('newsNo', form.newsNo);
                            msg = '修改成功!';
                        }
                        Request({
                            method: 'post',
                            url: url,
                            params: formData,
                        }).then(res => {
                            if (res.code == 200) {
                                success(msg);
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
            handleContentFileChange(e) {
                this.contentFile = e.target.files[0];
            },
            handlePreview(imgUrl = '') {
                this.previewImgUrl = imgUrl;
                this.previewVisible = imgUrl ? true : false;
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