<template>
  <div>
    <!--数据表格-->
    <el-row>
      <el-col :span="24">
        <el-card header="预约记录">
          <el-table :data="tableLogData" style="width: 100%">
            <el-table-column width="130" prop="reservationID" label="预约号">
            </el-table-column>


            <el-table-column width="160" prop="studentID" label="学号">
            </el-table-column>


            <el-table-column width="160" prop="floor" label="楼层">
            </el-table-column>

            <el-table-column width="160" prop="seatNumber" label="座位号">
            </el-table-column>

            <el-table-column width="250" prop="startTime" label="开始时间">
            </el-table-column>

            <el-table-column width="250" prop="endTime" label="结束时间">
            </el-table-column>

            <el-table-column prop="status" label="状态">
            </el-table-column>


          </el-table>
        </el-card>
      </el-col>
    </el-row>


    <!--分页-->
    <el-row class="page-row">
      <el-pagination class="el-pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 30, 50]" :current-page="current"
        :page-size="size" :total="total">
      </el-pagination>
    </el-row>

  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      size: 5,
      current: 1,
      total: 0,
      tableLogData: []
    }
  },
  // 获取人脸数据
  created() {
    this.getResevationList()
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.size = val
      this.getResevationList()
    },
    // 分页
    handleCurrentChange(val) {
      this.current = val
      this.getResevationList()
    },
    // 日志列表
    getResevationList() {
      this.$http.get('/resRecord/myList', {
        params: {
          current: this.current,
          size: this.size
        }
      }).then(res => {
        this.tableLogData = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
  }
}
</script>

<style >
.page-row {
  margin-top: 20px;
  text-align: center;
}
</style>