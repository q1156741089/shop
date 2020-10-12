<template>

        <el-container  class="home_content">
            <el-header class="home_header">
                <div class="img_span">
                    <img src="~assets/logo.jpg" alt="">
                    <span>电商管理后台</span>
                </div>

                <el-button type="info" @click="home_out">退出</el-button>
            </el-header>
            <el-container class="home_body">
                <home-aside :Menus="Lmenus"></home-aside>
                <el-main><router-view></router-view></el-main>
            </el-container>
        </el-container>


</template>

<script>
    import HomeAside from "./children/HomeAside";
    import Lfet_Menus from "network/Lfet_Menus";
    export default {
        name: "home",
        data(){
            return {
              Lmenus : []
            }
        },
        components :{
            HomeAside
        },
        created() {
            Lfet_Menus().then(ref=>{
                if (ref.meta.status!==200) return  this.$message({
                    showClose: true,
                    message:ref.meta.msg ,
                    type: 'error'
                });
                this.Lmenus =ref.data
            })
        },
        methods : {
            home_out(){
                window.sessionStorage.clear()
                this.$router.push('/login')
                this.$message({
                    showClose: true,
                    message: '您已退出登录'
                });
            }
        }
    }
</script>

<style scoped>
.el-header{
    background-color:#2850A7;
    display: flex;
    justify-content: space-between; /* 利用flex布局  两端对齐*/
    padding-left: 0;
    align-items:center;
}
    .el-aside{
        background-color:#3367D6;
    }
    .el_main {
        background-color: #F8F9FA;
    }
    .home_content{
      height: 100%;
    }
.el-header img {
    width:60px;
    height:60px;
}
    .img_span span {
        color: #eeeeee;
    }
.img_span{
    display: flex;
    align-items: center;
}
    .el-main{
        height: 100%;
    }
    .home_body{
        height: calc(100% - 60px);
    }
</style>