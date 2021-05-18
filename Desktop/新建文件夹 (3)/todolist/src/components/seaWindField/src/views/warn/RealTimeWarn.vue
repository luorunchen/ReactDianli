<!--
模块：设备告警--实时告警 by 孔祥义
-->
<template>
  <div id='RealTimeWarn'>
    <!-- 按钮操作栏 -->
    <div class="title">
      <div @click="exportExcel"
           class="my-btn">导出

        <i class="iconfont icondaochu"></i>
      </div>
      <!-- <div class="my-btn">确认全部告警 <i class="iconfont iconquerenquanbugaojing"></i>
      </div>
      <div class="my-btn">
        <el-checkbox v-model="isSon">是否显示子事件</el-checkbox>
      </div> -->
    </div>
    <!-- 表格主体部分 -->
    <div class="table">
      <el-table :data="tableData"
                border
                height='100%'
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="triggerTime"
                         label="触发时间"
                         width="180">
        </el-table-column>
        <el-table-column prop="confirmTime"
                         label="复位时间"
                         width="180">
        </el-table-column>
        <el-table-column prop="fanName"
                         label="风机名"
                         width="180">
        </el-table-column>
        <el-table-column prop="eventType"
                         label="事件类型"
                         width="180">
        </el-table-column>
        <el-table-column prop="codeType"
                         label="代码类型"
                         width="180">
        </el-table-column>
        <el-table-column prop="duration"
                         label="持续时间（s）"
                         width="180">
        </el-table-column>
        <!-- <el-table-column prop="mainEvent"
                         label="主事件"
                         width="150">
        </el-table-column>
        <el-table-column prop="confirmStatus"
                         label="确认状态"
                         width="150">
        </el-table-column> -->
        <el-table-column prop="content"
                         label="内容"
                         width="">
        </el-table-column>
        <!-- <el-table-column width="50">
          <template>
            <div class="table-inner-btn">
              <i class="iconfont iconsousuo"></i>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 是否显示子事件
      isSon: true,
      // 表格数据
      tableData: [],
      // 定时任务
      timer: null,
      // 故障告警代码转译对象，和测点数据
      EWObject: {},
      // 测点数组
      point: []
    }
  },
  methods: {
    /**
     * 导出方法
     */
    exportExcel () {
      if (this.tableData.length === 0) {
        this.$message.warning('没有可以导出的数据')
        return
      }
      // 设置Excel的表格表头
      const tHeader = ['触发时间', '确认时间', '风机名', '事件类型', '代码类型', '持续时间（s）', '内容']
      // const tHeader = ['触发时间', '确认时间', '风机名', '事件类型', '代码类型', '持续时间（s）', '主事件', '确认状态', '内容']
      // 设置Excel的表格列对应的字段
      // const filterVal = ['triggerTime', 'confirmTime', 'fanName', 'eventType', 'codeType', 'duration', 'mainEvent', 'confirmStatus', 'content']
      const filterVal = ['triggerTime', 'confirmTime', 'fanName', 'eventType', 'codeType', 'duration', 'content']
      // 文件名
      var filrName = '实时告警列表'
      if (this.tableData.length === 0) {
        this.$message.error('暂无数据，无法导出！')
        return
      }
      const data = this.tableData.map(v => filterVal.map(j => v[j]))
      this.$exportExcel(tHeader, data, filrName)
    },
    /**
     * 获取表格数据方法
     */
    getTableData () {
      this.$axios
        .post(this.$url.alarm, {
          begin: this.$moment(Date.now() - 1000 * 60 * 60 * 5).format('YYYYMMDDHHmmss'),
          end: this.$moment(Date.now()).format('YYYYMMDDHHmmss'),
          wtID: this.point.join(','),
          statCode: ''
        })
        .then(response => {
          if (response.data.length > 0 && response.data[0].begin) {
            this.tableData = []
            response.data.forEach(d => {
              if (this.EWObject[d.statCode] != null && this.EWObject[d.statCode] !== '') { // 判断故障代码是否存在在故障代码json文件中。若为空则不显示（业主要求） update by fengxw 20200914
                this.tableData.push(this.getTableDataObj(d))
              }
            })
            // 对表格数据按照指定字段排序
            this.tableData.sort((a, b) => {
              if (a.triggerTime > b.triggerTime) {
                return 1
              } else if (a.triggerTime < b.triggerTime) {
                return -1
              } else {
                return 0
              }
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 根据原始数据，处理成一行列表数据
     * @param {Object} d 原始数据
     * @return {Object} 一行列表数据
     */
    getTableDataObj (d) {
      const st = this.formatTime(d.begin)
      let et = ''
      let duration = ''
      // 判断有没有结束时间
      if (d.end.length > 0) {
        et = this.formatTime(d.end)
        duration = (et.getTime() - st.getTime()) / 1000
        et = this.$moment(et).format('YYYY-MM-DD HH:mm:ss')
      }
      return {
        triggerTime: this.$moment(st).format('YYYY-MM-DD HH:mm:ss'),
        confirmTime: et,
        fanName: d.wtID.substr(3, 3),
        eventType: this.EWObject[d.wtID],
        codeType: d.statCode,
        duration: duration,
        content: this.EWObject[d.statCode]
      }
    },
    /**
     * 根据传入的特殊格式的时间，返回时间对象
     * @param {String} t 时间 yyyyMMDDHHmmss
     * @return {Object} 正常的js时间对象
     */
    formatTime (t) {
      const l = t.split('')
      return new Date(l[0] + l[1] + l[2] + l[3], Number(l[4] + l[5]) - 1, l[6] + l[7],
        l[8] + l[9], l[10] + l[11], l[12] + l[13])
    },
    /**
     * 获取页面的基本数据
     */
    getBsData () {
      this.$axios
        .get('/jsonFile/common/errorCode.json')
        .then(response => {
          this.EWObject = response.data
          // 初始化页面一些数据//测点数据，和状态码转译对象
          for (let i = 2; i < 76; i++) {
            if (i !== 42) {
              this.EWObject.error.forEach(p => {
                const pp = 'ZQ:F' + ('' + i).padStart(2, '0') + p
                this.point.push(pp)
                this.EWObject[pp] = '故障'
              })
              this.EWObject.warn.forEach(p => {
                const pp = 'ZQ:F' + ('' + i).padStart(2, '0') + p
                this.point.push(pp)
                this.EWObject[pp] = '警告'
              })
            }
          }
          // 获取列表数据
          this.getTableData()
          // 定时获取列表数据
          this.timer = setInterval(() => {
            this.getTableData()
          }, 1000 * 30)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.getBsData()
  },
  // 当该组件被销毁时，清楚定时任务
  destroyed () {
    window.clearInterval(this.timer)
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
#RealTimeWarn {
  height: 100%;
  display: flex;
  flex-direction: column;
  // <!-- 按钮操作栏 -->
  .title {
    font-size: 12px;
    font-family: Segoe UI;
    font-weight: 400;
    line-height: 16px;
    color: rgba(255, 255, 255, 1);
    opacity: 1;
    width: 100%;
    height: 50px;
    background: rgba(4, 32, 105, 1);
    opacity: 1;
    display: flex;
    .my-btn {
      height: 18px;
      background: rgba(255, 255, 255, 0);
      border: 1px solid #1882f8;
      opacity: 1;
      border-radius: 4px;
      padding: 8px;
      margin-top: 6px;
      margin-left: 7px;
      cursor: pointer;
      /deep/.el-checkbox__label {
        color: white !important;
      }
    }
  }
  // <!-- 表格主体部分 -->
  .table {
    flex: 1;
    padding: 5px;
    padding-bottom: 0px;
    .table-inner-btn {
      cursor: pointer;
      width: 20px;
      height: 20px;
      background: #00d664;
      opacity: 1;
      color: white;
      margin: auto;
    }
  }
}
</style>
