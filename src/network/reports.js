import {request} from "./request";
export   function GetReportsData() { //获取分类列表
    return request({
        method : 'get',
        url : 'reports/type/1',
    })
}