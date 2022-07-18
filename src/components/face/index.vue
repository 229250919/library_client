<template>

  <el-row>
    <el-col :span="24">
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="date"
            label="编号" sortable>
        </el-table-column>

        <el-table-column
            prop="date"
            label="人脸图片">
        </el-table-column>

        <el-table-column
            prop="date"
            label="创建时间" sortable>
        </el-table-column>

        <el-table-column
            prop="date"
            label="验证次数" sortable>
        </el-table-column>

        <el-table-column
            prop="date"
            label="姓名">
        </el-table-column>

        <el-table-column
            prop="date"
            label="备注">
        </el-table-column>

        <el-table-column
            prop="date"
            label="是否禁用" sortable>
        </el-table-column>

<!--        <el-table-column-->
<!--            label="姓名">-->
<!--          <template slot-scope="scope">-->
<!--            <el-popover trigger="hover" placement="top">-->
<!--              <p>姓名: {{ scope.row.name }}</p>-->
<!--              <p>住址: {{ scope.row.address }}</p>-->
<!--              <div slot="reference" class="name-wrapper">-->
<!--                <el-tag size="medium">{{ scope.row.name }}</el-tag>-->
<!--              </div>-->
<!--            </el-popover>-->
<!--          </template>-->
<!--        </el-table-column>-->


        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-col>
  </el-row>

</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
}
</script>