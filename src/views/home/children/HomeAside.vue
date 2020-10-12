<template>
    <el-aside :width="Iscollapse ? '64px' : '200px'">
        <div class="collapse" @click="collapseClick"> | | | </div>
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#2850A7"
                text-color="#fff"
                active-text-color="#ffd04b" unique-opened :collapse="Iscollapse"
                :collapse-transition="false" router
                :default-active="defaultA">
            <!--                            一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in Menus"  :key="item.id" >
                <!--                                1级菜单模板区-->
                <template slot="title">
                    <!--                                    图标-->
                    <i class="el-icon-location"></i>
                    <!--                                    文字-->
                    <span>{{item.authName}}</span>
                </template>
                <!--                                二级菜单-->
                <el-menu-item  :index="'/' + childItem.path"
                               v-for="childItem in item.children" :key="childItem.id"
                               @click="active('/' + childItem.path)">
                    <template slot="title">
                        <!--                                    图标-->
                        <i class="el-icon-location"></i>
                        <!--                                    文字-->
                        <span>{{childItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>

<script>
    export default {
        name: "HomeAside",
        created() {
            this.defaultA =sessionStorage.getItem('defaultActive')
        },
        data(){
          return {
              Iscollapse : false,
              defaultA : ''
          }
        },
        props : {
            Menus : {
                type : Array,
                default(){
                  return []
                }
            }
        },
        methods : {
            collapseClick(){
              this.Iscollapse =!this.Iscollapse
            },
            active(index){
              sessionStorage.setItem('defaultActive',index)
                this.defaultA =sessionStorage.getItem('defaultActive')
            }
    }
    }
</script>

<style scoped>
    .el-menu{
        border-right: none;
    }
    .collapse {
        text-align: center;
        color: #eeeeee;
        line-height: 29px;
    }
</style>