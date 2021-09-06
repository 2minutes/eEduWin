<template>
    <div class="curd clearfix">
        <Menu />
        <router-view ></router-view>
    </div>
</template>
<script>
    import Menu from '@/components/common/menu';
    export default{
        components: {
            Menu,
        }
    }
</script>
