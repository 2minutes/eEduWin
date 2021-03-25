import axios from 'axios';
import QS from 'qs';

import baseUrl from '@/utils/baseUrl';
import {getToken, loginClear, loading, hideLoading,} from '@/assets/js/public';
import {message} from 'ant-design-vue';
import store from '@/store/index';

const service = axios.create({
    baseURL: baseUrl,
    header: {
        "Content-Type": 'application/json;charset=utf-8', //application/x-www-form-urlencoded
    },
    withCredentials: true,
    timeout: 10000,
});

service.interceptors.request.use(
    config => {
        let token = getToken();
        if (token) {
            config.headers['token'] = token;
        }
        config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;';
        if (config.header) {
            config.headers['Content-Type'] = config.header['Content-Type'];
        }
        if (config.method === 'post') {
            if (config.headers['Content-Type'].indexOf('application/json') == -1) {
                config.data = config.headers['Content-Type'] == 'multipart/form-data' ? config.data : QS.stringify(config.data);
            } else {
                config.data = config.data;
            }
        }
        if (config.loading) {
            loading();
        }
        return config;
    },
    error => {
        // do something with request error
        return Promise.reject(error)
    }
);


service.post = function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params))
        .then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data);
        });
    });
}

service.interceptors.response.use(response => {
    const res = response.data;
    if(res.code != 200) {
        message.error(res.msg);
        if (res.code == '1001') {
            loginClear();
        }
    }
    if (response.config.loading) {
        hideLoading();
    }
    return res;
}, error => {
    return Promise.reject(error);
});

export default service;