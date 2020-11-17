<template>
    <div class="footer_wrap" :class="$i18n.locale=='zh' ? 'zh' : ''">
        <div class="footer_top">
            <div class="logo_wrap">
                <img class="logo_icon" src="../../assets/images/logo.png" />
                <span class="logo_name">{{$t('common.logoName')}}</span>
            </div>
            <div class="concat_wrap">
                <span class="concat_title">{{$t('footer.contactUs')}}</span>
                <!-- <span>{{$t('footer.phone')}}: +1(123) 456 789</span> -->
                <span>{{$t('footer.email')}}: inquires@eeduwin.com</span>
            </div>
            <div class="externals">
                <span class="externals_title">{{$t('footer.socialMedia')}}</span>
                <div class="externals_icons">
                    <img class="icon_external" v-for="img in externals" 
                        @click="toExternalUrl(img.url, img.type)"
                        :src="require(`../../assets/images/${img.imgName}`)">
                </div>
                <!-- 二维码弹窗 -->
                <div class="qrcode_wrap" v-show="showQrcodeFlag">
                    <img src="../../assets/images/edu_qrcode.png">
                    <span class="close" @click="hideQrcodeModel"></span>
                </div>
            </div>
        </div>
        <div class="footer_bottom">
            <span class="copyright">&copy; 2020 eEduWin, All Rights Reserved.</span>
            <span class="terms">Terms of Service</span>
            <span>Privacy Policy</span>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                externals: [],
                showQrcodeFlag: false,
            }
        },
        created() {
            this.setExternals();
        }, 
        methods: {
            setExternals() {
                this.externals = [
                    {
                        url: '',
                        imgName: 'icon_facebook.png',
                        type: 'facebook',
                    }, {
                        url: '',
                        imgName: 'icon_weixin.png',
                        type: 'weixin',
                    }, {
                        url: '',
                        imgName: 'icon_instagram.png',
                        type: 'instagram',
                    }
                    // , {
                    //     url: '',
                    //     imgName: 'icon_email.png',
                    //     type: 'email',
                    // }
                ]
            },
            toExternalUrl(url, type) {
                switch(type) {
                    case 'weixin': 
                        this.showQrcodeFlag = true;
                        break;
                    default: 
                        if (url) {
                            window.location.href = url;
                        }
                        break;
                }
            },
            hideQrcodeModel() { //隐藏二维码弹窗
                this.showQrcodeFlag = false;
            },
        },
    }
</script>
<style lang="less" scoped>
    @defaultColor: #303461;
    .footer_wrap.zh {
        .footer_top {
            .externals .externals_title, .concat_wrap .concat_title {
                font-size: 14px;
            }
            .logo_wrap .logo_name {
                font-size: 18px;
            }
        }
    }
    .footer_wrap {
        flex: 0 0 auto;
        width: 100%;
        height: 160px;
        background-color: @defaultColor;
        .footer_top {
            display: flex;
            justify-content: center;
            padding-top: 35px;
            box-sizing: border-box;
            width: 100%;
            height: 130px;
            background: #a8d0e6;
            .logo_wrap {
                float: left;
                width: 240px;
                height: 100%;
                .logo_icon {
                    float: left;
                    width: 64px;
                    height: 76px;
                }
                .logo_name {
                    float: left;
                    margin-left: 30px;
                    height: 60px;
                    line-height: 60px;
                    color: @defaultColor;
                    font-size: 14px;
                    font-weight: bold;
                }
            }
            .concat_wrap {
                position: relative;
                float: left;
                width: 290px;
                height: 100%;
                &:before {
                    position: absolute;
                    left: 0;
                    top: 15px;
                    content: '';
                    width: 2px;
                    height: 30px;
                    background-color: @defaultColor;
                    border-radius: 1px;
                }
                span {
                    float: left;
                    padding-left: 35px;
                    box-sizing: border-box;
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: @defaultColor;
                    &.concat_title {
                        font-weight: bold;
                    }
                }
            }
            .externals {
                position: relative;
                float: left;
                width: 120px;
                height: 100%;
                .externals_title {
                    display: block;
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    color: @defaultColor;
                    font-weight: bold;
                }
                .externals_icons {
                    margin-top: 10px;
                    width: 100%;
                    .icon_external {
                        float: left;
                        margin-left: 5px;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                }
                .qrcode_wrap {
                    position: absolute;
                    left: 30px;
                    top: -220px;
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
                        position: absolute;
                        right: -20px;
                        top: -20px;
                        display: block;
                        width: 20px;
                        height: 20px;
                        background: #fff url('../../assets/images/icon_close.png') no-repeat center;
                        background-size: 10px;
                        border-radius: 50%;
                        cursor: pointer;
                        border: 1px solid @defaultColor;
                    }
                }
            }
        }
        .footer_bottom {
            margin: 0 auto;
            width: 1000px;
            height: 30px;
            color: #fff;
            font-size: 12px;
            line-height: 30px;
            span {
                float: right;
                &.copyright {
                    float: left;
                }
                &.terms {
                    margin-left: 40px;
                }
            }
        }
    }
</style>
// position: absolute; bottom: 0;