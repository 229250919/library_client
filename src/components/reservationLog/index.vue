<template>
  <div>
    <!--数据表格-->
    <el-row>
      <el-col :span="24">
        <el-card header="预约记录">
          <el-table :data="tableLogData" style="width: 100%">
            <el-table-column width="120" prop="reservationID" label="预约号">
            </el-table-column>


            <el-table-column width="160" prop="studentID" label="学号">
            </el-table-column>


            <el-table-column width="100" prop="floor" label="楼层">
            </el-table-column>

            <el-table-column width="100" prop="seatNumber" label="座位号">
            </el-table-column>

            <el-table-column width="180" prop="startTime" label="开始时间">
            </el-table-column>

            <el-table-column width="180" prop="endTime" label="结束时间">
            </el-table-column>

            <el-table-column width="150" prop="status" label="状态">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button :disabled="!isButtonDisabled(scope.row.startTime)" icon=" el-icon-edit" size="mini"
                  @click="handleEdit(scope.$index, scope.row)">修改时间</el-button>
                <el-popconfirm :title="('确认取消预约吗?')" @confirm="handleDelete(scope.$index, scope.row)">
                  <el-button :disabled="!isButtonDisabled(scope.row.startTime)" style=" margin-left: 20px"
                    icon="el-icon-delete" size="mini" type="danger" slot="reference">取消预约</el-button>
                </el-popconfirm>
              </template>
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
    isButtonDisabled(startTime) {
      const currentDate = new Date(); // 当前日期时间
      const startDate = new Date(startTime); // 开始时间

      // 只比较日期，不比较时间
      currentDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      console.log(currentDate)
      console.log(startDate)

      // 如果开始日期晚于当前日期，则按钮可用
      return startDate > currentDate;
    },
    //删除
    handleDelete(index, row) {
      this.$http.delete("/resRecord/" + row.reservationID).then(res => {
        this.getResevationList();
        this.$message.success(res.data.msg)
      })
    }
  }
}
</script>

<style >
.page-row {
  margin-top: 20px;
  text-align: center;
}
</style>