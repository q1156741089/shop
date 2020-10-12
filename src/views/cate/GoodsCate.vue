<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
<!--        面包屑-->
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="AddCates">添加分类</el-button>
                </el-col>
            </el-row>

            <el-table
                    :data="CateGoriesList"
                    row-key="cat_id"
                    border
                    :tree-props="{children: 'children'}">
                <el-table-column
                        sortable
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="cat_name"
                        label="分类名称"
                        sortable
                        width="180">
                </el-table-column>
                <el-table-column
                        label="是否有效"
                        sortable
                        width="180">
                    <template slot-scope="scope">
                        <i class="el-icon-success" style="color: blue" v-if="scope.row.cat_deleted==false"></i>
                        <i class="el-icon-error" style="color: red" v-else></i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="排序">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                        <el-tag  type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
                        <el-tag type="danger" v-else>三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditCatebtn(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelCatebtn(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="this.RequestData.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="this.RequestData.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
            </el-card>
<!--        添加分类-->
        <el-dialog
                title="添加分类"
                :visible.sync="AddCateVisible"
                width="40%"
        >
            <!--             主体区-->
            <el-form :model="AddCateForm" :rules="AddCateFormRules" ref="AddCateFormRef" label-width="80px" >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="AddCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                 <el-cascader
                        v-model="CateValue"
                        :options="options"
                        :props="PropsCate"
                        @change="handleChange"
                  style="width: 100%" filterable clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="AddCateVisible=false">取 消</el-button>
    <el-button type="primary" @click="InsetCate">确 定</el-button>
  </span>
        </el-dialog>
        <!--        编辑分类-->
        <el-dialog
                title="编辑分类"
                :visible.sync="EditCateVisible"
                width="40%"
        >
            <!--             主体区-->
            <el-form :model="EditCateForm" :rules="AddCateFormRules" ref="EditCateFormRef" label-width="80px" >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="EditCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="EditCateVisible=false">取 消</el-button>
    <el-button type="primary" @click="EditCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {GetCateData,AddCatesTO,EditCatesTO,GetCateNum,DelCateNum} from 'network/Cate'
    export default {
        name: "goodscate",
        data(){
            return {
                 CateGoriesList:[], //接收服务器返回的分类数组
                RequestData :{
                    pagenum:1,
                    pagesize:5,
                    type :3
                },
                total:0,
                AddCateVisible:false,
                AddCateForm :{ //添加分类
                    cat_name:'',
                    cat_pid :0,
                    cat_level:0
                },
                AddCateFormRules:{
                    cat_name: [
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ]
                },
                options:[],
                PropsCate :{
                    expandTrigger: 'hover' ,
                    label : 'cat_name',
                    value : 'cat_id',
                    children : 'children',
                    checkStrictly: true
                },
                CateValue:[],
                EditCateVisible : false,
                EditCateForm:{ //编辑分类
                    cat_name : '',
                    id:''
                }
            }
        },
        created() {
            this.GetUserCate()
        },
        methods :{
            GetUserCate(){
                GetCateData(this.RequestData).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.CateGoriesList=res.data.result
                    this.total =res.data.total
                })
            },
            handleSizeChange(NewSize){
               this.RequestData.pagesize=NewSize
               this.GetUserCate()
            },
            handleCurrentChange(NewNum){
                this.RequestData.pagenum=NewNum
                this.GetUserCate()
            },
            AddCates(){
                GetCateData({type:2}).then(res=>{
                    this.options =res.data
                })
                this.AddCateVisible=true
            },
            handleChange(){
                if(this.CateValue.length>0){
                    this.AddCateForm.cat_pid =this.CateValue[this.CateValue.length-1]
                    this.AddCateForm.cat_level =this.CateValue.length
                }else{
                    this.AddCateForm.cat_pid =0
                    this.AddCateForm.cat_level =0
                }
            },
            InsetCate(){
                this.$refs.AddCateFormRef.validate(valid=>{
                    if (!valid) return
                    AddCatesTO(this.AddCateForm).then(res=>{
                        if (res.meta.status!==201) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.GetUserCate()
                        this.AddCateVisible=false
                        this.$message.success('分类信息添加成功')
                    })
                })
            },
            EditCate(){
                this.$refs.EditCateFormRef.validate(valid=>{
                    if (!valid) return
                    EditCatesTO(this.EditCateForm).then(res=>{
                        if (res.meta.status!==200) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.GetUserCate()
                        this.EditCateVisible=false
                        this.$message.success('分类信息修改成功')
                    })
                })
            },
            EditCatebtn(row){
                GetCateNum(row.cat_id).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                     this.$set(  this.EditCateForm, 'id', res.data.cat_id);
                    this.$set(  this.EditCateForm, 'cat_name',  res.data.cat_name);
                     this.EditCateVisible=true
                })
            },
            async DelCatebtn(row){
                const confirmResult= await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
                const res = await DelCateNum(row.cat_id)
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
                this.GetUserCate()
            }
        },
        watch :{
            AddCateVisible : function () { //初始化添加窗口
                if(this.$refs.AddCateFormRef) {
                    this.$refs.AddCateFormRef.resetFields()
                    this.CateValue=[]
                    this.AddCateForm.cat_pid =0
                    this.AddCateForm.cat_level =0
                }
            },
            EditCateVisible : function () { //初始化编辑窗口
                if(this.$refs.EditCateFormRef && this.EditCateVisible==false){
                    this.$refs.EditCateFormRef.resetFields();
                }
            }
        }
    }
</script>

<style scoped>

    .el-table{
        margin-top: 20px;
        margin-bottom: 15px;
    }
</style>