<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row class="alert-row">
                <el-alert
                        title="注意：只允许为第三级分类设置相关参数！"
                        type="warning"
                        show-icon
                        :closable="false">
                </el-alert>
            </el-row>
            <el-row class="alert-row">
               <span>选择商品分类：</span>
                <el-cascader
                        v-model="cateIdList"
                        :options="cateList"
                        :props="propsCate"
                        @change="handleChange"></el-cascader>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-row class="alert-row">
                        <el-button type="primary" size="small" :disabled="isDisabled"
                                   @click="AddCateParamsVisible=true">添加参数</el-button>
                    </el-row>
                    <el-table
                            :data="CateParamsList"
                            row-key="attr_id"
                            border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                            <el-tag
                                    :key="index"
                                    v-for="(itme,index) in scope.row.attr_vals"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(scope.row,itme)">
                                {{itme}}
                            </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="#"
                                sortable
                                width="90"
                                type="index">
                        </el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="参数名称"
                                sortable
                              >
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditParamsbtn(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelParamsbtn(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-row class="alert-row">
                        <el-button type="primary" size="small" :disabled="isDisabled"
                                   @click="AddCateParamsVisible=true">添加属性</el-button>
                    </el-row>
                    <el-table
                            :data="CateParamsList"
                            row-key="attr_id"
                            border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag
                                        :key="index"
                                        v-for="(itme,index) in scope.row.attr_vals"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(scope.row,itme)">
                                    {{itme}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="#"
                                sortable
                                width="90"
                                type="index">
                        </el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="属性名称"
                                sortable
                        >
                        </el-table-column>
                        <el-table-column
                                label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="EditParamsbtn(scope.row)">编辑</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="DelParamsbtn(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!--        添加动态参数/属性-->
        <el-dialog
                :title="'添加'+ setTitle"
                :visible.sync="AddCateParamsVisible"
                width="40%"
       @close="dialogClose" >
            <!--             主体区-->
            <el-form :model="AddCateParamsForm" :rules="AddCateParamsFormRules" ref="AddCateParamsFormRef" label-width="80px" >
                <el-form-item :label="setTitle" prop="attr_name">
                    <el-input v-model="AddCateParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="AddCateParamsVisible=false">取 消</el-button>
    <el-button type="primary" @click="insetCateParams">确 定</el-button>
  </span>
        </el-dialog>
        <!--        编辑动态参数/属性-->
        <el-dialog
                :title="'编辑'+ setTitle"
                :visible.sync="EditCateParamsVisible"
                width="40%"
              >
            <!--             主体区-->
            <el-form :model="EditCateParamsForm" :rules="AddCateParamsFormRules" ref="EditCateParamsFormRef" label-width="80px" >
                <el-form-item :label="setTitle" prop="attr_name">
                    <el-input v-model="EditCateParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="EditCateParamsVisible=false">取 消</el-button>
    <el-button type="primary" @click="EditParamsTo">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {GetCateData,GetCateParams,AddCatesParamsTO,EditCatesAdd,GetAttrId,DelAttrId} from 'network/Cate'
    import { formatDate } from "../../common/utils";
    export default {
        name: "ParamsCate",
        data(){
           return {
               cateIdList :[],//选中ID
               cateList : [],//所有分类
               propsCate :{//联级选择配置
                   expandTrigger: 'hover',
                   label:'cat_name',
                   value : 'cat_id',
                   children : 'children'
               },
               activeName: 'many',//绑定当前所选中标签页
               CateParamsList:[], //table动态参数
               AddCateParamsVisible:false,
               EditCateParamsVisible:false,
               AddCateParamsForm :{//添加静态参数/动态属性
                   attr_name : '',
                   attr_sel :''
               },
               EditCateParamsForm :{
               },
               AddCateParamsFormRules:{
                   attr_name: [
                       { required: true, message: '请输入相关名称', trigger: 'blur' },
                       { min: 1, max: 20, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                   ]
               }
           }
        },
        created() {
            this.getCateList()
        },
        computed :{
            isDisabled(){//根据选中长度是否启用按钮
             return  this.cateIdList.length!==3 ?  true : false
            },
            setTitle(){
                return this.activeName=='many' ? '动态参数' : '静态属性'
            }
        },
        methods :{
            getCateList(){//获取分类数据
                GetCateData().then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.cateList = res.data
                })
            },
            handleChange(){
              this.getCateParamsData()
        },
            handleClick(){
                this.getCateParamsData()
            },
            getCateParamsData(){
                if (this.cateIdList.length<3) {
                    this.cateIdList =[]
                    this.CateParamsList=[]
                }else{
                    GetCateParams(this.cateIdList[2],{sel:this.activeName}).then(res=>{
                        if (res.meta.status!==200) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.CateParamsList =res.data
                        this.CateParamsList.forEach(item=>{
                            this.$set(item,'inputVisible',false)
                            this.$set(item,'inputValue','')
                            item.attr_vals.length === 0 ? item.attr_vals=[] : item.attr_vals = item.attr_vals.split(' ')
                        })

                    })
                }
            },
            handleClose(row,itme){
                row.attr_vals.splice(row.attr_vals.indexOf(itme),1)
                EditCatesAdd(row,row.attr_vals.join(' ')).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.$message.success(this.setTitle+'更新成功')
                })
            },
            handleInputConfirm(row){
              if (row.inputValue.trim().length> 0 ) {
                  row.attr_vals.push(row.inputValue)
                  EditCatesAdd(row,row.attr_vals.join(' ')).then(res=>{
                      if (res.meta.status!==200) {
                          return   this.$message({
                              showClose: true,
                              message: res.meta.msg,
                              type: 'error'
                          })
                      }
                      this.$message.success(this.setTitle+'更新成功')
                  })
              }
                row.inputValue=""
                row.inputVisible=false
            },
            showInput(row){
                row.inputVisible=true
                this.$nextTick(_ => {
                      this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            dialogClose(){
                this.$refs.AddCateParamsFormRef.resetFields()
            },
            insetCateParams(){
                this.$refs.AddCateParamsFormRef.validate(valid=>{
                    if (!valid) return
                    this.AddCateParamsForm.attr_sel=this.activeName
                    AddCatesParamsTO(this.cateIdList[2],this.AddCateParamsForm).then(res=>{
                        if (res.meta.status!==201) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.getCateParamsData()
                        this.AddCateParamsVisible=false
                        this.$message.success(this.setTitle+'添加成功')
                    })
                })
            },
            editCateParams(){

            },
            EditParamsbtn(row){
                GetAttrId(row).then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.EditCateParamsForm=res.data
                    this.EditCateParamsVisible=true
                })
            },
            async  DelParamsbtn(row){
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
                const res = await DelAttrId(row)
                if (res.meta.status!==200) {
                    return   this.$message({
                        showClose: true,
                        message: res.meta.msg,
                        type: 'error'
                    })
                }
                this.getCateParamsData()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            },
            EditParamsTo(){
                this.$refs.EditCateParamsFormRef.validate(valid=>{
                    if (!valid) return
                    console.log(this.EditCateParamsForm);
                    EditCatesAdd(this.EditCateParamsForm).then(res=>{
                        if (res.meta.status!==200) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.getCateParamsData()
                        this.EditCateParamsVisible=false
                        this.$message.success(this.setTitle+'更新成功')
                    })
                })
            }
        },
        watch :{
            EditCateParamsVisible : function () { //初始化编辑窗口
                if(this.$refs.EditCateParamsFormRef && this.EditCateParamsVisible==false){
                    this.$refs.EditCateParamsFormRef.resetFields()
                }
            }
        }
    }
</script>

<style scoped>
.alert-row{
    margin-bottom: 15px;
}
    .el-cascader{
        width: 300px;
    }
    .el-tag{
        margin:5px ;
    }
.input-new-tag{
    width: 100px;
}

</style>