<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="AddRolesVisible=true">角色添加</el-button>
                    </el-col>
            </el-row>
            <el-table :data="RolesList" border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                    <power-expand :PowerData="scope.row.children" :PowerUserId="scope.row.id"
                                  @DelPower="deluserpower"></power-expand>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit" @click="EditRoles(scope.row)">编辑</el-button>
                        <el-button type="danger"  size="mini" icon="el-icon-delete" @click="DeleteRoles(scope.row)">删除</el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="SetRoles(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!--      编辑角色-->
        <el-dialog
                title="编辑用户"
                :visible.sync="RolesVisible"
                width="40%"
        >
            <!--             主体区-->
            <el-form :model="EditRolesFormList" :rules="RolesRules" ref="EditRolesForm" label-width="80px" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="EditRolesFormList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="EditRolesFormList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="RolesVisible=false">取 消</el-button>
    <el-button type="primary" @click="EditRolesTo">确 定</el-button>
  </span>
        </el-dialog>
<!--添加角色-->
        <el-dialog
                title="添加用户"
                :visible.sync="AddRolesVisible"
                width="40%"
        >
            <!--             主体区-->
            <el-form :model="AddRolesFormList" :rules="RolesRules" ref="AddRolesForm" label-width="80px" >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="AddRolesFormList.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="AddRolesFormList.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="AddRolesVisible=false">取 消</el-button>
    <el-button type="primary" @click="AddRolesTo">确 定</el-button>
  </span>
        </el-dialog>
        <!--分配权限-->
        <el-dialog
                title="分配权限"
                :visible.sync="SetRolesVisible"
                width="40%"
        >
            <!--             主体区-->
            <el-tree :data="AllRolesList" :props="defaultProps"
                     class="tree" default-expand-all  show-checkbox  node-key="id"
                     :default-checked-keys="CheckedList" ref="TreePower"></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="SetRolesVisible=false">取 消</el-button>
    <el-button type="primary" @click="AddRightsTo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {GetPowerRoles,GetRolesId,EditRoles,DeleteRole,AddRolesTO,GetPowerTree,AddRolesRightsTO} from "network/power";
   import PowerExpand from "./children/PowerExpand";
    export default {
        name: "PowerRoles",
        components :{
            PowerExpand
        },
        data(){
            return {
                RolesList:[],//当前所有角色信息
                AllRolesList:[],//所有权限名称
                 EditRolesFormList : {//修改
                    roleName:'',
                    roleDesc:'',
                    roleId:0
                },
                AddRolesFormList : { //新增
                    roleName:'',
                    roleDesc:''
                },
                RolesRules:{
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ]
                },
                RolesVisible:false,
                AddRolesVisible:false,
                SetRolesVisible:false,
                defaultProps: {//tree目录树中展示的数据指定
                    children: 'children',
                    label: 'authName'
                },
                CheckedList:[],//当前角色已有的权限ID
                AddRightsVisible:false,
                KeyList:[],//当前勾选的权限ID
                rolesId:''
            }
        },
        created() {
            this.getRoles()
        },
        methods :{
            getRoles(){//加载页面角色信息
                GetPowerRoles().then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.RolesList=res.data
                })
            },
            EditRoles(row){ //打开编辑窗口
                GetRolesId(row.id).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.EditRolesFormList=res.data
                })
                this.RolesVisible=true
            },
            EditRolesTo(){//完成编辑并提交
                this.$refs.EditRolesForm.validate(valid=>{
                    if (!valid) return
                    EditRoles(this.EditRolesFormList.roleId,this.EditRolesFormList).then(res=>{
                        if (res.meta.status!==200) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.getRoles()
                        this.RolesVisible=false
                        this.$message.success('角色信息修改成功')
                    })
                })
            },
            async DeleteRoles(row){//删除角色
                const confirmResult= await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
                if (confirmResult!='confirm'){
                    return  this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                }
                const res= await DeleteRole(row.id)
                if (res.meta.status!==200) {
                    return   this.$message({
                        showClose: true,
                        message: res.meta.msg,
                        type: 'error'
                    })
                }
                this.getRoles()
                this.$message.success('角色信息删除成功')
            },
            AddRolesTo(){//新增角色
                this.$refs.AddRolesForm.validate(valid=>{
                     if (!valid) return
                    AddRolesTO(this.AddRolesFormList).then(res=>{
                        if (res.meta.status!==201) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.getRoles()
                        this.AddRolesVisible=false
                        this.$message.success('角色信息添加成功')
                    })
                })
            },
            deluserpower(data,userid){
              // 接收子组件发送的事件  并根据传入的userid修改RolesList中的值
                console.log(this.RolesList);
                this.RolesList.forEach(item=>{
                    if(item.id==userid){
                        item.children=data.data
                    }
                })
            },
            SetRoles(row){//展开目录树并获取当前角色拥有权限
                GetPowerTree().then(res=>{
                     if (res.meta.status!==200) {
                         return   this.$message({
                             showClose: true,
                             message: res.meta.msg,
                             type: 'error'
                         })
                     }
                       this.AllRolesList=res.data
                     this.SetRolesVisible=true
                     this.CheckedList=[]
                     this.RecursionData(this.CheckedList,row.children)
                    this.rolesId=row.id
                })
            },
            RecursionData(Arr,data){//递归函数获取第三级权限id
                if (Array.isArray(data) && data.length>0){
                    data.forEach(item => {
                        if(!item.children){
                            Arr.push(item.id)
                        }
                        this.RecursionData(Arr, item.children)
                    })
                }
            },
            AddRightsTo(){//设置分配权限
                this.KeyList=[...this.$refs.TreePower.getHalfCheckedKeys(),
                    ...this.$refs.TreePower.getCheckedKeys()]
                if(this.KeyList.length==0) return
                AddRolesRightsTO(this.rolesId, {
                    rids:this.KeyList.join(',')
                }).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                     this.getRoles()
                    this.SetRolesVisible=false
                    this.$message.success('角色授权成功')
                })
            }
        },
        watch :{
            RolesVisible : function () { //初始化编辑窗口
                if(this.$refs.EditRolesForm) this.$refs.EditRolesForm.resetFields()
            },
            AddRolesVisible : function () { //初始化编辑窗口
                if(this.$refs.AddRolesForm) this.$refs.AddRolesForm.resetFields()
            }
        }
    }
</script>

<style scoped>
    .el-breadcrumb {
        margin-bottom: 15px;

    }
    .el-card{
        box-shadow: 0 1px 1px rgba(0,0,0,0.15);
    }
    .el-table{
        margin-top: 20px;
    }

    .tree {
        overflow-y:auto;
        /*overflow-x: scroll;*/
        height:290px;
    }
</style>