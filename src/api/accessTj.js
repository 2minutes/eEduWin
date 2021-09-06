import {Request} from './request';
export function addTj(type, courseNo = '') {
    let params = {
        accessType: type
    }
    if (courseNo) {
        params.courseNo = courseNo;
    }
    Request({
        url: 'accessTj/add',
        params: params
    }).then(res => {
    });
}