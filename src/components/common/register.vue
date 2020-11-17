<template>
    <div v-if="showRegisterFlag" class="shadow_wrap">
        <div class="content_register clearfix">
            <div class="header_register_base">
                <div class="content_title">{{$t('register.create')}}</div>
                <div class="header_register">
                    <span class="header_left">{{$t('register.already')}}?</span>
                    <span class="header_right" @click="showLoginModel">{{$t('login.signIn')}}</span>
                </div>

                <div class="header_input_wrap">
                    <input v-model.trim="userName" :placeholder="$t('common.userName')" type="text" />
                </div>

                <div class="header_input_wrap">
                	<input v-model.trim="email" :placeholder="$t('common.email')" type="text" @blur="emailBlur" />
                </div>

                <div class="header_input_wrap">
                    <input v-model.trim="password" :placeholder="$t('common.password')" type="password"></input>
                </div>
                <div class="header_input_wrap">
                    <input v-model.trim="confirmPassword" :placeholder="$t('common.confirmPassword')" type="password"></input>
                </div>
                <div class="header_input_wrap">
                    <input v-model="code" :placeholder="$t('common.code')" class="code" type="text"></input>
                    <img v-if="codeSrc" class="captcha_img" 
                        @click="getCaptcha" 
                        :src="'data:image/jpg;base64,' + codeSrc" />
                    <span v-else class="captcha_text" 
                        @click="getCaptcha"
                        >{{$t('common.getCaptcha')}}</span>
                </div>
                <p class="register_btn button" @click="signUp">{{$t('register.signUp')}}</p>

                <!-- <div class="login_other">
                    <span>{{$t('login.signWith')}}</span>
                </div>
                <div class="externals">
                    <img class="icon_external" v-for="img in externalsArr"
                        @click="clickExternal(img.type)"
                        :src="require(`../../assets/images/${img.imgName}`)">
                </div> -->
            </div>
            <span class="close" @click="hideRegisterModel"></span>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {Request} from '@/api/request';
    import {isEmail, isPassword} from '@/assets/js/public';
    export default {
        data() {
            return {
                loading: false,
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                externalsArr: [],
                errTip: '',
                codeSrc: '',//验证码
                code: '',
            }
        },
        created() {
        },
        methods: {
            getCaptcha() {
                if (!this.email) {
                    this.$message.error(this.zh ? '请输入邮箱地址!' : 'please enter email');
                    return;
                }
                if (!isEmail(this.email)) {
                    this.$message.error(this.zh ? '邮箱地址错误' : 'please enter the correct Email Address');
                    return;
                }
                Request({
                    url: 'userReg/captcha',
                    params: {
                        loginId: this.email
                    },
                }).then(res => {
                    if (res.code == 200) {
                        this.codeSrc = res.msg;
                        this.code = '';
                    }
                });
            },
            signUp() {//注册
                let errTip = this.checkSign();
                if (errTip) {
                    this.$message.error(errTip);
                    return;
                }
                let params = {
                    userNm: this.userName,
                    mailAddress: this.email,
                    password: this.password,
                    verifyCode: this.code,
                };
                Request({
                    url: 'userReg/mailReg',
                    params: params,
                }).then(res => {
                    if (res.code != 200) {
                        this.$message.error(res.msg);
                        this.getCaptcha();
                    } else {
                        this.$message.success(this.zh ? '注册成功，请前往邮箱验证!' : 'register success, please go to email for verification!');
                        this.$store.dispatch('handleRegisterModel', false);
                    }
                });
            },
            checkSign() {
                let zh = this.zh;
                if (!this.userName) {
                    return zh ? '请输入用户名!' : 'please enter Full Name!';
                }
                if (!this.email) {
                    return zh ? '请输入邮箱地址!' : 'please enter Email Address!';
                }
                if (!this.password) {
                    return zh ? '请输入密码!' : 'please enter password!';
                }
                if (!this.confirmPassword) {
                    return zh ? '请输入确认密码!' : 'please enter confirm password!';
                }
                if (!isEmail(this.email)) {
                    return zh ? '请输入正确的邮箱地址!' : 'please enter the correct Email Address';
                }
                if (!isPassword(this.password) || !isPassword(this.confirmPassword)) {
                    return zh ? '密码必须由英文字母、数字、特殊字符组成，至少6位数!' : 'Password must be at least 6 characters, a combination of number, letters and special characters!';
                }
                if (this.password != this.confirmPassword) {
                    return zh ? '密码和确认密码不一致!' : 'The password and confirmation password do not match!';
                }
                if (!this.code) {
                    return zh ? '请输入验证码!' : 'please enter the code';
                }
                return false;
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
            hideRegisterModel() {//关闭注册弹窗
                this.$store.dispatch('handleRegisterModel', false);
            },
            showLoginModel() {//去登录
                this.$store.dispatch('handleRegisterModel', false);
                this.$store.dispatch('handleLoginModel', true);
            },

            emailBlur() {
                if (this.email && isEmail(this.email) && !this.codeSrc) {
                    this.getCaptcha();
                }
            }
        },
        computed: {
            ...mapGetters(['showRegisterFlag']),
            zh() {
                return this.$i18n.locale == 'zh';
            }
        }
    }
</script>
<style lang="less" scoped>
    @defaultColor: #A8D0E6;
    @clientWidth: 100vw;
    @clientHeight: 100vh;
    .content_register {
        position: relative;
        padding: 40px 40px 40px;
        margin: 100px auto;
        width: 800px;
        background: #a7d1e5 url('../../assets/images/register_right_Img.png') no-repeat 470px 100px;
        background-size: 280px 300px;
        color: #25315E;
        z-index: 10;
        .header_register_base {
            width: 370px;
            .header_input_wrap {
                margin-bottom: 15px;
                width: 280px;
                height: 40px;
                input {
                    float: left;
                    padding: 0 5px;
                    width: 280px;
                    height: 40px;
                    font-size: 16px;
                    color: #24335f;
                    border: 2px solid #24335f;
                    &.firstname, &.lastname, &.code {
                        margin-right: 15px;
                        width: 130px;
                    }
                    &.lastname {
                        margin-right: 0;
                    }
                }
                .captcha_text, .captcha_img {
                    float: left;
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
            .content_title {
                margin-bottom: 15px;
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
                        color: #587FFF;
                        cursor: pointer;
                    }
                }
            }
            .register_btn {
                width: 280px;
                height: 40px;
                line-height: 40px;
                background: #24335f;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                color: #ffffff;
                cursor: pointer;
                border-radius: 2px;
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
                width: 100%;
                float: left;
                margin-left: 80px;
                height: 60px;
                .icon_external {
                    float: left;
                    margin-left: 10px;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 1px solid #24335f;
                }
            }
            .header_code {
                width: 280px;
                height: 40px;
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