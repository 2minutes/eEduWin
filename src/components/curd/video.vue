<template>
    <div class="curd clearfix">
        <div class="curd_right">
            <el-button type="primary" @click="showAddModal" size="small">
                新增
            </el-button>
            <el-button type="primary" @click="initData()" size="small">
                查询
            </el-button>
            <Table v-show="videoList.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="videoList" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <el-dialog
            :title="(form.id ? '修改' : '新增') + '视频'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="140px">
                <el-form-item label="视频名称(中文)" prop="videoNameCn">
                    <el-input v-model="form.videoNameCn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="视频名称(英文)" prop="videoNameEn">
                    <el-input v-model="form.videoNameEn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课程" prop="courseNo">
                    <el-select v-model="form.courseNo" placeholder="请选择">
                        <el-option
                            v-for="item in courseList"
                            :key="item.courseNo"
                            :label="item.courseNmCn"
                            :value="item.courseNo">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="视频密码" prop="videoPassword">
                    <el-input v-model="form.videoPassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注(中文)">
                    <el-input v-model="form.remarkCn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注(英文)">
                    <el-input v-model="form.remarkEn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="开始结束时间" prop="ts">
                    <el-date-picker
                        v-model="form.ts"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item v-show="!form.id" label="视频">
                    <input class="file_btn" name="file" type="file" ref="videoFile"
                        accept="video/*" 
                        @change="handleChange"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.id ? '修改' : '新增'}}</el-button>
            </div>
        </el-dialog>
        
        <div v-show="progressFlag" class="shadow">
            <el-progress class="progress" type="circle" :percentage="percent"></el-progress>
        </div>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import {getFormParams, error, success, warn} from '@/assets/js/public';
    import Table from '@/components/common/table';

    export default {
        data() {
            return {
                form: {
                    videoNameCn: '',
                    videoNameEn: '',
                    courseNo: '',
                    videoPassword: '',
                    remarkCn: '',
                    remarkEn: '',
                    courseColor: '',
                    ts: [],
                },
                rules: {
                    videoNameCn: {required: true, message: '请输入视频名称(中文)', trigger: 'blur'},
                    videoNameEn: {required: true, message: '请输入视频名称(英文)', trigger: 'blur'},
                    courseNo: {required: true, message: '请选择课程', trigger: 'blur'},
                    videoPassword: {required: true, message: '请输入视频密码', trigger: 'blur'},
                    ts: {required: true, message: '请选择开始结束时间', trigger: 'blur'},
                },
                file: null,

                tableHeader: [],
                videoList: [],

                addVisible: false,
                progressFlag: false,
                percent: 0,

                courseList: [],
            };
        },
        created() {
            this.initData();
            this.getCourseList();
            this.setTableHeader();
        },
        methods: {
            setTableHeader() {
                this.tableHeader = [
                    {
                        label: '视频ID',
                        prop: 'id',
                    }, {
                        label: '视频名称中文',
                        prop: 'videoNameCn',
                        width: '300'
                    }, {
                        label: '视频名称英文',
                        prop: 'videoNameEn',
                        width: '300'
                    }, {
                        label: '课程编码',
                        prop: 'courseNo',
                        width: '300'
                    }, {
                        label: '课程密码',
                        prop: 'videoPassword',
                        width: '200'
                    }, {
                        label: '开始时间',
                        prop: 'startTs',
                        width: '240'
                    }, {
                        label: '结束时间',
                        prop: 'endTs',
                        width: '240'
                    }, {
                        label: '备注(中文)',
                        prop: 'remarkCn',
                        width: '200'
                    }, {
                        label: '备注(英文)',
                        prop: 'remarkEn',
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
                                action: 'del'
                            }
                        ]
                    }
                ];
            },
            initData(opts = {}) {
                Request({
                    url: 'video/query',
                    method: 'post',
                    params: {
                       id: opts.id ? opts.id : '',
                       courseNo: opts.courseNo ? opts.courseNo : '', 
                       startTs: opts.startTs ? opts.startTs : '',
                       endTs: opts.endTs ? opts.endTs : '',
                    }
                }).then(res => {
                    let list = res.videos ? res.videos : [];
                    this.videoList = list;
                });
            },
            edit(row) {
                this.form = {
                    id: row.id,
                    videoNameCn: row.videoNameCn,
                    videoNameEn: row.videoNameEn,
                    courseNo: row.courseNo,
                    videoPassword: row.videoPassword,
                    remarkCn: row.remarkCn,
                    remarkEn: row.remarkEn,
                    courseColor: row.courseColor,
                    ts: [row.startTs, row.endTs],
                }
                this.addVisible = true;
            },
            del(record) {
                warn('确认删除, 删除后数据不可恢复?', () => {
                    Request({
                        url: `video/delete/${record.id}`,
                    }).then(res => {
                        if (res.code == 200) {
                            success('删除成功!');
                            this.initData();
                        }
                    });
                });
            },
            showAddModal() {
                this.addVisible = true;
            },
            handleCancel() {
                this.addVisible = false;
                this.editRow = {};
                this.form = {
                    videoNameCn: '',
                    videoNameEn: '',
                    courseNo: '',
                    videoPassword: '',
                    remarkCn: '',
                    remarkEn: '',
                    courseColor: '',
                    ts: [],
                };
                this.file = null;
                this.$refs.videoFile.value = '';
                this.handleProgressClose();
            },
            handleSubmit(e) {//size
                e.preventDefault();
                let file = this.file;
                let _this = this;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let form = Object.assign({}, this.form);
                        let {ts} = form;
                        let [startTs = '', endTs = ''] = ts;
                        if (startTs >= endTs) {
                            error('开始时间不得大于结束时间!');
                            return;
                        }
                        if (startTs.substr(0, 10) != endTs.substr(0, 10)) {
                            error('视频开始结束时间不得跨天!');
                            return;
                        }
                        form.startTs = startTs;
                        form.endTs = endTs;
                        delete form.ts;
                        if (!this.file && !form.id) {
                            error('请选择需要上传的视频文件!');
                            return;
                        }
                        let formData = getFormParams(form);
                        if (this.file) {
                            formData.append('video', file);
                        }
                        let url = 'video/add';
                        let msg = '新增成功!';
                        if (form.id) {
                            url = `video/update`;
                            msg = '修改成功!';
                        }
                        let prePercent = 0;
                        this.progressFlag = true;
                        Request({
                            method: 'post',
                            url: url,
                            params: form.id ? form : formData,
                            loading: true,
                            timeout: 0,
                            uploadProgress(progressEvent) {
                                let percent = (progressEvent.loaded / progressEvent.total * 100 | 0);
                                if (prePercent != percent) {
                                    _this.percent = percent;
                                    prePercent = percent;
                                }
                            }
                        }).then(res => {
                            if (res.code == 200) {
                                success(msg);
                                this.initData();
                                this.handleCancel();
                            }
                        }, res => {
                            this.handleProgressClose();
                        });
                    }

                });
            },
            handleProgressClose() {
                this.progressFlag = false;
                this.percent = 0;
            },
            handleChange(e) {
                this.file = e.target.files[0];
            },
            handlePreview(imgUrl = '') {
                this.previewImgUrl = imgUrl;
                this.previewVisible = imgUrl ? true : false;
            },

            getCourseList() {
                Request({
                    url: 'course/query',
                }).then(res => {
                    let courseList = res.courses ? res.courses : [];
                    this.courseList = courseList;
                });
            },

            
        },
        components: {
            Table
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
        }
    }
    .news_pic {
        float: left;
        margin-right: 10px;
        width: 80px;
        height: 80px;
        cursor: pointer;
    }
    .shadow {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, .5);
        z-index: 3000;
        .progress {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .video-player-box {
        width: 800px;
        height: 500px;
    }
</style>