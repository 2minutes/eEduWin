<template>
    <div class="curd_menu">
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :default-active="$route.path"
            @select="handleSelect">
            <el-menu-item  v-for="(menu) in menuList" :key="menu.key" :index="menu.path">
                <span slot="title">{{menu.title}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                current: ['news'],
            }
        },
        created() {
            this.setMenuList();
        },
        methods: {
            setMenuList() {
                this.menuList = [
                    {
                        title: '首页',
                        key: 'home',
                        path: '/curd/',
                    }, {
                        title: '新闻',
                        key: 'news',
                        path: '/curd/news',
                    }, {
                        title: '课程类型',
                        key: 'type',
                        path: '/curd/type',
                    }, {
                        title: '导师',
                        key: 'teacher',
                        path: '/curd/teacher',
                    }, {
                        title: '课程',
                        key: 'course',
                        path: '/curd/course',
                    }, {
                        title: '竞赛及活动',
                        key: 'activity',
                        path: '/curd/activity',
                    }, {
                        title: '通告',
                        key: 'notice',
                        path: '/curd/notice',
                    }, {
                        title: '视频',
                        key: 'video',
                        path: '/curd/video'
                    }
                ]
            }, 
            handleSelect(menu) {
                let route = this.$route;
                if (menu == route.path) {
                    return;
                }
                this.$router.push({
                    path: menu,
                });
            },
        },
    }
</script>
<style lang="less" scoped>
</style>