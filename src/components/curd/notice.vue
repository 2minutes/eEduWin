<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">
                新增
            </el-button>
            <Table v-show="noticeList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="noticeList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <!-- 新增通告 -->
        <el-dialog
            :title="(form.id ? '修改' : '新增') + '通告'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="160px">
                
                <el-form-item label="通告标题（中文）" prop="noticeTitleZh">
                    <el-input v-model="form.noticeTitleZh" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="通告标题(英文)" prop="noticeTitleEn">
                    <el-input v-model="form.noticeTitleEn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="报名截止时间" prop="endTs">
                    <el-date-picker
                        v-model="form.endTs"
                        type="datetime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="报名截止时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="通告内容（中文）" prop="noticeContentZh">
                    <el-input v-model="form.noticeContentZh" type="textarea" :autoSize="{minRows: 2}"
                        placeholder="多段数据用#分隔"></el-input>
                </el-form-item>
                <el-form-item label="通告内容（英文）" prop="noticeContentEn">
                    <el-input v-model="form.noticeContentEn" type="textarea" :autoSize="{minRows: 2}"
                        placeholder="多段数据用#分隔"></el-input>
                </el-form-item>
                <el-form-item label="通告图片">
                    <el-image  v-if="form.noticePic" class="pic"
                        :src="form.noticePic" @click="handlePreview(form.noticePic)" >
                    </el-image>
                    <input class="file_btn" name="file" type="file" ref="file"
                        accept="image/png,image/gif,image/jpeg" 
                        @change="handleChange"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.id ? '修改' : '新增'}}</el-button>
            </div>
        </el-dialog>
        <!-- 图片预览 -->
        <el-dialog :visible.sync="previewVisible" :footer="null" 
            @cancel="handlePreview()">
            <img alt="example" style="width: 100%" :src="previewImgUrl" />
        </el-dialog>

    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import {getFormParams, warn, success} from '@/assets/js/public';
    import Table from '@/components/common/table';
    
    export default {
        data() {
            return {
                form: {
                    noticeTitleZh: '',
                    noticeTitleEn: '',
                    endTs: '',
                    noticeContentZh: '',
                    noticeContentEn: '',
                },
                rules: {
                    noticeTitleZh: {required: true, message: '请输入中文标题', trigger: 'blur'},
                    noticeTitleEn: {required: true, message: '请输入英文标题', trigger: 'blur'},
                    endTs: {required: true, message: '请选择报名截止时间', trigger: 'blur'},
                    noticeContentZh: {required: true, message: '请输入中文通告内容', trigger: 'blur'},
                    noticeContentEn: {required: true, message: '请输入英文通告内容', trigger: 'blur'},
                },
                file: null,

                noticeList: [],
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
                        label: '通知编号',
                        prop: 'id',
                    }, {
                        label: '中文标题',
                        prop: 'noticeTitleZh',
                        width: '300'
                    }, {
                        label: '英文标题',
                        prop: 'noticeTitleEn',
                        width: '600'
                    }, {
                        label: '中文内容',
                        prop: 'noticeContentZh',
                        width: '400'
                    }, {
                        label: '英文内容',
                        prop: 'noticeContentEn',
                        width: '600'
                    }, {
                        label: '截止时间',
                        prop: 'endTs',
                        width: '240'
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
                    url: 'notice/query',
                }).then(res => {
                    let list = res.notices ? res.notices : [];
                    this.noticeList = list;
                });
            },
            edit(row) {
                this.form = {
                    id: row.id,
                    noticeTitleZh: row.noticeTitleZh,
                    noticeTitleEn: row.noticeTitleEn,
                    endTs: row.endTs,
                    noticeContentZh: row.noticeContentZh,
                    noticeContentEn: row.noticeContentEn,
                    noticePic: row.noticePic,
                };
                this.showAddModal();
            },
            del(record) {
                warn('确认删除，删除后数据不可恢复？', () => {
                    Request({
                        url: 'notice/delete',
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
                    noticeTitleZh: '',
                    noticeTitleEn: '',
                    endTs: '',
                    noticeContentZh: '',
                    noticeContentEn: '',
                };
                this.file = null;
                this.$refs.file.value = '';
            },
            handleSubmit(e) {//size
                e.preventDefault();
                let file = this.file;
                if (file && file.size > 1024 * 1024) {
                    this.$message.error('图片过大，请选择小于1M的图片!');
                    return;
                }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let form = this.form;
                        let formData = getFormParams(form);
                        if (this.file) {
                            formData.append('file', file);
                        }
                        let url = 'notice/add';
                        let msg = '新增成功!';
                        if (form.id) {
                            url = 'notice/update';
                            msg = '修改成功!';
                        }
                        Request({
                            method: 'post',
                            url: url,
                            params: formData,
                        }).then(res => {
                            if (res.code == 200) {
                                success(msg);
                                this.handleCancel();
                                this.initData();
                            }
                        })
                    }

                });
            },
            handleChange(e) {
                this.file = e.target.files[0];
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
    .pic {
        float: left;
        margin-right: 10px;
        width: 80px;
        height: 80px;
        cursor: pointer;
    }
</style>