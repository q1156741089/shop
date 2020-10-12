<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
     <el-table :data="powerlist" border stripe>
        <el-table-column type="index" label="#">
        </el-table-column>
         <el-table-column prop="authName" label="权限名称">
         </el-table-column>
         <el-table-column prop="path" label="路径">
         </el-table-column>
         <el-table-column  label="权限等级">
             <template slot-scope="scope">
                              <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                              <el-tag v-else-if="scope.row.level === '1'"  type="success">二级</el-tag>
                              <el-tag type="warning" v-else>三级</el-tag>
             </template>
         </el-table-column>
     </el-table>
    </el-card>
    </div>
</template>

<script>
    import {getpower} from "network/power";

    export default {
        name: "PowerList",
        data(){
          return {
             powerlist :[]
          }
        },
        created() {
            this.getpowerlist()
        },
        methods : {
            getpowerlist(){
                getpower().then(res=>{
                    if (res.meta.status!==200) {
                        return   this.$message({
                            showClose: true,
                            message: res.meta.msg,
                            type: 'error'
                        })
                    }
                     this.powerlist = res.data
                })
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
</style>