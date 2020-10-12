<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert
                    title="添加商品信息"
                    type="info"
                    center
                    show-icon
                    :closable="false">
            </el-alert>
            <el-steps :active="Number(active)" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form :model="goodsRuleForm" :rules="goodsRules" ref="goodsRuleForm" label-width="100px"
                     label-position="top">
            <el-tabs tab-position="left" v-model="active" :before-leave="jumpGoods" @tab-click="activeTab">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                        <el-input v-model="goodsRuleForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                        <el-input v-model="goodsRuleForm.goods_price" type="Number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                        <el-input v-model="goodsRuleForm.goods_weight" type="Number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                        <el-input v-model="goodsRuleForm.goods_number" type="Number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="goods_cat">
                        <el-cascader
                                v-model="goodsRuleForm.goods_cat"
                                :options="cateOptions"
                                :props="propsCate"
                                @change="handleChange"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTable">
                        <el-checkbox-group v-model="item.attr_vals" >
                            <el-checkbox :label="i" :key="index"  v-for="(i,index) in item.attr_vals" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name"  v-for="item in onlyTable" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload
                            action="http://127.0.0.1:8888/api/private/v1/upload/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                     :headers="headersObj"
                            :on-success="handleSuccess">
                        <el-button size="small" type="primary">上传图片</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <quill-editor v-model="goodsRuleForm.goods_introduce"></quill-editor>
                    <el-button type="primary" class="addBtn" @click="goodAddBtn">添加商品</el-button>
                </el-tab-pane>
                <el-tab-pane label="完成" name="5">完成</el-tab-pane>
            </el-tabs>
            </el-form>
            </el-card>
        <!--        图片预览-->
        <el-dialog
                title="图片预览"
                :visible.sync="imgVisible"
                width="50%"
        >
            <img :src="imgUrl" alt="图片预览" class="imgPath">
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash' //深拷贝
    import {GetCateData,GetCateParams,AddGoodsTO} from 'network/Cate'
    export default {
        name: "goodsAdd",
        data(){
            return {
                active :0,
                goodsRuleForm:{
                    goods_name : '',
                    goods_price:0,
                    goods_weight:0,
                    goods_number:0,
                    goods_cat :[],
                    attrs : [],
                    pics:[],
                    goods_introduce:''
                },
                goodsRules:{
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ]
                },
                cateOptions : [],
                propsCate :{//联级选择配置
                    expandTrigger: 'hover',
                    label:'cat_name',
                    value : 'cat_id',
                    children : 'children'
                },
                manyTable:[], //商品参数
                onlyTable : [], //商品属性
                headersObj:{
                    Authorization : window.sessionStorage.getItem('token')
                },
                imgVisible:false,
                imgUrl:''
            }
        },
        created() {
            this.getCateList()
        },
        methods :{
            handleChange(val){
               if (val.length==2) {
                   this.goodsRuleForm.goods_cat=[]
                   return
               }
            },
            getCateList(){
                GetCateData().then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.cateOptions = res.data
                })
            },
            jumpGoods(activeName, oldActiveName){
                if (oldActiveName=='0'&&   this.goodsRuleForm.goods_cat.length!=3){
                    this.$message({
                        showClose: true,
                        message: '请先选择商品分类',
                        type: 'error'
                    })
                    return false
                }
            },
            async  activeTab(){
                if (this.active==1) {
                    const res =  await GetCateParams(this.goodsRuleForm.goods_cat[2],{sel:'many'})
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    res.data.forEach(item=>{
                        item.attr_vals=item.attr_vals.split(' ')
                    })
                    this.manyTable =res.data
                }else if(this.active==2){
                    const res =  await GetCateParams(this.goodsRuleForm.goods_cat[2],{sel:'only'})
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                    this.onlyTable =res.data
                }
            },
            handlePreview(file){
                this.imgVisible =true
                this.imgUrl =file.response.data.url
            },
            handleRemove(file){
                const filePath= file.response.data.tmp_path
                this.goodsRuleForm.pics.splice(this.goodsRuleForm.pics.indexOf(filePath),1)
                console.log(this.goodsRuleForm);
            },
            handleSuccess(response){
                const picinfo = {pic:response.data.tmp_path}
                this.goodsRuleForm.pics.push(picinfo)
                console.log(this.goodsRuleForm);
            },
            goodAddBtn(){ //增加商品
                this.$refs.goodsRuleForm.validate(valid=>{
                    if (!valid) return  this.$message({
                        showClose: true,
                        message:'请输入必填项！',
                        type: 'error'
                    })
                    const from = _.cloneDeep(this.goodsRuleForm)
                    from.goods_cat= from.goods_cat.join(',')
                    this.manyTable.forEach(item=>{
                        const manyObj= {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
                        from.attrs.push(manyObj)
                    })
                    this.onlyTable.forEach(item=>{
                        const nolyObj= {attr_id:item.attr_id,attr_value:item.attr_vals}
                        from.attrs.push(nolyObj)
                    })
                    AddGoodsTO(from).then(res=>{
                        if (res.meta.status!==201) {
                            return   this.$message({
                                showClose: true,
                                message: res.meta.msg,
                                type: 'error'
                            })
                        }
                        this.$message.success('商品添加成功')
                        this.$router.push('/goods')
                    })
                })
            }
        }
    }
</script>

<style scoped>
.el-cascader{
    width: 300px;
}
    .el-checkbox{
        margin: 0 10px 0 0 !important;
    }
    .imgPath{
        width: 100%;
    }
    .addBtn{
        margin-top: 15px;
    }
</style>