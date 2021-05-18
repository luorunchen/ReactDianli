<!--
模块：数据查询--历史数据 by 孔祥义
  引用组件：
    历史曲线组件  @/components/data/CurveComparisonHistory
    测点组件  @/components/data/selectPoint
-->
<template>
  <div id='History'>
    <!-- 查询div -->
    <div class="title">
      <span>选择测点:</span>
      <div class="my-btn">

        <el-popover popper-class="points-popover"
                    width="360"
                    visible-arrow="false"
                    trigger="click">
          <!-- 使用测点选择组件 -->
          <select-point @confirmSelectPoint="confirmSelectPoint"></select-point>

          <el-input slot="reference"
                    id="pointsImput"
                    v-model="points"
                    readonly
                    placeholder="请选择"></el-input>

        </el-popover>

      </div>
      <div class="my-btn">

        <el-select class="dataType"
                   @change="dataTypeValueChange"
                   v-model="dataTypeValue">
          <el-option v-for="item in dataType"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>

      </div>
      <div class="my-btn">
        <el-date-picker v-model="startTime"
                        :type="datePickerType"
                        :format="dataFormat"
                        :value-format="valueDataFormat"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="endTime"
                        :type="datePickerType"
                        :format="dataFormat"
                        :value-format="valueDataFormat"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <span>精度:</span>

      <div class="my-btn">
        <el-input style="width:80px"
                  v-model="precision"></el-input>

        <span>分</span>
      </div>
      <div @click="search"
           class="my-btn">
        查询
        <i class="iconfont iconsousuo"></i>
      </div>
      <!-- <div  class="my-btn">导出
        <i class="iconfont icondaochu"></i>
      </div> -->
    </div>
    <!-- 页面主体部分 -->
    <div class="table">
      <div class="t"></div>
      <div class="main">
        <div class="chart">
          <!-- 使用历史曲线组件 -->
          <curve-comparison-history :count="0"
                                    ref="CurveComparisonHistory1"
                                    :pointsData="selectPoints"></curve-comparison-history>
        </div>
        <div class="chart">
          <!-- 使用历史曲线组件 -->
          <curve-comparison-history :count="1"
                                    ref="CurveComparisonHistory2"
                                    :pointsData="selectPoints"></curve-comparison-history>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 历史曲线组件
const CurveComparisonHistory = () =>
  import('@/components/data/CurveComparisonHistory').then(m => m.default)
// 测点选择组件
const selectPoint = () =>
  import('@/components/data/selectPoint').then(m => m.default)
export default {
  name: 'History',
  components: { CurveComparisonHistory, selectPoint },
  data () {
    return {
      // 时间类型
      dataType: [],
      // 精度
      precision: 5,
      // /时间类型选中项
      dataTypeValue: '0',
      // 开始时间--eg:2020-05-21 00:00:00
      startTime: this.$moment(new Date().getTime() - 3600 * 1000 * 24).format('YYYY/MM/DD HH:mm:ss'),
      // 结束时间--eg:2020-05-21 00:00:00
      endTime: this.$moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss'),
      // 选中的测点
      selectPoints: [],
      // 展示时间格式化格式
      dataFormat: 'yyyy-MM-dd HH:mm:ss',
      // 时间格式化样式
      valueDataFormat: 'yyyy/MM/dd HH:mm:ss',
      // 日期选择框类型
      datePickerType: 'datetime'

    }
  },
  methods: {
    /**
     * 确认选中测点回调函数，将组建选中的测点信息传递会父组件
     * @param {Array} val 测点选择组件中选中的测点信息
     */
    confirmSelectPoint (val) {
      this.selectPoints = val
    },
    /**
     * 查询数据方法
     */
    search () {
      // 查询前的表单验证
      if (!this.startTime) {
        this.$message.warning('请选择开始时间')
        return false
      }
      if (!this.endTime) {
        this.$message.warning('请选择结束时间')
        return false
      }
      if (this.endTime <= this.startTime) {
        this.$message.warning('开始时间应小于结束时间')
        return false
      }
      if (Date.now() <= new Date(this.startTime).getTime()) {
        this.$message.warning('开始时间应小于当前时间')
        return false
      }
      if (Date.now() <= new Date(this.endTime).getTime()) {
        if (this.dataTypeValue === '0') {
          this.endTime = this.$moment(new Date()).format('YYYY/MM/DD HH:mm:ss')
        } else if (this.dataTypeValue === '1') {
          this.endTime = this.$moment(new Date()).format('YYYY/MM/DD 00:00:00')
        } else if (this.dataTypeValue === '2') {
          this.endTime = this.$moment(new Date()).format('YYYY/MM/01 00:00:00')
        } else if (this.dataTypeValue === '3') {
          this.endTime = this.$moment(new Date()).format('YYYY/01/01 00:00:00')
        }
      }
      if (isNaN(this.precision) || !this.precision) {
        this.$message.warning('精度请输入数字')
        return false
      }

      const params = {
        startTime: this.startTime,
        endTime: this.endTime,
        // 精度问题
        precision: this.precision
      }
      // 进行精度合理性验证，如果时间跨度过大，精度太小则给出提示
      const day = (new Date(this.endTime).getTime() - new Date(this.startTime).getTime()) / 1000 / 60 / 60 / 24
      if (day * 5 / this.precision > 10) {
        this.$confirm('所选择时间跨度较大,查询时间可能会较长。是否继续？ 建议精度：' + Math.ceil(day * 5) + '')
          .then(_ => {
            // 调用历史曲线的查询历史测点方法
            this.$refs.CurveComparisonHistory1.search(params)
            this.$refs.CurveComparisonHistory2.search(params)
          })
          .catch(_ => { })
      } else {
        // 调用历史曲线的查询历史测点方法
        this.$refs.CurveComparisonHistory1.search(params)
        this.$refs.CurveComparisonHistory2.search(params)
      }
    },
    /**
     * 时间类型发生改变后触发的事件，根据不同的日期类型，设置日期格式和日期组件
     * @param {String} val 当前日期类型的值  0：任意；1：日；2：月；3：年
     */
    dataTypeValueChange (val) {
      this.endTime = ''
      this.startTime = ''
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
    }
  },
  mounted () {
    // 查询上报状态下拉框数据
    this.$common.findSelectByKey(1, 1).then(res => {
      this.dataType = res
      this.dataTypeValue = this.dataType[0].key
    })
  },
  computed: {
    // 计算测点选中信息
    points () {
      return this.selectPoints.length > 0 ? '已选中' + this.selectPoints.length + '个测点' : ''
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
//定义页面内的元素的样式
#History {
  height: 100%;
  display: flex;
  flex-direction: column;
  //查询栏div的样式
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
  //主体部分样式
  .table {
    flex: 0.95;
    background: #042069;
    border: 1px solid #0a8df9;
    opacity: 1;
    border-radius: 2px;
    padding-bottom: 0px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    .t {
      height: 30px;
      background: rgba(0, 47, 162, 1);
      opacity: 1;
      border-radius: 1px 1px 0px 0px;
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      .chart {
        flex: 0.5;
        margin: 10px;
        background: rgba(0, 41, 196, 1);
        border: 3px solid rgba(10, 141, 249, 1);
        opacity: 1;
      }
      .chart:last-child {
        margin-top: 0px;
      }
    }
  }
}
</style>
<style lang="less">
//修改ellementui默认样式，以及测点选择框内的样式
.points-popover {
  width: 360px !important;
  height: 396px !important;
  background: rgba(0, 41, 196, 1) !important;
  border: 1px solid rgba(10, 141, 249, 1) !important;
  font-size: 12px !important;
  font-family: Segoe UI !important;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 1) !important;
  opacity: 1;
  .popper__arrow {
    display: none !important;
  }

  .title {
    width: 349px;
    height: 20px;
    background: #001f95;
    opacity: 1;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    > div:first-child {
      font-size: 14px;
    }
    > div:last-child {
      cursor: pointer;
    }
  }
  .search-div {
    padding: 5px 10px;
    > span {
      display: inline-block;
      width: 57px;
      height: 15px;
      background: #0029c4;
      border: 1px solid #1882f8;
      box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.3);
      opacity: 1;
      padding: 5px;
      border-radius: 4px;
      margin-right: 10px;
    }

    .el-input {
      width: 190px;
      height: 20px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(24, 130, 248, 1);
      opacity: 1;
      border-radius: 4px;
    }
    > div {
      display: inline-block;
    }
    i {
      display: inline-block;
      width: 45px;
      height: 17px;
      background: #0029c4;
      border: 1px solid #1882f8;
      opacity: 1;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 5px;
      font-size: 13px;
      padding: 5px;
    }
    input {
      height: 25x;
    }
  }
  .page {
    margin-top: 5px;
    .el-pager li {
      display: none;
    }
    .el-pagination__total {
      width: 43px;
      margin-left: -9px;
      margin-right: 18px;
    }
    .el-pagination .el-select .el-input {
      width: 86px;
      margin-right: 0px;
    }
    .el-pagination__jump {
      margin: 0px;
    }
  }
}
</style>
