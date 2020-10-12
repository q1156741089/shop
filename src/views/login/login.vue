<template>
    <div class="login_body">
<!--        logo区域-->
          <div class="login_content">
              <div class="login_img"><img src="~assets/logo.png" alt=""></div>
              <!--        表单-->
              <el-form  class="login_form" ref="loginFrom" :model="form" :rules="loginRules">
                  <el-form-item class="login_input" prop="username">
                      <el-input prefix-icon="iconfont icon-denglu" v-model="form.username" ></el-input>
                  </el-form-item>
                  <el-form-item class="login_input" prop="password">
                      <el-input prefix-icon="iconfont icon-denglu1" type="password" v-model="form.password" ></el-input>
                  </el-form-item>
                   <div class="login_button">
                       <el-button type="primary" @click="loginSign">登录</el-button>
                       <el-button type="info" @click="loginResult">重置</el-button>
                   </div>
              </el-form>
          </div>
    </div>
</template>

<script>
    import login from "network/login";
    export default {
        name: "login",
        data(){
            return {
                //登录账号密码
                form :{
                    username :'admin',
                    password :'123456'
                },
                loginRules: {
                    username: [
                        { required: true, message: '请输入登录账号', trigger: 'blur' },
                        { min: 5, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
                    ],
                }
            }
        },
        methods : {
            loginResult(){
                //重置表单
                this.$refs.loginFrom.resetFields()
            },
            loginSign(){
            //    登录
               this.$refs.loginFrom.validate(valid=>{
                   if (!valid) return
                   login(this.form).then(ref=>{
                     if( ref.meta.status == 200){
                         this.$message({
                             showClose: true,
                             message: '恭喜您，登录成功',
                             type: 'success'
                         });
                         window.sessionStorage.setItem('token',ref.data.token)
                         this.$router.push('/home')
                     }else{
                         this.$message({
                             showClose: true,
                             message:ref.meta.msg ,
                             type: 'error'
                         });
                     }

                   })
               })
            }
        }
    }
</script>

<style scoped>
 .login_body {
     background-color:#2b4b6b;
     height: 100vh;
 }
    .login_content {
        height: 300px;
        width: 450px;
        background-color: #fff;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 10px;
    }

 .login_img{
    height: 130px;
     width: 130px;
     border: 2px solid #eeeeee;
     border-radius: 50%;
     padding: 6px;
     box-shadow:0 0 10px #dddd;
     position: relative;
     left: 50%;
     transform: translate(-50%,-50%);
     background-color: #fff;

 }
    .login_img img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background: #eeeeee;
    }
    .login_input{
        padding: 0px 20px;
    }
    .login_form{
        margin-top: -10%;
    }
  .login_button {
      text-align: right;
       padding: 0px 20px;
  }
</style>