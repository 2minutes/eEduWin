<template>
    <div v-if="showLoginFlag" class="shadow_wrap">
        <div class="content_base clearfix">
            <div class="header_login">
                <div class="content_title">{{pageType == 1 ? $t('login.signIn') : $t('login.forget')}}</div>

                <div v-show="pageType == 1" class="header_register">
                    <span>{{$t('login.newUser')}}?</span>
                    <span class="header_right" @click="showRegisterModel">{{$t('login.create')}}</span>
                </div>
                
                <div class="header_input_wrap">
                    <input v-model="userName" :placeholder="$t('common.email')" type="text" @blur="userNameBlur"></input>
                </div>

                <div v-show="pageType != 2" class="header_input_wrap">
                    <input v-model="password" 
                        :placeholder="forgetFlag ? $t('account.newPassword') : $t('common.password')" type="password"></input>
                </div>

                <div v-show="pageType != 3" class="header_input_wrap">
                    <input v-model="code" :placeholder="$t('common.code')" class="code" type="text"></input>
                    <img v-if="codeSrc" class="captcha_img" 
                        @click="getCaptcha" 
                        :src="'data:image/jpg;base64,' + codeSrc" />
                    <span v-else class="captcha_text" 
                        @click="getCaptcha"
                        >{{$t('common.getCaptcha')}}</span>
                </div>

                <div v-if="pageType == 3" class="header_input_wrap">
                    <input v-model="mailCode" :placeholder="$t('login.emailCode')" class="code" type="text"></input>
                    <span class="captcha_text" 
                        @click="resendCode"
                        >{{$t('login.resend')}}</span>
                </div>

                <div v-show="pageType == 1" class="login-checkbox">
                    <label for="remember">
                        <input id="remember" type="checkbox" v-model="remember" />
                        {{$t('login.rememberMe')}}
                    </label>
                    
                    <span @click="forgetClick">{{$t('login.forget')}}?</span>
                </div>

                <p class="login_btn" 
                    :class="{'send': pageType == 2, 'reset': pageType == 3}"
                    @click="submit">
                    {{pageType == 1 ? $t('login.signIn') : (pageType == 2 ? $t('login.submit') : $t('login.reset'))}}
                </p>
                <!-- <div class="login_other">
                    <span>{{$t('login.signWith')}}</span>
                </div>
                <div class="externals">
                    <img class="icon_external" v-for="img in externalsArr" 
                        @click="clickExternal(img.type)"
                        :src="require(`../../assets/images/${img.imgName}`)">
                </div> -->
            </div>
            <span class="close" @click="closeLoginModel"></span>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {Request} from '@/api/request';
    import {isEmail, loginSave, encodeStr, decodeStr, isPassword} from '@/assets/js/public';
    export default {
        data() {
            return {
                pageType: 1, //页面类型，1登录，2忘记密码发送邮件，3重置密码
                userName: '',
                remember: '',
                password: '',
                externalsArr: [],
                codeSrc: '',//验证码
                code: '',
                mailCode: '',

                forgetFlag: false, //忘记密码
            }
        },
        created() {
            // this.setExternals();
        },
        methods: {
            getCaptcha() {//获取验证码
                if (!this.userName) {
                    this.$message.error(this.$t('error.emailEmpty'));
                    return;
                }
                if (!isEmail(this.userName)) {
                    this.$message.error(this.$t('error.emailIncorrect'));
                    return;
                }
                let url = 'login/captcha';
                if (this.pageType != 1) {
                    url = 'userReg/captcha';
                }
                Request({
                    url: url,
                    params: {
                        loginId: this.userName
                    },
                }).then(res => {
                    if (res.code == 200) {
                        this.codeSrc = res.msg;
                        this.code = '';
                    }
                });
            },
            getEmailCaptcha() {//获取邮箱验证码
                Request({
                    url: 'account/mailCode',
                    params: {
                        mailAddress: this.userName,
                        verifyCode: this.code,
                    }
                }).then(res => {
                    if (res.code == 200) {
                        this.$message.success(this.zh ? '请查看您的邮箱，通过邮箱里收到的验证码来重置密码!' : 'Please check your e-mail, use the verification code in your inbox to reset the password!');
                        this.mailCode = '';
                        this.code = '';
                        this.codeSrc = '';
                        this.pageType = 3;
                    }
                });
            },
            userNameBlur() {//用户输入完邮箱自动获取验证码
                if (this.userName && isEmail(this.userName) && !this.codeSrc) {
                    this.getCaptcha();
                }
            },

            setExternals() {
                this.externalsArr = [
                    {
                        type: 'weixin',
                        imgName: 'weixin_Img.png',
                    },{
                        type: 'facebook',
                        imgName: 'weibo_Img.png',
                    }
                ]
            },
            clickExternal(type) {
                switch(type) {
                    case 'weixin': 
                        break;
                    case 'facebook': 
                        break;
                }
            },

            submit() {
                let tip = this.checkSign();
                if (tip) {
                    this.$message.error(tip);
                    return;
                }
                switch(this.pageType) {
                    case 1: 
                        this.handleLogin();
                        break;
                    case 2: 
                        this.getEmailCaptcha();
                        break;
                    case 3:
                        this.handleForget();
                        break;
                }
            },
            handleLogin() {//登录 
                Request({
                    url: 'login/login',
                    params: {
                        loginId: this.userName,
                        loginPwd: this.password,
                        verifyCode: this.code,
                    }
                }).then(res => {
                    if (res.code == 200) {
                        this.$message.success('登录成功!');
                        this.$store.dispatch('handleLoginModel', false);
                        loginSave(res.token, res.userNm);
                        if (this.remember) {
                            localStorage.setItem(window.btoa('email'), encodeStr(this.userName, true));
                            localStorage.setItem(window.btoa('pass'), window.btoa(this.password));
                        } else {
                            localStorage[window.btoa('email')] = '';
                            localStorage[window.btoa('pass')] = '';
                        }
                        this.reset();
                        this.afterLogin();
                    } else {
                        this.getCaptcha();
                    }
                });
            },
            handleForget() {
                Request({
                    url: 'account/passwordReset',
                    params: {
                        mailAddress: this.userName,
                        verifyCode: this.mailCode,
                        password: this.password
                    }
                }).then(res => {
                    if (res.code == 200) {
                        this.$message.success(this.zh ? '重置密码成功，请登录!' : 'Password reset successful, please continue to login!');
                        this.pageType = 1;
                        this.getCaptcha();
                        this.code = '';
                        this.codeSrc = '';
                    }
                });
            },
            checkSign() {
                let zh = this.zh;
                if (!this.userName) {
                    return zh ? '请输入邮箱地址!' : 'please enter Email Address!';
                }
                if (!this.password && this.pageType != 2) {
                    return zh ? '请输入密码!' : 'please enter password!';
                }
                if (!isEmail(this.userName)) {
                    return zh ? '请输入正确的邮箱地址!' : 'please enter the correct Email Address';
                }
                if (!isPassword(this.password) && this.pageType != 2) {
                    return zh ? '密码必须由英文字母、数字、特殊字符组成，至少6位数!' : 'Password must be at least 6 characters, a combination of number, letters and special characters!';
                }
                if (!this.code && this.pageType != 3) {
                    return zh ? '请输入验证码!' : 'please enter the code';
                }
                if (!this.mailCode && this.pageType == 3) {
                    return zh ? '请输入邮箱验证码!' : 'please enter the email code';
                }
                return false;
            },

            closeLoginModel() {//关闭联系我们弹窗
                this.reset();
                this.pageType = 1;
                this.$store.dispatch('handleLoginModel', false);
            },
            showRegisterModel() {
                this.$store.dispatch('handleLoginModel', false);
                this.reset();
                this.$store.dispatch('handleRegisterModel', true);
            },
            reset() {
                this.userName = '';
                this.password = '';
                this.code = '';
                this.codeSrc = '';
            },

            toAccount() {//忘记密码
                this.$store.dispatch('handleLoginModel', false);
                this.$router.push({
                    path: '/account',
                });
            },
            afterLogin() {
                let routeName = this.$route.name;
                switch(routeName) {
                    case 'account':
                        this.$router.replace({
                            path: '/'
                        });
                        break;
                }
            },

            forgetClick() {
                this.pageType = 2;
                if (isEmail(this.userName)) {
                    this.getCaptcha();
                }
                this.code = '';
                this.emailCode = '';
            },
            resendCode() {
                this.pageType = 2;
                if (isEmail(this.userName)) {
                    this.getCaptcha();
                }
                this.code = '';
                this.codeSrc = '';
            },
        },
        watch: {
            showLoginFlag(newVal, oldVal) {
                if (newVal ) {
                    let userName = localStorage[window.btoa('email')];
                    let password = localStorage[window.btoa('pass')];
                    if (userName && password) {
                        this.remember = true;
                        this.userName = decodeStr(userName, true);
                        this.password = window.atob(password);
                        this.getCaptcha();
                    }
                }
            }
        },
        computed: {
            ...mapGetters([
                'showLoginFlag',
            ]),
            zh() {
                return this.$i18n.locale = 'zh';
            }
        }
    }
</script>
<style lang="less" scoped>
    @defaultColor: #A8D0E6;
    @clientWidth: 100vw;
    @clientHeight: 100vh;
    .content_base {
        position: relative;
        padding: 40px 40px 40px;
        margin: 100px auto;
        width: 800px;
        min-height: 420px;
        background: #a7d1e5 url('../../assets/images/login_right_img.png') no-repeat 450px 60px;
        background-size: 280px 340px;
        color: #25315E;
        .header_login {
            width: 370px;
            .content_title {
                height: 56px;
                line-height: 50px;
                font-size: 24px;
                font-weight: bold;
            }
            .header_register {
                margin-bottom: 20px;
                width: 100%;
                span{
                    font-size: 14px;
                    font-weight: bold;
                    &.header_right {
                        cursor: pointer;
                        color: #587FFF;
                    }
                }
            }
            .header_input_wrap {
                margin-bottom: 15px;
                width: 280px;
                height: 40px;
                input {
                    padding: 0 5px;
                    float: left;
                    margin-right: 15px;
                    width: 280px;
                    height: 40px;
                    font-size: 16px;
                    color: #24335f;
                    border: 2px solid #24335f;
                    &.code {
                        width: 130px;
                    }
                }
                .captcha_text, .captcha_img {
                    display: inline-block;
                    width: 130px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                    color: #24335f;
                    text-decoration: underline;
                    cursor: pointer;
                    font-weight: bold;
                }
                .captcha_img {
                    width: 110px;
                }
            }

            .header_userinput input {
                padding: 0 5px;
                width: 280px;
                height: 40px;
                margin-top: 20px;
                margin-bottom: 10px;
                font-size: 16px;
                color: #24335f;
                border: 2px solid #24335f;
            }
            .login-checkbox {
                margin-bottom: 20px;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                span {
                    padding-right: 85px;
                    float: right;
                    color: #587FFF;
                }
            }
            .login_btn {
                width: 280px;
                height: 40px;
                line-height: 40px;
                font-size: 18px;
                font-weight: bold;
                color: #fff;
                background-color: #24335f;
                text-align: center;
                cursor: pointer;
                &.send {
                    margin-top: 150px;
                }
                &.reset {
                    margin-top: 95px;
                }
            }
            .login_other {
                margin-top: 30px;
                position: relative;
                width: 280px;
                height: 30px;
                border-top: 2px solid #24335f;
                span {
                    position: absolute;
                    left: 50%;
                    top: -20px;
                    transform: translateX(-50%);
                    padding: 0 10px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 12px;
                    font-weight: bold;
                    color: #24335f;
                    background: #a7d1e5;
                }
            }
            .externals {
                float: left;
                margin-left: 80px;
                width: 100%;
                height: 60px;
                .icon_external {
                    float: left;
                    margin-left: 10px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 1px solid #25315e;
                }
            }
        }
    }
    .close {
        position: absolute;
        top: 35px;
        right: 35px;
        display: block;
        width: 20px;
        height: 20px;
        background: #fff url('../../assets/images/icon_close.png') no-repeat center;
        background-size: 10px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid #25315e;
    }
</style>