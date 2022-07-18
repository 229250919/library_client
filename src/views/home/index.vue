<template>
    <div>
      当前是首页
      <el-button>退出登录</el-button>
    </div>
</template>

<script>
export default {
name: "index",
  data(){
    return{

    }
  },

  methods:{
    loginOut(){
      localStorage.clear();
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>

</style>