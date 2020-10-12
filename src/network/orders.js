import {request} from "./request";
export   function GetOrdersData(queryInfo) { //获取订单列表
    return request({
        method : 'get',
        url : 'orders',
        params: {
            ...queryInfo
        },
    })
}

export   function GetExpressData() { //获取快递信息
    return request({
        method : 'get',
        url : 'kuaidi/1106975712662'
    })
}