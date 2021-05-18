<!--
模块：系统报表--功率曲线 by 孔祥义
  引用组件：
    风机选择组件  @/components/report/selectFans
-->
<template>
  <div id='PowerCurve'>
    <!-- 查询条件 -->
    <div class="title">
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
      <!-- 曲线类型1 -->
      <div class="my-btn">
        <el-select class="selectOne"
                   v-model="selectOneValue">
          <el-option v-for="item in selectOne"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <!-- 曲线类型2 -->
      <div class="my-btn">
        <el-select class="selectTwo"
                   v-model="selectTwoValue">
          <el-option v-for="item in selectTwo"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <!-- 时间类型 -->
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
      <div @click="getDefaultData"
           class="my-btn">
        查询
        <i class="iconfont iconsousuo"></i>
      </div>
    </div>
    <!-- 表格图表部分 -->
    <div class="table">

      <el-tabs v-model="activeNameTab">

        <el-tab-pane label="功率曲线"
                     name="first">
          <div :style="{ height: pointHeight, width: pointWidth }"
               id='PowerCurveLine'></div>
        </el-tab-pane>

        <el-tab-pane label="功率曲线表格模式"
                     name="second">
          <div @click="exportExcel(1)"
               style="background:#042069;width:100px;margin-bottom: 10px;"
               class="my-btn">
            导出数据到Exel
          </div>
          <div class="innerTable">
            <el-table :data="tableData1"
                      border
                      :height='tableHeight'
                      style="width: 100%">
              <el-table-column prop="fs"
                               label="风速"
                               fixed
                               min-width="88">
              </el-table-column>
              <el-table-column prop="f0"
                               fixed
                               label="H120-1211"
                               min-width="120">
              </el-table-column>
              <el-table-column v-for="(i,index) in colData1"
                               :key="index"
                               :prop="i"
                               show-overflow-tooltip
                               :label="i+'功率'"
                               min-width="100">
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane label="功率散点图"
                     name="third">
          <div :style="{ height: pointHeight, width: pointWidth }"
               id='PowerCurvePoint'></div>
        </el-tab-pane>

        <el-tab-pane label="功率散点图表格模式"
                     name="fourth">
          <div @click="exportExcel(2)"
               style="background:#042069;width:100px;margin-bottom: 10px;"
               class="my-btn">
            导出数据到Exel
          </div>

          <div class="innerTable">
            <el-table :data="pageTableData"
                      border
                      :height='tableHeight2'
                      style="width: 100%">
              <!-- <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column> -->
              <el-table-column prop="name"
                               label="风机名"
                               width="">
              </el-table-column>
              <el-table-column prop="fs"
                               label="风速"
                               width="">
              </el-table-column>
              <el-table-column prop="gl"
                               label="功率"
                               width="">
              </el-table-column>
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
                           :total="tableData2.length">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>
<script>
// 选择风机组件
const selectFans = () =>
  import('@/components/report/selectFans').then(m => m.default)
export default {
  name: 'PowerCurve',
  components: { selectFans },
  data () {
    return {
      // 功率曲线表格数据
      tableData1: [],
      // 功率曲线表格默认数据
      tableData1Default: [],
      // 功率曲线列表-风速对应行数
      fsLine: [],
      // 功率曲线列数据
      colData1: [],
      // 散点列表数据
      tableData2: [],
      // 曲线类型1选项数据
      selectOne: [],
      // 曲线类型1选中项
      selectOneValue: '0',
      // 曲线类型2选项数据
      selectTwo: [],
      // 曲线类型2选中项
      selectTwoValue: '',
      // 时间类型数据
      dataType: [],
      // 时间类型选中项
      dataTypeValue: '',
      // 风机选中id
      fanIds: '',
      // 开始时间--eg:2020-05-21 00:00:00
      startTime: this.$moment(new Date().getTime() - 3600 * 1000 * 24).format('YYYY/MM/DD HH:mm:ss'),
      // 结束时间--eg:2020-05-21 00:00:00
      endTime: this.$moment(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss'),
      // 选择风机input框文字
      fans: '',
      // 当前活跃的tab
      activeNameTab: 'first',
      // 表格高度
      tableHeight: window.innerHeight - 200,
      // 表格高度
      tableHeight2: window.innerHeight - 250,
      // echarts图高度
      pointHeight: window.innerHeight - 200 + 'px',
      // echarts图宽度
      pointWidth: window.innerWidth - 100 + 'px',
      // 折线配置项
      lineOption: {},
      // 折线数据
      line_series: [],
      // 折线数据
      line_seriesDefault: [],
      // 散点配置项
      pointOption: {},
      // 展示时间格式化格式
      dataFormat: 'yyyy-MM-dd HH:mm:ss',
      // 时间格式化样式
      valueDataFormat: 'yyyy/MM/dd HH:mm:ss',
      // 日期选择框类型
      datePickerType: 'datetime',
      // 储存需要查询的测点数据
      point: [
        'WSPEED', // 风速
        'CE301', // 功率
        'AIR_DEN', // 空气密度
        'WORKMOD', // 工作模式
        '_RUNSTA_XG', // 限功状态
        'CE301SET'// 功率设定
      ],
      // 当前页
      pageIndex: 1,
      // /每页大小
      pageSize: 50,
      // 散点图数据模板
      pointSeriesObj: {
        name: '',
        type: 'scatter',
        symbolSize: 5,
        itemStyle: {
          normal: {
            borderWidth: 0.2,
            borderColor: '#fff'
          }
        },
        data: []
      },
      // 散点图数据
      pointSeries: []
      // st: ''
    }
  },
  methods: {
    /**
     * 导出的方法
     * @param {Number} curveId 导出的信息标识；1：功率曲线；2：功率散点
     */
    exportExcel (curveId) {
      // 设置Excel的表格表头
      var tHeader = []
      // 设置Excel的表格列对应的字段
      var filterVal = []
      // 文件名
      var filrName = ''
      let data
      if (curveId === 1) { // 功率曲线
        if (this.tableData1.length === 0) {
          this.$message.warning('暂无数据，无法导出！')
          return
        }
        tHeader = ['风速', 'H123-1211']
        filterVal = ['fs', 'f0']
        this.colData1.forEach(i => {
          tHeader.push(i)
          filterVal.push(i)
        })
        filrName = '功率曲线表格'
        data = this.tableData1.map(v => filterVal.map(j => v[j]))
      } else { // 功率散点
        if (this.tableData2.length === 0) {
          this.$message.warning('暂无数据，无法导出！')
          return
        }
        tHeader = ['风机名', '风速', '功率']
        filterVal = ['name', 'fs', 'gl']
        filrName = '功率散点图表格'
        data = this.tableData2.map(v => filterVal.map(j => v[j]))
      }

      this.$exportExcel(tHeader, data, filrName)
    },
    /**
     * 获取默认数据，和一些配置信息
     */
    getDefaultData () {
      this.$axios
        .get('/jsonFile/report/PowerCurve' + this.selectOneValue + '.json')
        .then(response => {
          this.tableData1Default = response.data.tableData
          this.tableData1 = this.tableData1Default
          this.fsLine = response.data.fsLine
          // 整理默认的曲线数据
          // eslint-disable-next-line prefer-const
          let list = []
          this.tableData1Default.forEach(e => {
            list.push([e.fs, e.f0])
          })
          this.line_seriesDefault = []
          this.line_seriesDefault.push({
            name: 'H120-1211',
            type: 'line',
            data: list,
            smooth: true
          })
          this.getPointData()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
   * 获取测点数据
   */
    getPointData () {
      // 判断是否通过表单验证
      if (!this.checkSearch()) {
        return
      }
      this.st = Date.now()
      // 整理需要查询的测点
      const fanList = this.fanIds.split(',')
      // eslint-disable-next-line prefer-const
      let pointList = []
      fanList.forEach(f => {
        this.point.forEach(p => {
          pointList.push('ZQ:F' + f + p)
        })
      })
      // 显示loadin框
      this.$loading1()
      // 查询风速/风向。然后处理数据
      this.$axios
        .post(this.$url.scatterData, {
          tags: pointList.join('|'),
          time: this.$moment(new Date(this.startTime)).format('YYYYMMDDHHmmss') + '-' + this.$moment(new Date(this.endTime)).format('YYYYMMDDHHmmss'),
          interval: 60 * 30
        })
        .then(response => {
          // 隐藏loading框
          this.$loading1().close()
          // console.warn('数据请求时间:', Date.now() - this.st)
          // this.st = Date.now()
          let list = response.data.values.split('|')
          if (list.length === 1) {
            return
          }
          list.forEach((l, i) => {
            list[i] = l.split(';')
          })
          // 切割数组
          list = this.arrayGroup(list, 6)

          // 处理数据之前，对数据初始化
          this.tableData2 = []
          this.pointSeries = []
          this.tableData1 = this.tableData1Default
          this.colData1 = []
          this.line_series = [...this.line_seriesDefault]
          // 循环风机，处理数据
          fanList.forEach((f, i) => {
            f = 'F' + f
            this.colData1.push(f)
            // 定义数组，用来暂存散点列表数据
            // eslint-disable-next-line prefer-const
            let tableData2 = []
            // 散点数据数组
            // eslint-disable-next-line prefer-const
            let pointList = []
            // 用来处理功率曲线数据
            // eslint-disable-next-line prefer-const
            let curveObj = {}
            // 循环数据部分
            list[i][0].forEach((d, ii) => {
              // 将风速处理成就近风速区间值
              const fs = Math.ceil((Number(list[i][0][ii]) - 0.25) / 0.5) * 0.5
              const gzms = Number(list[i][3][ii])
              // 风速小于2.75米/状态不是发电的数据不统计
              if (fs < 3 || gzms !== 32) {
                return
              }
              const gl = Number(list[i][1][ii])
              const kqmd = Number(list[i][2][ii])
              const xgzt = Number(list[i][4][ii])
              const glsd = Number(list[i][5][ii])
              // 判断数据的有效性
              if (this.checkPoint(kqmd, xgzt, glsd)) {
                // 散点列表赋值
                tableData2.push({
                  name: f,
                  fs: fs.toFixed(2),
                  gl: gl.toFixed(2)
                })
                // 散点图表赋值
                pointList.push([fs, gl.toFixed(2)])
                // 功率曲线数据统计对象
                if (curveObj[fs]) {
                  curveObj[fs].gl += gl
                  curveObj[fs].counts++
                } else {
                  curveObj[fs] = {
                    gl: gl,
                    counts: 1
                  }
                }
              }
            })
            // 散点列表赋值
            // 对数据按照风速排序
            tableData2.sort((a, b) => {
              if (Number(a.fs) > Number(b.fs)) {
                return 1
              } else {
                return -1
              }
            })
            this.tableData2 = this.tableData2.concat(tableData2)
            // 散点图表赋值
            this.pointSeriesObj.name = f
            this.pointSeriesObj.data = pointList
            this.pointSeries.push({ ...this.pointSeriesObj })
            // 功率曲线赋值
            // eslint-disable-next-line prefer-const
            let curveList = []
            for (const key in curveObj) {
              const gl = (curveObj[key].gl / curveObj[key].counts).toFixed(2)
              this.tableData1[this.fsLine[key]][f] = gl
              curveList.push([key, gl])
            }
            curveList.sort((a, b) => {
              if (Number(a[0]) > Number(b[0])) {
                return 1
              } else {
                return -1
              }
            })
            this.line_series.push({
              name: f,
              type: 'line',
              data: curveList,
              smooth: true
            })
          })
          // console.warn('数据处理时间:', Date.now() - this.st)
          this.drawPoint()
          this.drawLine()
        })
        .catch((error) => {
          // 隐藏loading框
          this.$loading1().close()
          // this.$message.error('测点数据查询异常')
          console.error(error)
        })
    },
    /**
   * 判断测点的合法性
   * @param {Number} kqmd 空气密度
   * @param {Number} xgzt 限功状态
   * @param {Number} glsd 功率设定
   */
    checkPoint (kqmd, xgzt, glsd) {
      if (this.selectOneValue === '0') { // 年均功率密度曲线--空气密度仪
      } else { // 标准空气密度功率曲线--空气密度为1.225kg/m3下的功率曲线；
        if (kqmd !== 1.2300000190734863) { // 由于数据库中只有1.2300000190734863，故先以此作为判断条件
          return false
        }
      }
      if (this.selectTwoValue === '0') { // 运行功率曲线--剔除任何情况下机组限电情况的点，绘制的功率曲线；
        if (xgzt === 1) {
          return false
        }
      } else { // 考核功率曲线--剔除机组设定功率小于额定功率的点，绘制的功率曲线；
        if (glsd < 2000) {
          return false
        }
      }
      return true
    },
    /**
   * 将数组等间隔切成小数租，并返回
   * @param {Array} array 需要切割的数组
   * @param {Number} subGroupLength 切割的长度
   * @param {Array} return 返回切割好的数组
   */
    arrayGroup (array, subGroupLength) {
      let index = 0
      // eslint-disable-next-line prefer-const
      let newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
    },
    /**
   * 查询前的表单验证
   * @return {Boolean} 验证结果；通过为true
   */
    checkSearch () {
      if (this.fanIds === '') {
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
   * 绘制折线图
   */
    drawLine () {
      // 初始化折线dom对象
      // eslint-disable-next-line prefer-const
      let eChartDemo = this.$echarts.init(document.querySelectorAll('#PowerCurveLine')[0])
      eChartDemo.clear()
      // 配置折线
      this.lineOption = {
        grid: {
          top: 100
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              show: false
            }
          }
        },
        title: {
          left: 'left',
          text: '功率曲线',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          left: '100',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'value',
          min: 3,
          boundaryGap: false,
          axisLine: {
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
            show: false
          },
          interval: 0.5,
          max: 21.5
        },
        yAxis: {
          name: '单位KW',
          type: 'value',
          axisLine: {
            // show: false,
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
        dataZoom: {
          color: 'red'
        },
        series: this.line_series
      }
      eChartDemo.setOption(this.lineOption)
    },
    /**
 * 绘制散点图
 */
    drawPoint () {
      // 初始化折线dom对象
      // eslint-disable-next-line prefer-const
      let eChartDemo = this.$echarts.init(document.querySelectorAll('#PowerCurvePoint')[0])
      eChartDemo.clear()
      // 配置散点
      this.pointOption = {
        grid: {
          top: 100
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
          }
        },
        title: {
          left: 'left',
          text: '功率散点',
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          // data: ['f1'],
          left: '100',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [{
          min: 3,
          type: 'value',
          boundaryGap: false,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            show: false,
            lineStyle: {
              show: false,
              color: '#fff'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        }],
        series: this.pointSeries
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
    },
    /**
   * 确认选中风机回调函数，将组建选中的测点信息传递会父组件
   * @param {Array} val 测点选择组件中选中的风机信息，id数组
   */
    confirmSelectFans (val) {
      this.fans = '已选择' + val.length + '台'
      this.fanIds = val.join(',')
    },
    /**
   * 每页条数改变
   * @param {Number} val 当前每天条数数值
   */
    handleSizeChange (val) {
      this.pageSize = val
    },
    /**
   * 当前页变化事件
   * @param {Number} val 当前页
   */
    handleCurrentChange (val) {
      this.pageIndex = val
    }
  },
  mounted () {
    // 查询曲线类型1下拉框数据
    this.$common.findSelectByKey(3, 1).then(res => {
      this.selectOne = res
      this.selectOneValue = this.selectOne[0].key
      return this.$common.findSelectByKey(4, 1)
    })
      // 查询曲线类型2下拉框数据
      .then(res => {
        this.selectTwo = res
        this.selectTwoValue = this.selectTwo[0].key
        return this.$common.findSelectByKey(1, 1)
      })
      // 查询时间类型下拉框数据
      .then(res => {
        this.dataType = res
        this.dataTypeValue = this.dataType[0].key
      })
  },
  computed: {
    /**
     * 根据分页信息，返回分好后的数据
     */
    pageTableData () {
      return this.tableData2.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
    }
  }
}
</script>
<style lang="less" scoped>
#PowerCurve {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  //查询框部分
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
  //主体表格图表部分，由于要修改element tab的默认样式，所以需要加deep
  /deep/.table {
    flex: 1;
    padding: 5px;
    padding-bottom: 0px;
    > div {
      height: 100%;
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
    .el-tabs__content {
      flex: 1;
    }
    .el-tab-pane {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .innerTable {
      // flex: 1;
    }
  }
  //自定义按钮类
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
  #PowerCurvePoint,
  #PowerCurveLine {
    width: 100%;
    height: 100%;
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
}
</style>
