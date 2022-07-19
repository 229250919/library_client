<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card header="人脸列表">
          <el-form :inline="true">

              <el-form-item label="人脸名称">
                <el-input
                    v-model="searchFace.faceName"
                    placeholder="名称"
                    clearable>
                </el-input>
              </el-form-item>

            <el-form-item label="人脸状态">
              <el-select v-model="searchFace.faceStatus" placeholder="请选择">
                <el-option label="不限" value=""></el-option>
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button icon="el-icon-search" @click="getFaceList">搜索</el-button>
            </el-form-item>

          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card>
          <el-header style="background-color: #ffffff">
            <el-button icon="el-icon-circle-plus-outline">添加人脸</el-button>
          </el-header>
          <el-table
              :data="tableData"
              style="width: 100%">
            <el-table-column
                width="100"
                prop="fid"
                label="编号" sortable>
            </el-table-column>

            <el-table-column
                width="150"
                prop="date"
                label="人脸图片">
              <template slot-scope="scope">
                <el-button icon="el-icon-picture-outline" size="mini" @click="selectImg(scope.row.faceBase)">查看人脸</el-button>
              </template>
            </el-table-column>

            <el-table-column
                prop="createTime"
                label="创建时间" width="200" sortable>
            </el-table-column>

            <el-table-column
                prop="vefNum"
                label="验证次数" sortable>
            </el-table-column>

            <el-table-column
                prop="faceName"
                label="姓名">
            </el-table-column>

            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>

            <el-table-column
                prop="faceStatus"
                label="是否启用" sortable>
              <template slot-scope="scope">
                <el-switch
                    :value="scope.row.faceStatus===0"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                </el-switch>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                    icon="el-icon-edit"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!--分页-->
    <el-row class="page-row">
      <el-pagination
          class="el-pagination"
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         layout="total, sizes, prev, pager, next, jumper"
         :page-sizes="[5, 10, 30, 50]"
         :current-page="current"
         :page-size="size"
         :total="total">
      </el-pagination>
    </el-row>



    <!--查看人脸图片-->
    <el-dialog
        title="人脸图片"
        :visible.sync="selectImgDialog"
        width="30%">
        <img style="width: 100%;" :src="currentImg">
    </el-dialog>

  </div>


</template>

<script>
export default {
  data() {
    return {
      size:5,
      current:1,
      total:0,
      searchFace:{
        faceName:'',
        faceStatus:''
      },
      tableData:[],
      selectImgDialog:false,
      currentImg:''
    }
  },
  created() {
      this.getFaceList()
  },
  methods: {

    // 查看人脸
    selectImg(faceBase){
        this.selectImgDialog = true
        this.currentImg = faceBase
    },
    // 获取人脸列表
    getFaceList(){
        this.$http.get('/face/faceList',{
          params:{
            current:this.current,
            size:this.size,
            faceName:this.searchFace.faceName,
            faceStatus:this.searchFace.faceStatus
          }
        }).then(res =>{
          this.tableData = res.data.data.records
          this.size = res.data.data.size
          this.current = res.data.data.current
          this.total = res.data.data.total
        })
    },
    handleSizeChange(val) {
      this.size = val
      this.getFaceList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getFaceList()
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$http.get("/face/faceDelete/"+row.fid).then(res =>{
        this.getFaceList();
        this.$message.success(res.data.msg)
      })
    }
  }
}
</script>

<style>
.page-row{
  margin-top: 20px;
  text-align: center;
}
</style>