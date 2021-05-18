<!--
模块：系统报表--风玫瑰图 by 孔祥义
-->
<template>
  <div id='WindRose'>
    <!-- 查询部分 -->
    <div class="title">
      <span>选择风机:</span>
      <div class="my-btn">
        <el-popover popper-class="fans-popover"
                    width="200"
                    trigger="click">
          筛选
          <br>
          <el-input v-model="searchFans"
                    size="mini"
                    placeholder="输入关键字搜索" />
          <el-table :data="fansData.filter(data => !searchFans || data.name.toLowerCase().includes(searchFans.toLowerCase()))"
                    style="width: 100%"
                    height="250"
                    ref="multipleTableFans"
                    highlight-current-row
                    @row-click="handleCurrentChange">
            <el-table-column label="风机"
                             prop="name">
            </el-table-column>
          </el-table>
          <el-input slot="reference"
                    v-model="currentFan.name"
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
      <div @click="getPointData"
           class="my-btn">
        查询
        <i class="iconfont iconsousuo"></i>
      </div>
    </div>
    <!-- 主体图表部分，为了能够适应浏览器高度，这里对高度进行了动态赋值 -->
    <div :style="{height:tableHeightOut}"
         class="table">
      <!-- 风玫瑰图部分 -->
      <div class="tab-div">
        <el-tabs v-model="activeNameTab1">
          <el-tab-pane label="图形模式"
                       name="first">
            <div class="chart-div"
                 :style="{ height: echartsHeight, width: echartsWidth }"
                 id='WindRoseRadar'></div>
          </el-tab-pane>
          <el-tab-pane label="表格模式"
                       name="second">
            <div @click="exportExcel(1)"
                 style="background:#042069;width:100px;margin-bottom: 10px;"
                 class="my-btn">
              导出数据到Exel
            </div>
            <div class="innerTable">
              <el-table :data="tableData1"
                        border
                        height="100%"
                        style="width: 100%">
                <el-table-column v-for="(value,name,i) in tableData1[0]"
                                 :key="i"
                                 :prop="name"
                                 :label="i===0?'类型':name"
                                 :fixed="i===0?true:false"
                                 width="">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 风频图部分 -->
      <div class="tab-div">
        <el-tabs v-model="activeNameTab2">
          <el-tab-pane label="图形模式"
                       name="third">
            <div class="chart-div"
                 :style="{ height: echartsHeight, width: echartsWidth }"
                 id='WindRoseBar'></div>
          </el-tab-pane>
          <el-tab-pane label="表格模式"
                       name="fourth">
            <div @click="exportExcel(2)"
                 style="background:#042069;width:100px;margin-bottom: 10px;"
                 class="my-btn">
              导出数据到Exel
            </div>
            <div class="innerTable">
              <el-table :data="tableData2 "
                        border
                        height="100%"
                        style="width: 100%">
                <!-- <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column> -->
                <el-table-column v-for="(itme,i) in tableCol2"
                                 :key="i"
                                 :prop="isNaN(itme)?itme:itme*10+''"
                                 :fixed="isNaN(itme)?true:false"
                                 :label="itme+''"
                                 width="">
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WindRose',
  data () {
    return {
      // 表格1数据
      tableData1: [],
      // 表格2数据
      tableData2: [],
      // 表格2的列信息
      tableCol2: [],
      // 时间类型选项数据
      dataType: [],
      // 时间类型选中项信息
      dataTypeValue: '0',
      // 开始时间--eg:2020-05-21 00:00:00
      startTime: this.$moment(new Date().getTime() - 3600 * 1000 * 24).format('YYYY/MM/DD HH:mm:ss'),
      // 结束时间--eg:2020-05-21 00:00:00
      endTime: this.$moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss'),
      // 风机查询条件
      searchFans: '',
      // 风机数据
      fansData: [],
      // 当前选中风机
      currentFan: {},
      // 第一个tab组件活跃的tab
      activeNameTab1: 'first',
      // 第二个tab组件活跃的tab
      activeNameTab2: 'third',
      // 表格高度
      tableHeight: (window.innerHeight - 300) / 2,
      // echarts图高度
      echartsHeight: (window.innerHeight - 200) / 2 + 'px',
      // echarts图宽度
      echartsWidth: window.innerWidth - 200 + 'px',
      // 主体部分高度
      tableHeightOut: window.innerHeight - 300 + 'px',
      // 柱状图配置信息
      barOption: {},
      // 柱状图x轴
      bar_xAxis: [],
      // 柱状图数据信息
      bar_series: [],
      // 雷达图配置信息
      pointOption: {},
      // 第一组雷达数据
      radar_series1: [],
      // 第二组雷达数据
      radar_series2: [],
      // 第三组雷达数据
      radar_series3: [],
      // 展示时间格式化格式
      dataFormat: 'yyyy-MM-dd HH:mm:ss',
      // 时间格式化样式
      valueDataFormat: 'yyyy/MM/dd HH:mm:ss',
      // 日期选择框类型
      datePickerType: 'datetime',
      // 风向用来统计的项
      FX: [
        'N',
        'NNW',
        'NW',
        'WNW',
        'W',
        'WSW',
        'SW',
        'SSW',
        'S',
        'SSE',
        'SE',
        'ESE',
        'E',
        'ENE',
        'NE',
        'NNE'],
      // 雷达图中的最大值
      max: 0

    }
  },
  methods: {
    /**
     * 选择风机弹框行点击事件
     * @param {Object} val 当前点击的风机
     */
    handleCurrentChange (val) {
      this.currentFan = val
    },
    /**
     * 导出的方法
     * @param {Number} curveId 导出的信息标识；1：风玫瑰图；2：风频图
     */
    exportExcel (curveId) {
      // 设置Excel的表格表头
      var tHeader = []
      // 设置Excel的表格列对应的字段
      var filterVal = []
      // 文件名
      var filrName = ''
      // 导出数据数组
      let data = []
      if (curveId === 1) { // 风玫瑰图
        if (this.tableData1.length <= 1) {
          this.$message.warning('暂无数据，无法导出！')
          return
        }
        tHeader = ['类型', 'N', 'NNW', 'NW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE']
        filterVal = ['type', 'N', 'NNW', 'NW', 'W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE']
        filrName = '风玫瑰图表格'
        data = this.tableData1.map(v => filterVal.map(j => v[j]))
      } else { // 风频图
        if (this.tableData2.length <= 0) {
          this.$message.warning('暂无数据，无法导出！')
          return
        }
        filrName = '风频图表格'
        tHeader.push('类别')
        filterVal.push('类别')
        for (const key in this.tableData2[1]) {
          if (!isNaN(key)) {
            tHeader.push(key / 10)
            filterVal.push(key + '')
          }
        }
        data = this.tableData2.map(v => filterVal.map(j => v[j]))
        filrName = '风频图表格'
      }
      this.$exportExcel(tHeader, data, filrName)
    },
    /**
     * 获取测点数据
     */
    getPointData () {
      // 判断是否通过表单验证
      if (!this.checkSearch()) {
        return
      }
      // 显示loadin框
      this.$loading1()
      // 查询风速/风向。然后处理数据
      this.$axios
        .post(this.$url.historicalUrl, {
          tags: 'ZQ:F' + this.currentFan.id + 'WSPEED|ZQ:F' + this.currentFan.id + 'WDIR2',
          time: this.$moment(new Date(this.startTime)).format('YYYYMMDDHHmmss') + '-' + this.$moment(new Date(this.endTime)).format('YYYYMMDDHHmmss'),
          interval: 60
        })
        .then(response => {
          // 隐藏loading框
          this.$loading1().close()
          const list = response.data.values.split('|')
          if (list.length === 1) {
            return
          }
          // 风速数组
          const fs = list[0].split(';')
          // 风向数组
          const fx = list[1].split(';')
          // 处理风频图数据
          this.initBarData(fs)

          // 风玫瑰图数据处理
          this.initRadarDta(fs, fx)
        })
        .catch((error) => {
          // 隐藏loading框
          this.$loading1().close()
          // this.$message.error('测点数据查询异常')
          console.error(error)
        })
    },
    /**
     * 初始化风频图数据
     * @param {Array} fs 测点返回的风速数据
     */
    initBarData (fs) {
      // 用来初始化统计对象
      // eslint-disable-next-line prefer-const
      let obj = {}
      this.bar_xAxis = []
      for (let i = 0; i <= 25; i += 0.5) {
        obj[i] = 0
        this.bar_xAxis.push(i)
      }
      // 统计各个风速出现的次数，以及对应功率的和
      fs.forEach((e) => {
        if (e < 0.25) {
          obj[0]++
        } else {
          const key = Math.ceil((e - 0.25) / 0.5) * 0.5
          obj[key]++
        }
      })
      // 加工统计数据，
      this.bar_series = []

      this.tableCol2 = this.bar_xAxis

      // eslint-disable-next-line prefer-const
      let percentage = { 类别: '百分比' }
      // eslint-disable-next-line prefer-const
      let windSpeed = { 类别: '风速' }

      this.tableCol2.forEach(e => {
        const field = e * 10 + ''
        const percentagenNum = (obj[e] / fs.length * 100).toFixed(3)
        percentage[field] = percentagenNum
        windSpeed[field] = e
        this.bar_series.push(percentagenNum)
      })
      this.tableCol2 = ['类别'].concat(this.tableCol2)
      this.tableData2 = [percentage, windSpeed]
      this.drawBar()
    },
    /**
     * 初始化风频图数据
     * @param {Array} fs 测点返回的风速数据
     * @param {Array} fx 测点返回的风向数据
     */
    initRadarDta (fs, fx) {
      // 用来初始化统计对象
      // eslint-disable-next-line prefer-const
      let obj = {}
      this.FX.forEach(i => {
        obj[i] = {
          counts: 0,
          max: 0,
          avg: 0
        }
      })
      // 统计各个风向出现的次数，以及对应的风速数据
      fx.forEach((e, i) => {
        e = Number(e) + 180
        fs[i] = Number(fs[i])
        if (e <= 11.25 || e > 348.75) {
          obj.N.counts++
          obj.N.max = obj.N.max > fs[i] ? obj.N.max : fs[i]
          obj.N.avg += fs[i]
        } else {
          const key = this.FX[Math.floor((360 - e + 11.25) / 22.5)]
          obj[key].counts++
          obj[key].max = obj[key].max > fs[i] ? obj[key].max : fs[i]
          obj[key].avg += fs[i]
        }
      })
      this.max = 0
      this.tableData1 = [{ type: '平均风速' }, { type: '最大风速' }, { type: '百分比' }]
      // 处理成百分比数据
      this.FX.forEach(n => {
        if (obj[n].counts === 0) {
          this.tableData1[0][n] = 0
        } else {
          this.tableData1[0][n] = (obj[n].avg / obj[n].counts).toFixed(2)
        }
        this.tableData1[1][n] = (obj[n].max).toFixed(2)
        this.tableData1[2][n] = (obj[n].counts / fx.length * 100).toFixed(2)
        // 找出雷达图中的最大值
        this.max = this.max > Number(this.tableData1[0][n]) ? this.max : Number(this.tableData1[0][n])
        this.max = this.max > Number(this.tableData1[1][n]) ? this.max : Number(this.tableData1[1][n])
        this.max = this.max > Number(this.tableData1[2][n]) ? this.max : Number(this.tableData1[2][n])
      })
      this.radar_series1 = []
      this.radar_series2 = []
      this.radar_series3 = []
      this.tableData1.forEach((obj, i) => {
        this.FX.forEach(key => {
          this['radar_series' + (i + 1)].push(obj[key])
        })
      })
      this.drawRadar()
    },
    /**
     * 查询前的表单验证
     * @return {Boolean} 验证结果；通过为true
     */
    checkSearch () {
      if (!this.currentFan.id) {
        this.$message.warning('请选择风机')
        return false
      }
      if (!this.startTime) {
        this.$message.warning('请选择开始时间')
        return false
      }
      if (!this.endTime) {
        this.$message.warning('请选择结束时间')
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
      if (this.endTime <= this.startTime) {
        this.$message.warning('开始时间应小于结束时间')
        return false
      }
      return true
    },
    /**
     * 获取风机信息
     */
    getFansData () {
      this.$axios
        .get('/jsonFile/warn/FansData.json')
        .then(response => {
          this.fansData = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * 绘制柱状图
     */
    drawBar () {
      // 初始化echarts dom对象
      // eslint-disable-next-line prefer-const
      let eChartDemo = this.$echarts.init(document.querySelectorAll('#WindRoseBar')[0])
      // 对柱状图配置信息赋值
      this.barOption = {
        color: ['#E49943'],
        title: {
          text: '风频图',
          left: 'left',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['百分比'],
          textStyle: {
            color: '#fff'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#fff'
              }
            },
            data: this.bar_xAxis
          }
        ],
        yAxis: {
          type: 'value',
          axisLine: {
            //   show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '百分比',
            type: 'bar',
            data: this.bar_series
            // markPoint: {
            //   data: [
            //     { type: 'max', name: '最大值' },
            //     { type: 'min', name: '最小值' }
            //   ]
            // },
            // markLine: {
            //   data: [
            //     { type: 'average', name: '平均值' }
            //   ]
            // }
          }
        ]
      }
      eChartDemo.setOption(this.barOption)
    },
    /**
     * 绘制雷达图
     */
    drawRadar () {
      // 初始化echarts dom对象
      // eslint-disable-next-line prefer-const
      let eChartDemo = this.$echarts.init(document.querySelectorAll('#WindRoseRadar')[0])
      // 对雷达图配置信息赋值
      this.pointOption = {
        title: {
          text: '风玫瑰图',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          position: ['70%', '0%']

        },
        legend: {
          data: ['百分比', '平均风速', '最大风速'],
          right: '0px',
          bottom: '0px',
          align: 'right',
          orient: 'vertical',
          textStyle: {
            color: '#fff'
          }

        },
        radar: {
          name: {
            textStyle: {
              color: '#fff'
            }
          },
          indicator: [
            { name: 'N', max: this.max },
            { name: 'NNW', max: this.max },
            { name: 'NW', max: this.max },
            { name: 'WNW', max: this.max },
            { name: 'W', max: this.max },
            { name: 'WSW', max: this.max },
            { name: 'SW', max: this.max },
            { name: 'SSW', max: this.max },
            { name: 'S', max: this.max },
            { name: 'SSE', max: this.max },
            { name: 'SE', max: this.max },
            { name: 'ESE', max: this.max },
            { name: 'E', max: this.max },
            { name: 'ENE', max: this.max },
            { name: 'NE', max: this.max },
            { name: 'NNE', max: this.max }
          ]
        },
        series: [{
          type: 'radar',
          data: [
            {
              value: this.radar_series3,
              name: '百分比'
            },
            {
              value: this.radar_series2,
              name: '平均风速'
            },
            {
              value: this.radar_series1,
              name: '最大风速'
            }
          ]
        }]
      }
      eChartDemo.setOption(this.pointOption)
    },
    /**
     * 时间类型发生改变后触发的事件，根据不同的日期类型，设置日期格式和日期组件
     * @param {String} val 当前日期类型的值  0：任意；1：日；2：月；3：年
     */
    dataTypeValueChange (val) {
      this.startTime = ''
      this.endTime = ''
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
    // 获取风机数据
    this.getFansData()
    // 查询上报状态下拉框数据
    this.$common.findSelectByKey(1, 1).then(res => {
      this.dataType = res
      this.dataTypeValue = this.dataType[0].key
    })
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
#WindRose {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

    > span {
      display: inline-block;
      line-height: 46px;
      margin-left: 10px;
      min-width: 60px;
    }
  }
  /deep/.table {
    flex: 1;
    padding: 5px;
    padding-bottom: 0px;
    // height: 820px;
    > div {
      height: 50%;
      display: flex;
      flex-direction: column;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__header {
      margin: 0px;
    }
    .el-tabs__item.is-active {
      border: solid 1px white;
    }
    .el-tabs__item {
      font-size: 12px;
      font-family: Segoe UI;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      opacity: 1;
      height: 30px;
      line-height: 30px;
      padding: 0 20px !important;
      margin: 2px;
    }
    .el-tabs__nav .el-tabs__item:nth-child(even) {
      background: linear-gradient(
        180deg,
        rgba(0, 46, 162, 1) 0%,
        rgba(0, 111, 206, 1) 0%,
        rgba(0, 46, 162, 1) 100%
      );
      opacity: 1;
      border-radius: 3px;
    }
    .el-tabs__nav .el-tabs__item:nth-child(odd) {
      background: linear-gradient(
        180deg,
        rgba(26, 216, 255, 1) 0%,
        rgba(0, 115, 145, 1) 100%
      );
      opacity: 1;
      border-radius: 3px;
    }
    .el-tabs__active-bar {
      display: none;
    }
    // .el-tabs__content {
    //   flex: 1;
    // }
    // .el-tab-pane {
    //   height: 100%;
    //   display: flex;
    //   flex-direction: column;
    // }
    // .innerTable {
    //   flex: 1;
    // }
  }
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
    .selectTwo {
      width: 130px;
    }
    .selectOne {
      width: 190px;
    }
    .dataType {
      width: 100px;
    }
  }
  #WindRoseBar {
    width: 100%;
    height: 100%;
    text-align: left;
  }
  .chart-div {
    text-align: left;
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
  .current-row > td {
    background-color: #89bceb !important;
  }
}
</style>
