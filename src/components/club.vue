<template>
    <div class="app_container clearfix" ref="head">
        <CommonHeader :blue="true"/>
        <div class="edu_club">
            <img class="edu_club_yellow" src="../assets/images/home_yellow.png">
            <img class="edu_club_blue" src="../assets/images/home_blue.png">
            <div class="text_field">
                <p class="club_title">{{$t('club.eEduWinnerClub')}}</p>
                <span>{{$t('club.overviewDesc')}}</span>
            </div>
        </div>
        <CommonFooter/>
    </div>
</template>
<script>
    import CommonHeader from '@/components/common/commonHeader';
    import CommonFooter from '@/components/common/commonFooter';
    export default {
        name: "club",
        components: {
          CommonHeader, CommonFooter,
        }
    }
</script>

<style lang="less" scoped>
    @borderColor: #25315E;
    @defaultColor: #25315e;
    .zh {
    
    }

    .edu_club {
        padding: 30px 85px;
        margin: 0 auto 110px;
        width: 940px;
        height: 390px;
        background: #fff;
        flex-shrink: 0;
        p {
            margin: 0 auto;
            width: 1000px;
            line-height: 24px;
            font-size: 14px;
            color: @defaultColor;
        }
        .club_title {
            height: 70px;
            line-height: 70px;
            font-size: 30px;
            font-weight: bold;
        }
        span {
            white-space: pre-line;
            padding: 40px 50px;
            box-sizing: border-box;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 1030px;
            height: 230px;
            line-height: 25px;
            font-size: 18px;
            color: @defaultColor;
            text-align: left;
            background: #b9e4f6;
            border-radius: 40px;
        }
        .text_field {
            float: left;
            width: 20px;
            .our_service_cont {
                margin-bottom: 20px;
            }
        }
        .edu_club_yellow{
            position: relative;
            left: -225px;
        }
        .edu_club_blue{
            position: relative;
            right: -620px;
            top: 210px;
        }
    }

</style>
