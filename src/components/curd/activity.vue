<template>
    <div class="curd clearfix">
        <Menu />
        <div class="curd_right">
            <a-button type="primary" @click="showAddModal">
                新增活动
            </a-button>
            <a-table :columns="tableHeader" 
                :data-source="list">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="customTitle">Name</span>
                <span slot="tags" slot-scope="record">
                    <a-tag color="red" @click="detail(record)">活动描述</a-tag>
                    <a-tag color="green" @click="edit(record)">修改</a-tag>
                    <a-tag color="red" @click="del(record)">删除</a-tag>
                </span>
            </a-table>
        </div>
        <a-modal
            :title="`${editRow.activityNo ? '修改' : '新增'}活动`"
            :visible="addVisible"
            @cancel="handleCancel"
            :footer="null"
            :width="1000"
            >
            <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
                <a-form-item label="活动名称（中文）">
                    <a-input
                        v-decorator="[
                            'activityNmZh',
                            { 
                                rules: [{ required: true, message: '请输入活动名称（中文）' }],
                                initialValue: editRow.activityNmZh 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="活动名称（英文）">
                    <a-input
                        v-decorator="[
                            'activityNmEn',
                            { 
                                rules: [{ required: true, message: '活动名称（英文）' }],
                                initialValue: editRow.activityNmEn 
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="报名截止时间">
                    <a-date-picker
                        placeholder="报名截止时间"
                        show-time
                        :allowClear="true"
                        :format="'yyyy-MM-DD HH:mm:ss'"
                        :valueFormat="'yyyy-MM-DD HH:mm:ss'"
                        v-decorator="[
                            'submitEndTs',
                            { 
                                rules: [{ required: true, message: '请选择报名截止时间' }],
                                initialValue: editRow.submitEndTs
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="活动类型">
                    <a-select
                        @change="handleTypeChange"
                        v-decorator="[
                            'activityTp',
                            { 
                                rules: [{ required: true, message: '请选择活动类型' }],
                                initialValue: editRow.activityTp 
                            },
                        ]"
                        >
                        <a-select-option :value="'0'">
                            竞赛
                        </a-select-option>
                        <a-select-option :value="'1'">
                            志愿者活动
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item required label="活动图片">
                    <img class="pic" v-if="editRow.activityLogo" :src="editRow.activityLogo" @click="handlePreview(editRow.activityLogo)" />
                    <input class="file_btn" name="file" type="file" 
                        accept="image/png,image/gif,image/jpeg"
                        @change="handleChange"/>
                </a-form-item>

                <!-- 竞赛 -->
                <template v-if="activityTp === '0'">
                    <a-form-item label="竞赛主题（中文）">
                        <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                            :allowClear="true"
                            placeholder="500字以内"
                            v-decorator="[
                                'activityThemeZh',
                                { 
                                    rules: [{ required: true, message: '请输入中文活动描述' }],
                                    initialValue: editRow.activityThemeZh
                                },
                            ]"
                            />
                    </a-form-item>
                    <a-form-item label="竞赛主题（英文）">
                        <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                            :allowClear="true"
                            placeholder="500字以内"
                            v-decorator="[
                                'activityThemeEn',
                                { 
                                    rules: [{ required: true, message: '请输入英文活动描述' }],
                                    initialValue: editRow.activityThemeEn
                                },
                            ]"
                            />
                    </a-form-item>
                    <a-form-item label="竞赛奖励（中文）">
                        <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                            :allowClear="true"
                            placeholder="多条数据用#分隔,100字以内"
                            v-decorator="[
                                'prizeZh',
                                { 
                                    rules: [{ required: true, message: '请输入中文活动奖励' }],
                                    initialValue: editRow.prizeZh
                                },
                            ]"
                            />
                    </a-form-item>
                    <a-form-item label="竞赛奖励（英文）">
                        <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                            :allowClear="true"
                            placeholder="多条数据用#分隔,100字以内"
                            v-decorator="[
                                'prizeEn',
                                { 
                                    rules: [{ required: true, message: '请输入英文活动奖励' }],
                                    initialValue: editRow.prizeEn
                                },
                            ]"
                            />
                    </a-form-item>
                </template>

                <a-form-item label="参与者年龄段（中文）">
                    <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true"
                        placeholder="多条数据用#分隔"
                        v-decorator="[
                            'attenderGradleZh',
                            { 
                                rules: [{ required: true, message: '请输入参与者年龄段（中文）' }],
                                initialValue: editRow.attenderGradleZh
                            },
                        ]"
                        />
                </a-form-item>
                <a-form-item label="参与者年龄段（英文）">
                    <a-textarea :autoSize="{minRows:2, maxRows: 6}"
                        :allowClear="true"
                        placeholder="多条数据用#分隔"
                        v-decorator="[
                            'attenderGradleEn',
                            { 
                                rules: [{ required: true, message: '请输入参与者年龄段（英文）' }],
                                initialValue: editRow.attenderGradleEn
                            },
                        ]"
                        />
                </a-form-item>
                
                

                <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                    <a-button type="primary" html-type="submit">
                        {{editRow.activityNo ? '修改' : '新增'}}
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
    import {Request, Post} from '@/api/request';
    import axios from 'axios';
    import baseUrl from '@/utils/baseUrl';
    import Menu from '@/components/common/menu';
    import {getToken, loginClear} from '@/assets/js/public';
    import {Modal} from 'ant-design-vue';
    const columns = [
        {
            title: '活动编号',
            dataIndex: 'activityNo',
            key: 'activityNo',
        }, {
            title: '中文名称',
            dataIndex: 'activityNmZh',
            key: 'activityNmZh',
        }, {
            title: '英文名称',
            dataIndex: 'activityNmEn',
            key: 'activityNmEn',
        }, {
            title: '活动类型',
            key: 'activityTpStr',
            dataIndex: 'activityTpStr',
        }, {
            title: '报名截止时间',
            key: 'submitEndTs',
            dataIndex: 'submitEndTs',
        }, {
            title: '报名人要求（中文）',
            key: 'attenderGradleZh',
            dataIndex: 'attenderGradleZh',
        }, {
            title: '报名人要求（英文）',
            key: 'attenderGradleEn',
            dataIndex: 'attenderGradleEn',
        }, {
            title: '竞赛主题（中文）',
            key: 'activityThemeZh',
            dataIndex: 'activityThemeZh',
        }, {
            title: '竞赛主题（中文）',
            key: 'activityThemeEn',
            dataIndex: 'activityThemeEn',
        }, {
            title: '竞赛奖励（中文）',
            key: 'prizeZh',
            dataIndex: 'prizeZh',
        }, {
            title: '竞赛奖励（英文）',
            key: 'prizeEn',
            dataIndex: 'prizeEn',
        }, {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'tags' },
        }
    ];
    export default {
        data() {
            return {
                formLayout: 'horizontal',
                form: this.$form.createForm(this, { name: 'news' }),

                list: [],
                file: null,
                editRow: {},
                tableHeader: columns,

                addVisible: false,
                previewVisible: false,
                previewImgUrl: '',

                activityTp: null,
            };
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                Request({
                    url: 'activity/query',
                    params: {
                        activityTp: null,
                    }
                }).then(res => {
                    console.log('activity:', res);
                    let activityList = res.activities ? res.activities : [];
                    let competitionList = res.competitions ? res.competitions : [];
                    let pastList = res.hisActivitys ? res.hisActivitys : [];
                    let list = activityList.concat(competitionList, pastList);
                    list = list.map(item => {
                        item.key = item.activityNo;
                        item.activityTpStr = item.activityTp == 1 ? '志愿者活动' : '竞赛';
                        return item;
                    });
                    this.list = list;
                });
            },
            detail(record) {
                this.$router.push({
                    path: '/curd/activityDetail',
                    query: {
                        ano: record.activityNo,
                    }
                });
            },
            edit(record) {
                this.editRow = record;
                this.addVisible = true;
                this.activityTp = record.activityTp;
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
                                url: 'activity/delete',
                                params: {
                                    activityNo: record.activityNo
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
            handleChange(e) {
                this.file = e.target.files[0];
            },
            handleCancel() {
                this.addVisible = false;
                this.editRow = {};
                this.form.resetFields();
                this.file = null;
            },
            handleSubmit(e) {
                e.preventDefault();
                let file = this.file;
                if (file && file.size > 1024 * 1024) {
                    this.$message.error('图片过大，请选择小于1M的图片!');
                    return;
                }
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let params = this.getFormParams(values);
                        if (this.file) {
                            params.append('file', file);
                        }
                        let url = 'activity/add';
                        let msg = '新增成功!';
                        if (this.editRow.activityNo) {
                            url = 'activity/update';
                            params.append('activityNo', this.editRow.activityNo);
                            msg = '修改成功!';
                        }
                        Request({
                            method: 'post',
                            url: url,
                            params: params,
                        }).then(res => {
                            if (res.code == 200) {
                                this.$message.success(msg);
                                this.initData();
                                this.handleCancel();
                            }
                        });
                    }
                });
            },
            getFormParams(params) {
                let formData = new FormData();
                for(var key in params) {
                    formData.append(key, params[key]);
                }
                return formData;
            },
            handlePreview(imgUrl = '') {
                this.previewImgUrl = imgUrl;
                this.previewVisible = imgUrl ? true : false;
            },
            handleTypeChange(value) {//活动类型改变
                this.activityTp = value;
            }

        },
        components: {
            Menu,
        }
    }
</script>
<style lang="less">
    .curd {
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