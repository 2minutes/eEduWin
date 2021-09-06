let interfaceFlag = 2;//接口环境，0测试，1uat,2生产
let baseUrl = '';
switch(interfaceFlag) {
    case 0: 
        // baseUrl = 'http://192.168.24.173:8080/ds-edu/';
        // baseUrl = 'http://192.168.24.78:8080/ds-edu/';
        // baseUrl = 'http://192.168.8.29:24631/ds-edu/';
        baseUrl = 'http://gray-api.eeduwin.com/ds-edu/';
        break;
    case 2:  
        baseUrl = 'http://api.eeduwin.com/ds-edu/';
        break;
}
export default baseUrl;