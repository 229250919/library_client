<template>
  <div>
    <!-- 用户信息 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>个人信息</span>
      </div>
      <div style="padding: 20px;" v-if="!loading">
        <div style="padding: 20px;">
          <p><strong>学号：</strong> {{ studentObj.studentID }}</p>
          <p><strong>昵称：</strong> {{ studentObj.nickname }}</p>
          <p><strong>信誉分：</strong> {{ studentObj.creditScore }}</p>

        </div>

        <el-spinner v-if="loading" size="medium" style="margin: 20px auto; display: block;"></el-spinner>
      </div>
      <el-button icon="el-icon-s-custom" @click="showFaceImg">查看人脸图片</el-button>
      <el-button icon="el-icon-scissors" @click="changeInfo">修改个人信息</el-button>
    </el-card>




    <!--查看人脸图片-->
    <el-dialog title="人脸图片" :visible.sync="imgDialog" width="30%">

      <img style="width: 100%;" :src="studentObj.faceBase">
    </el-dialog>


    <!-- 添加/修改-->
    <el-dialog :title="title" :visible.sync="changeInfoDialog" :before-close="handleClose" width="600px">
      <el-form :model="studentObjT" :rules="rules" ref="ruleForm" label-width="80px">

        <el-form-item label="学号" prop="studentID">
          <el-input placeholder="学号" v-model="studentObjT.studentID" disabled></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入新密码" v-model="studentObjT.password"></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname" style="margin-bottom: 40px">
          <el-input placeholder="请输入昵称" v-model="studentObjT.nickname"></el-input>
        </el-form-item>

        <el-form-item label="人脸数据" class="login-mid-mid" prop="faceBase">
          <!--捕获人脸区域-->
          <div class="savevideoCamera-canvasCamera ">
            <video id="videoCamera2" :width="videoWidth" :height="videoHeight" autoplay></video>
            <canvas style="display: none" id="canvasCamera2" :width="videoWidth" :height="videoHeight"></canvas>

            <!--人脸特效区域-->
            <div v-if="faceImgState" class="saveface-special-effects-2"></div>
            <div v-else class="saveface-special-effects"></div>
            <el-input type="hidden" v-model="studentObjT.faceBase"></el-input>
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
          <el-button type="primary" @click="submitForm('ruleForm')">保存修改</el-button>
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
      loading: true, // 加载状态
      videoWidth: 200,
      videoHeight: 200,
      faceImgState: false,
      imgDialog: false,
      changeInfoDialog: false,
      title: '',
      studentObj: {
        studentID: null,
        faceBase: '',
        password: '',
        nickname: '',
        creditScore: null
      },
      // 临时个人信息变量
      studentObjT: {
        studentID: null,
        faceBase: '',
        password: '',
        nickname: '',
        creditScore: null
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
      faceOption: {},
      cameraState: false
    }
  },
  watch: {
    changeInfoDialog: {
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
  // 获取学生数据
  created() {
    this.getUserInfo()
  },
  methods: {
    // 录入
    enteringFace() {
      this.studentObjT.faceBase = $camera.draw(this.faceOption)
      let faceBase = document.getElementById("faceBase");
      faceBase.innerHTML = "<img src='" + this.studentObjT.faceBase + "' />"
    },
    // 提交修改
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("/student/update", this.studentObjT).then(res => {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success',
              duration: 3000
            })
            this.getUserInfo()
            this.changeInfoDialog = false
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
      this.studentObjT = {
        studentID: null,
        faceBase: '',
        password: '',
        nickname: '',
        creditScore: null
      }
    },
    // 查看人脸
    showFaceImg() {
      this.imgDialog = true
    },

    getUserInfo() {
      this.loading = true;
      this.$http.get("/student/info").then(res => {
        this.studentObj = res.data.data
        localStorage.setItem("username", res.data.data.nickname);
        this.$emit('updateUsername', res.data.data.nickname);
      })
      this.loading = false;
    },
    // 关闭弹出层
    handleClose() {
      this.changeInfoDialog = false
      this.cameraState = false
      this.resetForm('ruleForm')
    },
    // 设置按钮的延迟加载
    setCameraState() {
      setTimeout(() => {
        this.cameraState = true
      }, 1500)
    },
    // 修改
    changeInfo() {
      this.setCameraState()
      this.title = '修改个人信息'
      this.changeInfoDialog = true
      this.studentObjT = { ...this.studentObj };
      this.$nextTick(() => {
        let faceBase = document.getElementById("faceBase");
        if (faceBase) {
          faceBase.innerHTML = "<img src='" + this.studentObj.faceBase + "' />"
        }
      });
    },
  },
  props: ['username'],
}
</script>

<style>
@import "./index.css";
</style>