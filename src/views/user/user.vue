<template>
    <div>
        <!--        面包屑-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片区-->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </div></el-col>
                <el-col :span="3"><div class="grid-content bg-purple">
                    <el-button type="primary" @click="dialogVisible=true">用户添加</el-button>
                </div></el-col>
            </el-row>
            <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        label="#"
                >
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="姓名"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="电话"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="role_name"
                        label="角色"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="mg_state"
                        label="状态"
                        width="180">
                    <template slot-scope="scope">
                        <el-switch  v-model="scope.row.mg_state" @change="SetState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="edituser(scope.row)" ></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="open2(scope.row)"></el-button>

                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini" @click="RolesUser(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[2, 4, 6, 8]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totals">
            </el-pagination>
        </el-card>
        <!--   弹框-->
        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
        >
            <!--             主体区-->
            <el-form :model="ruleFormUser" :rules="usersRules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="ruleFormUser.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="ruleFormUser.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="ruleFormUser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="ruleFormUser.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </span>
        </el-dialog>
<!--        修改用户-->
        <el-dialog
                title="编辑用户"
                :visible.sync="EditVisible"
                width="50%"
        >
            <!--             主体区-->
            <el-form :model="EditruleFormUser" :rules="usersRules" ref="EditRuleForm" label-width="70px" class="demo-ruleForm">
                <el-form-item label="用户名" >
                    <el-input v-model="EditruleFormUser.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="EditruleFormUser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="EditruleFormUser.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="EditVisible=false">取 消</el-button>
    <el-button type="primary" @click="EditUserTo">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="分配权限"
                :visible.sync="RolesVisible"
                width="30%"
        >
            <!--             主体区-->
            <el-form :model="RolesruleFormUser"  ref="RolesRuleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="当前的用户" >
                    <el-input v-model="RolesruleFormUser.Rolesname" disabled></el-input>
                </el-form-item>
                <el-form-item label="当前的角色">
                    <el-input v-model="RolesruleFormUser.Roles" disabled></el-input>
                </el-form-item>
                <el-form-item label="新的角色">
                    <el-select v-model="RolesValue" placeholder="请选择">
                        <el-option
                                v-for="item in RolesOptions"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="RolesVisible=false">取 消</el-button>
    <el-button type="primary" @click="EditRolesUserTo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getUsers,setstas,adduser,deluser,Ausers,EditRolesUser} from "network/users";  //axios请求
    import {GetPowerRoles} from "network/power"
    export default {
        name: "user",
        data(){
            let checkEmail =(rule,value,callback)=>{
                let reg= /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
                if(!reg.test(value)){callback(new Error('请输入合法的邮箱'))
                }else{
                    callback()
                }
            };
            let checkMoblie =(rule,value,callback)=>{
                let reg= /^1[3456789]\d{9}$/
                if(!reg.test(value)){callback(new Error('请输入合法的号码'))
                }else{
                    callback()
                }
            }
            return {
                queryInfo:{
                    query : '',
                    pagenum : 1,
                    pagesize :2
                },
                tableData : [],
                totals :0,
                dialogVisible : false,
                ruleFormUser : {
                    username : '',
                    password : '',
                    email : '',
                    mobile : ''
                },
                usersRules: {
                    username: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { validator: checkMoblie, trigger: 'blur' }
                    ],
                },
                EditVisible : false,
                RolesVisible:false,
                EditruleFormUser : {
                    username : '',
                    email : '',
                    mobile : '',
                    id : '',
                    rid : ''
                },
                RolesruleFormUser:{
                    Rolesname:'',
                    Roles:'',
                    RolesId:'',
                    UserId:''
                },
                RolesValue:'',
                RolesOptions:[]
            }
        },
        created() {
            this.getList()
        },
        methods : {
            getList(){  //请求每页数据
                getUsers(this.queryInfo).then(res=>{
                    if (res.meta.status!==200)  return  this.$message({
                        showClose: true,
                        message:res.meta.msg ,
                        type: 'error'
                    });
                    this.tableData = res.data.users
                    this.totals = res.data.total
                })
            },
            handleSizeChange(nwesize){ //获取当前每页显示条数
                this.queryInfo.pagesize =nwesize
                this.getList()
            },
            handleCurrentChange(newpage){//获取当前页码
                this.queryInfo.pagenum =newpage
                this.getList()
            },
            SetState(row){ //修改状态
                setstas('users/' + row.id + '/state/' + row.mg_state + '').then(res=>{
                    // console.log(ref);
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                        row.mg_state = !row.mg_state
                    }
                    this.$message.success('更新用户状态成功')
                })
            },
            adduser(){
                this.$refs.ruleForm.validate(valid=>{
                    if (!valid) return
                    adduser(this.ruleFormUser).then(res=>{
                        if (res.meta.status!==201) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.getList()
                        this.dialogVisible=false
                        this.$message.success('用户添加成功')
                    })
                })
            },
            async  open2(row) {
                const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
                const res = await  deluser('users/' + row.id + '')
                if (res.meta.status!==200) {
                    return   this.$message({
                        showClose: true,
                        message: res.meta.msg,
                        type: 'error'
                    })
                }
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getList()
            },
            edituser(row){
                Ausers('users/'+ row.id).then(res=>{
                    if (res.meta.status!==200)  return  this.$message({
                        showClose: true,
                        message:res.meta.msg ,
                        type: 'error'
                    });
                      this.EditruleFormUser=res.data
                     this.EditVisible=true
                })
            },
            EditUserTo(){
                this.$refs.EditRuleForm.validate(valid=>{
                    if (!valid) return
                    setstas('users/'+ this.EditruleFormUser.id,{
                        email : this.EditruleFormUser.email,
                        mobile : this.EditruleFormUser.mobile
                    }).then(res=>{
                        if (res.meta.status!==200) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.getList()
                        this.EditVisible=false
                        this.$message.success('用户信息修改成功')
                    })
                })
            },
            RolesUser(row){
                 this.RolesruleFormUser.Rolesname=row.username
                this.RolesruleFormUser.Roles=row.role_name
                 this.RolesruleFormUser.UserId=row.id
                    // console.log(row);
                GetPowerRoles().then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.RolesOptions =res.data
                    this.RolesVisible=true
                })
            },
            EditRolesUserTo(){
                if(!this.RolesValue) return
                EditRolesUser('users/' + this.RolesruleFormUser.UserId + '/role',{rid:this.RolesValue}).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.getList()
                    this.RolesVisible=false
                    this.RolesValue=''
                    this.$message.success('用户角色修改成功')
                })
            }
        },
        watch : {
            dialogVisible : function () {
                if(this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
            },
            EditVisible : function () {
                if(this.$refs.EditRuleForm) this.$refs.EditRuleForm.resetFields()
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
        margin-top: 15px;
        font-size: 12px;
    }
    .el-pagination{
        margin-top: 15px;
    }
</style>