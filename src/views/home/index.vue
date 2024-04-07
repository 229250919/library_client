<template>
  <el-container class="main">
    <!--头部区域-->
    <el-header>
      <div class="logo-title">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图书馆座位预约管理系统
      </div>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>

    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside style="width: 200px">
        <el-menu text-color="#008390" active-text-color="#ade2e0" class="el-menu-vertical-demo">

          <router-link class="router-link-active" to="/student">
            <el-menu-item index="1">
              <i class="el-icon-user"></i>
              <span slot="title">读者管理</span>
            </el-menu-item>
          </router-link>

          <router-link class="router-link-active" to="/reservationLog">
            <el-menu-item index="2">
              <i class="el-icon-time"></i>
              <span slot="title">预约记录</span>
            </el-menu-item>
          </router-link>

          <router-link class="router-link-active" to="/checkinLog">
            <el-menu-item index="3">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">签到记录</span>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>

      <!--右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      username: "admin",
      imageLogo: require("@/assets/face_logo.png"),
    };
  },
  created() {
    this.username = localStorage.getItem("username");
  },
  methods: {
    //退出登录
    loginOut() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style>
@import "./index.css";
</style>