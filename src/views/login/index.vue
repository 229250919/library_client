<template>
  <div>
    <div class="login">
    </div>


    <!--登录中间块-->
    <div class="login-mid">
      <el-form ref="loginForm" :model="loginForm" auto-complete="on" label-position="left">
        <h3 class="title">图书馆座位预约管理系统</h3>
        <el-form-item prop="username">
          <el-input class="login-item" v-model="loginForm.username" style="width:80%;" name="username" type="text"
            auto-complete="on" placeholder="username" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="login-item" type="password" v-model="loginForm.password" style="width:80%;" name="password"
            auto-complete="on" placeholder="password" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button class="login-item" :loading="loading" type="primary" style="width:80%;"
            @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>


  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$http.post("/student/loginAdmin", this.loginForm).then(res => {

        if (res.data.code === 200) {
          localStorage.setItem("library_token", res.data.token);
          localStorage.setItem("username", res.data.name);
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'success',
            duration: 3000
          })
          this.$router.push("/home")
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error',
            duration: 3000
          })
        }

      })
      this.loading = false;
    }
  },
};
</script>
<style>
@import "./index.css";
</style>