<template>
  <div>


    <el-row>
      <!--条件搜索区域-->
      <el-col :span="24">
        <el-card header="座位预约">
          <el-form :inline="true">
            <el-form-item label="楼层">
              <el-select v-model="floor" placeholder="请选择楼层" @change="handleFloorChange">
                <el-option v-for="item in floors" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 温度、湿度 -->
      <el-col :span="24" v-if="temperature !== null || humidity !== null">
        <el-card header="环境数据" style="margin-top: 20px;">
          <el-form :inline="true">
            <el-form-item v-if="temperature !== null">
              <span style="font-size: 30px;">温度：{{ temperature }} °C&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </el-form-item>
            <el-form-item v-if="humidity !== null">
              <span style="font-size: 30px;">湿度：{{ humidity }} %</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-row>
      <el-col :span="24">
        <el-card>
          <el-table :data="seats" style="width: 100%">
            <el-table-column width="200" prop="floor" label="楼层">
            </el-table-column>


            <el-table-column width="200" prop="seatNumber" label="座位号">
            </el-table-column>


            <el-table-column width="200" prop="status" label="状态">
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button style="margin-left: 20px" icon=" el-icon-edit" size="mini" type="primary" slot="reference"
                  :disabled="scope.row.status === '已约满'" @click="reserve(scope.row)">预约</el-button>
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

    <!-- 预约选择时间弹窗 -->
    <el-dialog title="预约座位" :visible.sync="ResDialog" width="600px">
      <el-form :model="ResObj" ref="ruleForm" label-width="80px">

        <el-form-item label="楼层">
          <span>{{ ResObj.floor }}</span>
        </el-form-item>

        <el-form-item label="座位号">
          <span>{{ ResObj.seatNumber }}</span>
        </el-form-item>

        <el-form-item label="选择时间">
          <el-checkbox-group v-model="ResObj.selectedTimes">
            <el-checkbox v-for="time in ResTimes" :key="time.label" :label="time.label" :disabled="time.reserved">
              {{ time.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitReserve">立即预约</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import mqtt from 'mqtt/dist/mqtt'
import { mqttUrl, mqttConfig } from '../../mqttPropertity'
export default {
  name: "index",
  data() {
    return {
      size: 5,
      current: 1,
      total: 0,
      floors: [],
      floor: '',
      seats: [],
      ResDialog: false,
      ResObj: {
        floor: null,
        seatNumber: null,
        selectedTimes: [] // 用来存储用户选中的时间段
      },
      ResTimes: [],
      temperature: null,
      humidity: null
    }
  },
  watch: {
    floor(newValue, oldValue) {
      if (oldValue != '') {
        this.unsubscribeFloor(oldValue)
      }
      this.subscribeFloor(newValue);

      this.temperature = null;
      this.humidity = null;
      this.lamp = null;
    }
  },
  // 获取人脸数据
  created() {
    this.getSeatList()
    this.getFloors()
    this.initMqtt()
  },
  methods: {
    initMqtt() {
      this.MQTT = mqtt.connect(mqttUrl, mqttConfig)

      // 检测mqtt是否连接成功
      this.MQTT.on('error', (e) => {
        console.log(e)
        this.MQTT.end();
      });
      const _this = this;
      // 设置来收到消息处理的方法
      this.MQTT.on('message', function (top, message) {
        message = message.toString();
        const topic = top.split('/');
        //根据不同主题进行赋值操作
        switch (topic[0]) {
          case 'floor':
            // #36#34#off 温度 湿度 灯
            const value = message.split('#');
            // ['', '32', '36', 'off']
            _this.temperature = value[1];
            _this.humidity = value[2];
            break;
        }
      });

    },
    subscribeFloor(id) {
      this.MQTT.subscribe("floor/" + id, { qos: 0 }, err => {
        if (!err) {
        } else {
          console.warn('订阅失败')
        }
      })
      this.MQTT.on('connect', () => {

      });
    },
    unsubscribeFloor(id) {
      this.MQTT.unsubscribe("floor/" + id, { qos: 0 }, err => {
        if (!err) {
        } else {
          console.warn('取消订阅失败')
        }
      })
      this.MQTT.on('connect', () => {

      });
    },
    submitReserve() {
      this.$http.post("/seat/reserve/" + this.ResObj.floor + "/" + this.ResObj.seatNumber, this.ResObj.selectedTimes).then(res => {
        if (res.data.code >= 0) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'success',
            duration: 3000
          })
          this.getSeatList()
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'error',
            duration: 3000
          })
        }

        this.ResDialog = false
      })
    },
    reserve(row) {
      this.ResDialog = true
      this.ResObj.floor = row.floor
      this.ResObj.seatNumber = row.seatNumber
      this.ResObj.selectedTimes = []
      // 获取当前用户可以预约该座位的时间表（座位空闲时间和用户空闲时间，用户同一时间只能预约一个）
      this.$http.get("/seat/times/" + row.floor + "/" + row.seatNumber).then(res => {
        this.ResTimes = res.data.data
      })
    },
    handleFloorChange(val) {
      this.floor = val
      this.getSeatList()
    },
    // 分页
    handleSizeChange(val) {
      this.size = val
      this.getSeatList()
    },
    // 分页
    handleCurrentChange(val) {
      this.current = val
      this.getSeatList()
    },
    // 座位列表
    getSeatList() {
      this.$http.get('/seat/list', {
        params: {
          current: this.current,
          size: this.size,
          floor: this.floor
        }
      }).then(res => {
        this.seats = res.data.data.records
        this.size = res.data.data.size
        this.current = res.data.data.current
        this.total = res.data.data.total
      })
    },
    getFloors() {
      this.$http.get('/seat/floors').then(res => {
        this.floors = res.data.data
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