import {request} from "./request";
 function getpower() { //所有权限列表list
     return request({
         method: 'get',
         url : 'rights/list'
     })
}
function GetPowerRoles() {//角色列表
   return request({
       method:'get',
       url:'roles'
   })
}

function GetRolesId(queryinfo) {// 根据 ID 查询角色
    return request({
        method:'get',
        url:'roles/'+ queryinfo
    })
}

function EditRoles(queryinfo,data) {// 编辑提交角色
    return request({
        method:'put',
        url:'roles/'+ queryinfo,
        data:{
           ...data
        }
    })
}

function DeleteRole(queryinfo) {// 删除角色
    return request({
        method:'delete',
        url:'roles/'+ queryinfo,
    })
}

function AddRolesTO(data) {// 编辑提交角色
    return request({
        method:'post',
        url:'roles',
        data:{
            ...data
        }
    })
}

function DeleteUserRole(queryinfo,queryinfo1) {// 删除指定角色的权限
    return request({
        method:'delete',
        url:'roles/'+ queryinfo + '/rights/'+ queryinfo1
    })
}

function GetPowerTree() { //所有权限列表tree
    return request({
        method: 'get',
        url : 'rights/tree'
    })
}

function AddRolesRightsTO(url,data) {// 编辑提交角色
    return request({
        method:'post',
        url:'roles/'+ url + '/rights',
        data:{
            ...data
        }
    })
}
export {getpower,GetPowerRoles,GetRolesId,EditRoles,DeleteRole,AddRolesTO,DeleteUserRole,GetPowerTree,AddRolesRightsTO}