<template>
    <div class="app_container">
        <CommonHeader :blue="true" />
        <div class="account app_content clearfix">
            <p class="account_title">{{$t('account.accountSetting')}}</p>
            <div class="account_list">
                <div class="left">
                    <p class="account_li">
                        <span class="account_li_label">{{$t('account.fullName')}}:</span>
                        <span class="account_li_value">{{userName}}</span>
                    </p>
                    <p class="account_li">
                        <span class="account_li_label">{{$t('common.email')}}:</span>
                        <span class="account_li_value">{{emailAddress}}</span>
                        <span v-show="emailAddress" class="account_edit" @click="showEditEmail">{{$t('account.edit')}}</span>
                    </p>
                    <div v-show="showEditEmailFlag" class="account_edit_wrap clearfix">
                        <span class="edit_label">{{$t('account.newEmail')}}:</span>
                        <input type="text" v-model="newEmail" />
                        <span class="edit_confirm" @click="editEmail">{{$t('account.confirm')}}</span>
                    </div>
                </div> 
                <div class="right">
                    <p class="account_li">
                        <span class="account_li_label">{{$t('common.password')}}:</span>
                        <span v-show="userName" class="account_li_value">******</span>
                        <span v-show="userName" class="account_edit" @click="showEditPass">{{$t('account.edit')}}</span>
                    </p>
                    <div v-show="showEditPassFlag" class="account_edit_wrap clearfix">
                        <span class="edit_label">{{$t('account.currentPassword')}}:</span>
                        <input type="password" v-model="currentPass" />
                        <span class="edit_label">{{$t('account.newPassword')}}:</span>
                        <input type="password" v-model="newPass" />
                        <span class="edit_confirm" @click="editPassworkd">{{$t('account.confirm')}}</span>
                    </div>
                </div>  
            </div>
        </div>
        <CommonFooter />
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {Request} from '@/api/request';
    import {isEmail, loginClear} from '@/assets/js/public';
    export default {
        data() {
            return {
                showEditEmailFlag: false,
                showEditPassFlag: false,
                currentPass: '',
                newPass: '',
                newEmail: '',

                userName: '',
                password: '',
                emailAddress: '',
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                Request({
                    url: 'userReg/selfInf',
                }).then(res => {
                    if (res.code == 200) {
                        let loginBean = res.loginBean;
                        let student = res.student;
                        this.emailAddress = loginBean.loginId;
                        this.userName = student.userNm;
                    }
                });
            },
            editEmail() {
            },
            editPassworkd() {
                let tip = this.checkPassword();
                if (tip) {
                    this.$message.error(tip);
                    return;
                }
                Request({
                    url: 'userReg/passwordReset',
                    params: {
                        password: this.newPass,
                        passwordOld: this.currentPass,
                    }
                }).then(res => {
                    if (res.code == 200) {
                        let tip = this.$i18n.locale == 'zh' ? '修改成功，请重新登录!' : 'edit success, please login again!';
                        this.$message.success(tip);
                        loginClear();
                        this.$store.dispatch('handleLoginModel', true);
                    }
                });
            },
            checkPassword() {
                let zh = this.$i18n.locale == 'zh';
                let passReg = /[(a-zA-Z){1,}\d{1,}]{6,18}/;
                if (!this.currentPass) {
                    return zh ? '请输入当前密码!' : 'please enter current password!';
                } else if (!passReg.test(this.currentPass)) {
                    return zh ? '密码必须由英文字母和数字组成，至少6位数!' : 'Password must be at least 6 characters, a combination of number and letters!';
                }
                if (!this.newPass) {
                    return zh ? '请输入新密码!' : 'please enter new password!';
                } else if (!passReg.test(this.newPass)) {
                    return zh ? '密码必须由英文字母和数字组成，至少6位数!' : 'Password must be at least 6 characters, a combination of number and letters!';
                }
                return false;
            },
            showEditPass() {
                this.showEditPassFlag = !this.showEditPassFlag;
                this.currentPass = '';
                this.newPass = '';
            },
            showEditEmail() {
                this.showEditEmailFlag = !this.showEditEmailFlag;
                this.newEmail = '';
            }
        },
        components: {
            CommonHeader,
            CommonFooter, 
        }
    }
</script>
<style lang="less" scoped>
    @defaultWidth: 700px;
    .account {
        margin: 20px auto;
        width: @defaultWidth;
        color: #000;
        .account_title {
            display: block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            font-size: 12px;
            color: #000;
            text-align: center;
            border-bottom: 1px solid #ccc;
            font-weight: bold;
        }
        .account_list {
            width: 100%;
            height: 280px;
            border-bottom: 1px solid #ccc;
            .account_li {
                width: 100%;
                height: 40px;
                line-height: 40px;
                font-size: 12px;
                span {
                    float: left;
                }
                .account_li_label {
                    width: 120px;
                    font-weight: bold;
                }
                .account_edit {
                    margin-left: 10px;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
            .left {
                float: left;
                width: 460px;
            }
            .right {
                float: right;
                width: 230px;
            }
            .account_edit_wrap {
                width: 220px;
                font-size: 12px;
                .edit_label {
                    display: block;
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                }
                input {
                    padding: 0 10px;
                    width: 170px;
                    height: 30px;
                    line-height: 30px;
                    font-size: 12px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                }
                .edit_confirm {
                    display: block;
                    height: 40px;
                    line-height: 40px;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
    }
</style>