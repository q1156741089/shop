import {request} from "./request";
 function getUsers(queryInfo) { //获取用户列表
    return request({
        method : 'get',
        url : 'users',
        params: {
           ...queryInfo
        },
    })
}


function setstas(data,editdata={}) {  //修改状态
    return request({
        method : 'put',
        url : data,
        data : {
            ...editdata
        }
    })
}

 function adduser(userfrom) { //添加用户
    return request({
        method : 'post',
        url : 'users',
        data : {
            //将对象解析
            ...userfrom
        }
    })
}

function deluser(data) {  //修改状态
    return request({
        method : 'delete',
        url : data
    })
}

function Ausers(queryInfo) { //获取用户列表
    return request({
        method : 'get',
        url : queryInfo
    })
}

function  EditRolesUser(data,editdat){  //修改状态
    return request({
        method : 'put',
        url : data,
        data : {
            ...editdat
        }
    })
}


export {getUsers,setstas,adduser,deluser,Ausers,EditRolesUser}
