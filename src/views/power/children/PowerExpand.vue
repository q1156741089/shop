<template>
    <div>
    <el-row v-for="(item,index) in PowerData" :key="item.id" :class="['bdbottom',index===0 ? 'bdtop' : '' ]">
        <el-col :span="5"><el-tag type="success" closable   @close="handleClose(item.id)">{{item.authName}}</el-tag>
            <i class="el-icon-caret-right"></i></el-col>
        <el-col :span="19">

            <el-row v-for="(item1,index1) in item.children" :key="item1.id" :class="index1 === 0 ? '':'bdtop'">
                <el-col :span="6">
                    <el-tag closable   @close="handleClose(item1.id)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i> </el-col>
                <el-col :span="18">
                    <el-tag type="warning" v-for="(item2,index2) in item1.children" :key="item2.id" closable
                            @close="handleClose(item2.id)">
                        {{item2.authName}}
                    </el-tag>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    </div>
</template>

<script>
    import {DeleteUserRole} from "network/power";
    export default {
        name: "PowerExpand",
        props : {
            PowerData:{
                type:Array,
                default(){
                 return []
                }
            },
            PowerUserId:{
                type: Number
            }
        },
        methods : {
            async handleClose(id){//删除权限
                const confirmResult= await this.$confirm('确定删除该权限?', '提示', {
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
             const res  =  await  DeleteUserRole(this.PowerUserId,id)
                if (res.meta.status!==200) {
                    return   this.$message({
                        showClose: true,
                        message: res.meta.msg,
                        type: 'error'
                    })
                }
                this.PowerFatherData(res,this.PowerUserId)
                this.$message.success('角色权限删除成功')
            },
            PowerFatherData(data,userid){ //发送事件到父组件修改当前行的数据
               this.$emit('DelPower',data,userid)
            }
        }
    }
</script>

<style scoped>
    .el-tag{
        margin: 7px;
    }
.el-row{
    display: flex;
    align-items: center;
}
    .bdtop{
            border-top: 1px solid #eee;
        }
.bdbottom{
    border-bottom: 1px solid #eee;
}
</style>