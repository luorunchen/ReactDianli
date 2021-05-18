<!--
模块：设备告警--历史告警 by 孔祥义
  引用组件：
    风机选择组件  @/components/report/selectFans
-->
<template>
  <div id='HistoryWarn'>
    <!-- 查询条件 -->
    <div class="title">
      <!-- <span>查询类型：</span>
      <div class="my-btn">
        <el-select class="selectType"
                   v-model="params.selectValue">
          <el-option v-for="item in selectType"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div> -->
      <span>选择风机:</span>
      <div class="my-btn">
        <el-popover popper-class="fans-popover"
                    width="200"
                    trigger="click">
          <!-- 风机选择组件 -->
          <select-fans ref="selectFans"
                       @confirmSelectFans="confirmSelectFans"></select-fans>
          <el-input slot="reference"
                    v-model="fans"
                    readonly
                    placeholder="请选择"></el-input>

        </el-popover>
      </div>
      <!-- 时间类型 -->
      <div class="my-btn">
        <el-select class="dataType"
                   @change="dataTypeValueChange"
                   v-model="params.dataTypeValue">
          <el-option v-for="item in dataType"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="params.startTime"
                        :type="datePickerType"
                        :format="dataFormat"
                        :value-format="valueDataFormat"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="params.endTime"
                        :type="datePickerType"
                        :format="dataFormat"
                        :value-format="valueDataFormat"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <!-- <div class="my-btn">
        <el-checkbox v-model="params.isSon">是否显示子事件</el-checkbox>
      </div> -->
      <div @click="search"
           class="my-btn">
        查询
        <i class="iconfont iconsousuo"></i>
      </div>
      <div @click="exportExcel"
           class="my-btn">导出
        <i class="iconfont icondaochu"></i>
      </div>
    </div>
    <!-- 表格主体 -->
    <div class="table">
      <el-table :data="pageTableData"
                border
                :height='tableHeight'
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="triggerTime"
                         label="触发时间"
                         width="180">
        </el-table-column>
        <!-- <el-table-column prop="confirmTime"
                         label="确认时间"
                         width="180">
        </el-table-column> -->
        <el-table-column prop="resetTime"
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
    <!-- 分页组件 -->
    <div class="page">

      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageIndex"
                     :page-sizes="[10, 20, 50, 100,200]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 选择风机组件
const selectFans = () =>
  import('@/components/report/selectFans').then(m => m.default)
export default {
  name: 'HistoryWarn',
  components: { selectFans },
  data () {
    return {
      // 是否显示子事件
      isSon: true,
      // 表格数据
      tableData: [],
      // 查询类型
      selectType: [],
      // 时间类型
      dataType: [],
      // 风机选中心显示内容
      fans: '',
      // 当前页
      pageIndex: 1,
      // /每页大小
      pageSize: 50,
      // 查询参数
      params: {
        // 查询类型
        selectValue: '',
        // 时间类型
        dataTypeValue: '',
        // 选中的风机id
        fanIds: '',
        // 开始时间--eg:2020-05-21 00:00:00
        startTime: this.$moment(new Date().getTime() - 3600 * 1000 * 24).format('YYYY/MM/DD HH:mm:ss'),
        // 结束时间--eg:2020-05-21 00:00:00
        endTime: this.$moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss')
      },
      // 用来保存历史查询参数，
      oldParams: null,
      // 展示时间格式化样式
      dataFormat: 'yyyy-MM-dd HH:mm:ss',
      // 时间格式化样式
      valueDataFormat: 'yyyy/MM/dd HH:mm:ss',
      // 日期选择框类型
      datePickerType: 'datetime',
      // 表格高度
      tableHeight: window.innerHeight - 160 + 'px',
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
      const tHeader = ['触发时间', '复位时间', '风机名', '事件类型', '代码类型', '持续时间（s）', '内容']
      // 设置Excel的表格列对应的字段
      const filterVal = ['triggerTime', 'resetTime', 'fanName', 'eventType', 'codeType', 'duration', 'content']
      // 文件名
      var filrName = '历史告警列表'
      const data = this.tableData.map(v => filterVal.map(j => v[j]))
      this.$exportExcel(tHeader, data, filrName)
    },
    /**
     * 获取验证查询参数，查询前的准备工作
     */
    search () {
      // 判断是否通过表单验证
      if (this.checkSearch()) {
        // 将现有查询条件，转换成字符串存到历史查询条件中
        this.oldParams = JSON.stringify(this.params)
        this.pageIndex = 1
        this.getTableData()
      } else {
        // 还原查询条件问历史查询条件中的信息
        // this.params = JSON.parse(this.oldParams)
        // this.changeFansFromOld()
      }
    },
    /**
     * 获取表格数据方法
     */
    getTableData () {
      this.point = []
      this.params.fanIds.split(',').forEach(f => {
        this.EWObject.error.forEach(p => {
          const pp = 'ZQ:F' + f + p
          this.point.push(pp)
          this.EWObject[pp] = '故障'
        })
        this.EWObject.warn.forEach(p => {
          const pp = 'ZQ:F' + f + p
          this.point.push(pp)
          this.EWObject[pp] = '警告'
        })
      })
      // 显示loadin框
      this.$loading1()
      // eslint-disable-next-line no-unused-vars
      var this_ = this
      this.$axios
        .post(this.$url.alarm, {
          begin: this.$moment(this.params.startTime).format('YYYYMMDDHHmmss'),
          end: this.$moment(this.params.endTime).format('YYYYMMDDHHmmss'),
          wtID: this.point.join(','),
          statCode: ''
        })
        .then(response => {
          // 隐藏loading框
          this.$loading1().close()
          if (response.data.length > 0 && response.data[0].begin) {
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
          // 隐藏loading框
          this.$loading1().close()
          // this.$message.error('数据查询异常')
          console.log(error)
        })
    },
    /**
     * 查询前的表单验证
     * @return {Boolean} 验证结果；通过为true
     *  */
    checkSearch () {
      if (this.params.fanIds === '') {
        this.$message.warning('请选择风机')
        return false
      }
      if (!this.params.startTime) {
        this.$message.warning('请选择开始时间')
        return false
      }
      if (!this.params.endTime) {
        this.$message.warning('请选择结束时间')
        return false
      }
      if (Date.now() <= new Date(this.params.startTime).getTime()) {
        this.$message.warning('开始时间应小于当前时间')
        return false
      }
      if (Date.now() <= new Date(this.params.endTime).getTime()) {
        if (this.params.dataTypeValue === '0') {
          this.params.endTime = this.$moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
        } else if (this.params.dataTypeValue === '1') {
          this.params.endTime = this.$moment(new Date()).format('YYYY/MM/DD 00:00:00')
        } else if (this.params.dataTypeValue === '2') {
          this.params.endTime = this.$moment(new Date()).format('YYYY/MM/01 00:00:00')
        } else if (this.params.dataTypeValue === '3') {
          this.params.endTime = this.$moment(new Date()).format('YYYY/01/01 00:00:00')
        }
      }
      if (this.params.endTime <= this.params.startTime) {
        this.$message.warning('开始时间应小于结束时间')
        return false
      }
      return true
    },
    /**
     * 每页条数改变
     * @param {Number} val 当前每天条数数值
     */
    handleSizeChange (val) {
      // 改变分页信息，查询条件没有变化，还原之前的查询条件
      this.params = JSON.parse(this.oldParams)
      this.changeFansFromOld()
      if (!this.checkSearch()) {
        return
      }
      this.pageSize = val
    },
    /**
     * 当前页变化事件
     * @param {Number} val 当前页
     */
    handleCurrentChange (val) {
      // 改变分页信息，查询条件没有变化，还原之前的查询条件
      this.params = JSON.parse(this.oldParams)
      this.changeFansFromOld()
      if (!this.checkSearch()) {
        return
      }
      this.pageIndex = val
    },

    /**
     * 从历史查询参数中，获取数据，改变风机选中状态
     */
    changeFansFromOld () {
      this.$refs.selectFans.changeSelectFansFromOld(this.params.fanIds)
    },
    /**
     * 时间类型发生改变后触发的事件，根据不同的日期类型，设置日期格式和日期组件
     * @param {String} val 当前日期类型的值  0：任意；1：日；2：月；3：年
     */
    dataTypeValueChange (val) {
      this.params.startTime = ''
      this.params.endTime = ''
      if (val === '0') {
        this.dataFormat = 'yyyy-MM-dd HH:mm:ss'
        this.valueDataFormat = 'yyyy/MM/dd HH:mm:ss'
        this.datePickerType = 'datetime'
      } else if (val === '1') {
        this.datePickerType = 'date'
        this.dataFormat = 'yyyy-MM-dd 00:00:00'
        this.valueDataFormat = 'yyyy/MM/dd 00:00:00'
      } else if (val === '2') {
        this.datePickerType = 'month'
        this.dataFormat = 'yyyy-MM-01 00:00:00'
        this.valueDataFormat = 'yyyy/MM/01 00:00:00'
      } else if (val === '3') {
        this.datePickerType = 'year'
        this.dataFormat = 'yyyy-01-01 00:00:00'
        this.valueDataFormat = 'yyyy/01/01 00:00:00'
      }
    },
    /**
     * 确认选中风机回调函数，将组建选中的测点信息传递会父组件
     * @param {Array} val 测点选择组件中选中的风机信息，id数组
     */
    confirmSelectFans (val) {
      this.fans = '已选择' + val.length + '台'
      this.params.fanIds = val.join(',')
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
        resetTime: et,
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
        })
        .catch((error) => {
          console.log(error)
        })
    }

  },
  mounted () {
    this.getBsData()
    // 查询上报状态下拉框数据
    this.$common.findSelectByKey(2, 1).then(res => {
      this.selectType = res
      this.params.selectValue = this.selectType[0].key
      return this.$common.findSelectByKey(1, 1)
    })
      // 查询上报方式下拉框数据
      .then(res => {
        this.dataType = res
        this.params.dataTypeValue = this.dataType[0].key
        // 对必要参数初始化
        this.oldParams = JSON.stringify(this.params)
      })
  },
  computed: {
    /**
     * 根据分页信息，返回分好后的数据
     */
    pageTableData () {
      return this.tableData.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
    }
  }
}
</script>
<style lang="less" scoped>
#HistoryWarn {
  height: 100%;
  display: flex;
  flex-direction: column;
  // 查询框样式
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
      .el-select,
      .el-input {
        margin: -8px;
        input,
        .el-input__inner {
          border: none;
          background-color: rgba(255, 255, 255, 0);
          color: white;
        }
      }
      /deep/.el-input__inner {
        background: rgba(255, 255, 255, 0);
        color: white;
        // border: 1px solid rgba(44, 93, 119, 1);
        border: none;
      }
      .selectType {
        width: 300px;
      }
      .dataType {
        width: 100px;
      }
    }
    > span {
      display: inline-block;
      line-height: 46px;
      margin-left: 10px;
      min-width: 60px;
    }
  }
  //表格主体部分样式
  .table {
    // flex: 1;
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
  // 分页部分样式
  .page {
    height: 40px;
    background: rgba(0, 41, 196, 1);
    opacity: 1;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px solid rgba(10, 141, 249, 1);
    border-top: none;
    padding-top: 5px;
  }
}
</style>
<!--
风机选框样式修改，已经弹出选框内的样式修改
-->
<style lang="less">
.fans-popover .el-table {
  td,
  th {
    border: none !important;
    color: #000;
  }
  tr:nth-child(odd) {
    background-color: white;
  }
  th,
  tr:nth-child(even) {
    background-color: #e6e6e6;
  }
  tr:hover > td {
    background: #cccccc !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: teal;
  }
}
</style>
