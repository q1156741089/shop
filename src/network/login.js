import {request} from "./request";
export default function (loginfrom) { //登录请求
    return request({
        method : 'post',
        url : 'login',
        data : {
            //将对象解析
            ...loginfrom
        }
    })
}