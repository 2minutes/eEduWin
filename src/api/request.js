import request from '@/utils/request';

export function Request(opts){
    let requestParams = {
        url: opts.url,
        method: opts.method ? opts.method : 'get',
        loading: opts.loading ? opts.loading : false,
    }
    let params = opts.params ? opts.params : {};
    
    let language = localStorage.lang ? localStorage.lang : 'zh';
    if (Object.prototype.toString.call(params) == '[object FormData]') {
        params.append('language', language);
        requestParams.header = {
            'Content-Type': 'multipart/form-data'
        };
    } else {
        params.language = language;
    }
    
    if (opts.loading) {
        params.loading = opts.loading;
    }
    if (opts.method && opts.method === 'post') {
        requestParams.data = params;
    } else {
        requestParams.params = params;
    }
    if (opts.header) {
        requestParams.header = opts.header;
    }
    if (opts.timeout != undefined) {
        requestParams.timeout = opts.timeout;
    }
    if (opts.uploadProgress) {
        requestParams.onUploadProgress = opts.uploadProgress;
    }
    if (opts.contentType) {
        requestParams.header = {
            'Content-Type': opts.contentType
        }
    }
    return request(requestParams);
}