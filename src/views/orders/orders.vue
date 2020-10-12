<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20" class="alert-row">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-table :data="ordersList" border>
                <el-table-column type="index" label="#">
                </el-table-column>
                <el-table-column prop="order_number" label="订单编号">
                </el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="100px">
                </el-table-column>
                <el-table-column label="是否付款" width="100px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.order_pay==='1'">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="100px">
                </el-table-column>
                <el-table-column label="是否发货">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateShow }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
             <template slot-scope="scope">
                 <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                 <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showExpress"></el-button>
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
                    :total="totals">
            </el-pagination>
        </el-card>
        <el-dialog
                title="快递信息"
                :visible.sync="showVisible"
                width="50%"
        >
            <el-timeline>
                <el-timeline-item
                        v-for="(activity, index) in expressList"
                        :key="index"
                        :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import {GetOrdersData,GetExpressData} from 'network/orders'
    import {formatDate} from "../../common/utils";
    export default {
        name: "orders",
        data(){
            return {
                ordersList:[],
                queryInfo :{
                    query:'',
                    pagenum:1,
                    pagesize:5
                },
                totals:0,
                showVisible:false,
                expressList:[]
            }
        },
        created() {
            this.getOrdersList()
        },
        methods :{
            getOrdersList(){
                GetOrdersData(this.queryInfo).then(res=>{
                    if (res.meta.status!==200)  return  this.$message({
                        showClose: true,
                        message:res.meta.msg ,
                        type: 'error'
                    })
                    this.ordersList = res.data.goods
                    this.totals =res.data.total
                })
            },
            handleSizeChange(newpagesize){
                this.queryInfo.pagesize=newpagesize
                this.getOrdersList()
            },
            handleCurrentChange(newpagenum){
                this.queryInfo.pagenum=newpagenum
                this.getOrdersList()
            },
            showExpress(){
                GetExpressData().then(res=>{
                    if (res.meta.status!==200)  return  this.$message({
                        showClose: true,
                        message:res.meta.msg ,
                        type: 'error'
                    })
                    this.expressList =res.data
                    this.showVisible=true
                })

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
    .el-table{
        margin-bottom: 15px;
    }
</style>