import {request} from "./request";
export   function GetCateData(queryInfo) { //获取分类列表
    return request({
        method : 'get',
        url : 'categories',
        params: {
            ...queryInfo
        },
    })
}

export function AddCatesTO(catefrom) { //添加分类
    return request({
        method : 'post',
        url : 'categories',
        data : {
            //将对象解析
            ...catefrom
        }
    })
}

export function  EditCatesTO(data){  //修改分类
    return request({
        method : 'put',
        url : 'categories/' + data.id,
        data : {
            cat_name : data.cat_name
        }
    })
}

export   function GetCateNum(queryInfo) { //获取用户列表
    return request({
        method : 'get',
        url : 'categories/'+ queryInfo ,
    })
}

export function DelCateNum(CateId) {  //修改状态
    return request({
        method : 'delete',
        url : 'categories/' + CateId
    })
}

export   function GetCateParams(urlInfo,queryInfo) { //获取参数列表
    return request({
        method : 'get',
        url : 'categories/' + urlInfo + '/attributes',
        params: {
            ...queryInfo
        },
    })
}

export function AddCatesParamsTO(urlId,catefrom) { //添加参数
    return request({
        method : 'post',
        url : 'categories/'+ urlId +'/attributes',
        data : {
            //将对象解析
            ...catefrom
        }
    })
}

export function  EditCatesAdd(data,attr_vals=data.attr_vals){  //修改分类
    return request({
        method : 'put',
        url : 'categories/' + data.cat_id + '/attributes/'+ data.attr_id,
        data : {
            attr_name : data.attr_name,
            attr_sel : data.attr_sel,
            attr_vals : attr_vals
        }
    })
}

export   function GetAttrId(queryInfo) { //获取用户列表
    return request({
        method : 'get',
        url : 'categories/' + queryInfo.cat_id + '/attributes/' + queryInfo.attr_id,
        params: {
            attr_sel:queryInfo.attr_sel
        },
    })
}

export function DelAttrId(CateId) {  //删除参数
    return request({
        method : 'delete',
        url : 'categories/' + CateId.cat_id + '/attributes/' + CateId.attr_id,
    })
}

export   function GetGoodsData(queryInfo) { //获取商品列表
    return request({
        method : 'get',
        url : 'goods',
        params: {
            ...queryInfo
        },
    })
}

export function DelGoodNum(CateId) {  //删除商品
    return request({
        method : 'delete',
        url : 'goods/' + CateId
    })
}

export function AddGoodsTO(goodfrom) { //添加商品
    return request({
        method : 'post',
        url : 'goods',
        data : {
            //将对象解析
            ...goodfrom
        }
    })
}