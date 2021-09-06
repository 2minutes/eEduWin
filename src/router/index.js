import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//使用require.context导入路由，新添加页面，在routeTitle添加下相应的title
const requireRoutes = require.context('@/components', false, /\.vue$/, 'lazy');
let routeTitle = {
    about: 'About Us',
    contact: 'Contact Us',
    course: 'Course Offerings',
    detail: 'Course Offerings',
    enhancement: 'Enhancement Opportunities',
    services: 'Admission Services',
    club: 'eEduWinner Club',
    home: 'eEduWin',
    schedule: 'schedule',
    'curd-news': '新闻管理',
    'curd-type': '类型管理',
    'curd-teacher': '导师管理',
    'curd-course': '课程管理',
    'curd-activity': '活动管理',
    'curd-notice': '通告管理',
    'curd-video': '视频管理',
    'card-home': '首页'
};

function formatRouter(routerArr, curdFlag = false) {
    let curdIdx = -1;
    let routes = routerArr.keys().map((fileName, idx) => {
        const routerSplit = fileName.split('.');
        let routerName = routerSplit[1].replace('/', '');
        if (curdFlag) {
            if (routerName === 'index') {
                curdIdx = idx;
            }
        }
        let component = routerArr(fileName).default;
        let title = routeTitle[routerName] ? routeTitle[routerName] : routerName;
        let routeItem = {
            // path: routerName === defaultPath ? '/' : (curdFlag ? '/curd' : '') + routerSplit[1],
            path: routerName === defaultPath ? '/' : curdFlag ? routerName : routerSplit[1],
            name: curdFlag ? 'curd-' + routerName : routerName,
            meta: {
                title: title,
            },
            component: () => routerArr(fileName)
        };
        if (keepAliveArr.includes(routerName)) {
            routeItem.meta.keepAlive = true;
        }
        return routeItem;
    });
    if (curdIdx != -1) {
        routes.splice(curdIdx, 1);
    }
    return routes;
}

const defaultPath = 'home';
let keepAliveArr = ['enhancement', 'schedule', 'course'];
let defaultRouter = null;

let routes = formatRouter(requireRoutes);

const curdRouter = require.context('@/components/curd', false, /\.vue$/, 'lazy');
let curdRoutes = formatRouter(curdRouter, true);

const createRouter = () => new Router({
    // mode: 'hash',
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        ...routes,
        {
            path: '/curd',
            component: () => import('@/components/curd/index'),
            children: [...curdRoutes]
        }
    ]
});

const router = createRouter()

// export default new Router({
//     mode: 'hash',
//     routes: [...routes],
// })
export default router;
