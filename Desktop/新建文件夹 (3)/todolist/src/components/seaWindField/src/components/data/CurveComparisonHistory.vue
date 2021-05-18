<!--
模块：历史曲线组件 by 孔祥义
  根据选择的测点信息，以及父组件的查询信息，查询生成曲线
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
                  @row-click="rowClick"
                  ref="multipleTableFans"
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
                  readonly
                  @focus="checkPoints"
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
      option: {
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
        },
        tooltip: {
          trigger: 'axis'
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
            },
            dataView: {
              readOnly: false,
              iconStyle: {
                borderColor: '#10FF18'
              }
            }

          }
        },
        grid: {
          left: '0', // 组件距离容器左边的距离
          top: '15%',
          right: '3%'
        },
        dataZoom: {
          textStyle: {
            color: 'white'
          }
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            color: '#fff',
            textStyle: { color: '#FFF' }// #A23400 purple
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
     * 清空测点选中
     */
    clearFans () {
      this.isChangeSelect = true
      this.eChartDemo.clear()
      this.$refs.multipleTableFans.clearSelection()
      this.multipleSelectionFans = []
      this.drawLine(this.eChartDemo, this.multipleSelectionFans)
    },
    /**
     * 改变测点选中的行
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
     * 查询数据-父组件调用
     * @param {Object} val 查询参数信息
     */
    search (val) {
      if (this.multipleSelectionFans.length === 0) {
        return
      }
      // eslint-disable-next-line prefer-const
      let pointStr = []
      this.multipleSelectionFans.forEach(i => {
        pointStr.push(i.id)
      })
      // 显示loadin框
      this.$loading1()
      this.$axios
        .post(this.$url.historicalUrl, {
          tags: pointStr.join('|'),
          time: this.$moment(val.startTime).format('YYYYMMDDHHmmss') + '-' + this.$moment(val.endTime).format('YYYYMMDDHHmmss'),
          interval: val.precision * 60
        })
        .then(response => {
          // 初步梳理数据
          // eslint-disable-next-line prefer-const
          let list = response.data.values.split('|')
          // eslint-disable-next-line prefer-const
          let data = []
          list.forEach((e, i) => {
            list[i] = e.split(';')
            data[i] = []
          })
          const time = new Date(val.startTime).getTime()
          // 处理返回数据为echarts数据-用来生成图表
          list[0].forEach((e, i) => {
            // const name = this.$moment(time + val.precision * 60 * 1000 * i).format('YYYY-MM-DD HH:mm:ss')
            const name = time + val.precision * 60 * 1000 * i
            data.forEach((ee, ii) => {
              ee.push([name, (Number(list[ii][i])).toFixed(2)])
            })
            // this.option.series[0].data.push({ name: name, value: [name, (Number(list[0][i])).toFixed(2)] })// 全场平均风速
          })
          // 隐藏loading框
          this.$loading1().close()
          this.drawLine(this.eChartDemo, this.multipleSelectionFans, data)
        })
        .catch((error) => {
          // 隐藏loading框
          this.$loading1().close()
          // this.$message.error('实时趋势数据加载失败！')
          console.error(error)
        })
    },
    /**
     * 开始绘制echarts图形
     * @param {Object} eChartDemo echarts dom对象
     * @param {Array} multipleSelectionFans 选中的测点信息
     * @param {Array} data 查询出来并且处理好的数据
     */
    drawLine (eChartDemo, multipleSelectionFans, data) {
      this.yAxis = []
      this.series = []
      this.eChartDemo.clear()
      for (let i = 0; i < multipleSelectionFans.length; i++) {
        var color = this.colors[i]
        var y = {
          name: '',
          type: 'value',
          position: 'left',
          splitNumber: 5,
          offset: 0,
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
          name: '',
          data: data[i],
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
        s.name = multipleSelectionFans[i].name
        y.offset = i * 30
        this.yAxis.push(y)
        this.series.push(s)
        this.colors.push(color)
      }
      this.option.color = this.colors
      this.option.yAxis = this.yAxis
      this.option.series = this.series
      eChartDemo.setOption(this.option)
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
    // 初始化echarts对象
    this.eChartDemo = this.$echarts.init(document.getElementsByClassName('chart-demo' + this.count)[0])
  },
  watch: {
    // 选中的数据发生改变
    multipleSelectionFans: function () {
      if (this.multipleSelectionFans.length > 0) {
        this.fans = '已选择' + this.multipleSelectionFans.length + '个测点'
      } else {
        this.fans = ''
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
        color: white;
        height: 25px;
        background: rgba(0, 14, 122, 1);
        border: 1px solid rgba(10, 141, 249, 1);
        opacity: 1;
        line-height: 25px;

        text-align: center;
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
