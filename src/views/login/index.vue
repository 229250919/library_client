<template>
  <div>
    <div class="login">
    </div>


    <!--登录中间块-->
    <div class="login-mid">
      <el-form ref="loginForm" :model="loginForm" auto-complete="on" label-position="left">
        <h3 class="title">图书馆座位预约系统</h3>
        <el-form-item prop="username">
          <el-input class="login-item" v-model="loginForm.studentID" style="width:80%;" name="username" type="text"
            auto-complete="on" placeholder="学号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="login-item" type="password" v-model="loginForm.password" style="width:80%;" name="password"
            auto-complete="on" placeholder="密码" @keyup.enter.native="handleLogin" />
        </el-form-item>
        <div class="button-group">
          <el-form-item>
            <el-button class="login-item" type="primary" style="width:60%;" @click.native.prevent="handleRegister">
              注册
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button class="login-item" :loading="loading" type="primary" style="width:60%;"
              @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>


    <!-- 注册弹窗-->
    <el-dialog :title="registerTitle" :visible.sync="registerDialog" :before-close="handleClose" width="600px">
      <el-form :model="studentObj" :rules="rules" ref="ruleForm" label-width="80px">

        <el-form-item label="学号" prop="studentID">
          <el-input placeholder="请输入学号" v-model="studentObj.studentID"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="studentObj.password"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input placeholder="请输入昵称" v-model="studentObj.nickname"></el-input>
        </el-form-item>

        <el-form-item label="人脸数据" class="login-mid-mid" prop="faceBase" style="margin-top: 40px;">
          <!--捕获人脸区域-->
          <div class="savevideoCamera-canvasCamera ">
            <video id="videoCamera2" :width="videoWidth" :height="videoHeight" autoplay></video>
            <canvas style="display: none" id="canvasCamera2" :width="videoWidth" :height="videoHeight"></canvas>

            <!--人脸特效区域-->
            <div v-if="faceImgState" class="saveface-special-effects-2"></div>
            <div v-else class="saveface-special-effects"></div>
            <el-input type="hidden" v-model="studentObj.faceBase"></el-input>
          </div>

          <!--拍照显示区域-->
          <div class="savefaceBase" id="faceBase">

          </div>

          <!--按钮区域-->
          <div class="saveface-btn" v-if="cameraState">
            <el-button @click="enteringFace">{{ studentObj.faceBase === '' ? '录入人脸' : '重新录入' }}</el-button>
          </div>
          <div class="saveface-btn" v-else>
            <el-button>摄像头正在加载...</el-button>
          </div>

        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即注册</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>


      </el-form>

    </el-dialog>

  </div>
</template>
<script>
import $camera from "../../camera/index.js";
export default {
  data() {
    return {
      registerTitle: '注册',
      videoWidth: 200,
      videoHeight: 200,
      registerDialog: false,
      cameraState: false,
      loginForm: {
        studentID: '',
        password: ''
      },
      studentObj: {
        studentID: null,
        faceBase: '',
        password: '',
        nickname: '',
        creditScore: 100
      },
      rules: {
        studentID: [
          { required: true, message: '学号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        faceBase: [
          { required: true, message: '人脸数据不能为空' }
        ]
      },
      loading: false
    };
  },
  watch: {
    registerDialog: {
      handler(newValue, oldValue) {
        // 监听弹出层 设置摄像头是否开启
        if (newValue) {
          // 延迟加载 不然document.getElementById找不到
          setTimeout(() => {
            // 开启摄像头
            this.faceOption = $camera.getCamera({
              videoWidth: 200,
              videoHeight: 200,
              thisCancas: null,
              thisContext: null,
              thisVideo: null,
              canvasId: 'canvasCamera2',
              videoId: 'videoCamera2'
            });
          }, 1000)
        } else {
          let faceBase = document.getElementById("faceBase");
          faceBase.innerHTML = ""
          if (this.faceOption.thisVideo != null) {
            // 不等于null 关闭摄像头
            this.faceOption.thisVideo.srcObject.getTracks()[0].stop();
          }
        }
      }
    }
  },
  methods: {
    // 录入
    enteringFace() {
      this.studentObj.faceBase = $camera.draw(this.faceOption)
      let faceBase = document.getElementById("faceBase");
      faceBase.innerHTML = "<img src='" + this.studentObj.faceBase + "' />"
    },
    // 提交注册表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("/student/register", this.studentObj).then(res => {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success',
              duration: 3000
            })
            this.resetForm('ruleForm')
            this.registerDialog = false
          })
        } else {
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      let faceBase = document.getElementById("faceBase");
      faceBase.innerHTML = ""
      this.studentObj = {
        studentID: null,
        faceBase: '',
        password: '',
        nickname: '',
        creditScore: 100
      }
    },
    // 关闭弹出层
    handleClose() {
      this.registerDialog = false
      this.cameraState = false
      this.resetForm('ruleForm')
    },
    // 设置按钮的延迟加载
    setCameraState() {
      setTimeout(() => {
        this.cameraState = true
      }, 1500)
    },
    // 注册
    handleRegister() {
      this.setCameraState()
      this.registerDialog = true
    },
    handleLogin() {
      this.loading = true;
      this.$http.post("/student/login", this.loginForm).then(res => {

        if (res.data.code === 200) {
          localStorage.setItem("library_token", res.data.token);
          localStorage.setItem("username", res.data.data.nickname);
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