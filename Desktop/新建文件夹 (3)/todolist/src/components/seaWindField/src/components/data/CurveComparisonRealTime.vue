<!--
模块：实时曲线组件 by 孔祥义
  根据选择的测点信息，查询生成曲线
-->
<template>
  <div class="CurveComparison">
    <!-- title区域 -->
    <div class="c-title">
      <span><i class="el-icon-plus"></i></span>
      &nbsp;&nbsp;
      <span style="position:relative;top: -9px;">曲线对比</span>
      <label>
        <i class="el-icon-top-right"></i>
        <i class="el-icon-close"></i>
      </label>

      <el-popover popper-class="fans-popover"
                  width="200"
                  trigger="click">
        筛选
        <br>
        <el-input v-model="searchFans"
                  size="mini"
                  placeholder="输入关键字搜索" />
        <el-table :data="pointsData.filter(data => !searchFans || data.name.toLowerCase().includes(searchFans.toLowerCase()))"
                  style="width: 100%"
                  height="250"
                  ref="multipleTableFans"
                  @row-click="rowClick"
                  @select-all="selectAllFans"
                  @select="handleSelectionChangeFans"
                  @selection-change="handleSelectionChange1">

          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column label=""
                           prop="name">
            <template slot="header"
                      slot-scope="">
              <span @click="clearFans"
                    style="cursor: pointer;">清空</span>
            </template>
          </el-table-column>
        </el-table>
        <el-input slot="reference"
                  v-model="fans"
                  @focus="checkPoints"
                  readonly
                  placeholder="请选择"></el-input>

      </el-popover>
    </div>
    <!-- echarts图区域，根据父组件的count值，来唯一标识定义echarts图div -->
    <div :class="'chart-demo' + count">
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 用来标识每个echarts图
    count: {
      type: Number,
      default: 1
    },
    // 父组件选中的测点数据
    pointsData: Array

  },
  data: function () {
    return {
      // echartsDom对象
      eChartDemo: {},
      // echarts数据
      data: [],
      // 选中的测点
      fans: '',
      // 查询的测点字符串
      searchFans: '',
      // 选中的测点信息
      multipleSelectionFans: [],
      // y轴信息
      yAxis: [],
      // 图例信息
      legend: {},
      // 数据信息
      series: [],
      // 默认颜色数组
      colors: ['#FF1493', '#ADD8E6', '#00FA9A', '#00FF00', '#FFFF00',
        '#FF4500', '#48D1CC', '#9932CC', '#CD5C5C', '#FF1493', '#ADD8E6',
        '#00FA9A', '#00FF00', '#FFFF00', '#FF4500', '#48D1CC', '#9932CC',
        '#CD5C5C', '#FF1493', '#ADD8E6', '#00FA9A'],
      // echarts图配置信息
      option: {},
      // 定时任务暂存对象
      timer: null,
      // 选中的测点
      valuePoints: [],
      // 初始化echarts图的时间
      initChartTime: null
    }
  },
  methods: {
    /**
     * 测点发生选中或者取消选中事件
     * @param {Array} val 当前选中的测点信息
     */
    handleSelectionChangeFans (val) {
      this.isChangeSelect = true
      this.multipleSelectionFans = val
    },
    /**
     * 选中的测点选中项发送改变
     * @param {Array} val 当前选中的行信息
     */
    handleSelectionChange1 (val) {
      if (this.isChangeSelect) {
        this.multipleSelectionFans = val
        this.isChangeSelect = false
        return
      }
      this.toggleSelection()
    },
    /**
     * 清空风机选中
     */
    clearFans () {
      this.isChangeSelect = true
      this.$refs.multipleTableFans.clearSelection()
      this.multipleSelectionFans = []
    },
    /**
     * 改变风机选中的行
     *  */
    toggleSelection () {
      if (this.multipleSelectionFans) {
        this.multipleSelectionFans.forEach(row => {
          this.isChangeSelect = true
          this.$refs.multipleTableFans.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTableFans.clearSelection()
      }
    },
    /**
     * 全选方法
     * @param {Arrya} val 选中的测点
     */
    selectAllFans (val) {
      this.multipleSelectionFans = val
    },

    /**
     * 验证测点是否已经从父组件获取，如果没有，则给出提示
     */
    checkPoints () {
      if (this.pointsData.length === 0) { this.$message.warning('请先选择测点') }
    },
    /**
     * 开始绘制echarts图形
     * @param {Object} eChartDemo echarts dom对象
     * @param {Array} multipleSelectionFans 选中的测点信息
     */
    drawLine (eChartDemo, multipleSelectionFans) {
      this.yAxis = []
      // eslint-disable-next-line prefer-const
      let series = []
      this.eChartDemo.clear()
      for (let i = 0; i < multipleSelectionFans.length; i++) {
        var color = this.colors[i]
        let data = []
        const series1 = this.series.find(ii => {
          return ii.id === multipleSelectionFans[i].id
        })
        if (series1 && series1.data) {
          data = series1.data
        } else {
          data = this.initChartData()
        }

        var y = {
          name: '',
          type: 'value',
          position: 'left',
          splitNumber: 5,
          offset: 0,
          // // min: 0,
          // max: 0,
          color: color,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontWeight: 900,
            textStyle: { color: color }// #A23400 purple
          },
          splitLine: {
            show: false
          },
          data: []
        }
        var s = {
          id: multipleSelectionFans[i].id,
          name: '',
          data: data,
          yAxisIndex: i,
          type: 'line',
          showSymbol: false,
          itemStyle: {
            normal: {
              lineStyle: {
                color: color // 折线颜色
              }
            }
          }

        }
        if (i === 0) {
          y.splitLine.show = true
        }
        if (i === 0) {
          this.option.grid.left = '100'
        } else {
          this.option.grid.left = 100 + i * 30
        }
        // y.min = multipleSelectionFans[i].min
        // y.max = multipleSelectionFans[i].max
        s.name = multipleSelectionFans[i].name
        y.offset = i * 30
        this.yAxis.push(y)
        series.push(s)
      }
      this.series = series
      this.option.color = this.colors
      this.option.yAxis = this.yAxis
      this.option.series = this.series
      eChartDemo.setOption(this.option)
    },
    /**
     * 初始化echarts数据
     * @return {Array} 返回处理过的数据
     */
    initChartData () {
      // eslint-disable-next-line prefer-const
      let list = []
      let time = 0
      const nowTime = new Date().getTime()
      const timeLength = 300 // 生成的空数据的条数，每条的时间间隔为1s
      time = nowTime - (timeLength * 1000)
      for (let i = 1; i <= timeLength; i++) {
        list.push({
          name: time,
          value: [time, '']
        })
        time += 1000
      }
      return list
    },

    /**
     * 获取echarts图数据
     * @param {Nuber} time 当前查询的时间，用于对查询结果的实际进行绑定
     */
    getChartData (time) {
      if (!(this.valuePoints && this.valuePoints.length > 0)) {
        return
      }
      this.$axios
        .post(this.$url.realTimeUrl, {
          tags: this.valuePoints.join('|')
        })
        .then(response => {
          time = Math.floor(time / 1000) * 1000
          // this.optionsPoints = response.data
          const list = response.data.values.split('|')
          this.series.forEach((e, i) => {
            e.data.shift()
            e.data.push({
              name: time,
              value: [time, list[i]]
            })
          })
          this.option.series = this.series
          this.eChartDemo.setOption(
            {
              series: this.series
            }
          )
        })
        .catch((error) => {
          console.log(error)
          this.$message.error('查询数据异常！')
        })
    },
    /**
     * 行点击事件
     * @param {Object} row 当前点击的行信息
     */
    rowClick (row) {
      this.isChangeSelect = true
      this.$refs.multipleTableFans.toggleRowSelection(row)
    }

  },
  mounted () {
    // echarts对象初始化
    this.eChartDemo = this.$echarts.init(document.getElementsByClassName('chart-demo' + this.count)[0])
    // echarts配置信息初始化
    this.option = {
      color: this.colors,
      legend: {
        pageIconColor: '#0A8DF9',
        pageIconInactiveColor: '#0A8DF9',
        pageTextStyle: {
          color: '#fff'
        },
        type: 'scroll',
        borderWidth: 20,
        orient: 'horizontal',
        padding: '10%',
        textStyle: {
          color: '#FFF'
        }
        // icon: 'rect'

      },
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%']
        }
      },
      toolbox: {
        right: '10',
        top: '20',
        feature: {
          restore: {
            iconStyle: {
              borderColor: '#0A8DF9'
            }
          },
          saveAsImage: {
            iconStyle: {
              borderColor: '#0A8DF9'
            }
            // },
            // dataView: {
            //   readOnly: false,
            //   iconStyle: {
            //     borderColor: '#10FF18'
            //   }
          }
        }
      },
      grid: {
        left: '0', // 组件距离容器左边的距离
        top: '15%',
        right: '2%'
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLabel: {
          color: '#fff',
          textStyle: { color: '#FFF' }, // #A23400 purple
          formatter: (val) => {
            let time = this.initChartTime > val ? this.initChartTime : val
            time = new Date(time)
            return (time.getHours() + '').padStart(2, '0') + ':' + (time.getMinutes() + '').padStart(2, '0') + ':' + (time.getSeconds() + '').padStart(2, '0')
          }
        },
        axisTick: {
          color: '#fff'
        },
        splitLine: {
          show: false,
          color: '#2B5A74'
        },
        axisLine: {
          lineStyle: {
            color: '#FFF'
          }
        }

      },
      yAxis: [],
      series: []
    }
  },
  // 组件销毁钩子函数
  destroyed () {
    // 销毁定时任务
    window.clearInterval(this.timer)
  },
  watch: {
    // 选中的数据发生改变
    multipleSelectionFans: function () {
      // window.clearInterval(this.timer)
      if (this.multipleSelectionFans.length > 0) {
        if (!this.initChartTime) {
          this.initChartTime = new Date().getTime()
        }
        this.drawLine(this.eChartDemo, this.multipleSelectionFans)
        this.fans = '已选择' + this.multipleSelectionFans.length + '个测点'
        this.valuePoints = []
        this.multipleSelectionFans.forEach(i => {
          this.valuePoints.push(i.id)
        })
      } else {
        this.valuePoints = []
        this.eChartDemo.clear()
        this.series = []
        this.initChartTime = null
        this.fans = ''
      }
      if (!this.timer) {
        if (this.valuePoints.length > 0) {
          // this.getChartData(new Date().getTime())
          this.timer = setInterval(() => {
            this.getChartData(new Date().getTime())
          }, 1000)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.CurveComparison {
  width: 100%;
  height: 100%;
  //title部分样式
  .c-title {
    text-align: left;
    height: 28px;
    width: 98%;
    margin-left: 1%;
    border-bottom: 1px solid rgba(4, 43, 118, 1);

    .el-icon-plus:before {
      font-size: 17px;
      line-height: 28px;
      font-weight: 900;
      color: #10ff18;
      float: left;
    }
    .el-icon-close:before {
      line-height: 28px;
      font-weight: 900;
      font-size: 17px;
      color: #10ff18;
    }
    .el-icon-top-right:before {
      font-size: 16px;
      line-height: 28px;
      font-weight: 900;
      color: #0a8df9;
    }

    > span {
      line-height: 28px;
    }

    > label {
      line-height: 28px;
      float: right;
    }

    /deep/ .el-popover__reference {
      width: 130px;
      height: 27px;
      opacity: 1;
      position: relative;
      top: -1px;
      float: right;
      right: 10px;

      .el-input__inner {
        width: 126px;
        height: 25px;
        color: white;
        background: rgba(0, 14, 122, 1);
        border: 1px solid rgba(10, 141, 249, 1);
        opacity: 1;
        text-align: center;
        line-height: 25px;
      }
    }
  }
  //echarts初始化dom样式
  .chart-demo0,
  .chart-demo1 {
    width: 100%;
    height: 89%;
    margin-top: 5px;
    text-align: left;
  }
}
</style>
<style lang="less" >
.fans-popover .el-table .cell {
  cursor: pointer;
}
</style>
