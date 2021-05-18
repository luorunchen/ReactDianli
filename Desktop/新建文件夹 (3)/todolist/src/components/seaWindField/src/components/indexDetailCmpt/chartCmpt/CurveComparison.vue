<!--
模块：风机明细页面 曲线对比组件 by 莫裕达
   风机明细页面子组件 选择测点生成实时曲线进行对比
-->
<template>
  <div class="CurveComparison">
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
                  placeholder="请选择"></el-input>

      </el-popover>
    </div>
    <div :class="'chart-demo' + count">
    </div>
  </div>
</template>
<script>
export default {
  props: ['count', 'itemId'], // 父组件传递进来的参数，itemId:风机编号 如 F01，可用于拼接测点名称;count：标记组件位置
  data: function () {
    return {
      tagInfo: null, // 测点信息对象，从json文件中获取
      pointsData: [], // 下拉框测点列表
      eChartDemo: {}, // eachart图绑定的元素
      data: [],
      fans: '', // 提示信息，选择测点个数
      searchFans: '', // 搜索框数据
      multipleSelectionFans: [], // 选中的测点
      yAxis: [], // y轴配置
      series: [], // 曲线配置
      colors: ['#FF1493', '#ADD8E6', '#00FA9A', '#00FF00', '#FFFF00',
        '#FF4500', '#48D1CC', '#9932CC', '#CD5C5C', '#FF1493', '#ADD8E6',
        '#00FA9A', '#00FF00', '#FFFF00', '#FF4500', '#48D1CC', '#9932CC',
        '#CD5C5C', '#FF1493', '#ADD8E6', '#00FA9A'], // 曲线颜色
      option: {}, // echart图配置
      valuePoints: [], // 选中的测点相关信息
      initChartTime: null, // 曲线初始的化时间
      timer: null// 绑定定时任务以便离开时销毁
    }
  },
  methods: {
    /**
     * 获取测点信息
     */
    getTagData () {
      const data = this.tagInfo
      this.pointsData = []
      for (let i = 0; i < data.length; i++) {
        // eslint-disable-next-line prefer-const
        let jsonData = {
          id: i,
          name: data[i].name
        }
        this.pointsData.push(jsonData)
      }
    },
    /**
     * 选中测点
     * @param {Array} val 已选中测点信息的集合
     */
    handleSelectionChangeFans (val) {
      this.multipleSelectionFans = val
      if (this.multipleSelectionFans.length > 10) {
        this.multipleSelectionFans.pop()
        this.$message.warning('最多只能选择10个测点')
        this.$refs.multipleTableFans.clearSelection()
        this.isChangeSelect = false
        this.toggleSelection()
        return
      }
      this.isChangeSelect = true
    },
    /**
     * 取消选中测点
     */
    handleSelectionChange1 () {
      if (this.multipleSelectionFans.length > 10) {
        return
      }
      if (this.isChangeSelect) {
        this.isChangeSelect = false
        return
      }
      this.toggleSelection()
    },
    /**
     * 清空已选中测点
     */
    clearFans () {
      this.isChangeSelect = true
      this.$refs.multipleTableFans.clearSelection()
      this.multipleSelectionFans = []
    },
    /**
     *  改变测点选中状态
     */
    toggleSelection () {
      if (this.multipleSelectionFans) { // 重新赋值已选中测点信息
        this.multipleSelectionFans.forEach(row => {
          this.isChangeSelect = true
          this.$refs.multipleTableFans.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTableFans.clearSelection()
      }
    },
    /**
     * 测点全选
     */
    selectAllFans (val) {
      this.multipleSelectionFans = val
      if (this.multipleSelectionFans.length > 10) {
        this.$message.warning('最多只能选择10个测点')
      }
      this.multipleSelectionFans = []
      this.$refs.multipleTableFans.clearSelection()
    },
    /**
     * 生成趋势图
     * @param {Object} eChartDemo echart图绑定的元素
     * @param {Array} multipleSelectionFans 已选中测点信息的集合
     */
    drawLine (eChartDemo, multipleSelectionFans) {
      // 清空上一次生成y轴和曲线
      this.yAxis = []
      // eslint-disable-next-line prefer-const
      let series = []
      this.eChartDemo.clear()
      // 循环已选中测点并生成相关曲线
      for (let i = 0; i < multipleSelectionFans.length; i++) {
        var color = this.colors[i]
        let data = []
        // eslint-disable-next-line prefer-const
        let series1 = this.series.find(ii => {
          return ii.id === multipleSelectionFans[i].id
        })
        if (series1 && series1.data) {
          data = series1.data
        } else {
          data = this.initChartData()
        }
        // y轴配置
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
        // 曲线配置
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
        if (i === 0) { // 最右边y轴显示坐标轴，其余隐藏
          y.splitLine.show = true
        }
        // y轴位置偏移
        this.option.grid.left = 50 + i * 30
        s.name = multipleSelectionFans[i].name
        y.offset = i * 30 // 曲线图偏移
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
     * 初始化曲线数据（新增测点时）
     * @return {Array} 返回一组空的时间轴数据
     */
    initChartData () {
      // eslint-disable-next-line prefer-const
      let list = []
      let time = 0
      const nowTime = new Date().getTime()
      const timeLength = 300 // 查询时长
      time = time = nowTime - (timeLength * 1000)
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
     * 更新曲线（测点）数据
     * @param {Date} time 当前时间
     */
    getChartData (time) {
      // 没有选中测点则不更新
      if (!(this.valuePoints && this.valuePoints.length > 0)) {
        return
      }
      // 测点描述
      // eslint-disable-next-line prefer-const
      let tags = []
      const tagArr = this.tagInfo
      // 获取相关测点名
      for (let j = 0; j < this.option.series.length; j++) {
        const seriesData = this.option.series[j]
        for (let i = 0; i < tagArr.length; i++) {
          if (seriesData.name === tagArr[i].name) {
            tags.push(tagArr[i].tag)
            break
          }
        }
      }

      this.$axios
        .post(this.$url.realTimeUrl, {
          tags: tags.join('|')
        })
        .then(response => {
          time = Math.floor(time / 1000) * 1000
          const list = response.data.values.split('|')
          // 删除第一个元素，把新请求的数据插入最后一个位置，达到动态数据效果
          this.series.forEach((e, i) => {
            e.data.shift()
            e.data.push({
              name: time,
              value: [time, Number(list[i]).toFixed(2)]
            })
          })
          this.option.series = this.series
          this.eChartDemo.setOption(this.option)
        })
        .catch((error) => {
          console.log(error)
        })
    }

  },
  mounted () {
    // 加载测点配置文件
    this.$axios
      .post(this.$url.tagInfoUrl,
        { fjs: 'ZQ:' + this.itemId }// 风机编号：ZQ:F01
      )
      .then(response => { // 从后台接口获取相关测点
        this.tagInfo = []
        const tagList = response.data
        tagList.forEach(e => {
          // eslint-disable-next-line prefer-const
          let obj = {
            name: e.tagdesc.replace(this.itemId, ''),
            tag: e.taglogicid
          }
          this.tagInfo.push(obj)
        })
        // 获取测点信息
        this.getTagData()
        // 加载绑定echart图元素
        this.eChartDemo = this.$echarts.init(document.getElementsByClassName('chart-demo' + this.count)[0])
        this.option = {
          color: this.colors,
          legend: {
            pageIconColor: '#0A8DF9',
            pageIconInactiveColor: '#0A8DF9',
            pageTextStyle: {
              color: '#fff'
            },
            type: 'scroll',
            orient: 'horizontal',
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
              }
            }
          },
          grid: {
            left: 30, // 组件距离容器左边的距离
            top: 30,
            right: 30
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLabel: {
              color: '#fff',
              textStyle: { color: '#FFF' }, // #A23400 purple
              formatter: (val) => {
                // let time = this.initChartTime > val ? this.initChartTime : val
                const time = new Date(val)
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
      })
      .catch((error) => {
        console.log(error)
      })
  },
  destroyed () { // 离开时销毁定时任务
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
        if (this.multipleSelectionFans.length > 10) {
          return
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
          this.timer = setInterval(() => {
            this.getChartData(new Date().getTime())
          }, this.$globals.CurveComparison_interval)// public/config/global.js 可配置（打包后config/global.js）
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
      }
    }
  }

  .chart-demo0,
  .chart-demo1 {
    width: 100%;
    height: 89%;
    margin-top: 5px;
    text-align: left;
  }
}
</style>
