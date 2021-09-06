<template>
	<div class="app_container">
        <CommonHeader :blue="true" />
        <div class="breadcrumb" >
            <span @click="toPage('/')">{{zh ? '首页' : 'Home'}}</span>
            <i></i>
            <span @click="toPage('/enhancement')">{{$t('header.enhancement')}}</span>
            <i></i>
            <span>{{zh ? detail.activityNmZh : detail.activityNmEn}}</span>
        </div>

        <div class="detail_wrap app_content"
            :class="{'competition': pageType == 0}">
	        <p class="detail_title">{{zh ? detail.activityNmZh : detail.activityNmEn}}</p>

	        <p v-if="pageType == 0" class="detail_desc">[{{$t('enhaDetail.theme')}}]: {{zh ? detail.activityThemeZh : detail.activityThemeEn}}</p>

	        <div class="detail_dates clearfix">
	        	<!-- <div class="detail_date left">
	        		<span>{{$t('enhaDetail.submissionDeadline')}}:</span>
	        		<b>{{zh ? detail.submitEndTsCn : detail.submitEndTsEn}}</b>
	        	</div> -->
	        	<div class="detail_date right">
	        		<span>{{$t('enhaDetail.participants')}}:</span>
	        		<b>{{zh ? detail.attenderGradleZh : detail.attenderGradleEn}}</b>
                    <img class="back" src="../assets/images/icon_cap.png" alt="">
	        	</div>
	        </div>

        	<div v-if="pageType == 0" class="guidance_wrap clearfix">
        		<p class="guidance_left">{{$t('enhaDetail.submissionGuidance')}}:</p>
        		<ul class="guidance_right clearfix">
        			<li v-for="(guid, guidIdx) in (zh ? detail.guidanceCn : detail.guidanceEn)"
                        :key="guidIdx">{{`${guidIdx + 1}) ${guid}`}}</li>
        		</ul>
        	</div>

            <div v-if="pageType == 1" class="volun_wrap clearfix">
                <p class="clearfix">
                    <b>{{$t('enhaDetail.duration')}}：</b>
                    <span>{{zh ? detail.durationCn : detail.durationEn}}</span>
                </p>
                <p class="clearfix">
                    <b>{{$t('enhaDetail.descriptions')}}：</b>
                    <span>{{zh ? detail.descCn : detail.descEn}}</span>
                </p>
                <p class="clearfix">
                    <b>{{$t('enhaDetail.signUpDetails')}}：</b>
                    <span>{{zh ? detail.signUpCn : detail.signUpEn}}</span>
                </p>
            </div>

        </div>
        <div :hidden="pageType == null || pageType == 1" class="detail_price_wrap">
            <p class="price_title">PRIZE:</p>
            <p class="price_list" v-for="(prize, prizeIdx) in (zh ? detail.prizeCn : detail.prizeEn)">{{prize}}</p>
           <img src="../assets/images/enha_bg_icon.png" />
        </div>
        <CommonFooter />
	</div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    import {Request} from '@/api/request';
    import {formatActivityDate} from '@/assets/js/public';
	export default {
        data() {
            return {
                pageType: null, //0竞赛，1志愿者活动
                activityNo: '',
                detail: {},
            }
        },
        created() {
            let query = this.$route.query;
            if (query.ano) {
                this.activityNo = query.ano;
                this.initData();
            }
        },
        methods: {
            initData() {
                Request({
                    url: 'activity/query',
                    params: {
                        activityNo: this.activityNo
                    },
                }).then(res => {
                    if (res.code == 200) {
                        let detail = res.activities.length ? res.activities[0] : {};
                        let formatedDate = formatActivityDate(detail.submitEndTs);
                        detail.submitEndTsCn = formatedDate.dateCn;
                        detail.submitEndTsEn = formatedDate.dateEn;
                        let desc = this.formatActivityDesc(detail.activityDescs);
                        Object.assign(detail, desc);
                        if (detail.activityTp === '0') {
                            detail.prizeCn = detail.prizeZh.split('#');
                            detail.prizeEn = detail.prizeEn.split('#');
                        }
                        this.detail = detail;
                        this.pageType = detail.activityTp;
                    }
                });
            },
            formatActivityDesc(descList) {
                let descObj = {};
                for(var key in descList) {
                    let item = descList[key];
                    switch(item.showRank) {
                        case '1':
                            descObj.guidanceCn = item.activityDescCn.split('#');
                            descObj.guidanceEn = item.activityDescEn.split('#');
                            break;
                        case '2':
                            descObj.durationCn = item.activityDescCn;
                            descObj.durationEn = item.activityDescEn;
                            break;
                        case '3':
                            descObj.descCn = item.activityDescCn;
                            descObj.descEn = item.activityDescEn;
                            break;
                        case '4':
                            descObj.signUpCn = item.activityDescCn;
                            descObj.signUpEn = item.activityDescEn;
                            break;
                    }
                }
                return descObj;
            },
            toPage(url) {
                this.$router.replace({
                    path: url
                });
            },
        },
        components: {
            CommonHeader,
            CommonFooter,
        },
        computed: {
            zh() {
                return this.$i18n.locale == 'zh';
            }
        }
	}
</script>
<style lang="less" scoped>
    @defaultColor: #303461;
    @defaultWidth: 1000px;
    @defaultHeight: 600px;
    .breadcrumb {
        margin: 0 auto;
        width: @defaultWidth;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        color: #7c7c7c;
        span {
            float: left;
            cursor: pointer;
        }
        i {
            float: left;
            margin-top: 5px;
            margin-left: 4px;
            margin-right: 8px;
            width: 8px;
            height: 8px;
            border-top: 1px solid #7c7c7c;
            border-left: 1px solid #7c7c7c;
            transform: rotate(135deg);
        }
    }
    .detail_wrap {
    	margin: 0 auto;
    	width: @defaultWidth;
        flex-shrink: 0;
        &.competition {
            background: url('../assets/images/icon_plane_blue.png') no-repeat right 270px;
            background-size: 188px 90px;
        }
	    .detail_title {
	    	width: @defaultWidth;
	    	line-height: 50px;
	    	font-size: 30px;
	    	color: #000;
	    	font-weight: bold;
	    }
	    .detail_desc {
	    	width: 580px;
	    	line-height: 18px;
	    	font-size: 12px;
	    	color: #6d6d6d;
	    }
	    .detail_dates {
	    	margin-top: 20px;
	    	width: 740px;
	    	min-height: 66px;
	    	line-height: 66px;
	    	color: #0f1646;
            font-size: 12px;
	    	.detail_date {
                display: flex;
	    		padding: 15px;
	    		float: left;
	    		width: auto;
                max-width: 1000px;
                line-height: 30px;
                background: #d8e6f1;
                .back {
                    float: left;
                    margin-left: 10px;
                    width: 44px;
                    height: 36px;
                }
	    		// &.left {
	    		// 	margin-right: 10px;
                //     background: #d8e6f1 url('../assets/images/icon_calendar.png') no-repeat 290px center;
                //     background-size: 40px 40px;
	    		// }
                // &.right {
                //     background: #d8e6f1 url('../assets/images/icon_cap.png') no-repeat 280px center;
                //     background-size: 44px 36px;
                // }
	    		span {
	    			float: left;
	    			margin-right: 20px;
	    		}
	    		b {
	    			float: left;
                    line-height: 30px;
	    		}
	    	}
	    }
	    .guidance_wrap {
	    	margin-top: 5px;
	    	padding: 20px 20px 0;
	    	box-sizing: border-box;
	    	width: 740px;
            min-height: 300px;
	    	background: #d8e6f1 url('../assets/images/icon_ionic_md.png') no-repeat 650px 20px;
            background-size: 46px 40px;
	    	.guidance_left {
	    		float: left;
	    		width: 160px;
	    		line-height: 20px;
	    		font-size: 14px;
	    		color: #121845;
	    	}
	    	.guidance_right {
	    		float: left;
	    		width: 460px;
	    		li {
	    			margin-bottom: 20px;
	    			line-height: 20px;
	    			font-size: 14px;
	    			font-weight: bold;
	    		}
	    	}
	    }
    }
    .volun_wrap {
        margin-top: 5px;
        padding: 20px 0;
        box-sizing: border-box;
        width: 100%;
        min-height: 310px;
        background: url('../assets/images/volunte_bg.png') no-repeat right 10px;
        background-size: 270px 270px;
        p {
            margin-bottom: 20px;
            width: 100%;
            color: @defaultColor;
            b {
                float: left;
                width: 200px;
                line-height: 20px;
                font-size: 16px;
            }
            span {
                float: left;
                width: 350px;
                line-height: 20px;
                font-size: 12px;
            }
        }
        &.volunteer {

        }
    }

    .detail_price_wrap {
        margin-top: 30px;
        padding-top: 40px;
        width: 100%;
        height: 300px;
        background-size: 220px 300px;
        position: relative;
        flex-shrink: 0;
        img {
          position: absolute;
          margin-left: 1200px;
          bottom: 0;
          width: auto;
          height: 260px;
        }
        .price_title {
            margin-bottom: 30px;
            width: 390px;
            height: 90px;
            line-height: 90px;
            font-size: 30px;
            color: #fff;
            font-weight: bold;
            text-align: center;
            background: #2d345e;
            letter-spacing: 2px;
        }
        .price_list {
            padding-left: 110px;
            width: 600px;
            line-height: 36px;
            font-size: 12px;
            font-size: 18px;
            font-weight: bold;
            color: #0d123a;
            b {
                font-size: 18px;
            }
        }
    }
</style>
