<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20" class="alert-row">
                <el-col :span="8"><div class="grid-content bg-purple">
                    <el-input placeholder="请输入内容"clearable v-model="queryInfo.query" @clear="getGoodsList(1)">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList(1)"></el-button>
                    </el-input>
                </div></el-col>
                <el-col :span="3"><div class="grid-content bg-purple">
                    <el-button type="primary"  @click="addGoods()">添加商品</el-button>
                </div></el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column
                        prop="goods_name"
                        label="商品名称">
                </el-table-column>
                <el-table-column
                        prop="goods_price"
                        label="商品价格（元）" width="120px">
                </el-table-column>
                <el-table-column
                        prop="goods_weight"
                        label="商品重量" width="95px">
                </el-table-column>
                <el-table-column
                        prop="add_time"
                        label="创建时间" width="180px">
                    <template slot-scope="scope">{{ scope.row.add_time | dateShow }}</template>
                </el-table-column>
                <el-table-column  width="120px" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 15, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="goodsTotal">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import {GetGoodsData,DelGoodNum} from 'network/Cate'
    import {formatDate} from "../../common/utils";
    export default {
        name: "goods",
        data(){
            return {
                queryInfo : {
                    query:'',
                    pagenum:1,
                    pagesize:10
                },
                goodsList:[],
                goodsTotal : 0
            }
        },
        created() {
          this.getGoodsList()
        },
        methods :{
          getGoodsList(num=0){
              if (num!=0){
                  this.queryInfo.pagenum=num
              }
              GetGoodsData(this.queryInfo).then(res=>{
                  if (res.meta.status!==200) {
                      return   this.$message({
                          showClose: true,
                          message: res.meta.msg,
                          type: 'error'
                      })
                  }
                  this.goodsList = res.data.goods
                  this.goodsTotal =res.data.total
                  this.queryInfo.pagenum= Number(res.data.pagenum)
              })
          },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.queryInfo.pagesize=val
                this.getGoodsList()
            },
            handleCurrentChange(val) {
                this.queryInfo.pagenum=val
                this.getGoodsList()
            },
            async removeById(id){
                const confirmResult= await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
             const res =  await DelGoodNum(id)
                if (res.meta.status!==200) {
                    return   this.$message({
                        showClose: true,
                        message: res.meta.msg,
                        type: 'error'
                    })
                }
                this.getGoodsList()
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            },
            addGoods(){
              this.$router.push('goods/add')
            }
        },
        filters :{ //过滤器
            dateShow(value) {
                let date = new Date(value * 1000);
                return formatDate(date, "yyyy-MM-dd hh:mm:ss");
            }
        }
    }
</script>

<style scoped>
.alert-row{
    margin-bottom: 15px;
}

</style>