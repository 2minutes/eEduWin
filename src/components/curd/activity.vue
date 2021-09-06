<template>
    <div class="curd clearfix">
        <div class="curd_right"> 
            <el-button type="primary" @click="showAddModal" size="small">
                新增活动
            </el-button>
            <Table v-show="list.length" :showSelect="false"
                :tableHeader="tableHeader" :tableData="list" 
                :total="1" :page="1" :pageSize="10"/>
        </div>
        <el-dialog
            :title="(form.activityNo ? '修改' : '新增') + '活动'"
            :visible.sync="addVisible"
            width="820px"
            :before-close="handleCancel">
            <el-form :model="form" :rules="rules" ref="form" label-width="180px">
                <el-form-item label="活动名称（中文）" prop="activityNmZh">
                    <el-input v-model="form.activityNmZh" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动名称（英文）" prop="activityNmEn">
                    <el-input v-model="form.activityNmEn" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="报名截止时间" prop="submitEndTs">
                    <el-date-picker
                        v-model="form.submitEndTs"
                        type="datetime"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="报名截止时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动类型" prop="activityTp">
                    <el-select v-model="form.activityTp" placeholder="请选择" @change="handleTypeChange">
                        <el-option label="竞赛" value="0" ></el-option>
                        <el-option label="志愿者活动" value="1" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动图片">
                    <el-image  v-if="form.activityLogo" class="pic"
                        :src="form.activityLogo" @click="handlePreview(form.activityLogo)" >
                    </el-image>
                    <input class="file_btn" name="file" type="file" ref="file"
                        accept="image/png,image/gif,image/jpeg" 
                        @change="handleChange"/>
                </el-form-item>
                <template v-if="activityTp === '0'">
                    <el-form-item label="竞赛主题（中文）" prop="activityThemeZh">
                        <el-input v-model="form.activityThemeZh" type="textarea" :autoSize="{minRows:2}"
                            placeholder="500字以内"></el-input>
                    </el-form-item>
                    <el-form-item label="竞赛主题（英文）" prop="activityThemeEn">
                        <el-input v-model="form.activityThemeEn" type="textarea" :autoSize="{minRows:2}"
                            placeholder="500字以内"></el-input>
                    </el-form-item>
                    <el-form-item label="竞赛奖励（中文）" prop="prizeZh">
                        <el-input v-model="form.prizeZh" type="textarea" :autoSize="{minRows:2}"
                            placeholder="多条数据用#分隔,100字以内"></el-input>
                    </el-form-item>
                    <el-form-item label="竞赛奖励（英文）" prop="prizeEn">
                        <el-input v-model="form.prizeEn" type="textarea" :autoSize="{minRows:2}"
                            placeholder="多条数据用#分隔,100字以内"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="参与者年龄段（中文）" prop="attenderGradleZh">
                    <el-input v-model="form.attenderGradleZh"  type="textarea" :autoSize="{minRows:2}"
                        placeholder="多条数据用#分隔"></el-input>
                </el-form-item>
                <el-form-item label="参与者年龄段（英文）" prop="attenderGradleEn">
                    <el-input v-model="form.attenderGradleEn"  type="textarea" :autoSize="{minRows:2}"
                        placeholder="多条数据用#分隔"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleCancel">关 闭</el-button>
                <el-button type="primary" @click="handleSubmit">{{form.activityNo ? '修改' : '新增'}}</el-button>
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
    import Table from '@/components/common/table';
    import {error, success, warn} from '@/assets/js/public';
    
    export default {
        data() {
            return {
                form: {
                    activityNmZh: '',
                    activityNmEn: '',
                    submitEndTs: '',
                    activityTp: '',
                    activityThemeZh: '',
                    activityThemeEn: '',
                    prizeZh: '',
                    prizeEn: '',
                    attenderGradleZh: '',
                    attenderGradleEn: '',
                },
                rules: {
                    activityNmZh: {required: true, message: '请输入活动名称（中文）', trigger: 'blur'},
                    activityNmEn: {required: true, message: '请输入活动名称(英文)', trigger: 'blur'},
                    submitEndTs: {required: true, message: '请选择报名截止时间', trigger: 'blur'},
                    activityTp: {required: true, message: '请选择活动类型', trigger: 'blur'},
                    activityThemeZh: {required: true, message: '请输入中文活动描述', trigger: 'blur'},
                    activityThemeEn: {required: true, message: '请输入英文活动描述', trigger: 'blur'},
                    prizeZh: {required: true, message: '请输入中文活动奖励', trigger: 'blur'},
                    prizeEn: {required: true, message: '请输入英文活动奖励', trigger: 'blur'},
                    attenderGradleZh: {required: true, message: '请输入参与者年龄段（中文）', trigger: 'blur'},
                    attenderGradleEn: {required: true, message: '请输入参与者年龄段（英文）', trigger: 'blur'},
                },

                list: [],
                file: null,
                tableHeader: [],

                addVisible: false,
                previewVisible: false,
                previewImgUrl: '',

                activityTp: null,
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
                        label: '活动编号',
                        prop: 'activityNo',
                        width: '300'
                    }, {
                        label: '中文名称',
                        prop: 'activityNmZh',
                        width: '400'
                    }, {
                        label: '英文名称',
                        prop: 'activityNmEn',
                        width: '600'
                    }, {
                        label: '活动类型',
                        prop: 'activityTpStr',
                    }, {
                        label: '报名截止时间',
                        prop: 'submitEndTs',
                        width: '300'
                    }, {
                        label: '报名人要求（中文）',
                        prop: 'attenderGradleZh',
                        width: '300'
                    }, {
                        label: '报名人要求（英文）',
                        prop: 'attenderGradleEn',
                        width: '400'
                    }, {
                        label: '竞赛主题（中文）',
                        prop: 'activityThemeZh',
                        width: '400'
                    }, {
                        label: '竞赛主题（中文）',
                        prop: 'activityThemeEn',
                        width: '600'
                    }, {
                        label: '竞赛奖励（中文）',
                        prop: 'prizeZh',
                        width: '400'
                    }, {
                        label: '竞赛奖励（英文）',
                        prop: 'prizeEn',
                        width: '600'
                    }, {
                        label: '操作',
                        prop: '',
                        width: '300',
                        slot: true,
                        slotArr: [
                            {
                                type: 'btn',
                                btnText: '活动描述',
                                action: 'detail'
                            }, {
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
                    url: 'activity/query',
                    params: {
                        activityTp: null,
                    }
                }).then(res => {
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
            edit(row) {
                this.form = {
                    activityNo: row.activityNo,
                    activityNmZh: row.activityNmZh,
                    activityNmEn: row.activityNmEn,
                    submitEndTs: row.submitEndTs,
                    activityTp: row.activityTp,
                    activityThemeZh: row.activityThemeZh,
                    activityThemeEn: row.activityThemeEn,
                    prizeZh: row.prizeZh,
                    prizeEn: row.prizeEn,
                    attenderGradleZh: row.attenderGradleZh,
                    attenderGradleEn: row.attenderGradleEn,
                    activityLogo: row.activityLogo
                }
                this.addVisible = true;
                this.activityTp = row.activityTp;
            },
            del(record) {
                warn('确认删除，删除后数据不可恢复？', () => {
                    Request({
                        url: 'activity/delete',
                        params: {
                            activityNo: record.activityNo
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
            handleChange(e) {
                this.file = e.target.files[0];
            },
            handleCancel() {
                this.addVisible = false;
                this.form = {
                    activityNmZh: '',
                    activityNmEn: '',
                    submitEndTs: '',
                    activityTp: '',
                    activityThemeZh: '',
                    activityThemeEn: '',
                    prizeZh: '',
                    prizeEn: '',
                    attenderGradleZh: '',
                    attenderGradleEn: '',
                }
                this.file = null;                
                this.$refs.file.value = '';
            },
            handleSubmit(e) {
                e.preventDefault();
                let file = this.file;
                if (file && file.size > 1024 * 1024) {
                    error('图片过大，请选择小于1M的图片!');
                    return;
                }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let form = this.form;
                        let params = this.getFormParams(form);
                        if (this.file) {
                            params.append('file', file);
                        }
                        let url = 'activity/add';
                        let msg = '新增成功!';
                        if (form.activityNo) {
                            url = 'activity/update';
                            msg = '修改成功!';
                        }
                        Request({
                            method: 'post',
                            url: url,
                            params: params,
                        }).then(res => {
                            if (res.code == 200) {
                                success(msg);
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
            Table,
        }
    }
</script>
<style lang="less" scoped>
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
            width: auto;
            height: auto;
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