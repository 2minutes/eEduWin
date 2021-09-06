<template>
    <div v-show="showContactFlag" class="shadow_wrap">
        <div class="contact_wrap clearfix">
            <div class="contact_left">
                <div class="logo_wrap">
                    <img class="logo_icon" src="../../assets/images/logo.png" />
                    <span class="logo_name">{{$t('common.logoName')}}</span>
                </div>
                <div class="contact_cont clearfix">
                    <div class="contact_cont_title">{{$t('contact.contactUs')}}</div>
                    <div class="contact_form clearfix">
                        <p class="form_item">
                            <span class="label">{{$t('contact.name')}}*</span>
                            <input type="text" v-model="form.userNm" name="">
                        </p>

                        <p class="form_item">
                            <span class="label">{{$t('common.email')}}*</span>
                            <input type="text" v-model="form.email" name="">
                        </p>

                        <p class="form_item">
                            <span class="label">{{$t('contact.phone')}}*</span>
                            <input type="number" v-model="form.mobile" name="">
                        </p>

                        <p class="form_item">
                            <span class="label">{{$t('contact.captcha')}}*</span>
                            <input type="number" v-model="form.verifyCode" name="">
                            <img v-if="codeSrc" class="captcha_img" 
                                @click="getCaptcha" 
                                :src="'data:image/jpg;base64,' + codeSrc" />
                            <span v-else class="captcha_text" 
                                @click="getCaptcha"
                                >{{$t('common.getCaptcha')}}</span>
                        </p>

                        <p class="form_item">
                            <span class="label">{{$t('contact.inquiry')}}</span>
                            <select v-model="form.messageType">
                                <option value="0">{{$t('contact.coursesServices')}}</option>
                                <option value="1">{{$t('contact.generalQuestionComment')}}</option>
                                <option value="2">{{$t('contact.recruitmentAvailablePositions')}}</option>
                            </select>
                        </p>

                        <p class="form_item comment">
                            <span class="label">{{$t('contact.generalQuestionComment')}}*</span>
                            <textarea type="text" v-model="form.message" name=""/>
                        </p>

                        <p class="form_submit_wrap">
                            <span @click="submit">{{$t('contact.submit')}}</span>
                            <!-- <b>Please fill in the fields bellow: *=Required</b> -->
                        </p>
                    </div>
                </div>
            </div>

            <!-- <div class="contact_right">
                <div class="follow">
                    <span>{{$t('contact.follow')}}</span>
                    <div class="externals">
                        <img class="icon_external" v-for="img in externals" 
                            @click="clickExternal(img.type)"
                            :src="require(`../../assets/images/${img.imgName}`)">
                    </div>
                </div>
            </div> -->
            <span class="close" @click="closeContactModel"></span>
            <!-- 二维码弹窗 -->
            <div class="qrcode_wrap" v-show="qrcodeModelFlag">
                <img src="../../assets/images/edu_qrcode.png">
                <span class="close" @click="hideQrcodeModel"></span>
            </div>
        </div>
        <el-dialog class="contact_modal" :visible.sync="resultVisible"
            :footer="null" @cancel="handleCancel">
            <i class="el-icon-success success result_icon"></i>
            <p v-show="zh">谢谢您与我们联系！我们会尽快回复。</p>
            <p v-show="!zh">Thank you for contacting us!</p>
            <p v-show="!zh">We will back to you soon.</p>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {Request} from '@/api/request';
    import {isEmail, error} from '@/assets/js/public';
    export default {
        data() {
            return {
                externals: [],
                qrcodeModelFlag: false,
                form: {
                    userNm: '',
                    email: '',
                    mobile: '',
                    messageType: '',
                    message: '',
                    verifyCode: '',
                },
                codeSrc: '',

                resultVisible: false,
            }
        },
        created() {
            this.reset();
        },
        methods: {
            setExternals() {
                this.externals = [
                    {
                        type: 'facebook',
                        imgName: 'icon_facebook.png',
                    }, {
                        type: 'weixin',
                        imgName: 'icon_weixin.png',
                    }, {
                        type: 'eduwin',
                        imgName: 'icon_instagram.png',
                    }
                ]
            },
            clickExternal(type) {
                switch(type) {
                    case 'weixin': 
                        this.qrcodeModelFlag = true;
                        break;
                    case 'facebook': 
                        break;
                    case 'eduwin':
                        break;
                }
            },
            handleCancel() {
                this.closeContactModel();
                this.resultVisible = false;
            },

            getCaptcha() {
                if (!this.form.mobile) {
                    error(this.zh ? '请输入手机号!' : 'please enter phone!');
                    return;
                }
                Request({
                    url: 'msg/captcha',
                    params: {
                        mobile: this.form.mobile
                    }
                }).then(res => {
                    if (res.code == 200) {
                        this.codeSrc = res.msg;
                        this.form.verifyCode = '';
                    }
                });
            },
            submit() {
                let tip = this.check();
                if (tip) {
                    error(tip);
                    return;
                }
                Request({
                    url: 'msg/add',
                    params: this.form
                }).then(res => {
                    if (res.code == 200) {
                        this.resultVisible = true;
                    }
                })
            },
            reset() {
                this.form = {
                    userNm: '',
                    email: '',
                    mobile: '',
                    messageType: '',
                    message: '',
                    verifyCode: '',
                };
            },
            check() {
                let form = this.form;
                let zh = this.zh;
                if (!form.userNm) {
                    return zh ? '请输入您的姓名!' : 'please enter you name!';
                }
                if (!form.email) {
                    return zh ? '请输入您的邮箱地址!' : 'please enter you email address!';
                }
                if (!isEmail(form.email)) {
                    return zh ? '请输入正确的邮箱地址!' : 'please enter the correct Email Address!';
                }
                if (!form.mobile) {
                    return zh ? '请输入您的手机号!' : 'please enter your phone number!';
                }
                if (!form.verifyCode) {
                    return zh ? '请输入验证码!' : 'please enter captcha!';
                }
                if (form.messageType === '') {
                    return zh ? '请选择咨询类别!' : 'please choose inquiry type!';
                }
                if (!form.message) {
                    return zh ? '请输入咨询内容!' : 'please enter your question or comment!';
                }
                return '';
            },

            closeContactModel() {//关闭联系我们弹窗
                this.reset();
                this.$store.dispatch('handleContactModel', false);
            },
            hideQrcodeModel() { //隐藏二维码弹窗
                this.qrcodeModelFlag = false;
            },
            prevent() {},
        },
        computed: {
            ...mapGetters(['showContactFlag']),
            zh() {
                return this.$i18n.locale == 'zh';
            }
        }
    }
</script>
<style lang="less" scoped>
    @defaultColor: #25315e;
    @clientWidth: 100vw;
    @clientHeight: 100vh;
    .contact_wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 20px 40px;
        width: 900px;
        height: 520px;
        background: #a8d0e6 url('../../assets/images/contact_img.png') no-repeat right 66px top 0;
        background-size: 300px 370px;
        color: @defaultColor;
        z-index: 10;
        .logo_wrap {
            width: 100%;
            height: 60px;
            .logo_icon {
                float: left;
                width: 50px;
                height: 60px;
            }
            .logo_name {
                margin-left: 10px;
                height: 60px;
                line-height: 60px;
                color: @defaultColor;
                font-size: 16px;
                font-weight: bold;
            }
        }
        .contact_cont {
            margin-left: 60px;
            width: 470px;
            height: 80px;
            .contact_cont_title {
                width: 100%;
                height: 50px;
                line-height: 50px;
                font-size: 20px;
                font-weight: bold;
                border-bottom: 2px solid @defaultColor;
            }
            .contact_form {
                .form_item {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    width: 100%;
                    height: 30px;
                    &.comment {
                        height: 110px;
                    }
                    .label {
                        float: left;
                        width: 134px;
                        line-height: 26px;
                        font-size: 12px;
                        color: @defaultColor;
                        font-weight: bold;
                        &.name {
                            width: 80px;
                        }
                    }
                    input, textarea, select {
                        float: left;
                        padding: 0 5px;
                        box-sizing: border-box;
                        width: 160px;
                        height: 30px;
                        line-height: 30px;
                        border: 1px solid @defaultColor;
                        border-radius: 2px;
                        outline: none;
                        &.name {
                            margin-right: 10px;
                            width: 75px;
                        }
                    }
                    select {
                        width: 274px;
                        line-height: 20px;
                    }
                    textarea {
                        width: 274px;
                        height: 99px;
                        resize: none;
                    }
                    .captcha_text, .captcha_img {
                        float: left;
                        margin-left: 20px;
                        width: 130px;
                        height: 30px;
                        line-height: 30px;
                        font-size: 14px;
                        color: #24335f;
                        text-decoration: underline;
                        cursor: pointer;
                        font-weight: bold;
                    }
                    .captcha_img {
                        width: 90px;
                    }
                }
                .form_submit_wrap {
                    margin-left: 134px;
                    width: 274px;
                    height: 24px;
                    span {
                        float: left;
                        width: 100px;
                        height: 30px;
                        line-height: 30px;
                        font-size: 12px;
                        font-weight: bold;
                        text-align: center;
                        color: #fff;
                        background: @defaultColor;
                        border-radius: 2px;
                        cursor: pointer;
                    }
                    b {
                        float: left;
                        width: 195px;
                        height: 24px;
                        line-height: 24px;
                        font-size: 12px;
                        text-align: right;
                        font-weight: normal;
                    }
                }
            }
        }
    }
    .contact_left {
        float: left;
        width: 540px;
    }
    .contact_right {
        float: left;
        margin-top: 390px;
        width: 280px;
        .follow {
            width: 100%;
            height: 60px;
            span {
                float: left;
                width: 140px;
                height: 60px;
                line-height: 60px;
                font-size: 12px;
                font-weight: bold;
                color: @defaultColor;
            }
            .externals {
                float: left;
                padding-top: 15px;
                height: 60px;
                .icon_external {
                    float: left;
                    margin-left: 5px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
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
        border: 1px solid @defaultColor;
    }
    .qrcode_wrap {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 240px;
        height: 240px;
        background: #fff;
        border-radius: 5px;
        img {
            margin: 20px;
            width: 200px;
            height: 200px;
        }
        .close {
            right: -20px;
            top: -20px;
        }
    }
    .contact_modal {
        .result_icon {

        }
    }
</style>