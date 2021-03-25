<template>
    <div class="curd_menu">
        <a-menu
            mode="inline"
            @select="handelMenuChange"
            >
            <a-menu-item v-for="(menu, menuIdx) in menuList" 
                :key="menu.key"
                :class="{'ant-menu-item-selected': $route.path == menu.path}" >
                <span>{{menu.title}}</span>
            </a-menu-item>
        </a-menu>
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
            handelMenuChange(menu) {
                let route = this.$route;
                let path = `/curd/${menu.key}`;
                this.current = [menu.key];
                if (path == route.path) {
                    return;
                }
                this.$router.push({
                    path: path,
                });
            }
        }
    }
</script>
<style lang="less" scoped>
</style>