<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="myChart" :style="{width: '600px', height: '400px'}"></div>
        </el-card>

    </div>
</template>

<script>
    import {GetReportsData} from "network/reports";
    import _ from 'lodash' //深拷贝
    // 引入基本模板
   import echarts from 'echarts'

    export default {
        name: "reports",
        data(){
            return {
                options1: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            }
        },
        created() {
        },
        mounted() {
       this.drawLine()

        },
        methods:{
           drawLine(){
               // 基于准备好的dom，初始化echarts实例
               var myChart = echarts.init(document.getElementById('myChart'));

               // 指定图表的配置项和数据
               GetReportsData().then(res=>{
                   if (res.meta.status!==200)  return  this.$message({
                       showClose: true,
                       message:res.meta.msg ,
                       type: 'error'
                   })
              const result = _.merge(res.data,this.options1)
                   myChart.setOption(result);
               })
               // 使用刚指定的配置项和数据显示图表。
           }
        }

    }
</script>

<style scoped>

</style>