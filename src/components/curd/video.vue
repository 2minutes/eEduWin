<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增
            </a-button>
            <a-button type="primary" @click="initData()">
                查询
            </a-button>
            <a-table :columns="tableHeader" :data-source="videoList">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <a-tag color="red" @click="del(record)">删除</a-tag>
                </span>
            </a-table>
        </div>
        <a-modal
            :title="(editRow.newsNo ? '修改' : '新增') + '视频'"
            :visible="addVisible"
            @cancel="handleCancel"
            :footer="null"
            :width="800"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="视频名称(中文)">
                    <a-input
                        v-decorator="[
                            'videoNameCn',
                            { 
                                rules: [{ required: true, message: '请输入视频名称(中文)' }],
                                initialValue: editRow.videoNameCn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="视频名称(英文)">
                    <a-input
                        v-decorator="[
                            'videoNameEn',
                            { 
                                rules: [{ required: true, message: '请输入视频名称(英文)' }],
                                initialValue: editRow.videoNameEn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="课程编码">
                    <a-select
                        v-decorator="[
                            'courseNo',
                            {
                                rules: [{ required: true, message: '请选择课程编码' }],
                                initialValue: editRow.courseNo
                            },
                        ]"
                        >
                        <a-select-option v-for="(course) in courseList"
                            :value="course.courseNo" :key="course.courseNo">
                            {{course.courseNmCn}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="视频密码">
                    <a-input
                        v-decorator="[
                            'videoPassword',
                            { 
                                rules: [{ required: true, message: '请输入视频密码' }],
                                initialValue: editRow.videoPassword 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="备注(中文)">
                    <a-input
                        v-decorator="[
                            'remarkCn',
                            { 
                                initialValue: editRow.remarkCn
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="备注(英文)">
                    <a-input
                        v-decorator="[
                            'remarkEn',
                            { 
                                initialValue: editRow.remarkEn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="开始时间">
                    <a-date-picker
                        show-time
                        :allowClear="true"
                        :format="'yyyy-MM-DD HH:mm:ss'"
                        :valueFormat="'yyyy-MM-DD HH:mm:ss'"
                        v-decorator="[
                            'startTs',
                            { 
                                rules: [{ required: true, message: '请选择开始时间' }],
                                initialValue: editRow.startTs
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="结束时间">
                    <a-date-picker
                        show-time
                        :allowClear="true"
                        :format="'yyyy-MM-DD HH:mm:ss'"
                        :valueFormat="'yyyy-MM-DD HH:mm:ss'"
                        v-decorator="[
                            'endTs',
                            { 
                                rules: [{ required: true, message: '请选择结束时间' }],
                                initialValue: editRow.endTs
                            },
                        ]"
                        />
                </a-form-item>
                
                <a-form-item v-show="!editRow.id" label="视频">
                    <input class="file_btn" name="file" type="file" ref="videoFile"
                        accept="video/*" 
                        @change="handleChange"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.id ? '修改' : '新增'}}
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal> 
        
        <div v-show="progressFlag" class="shadow">
            <a-progress class="progress" type="circle" :percent="percent"  :format="percent => `${percent}%`" />
        </div>
    </div>
</template>
<script>
    import {Request} from '@/api/request';
    import axios from 'axios';
    import Menu from '@/components/common/menu';
    import {Modal} from 'ant-design-vue';
    import {getFormParams, error} from '@/assets/js/public';

    const columns = [
        {
            title: '视频ID',
            dataIndex: 'id',
            key: 'id',
        }, {
            title: '视频名称中文',
            dataIndex: 'videoNameCn',
            key: 'videoNameCn',
        }, {
            title: '视频名称英文',
            dataIndex: 'videoNameEn',
            key: 'videoNameEn',
        }, {
            title: '课程编码',
            dataIndex: 'courseNo',
            key: 'courseNo',
        }, {
            title: '课程密码',
            dataIndex: 'videoPassword',
            key: 'videoPassword',
        }, {
            title: '开始时间',
            dataIndex: 'startTs',
            key: 'startTs',
        }, {
            title: '结束时间',
            key: 'endTs',
            dataIndex: 'endTs',
        }, {
            title: '备注(中文)',
            key: 'remarkCn',
            dataIndex: 'remarkCn',
        }, {
            title: '备注(英文)',
            key: 'remarkEn',
            dataIndex: 'remarkEn',
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
                form: this.$form.createForm(this, { name: 'video' }),
                file: null,

                videoList: [],
                editRow: {},
                tableHeader: columns,

                addVisible: false,
                progressFlag: false,
                percent: 0,

                
                courseList: [],
            };
        },
        created() {
            this.initData();
            this.getCourseList();
        },
        methods: {
            initData(opts = {}) {
                Request({
                    url: 'video/query',
                    method: 'post',
                    params: {
                       id: opts.id ? opts.id : '',
                       courseNo: opts.courseNo ? opts.courseNo : '', 
                       startTs: opts.startTs ? opts.startTs : '',
                       endTs: opts.endTs ? opts.endTs : ''
                    }
                }).then(res => {
                    let list = res.videos ? res.videos : [];
                    list = list.map(item => {
                        item.key = item.id;
                        return item;
                    });
                    this.videoList = list;
                });
            },
            query(record) {
                Request({
                    url: `video/play`,
                    params: {
                        id: record.id,
                        videoPassword: record.videoPassword,
                    },
                }).then(res => {
                    this.playerOptions.sources[0].src = res.msg;
                    console.log('video:', this.playerOptions);
                    // this.videoList = list;
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
                                url: `video/delete/${record.id}`,
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
            handleCancel() {
                this.addVisible = false;
                this.editRow = {};
                this.form.resetFields();
                this.file = null;
                this.$refs.videoFile.value = '';
                this.handleProgressClose();
            },
            handleSubmit(e) {//size
                e.preventDefault();
                let file = this.file;
                let _this = this;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        if (values.startTs >= values.endTs) {
                            error('开始时间不得大于结束时间!');
                            return;
                        }
                        if (values.startTs.substr(0, 10) != values.endTs.substr(0, 10)) {
                            error('视频开始结束时间不得跨天!');
                            return;
                        }
                        if (!this.file) {
                            error('请选择需要上传的视频文件!');
                            return;
                        }
                        let formData = getFormParams(values);
                        if (this.file) {
                            formData.append('video', file);
                        }
                        let url = 'video/add';
                        let msg = '新增成功!';
                        if (this.editRow.id) {
                            url = `video/update`;
                            msg = '修改成功!';
                        }
                        let prePercent = 0;
                        this.progressFlag = true;
                        Request({
                            method: 'post',
                            url: url,
                            params: this.editRow.id ? Object.assign({id: this.editRow.id}, values) : formData,
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
                                this.$message.success(msg);
                                this.initData();
                                this.handleCancel();
                            }
                        }, res => {
                            this.handleProgressClose();
                        })
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
                    courseList = courseList.map(item => {
                        item.key = item.courseNo;
                        return item;
                    });
                    this.courseList = courseList;
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
    .shadow {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, .5);
        z-index: 1001;
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