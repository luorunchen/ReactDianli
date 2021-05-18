<!--
模块：实时监控页面（首页） 风机列表组件 by 莫裕达
    系统首页子组件，显示风机列表
-->
<template>
  <div id="indexCmpt">
    <div v-for="item in chartData"
         :key="item.index">
      <div class="main-information">
        <div>{{item.lineName}}</div>
        <table>
          <tr>
            <td>总有功</td>
            <td><span class="valueStyle">{{item.zyg}}</span><span>kW</span></td>
          </tr>
          <tr>
            <td>总无功</td>
            <td><span class="valueStyle">{{item.zwg}}</span><span>kW</span></td>
          </tr>
          <tr>
            <td>最大风速</td>
            <td><span class="valueStyle">{{item.maxSpeed}}</span><span>m/s</span></td>
          </tr>
          <tr>
            <td>最小风速</td>
            <td><span class="valueStyle">{{item.minSpeed}}</span><span>m/s</span></td>
          </tr>
        </table>
      </div>
      <div class="main-detail"
           v-for="itemC in item.children"
           :key="itemC.index"
           @click="openIndexDetail(itemC.name)">
        <!-- 风机图片样式 -->
        <div class="d-left"
             :class="[{'stateOne': itemC.state === '初始化' || itemC.state === '待机'},
             {'stateTwo': itemC.state === '加速' || itemC.state === '启动' || itemC.state === '发电'},
             {'stateThree': itemC.state === '维护' || itemC.state === '限功'},
             {'stateFour': itemC.state === '故障' || itemC.state === '停机' || itemC.state === '通信中断'}
             ]">
          <!-- 风机图片，图片大小分辨率不同，需单独调整 -->
          <img v-show=" itemC.state === '发电' || itemC.state === '限功'"
               src="../../assets/img/index/海装.gif"
               style="width: 48px;height: 87px;margin-top: -10px;">
          <img v-show=" itemC.state !== '发电' && itemC.state !== '限功'"
               src="../../assets/img/index/海装j.png"
               style="width: 44px;height: 65px;margin-top: 4px;margin-bottom: 10px;">
          <span>{{itemC.name}}</span>
        </div>
        <table>
          <tr>
            <td><span class="valueStyle">{{itemC.state}} {{itemC.y_power}}</span><span>kW</span></td>
          </tr>
          <tr>
            <td><span class="valueStyle">{{itemC.speed}}</span><span>m/s</span></td>
          </tr>
          <tr>
            <td><span class="valueStyle">{{itemC.rfdl}}</span><span>kWh</span></td>
          </tr>
        </table>
        <div class="main-detail-footer">
          <div :style="{ width: itemC.powerRatio + '%' }"></div>
        </div>
        <!-- 跳转明细页面 query里放置需要传递的参数，可通过this.$route.query.id 取出-->
        <router-link :to="{path:'/indexDetail',query:{id:itemC.name}}"><button :id="'linkOpen' + itemC.name"
                  hidden></button></router-link>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  data: function () {
    return {
      workingState: { // 风机状态
        1: '发电', 2: '限功', 3: '待机', 4: '停机', 5: '故障', 6: '维护', 7: '初始化', 8: '启动', 9: '加速', 10: '通信中断'
      },
      jsonData: null, // 测点信息对象，从json文件中获取
      timer: 0, // 绑定定时任务以便离开时销毁
      tempData: [], // 存放临时数据，当接口连接失败时模拟空数据时页面加载不受影响
      chartData: []// 风机列表数据
    }
  },
  methods: {
    /**
     *  获取风机列表数据
     */
    getChartData () {
      // 将json数据进行转换防止数据污染
      // eslint-disable-next-line prefer-const
      let results = JSON.parse(JSON.stringify(this.tempData))// 存放查询结果
      // eslint-disable-next-line prefer-const
      let tags = []// 测点名称集合
      for (let i = 0; i < this.jsonData.length; i++) { // 遍历测点配置信息获取相关测点名
        const tag = []
        for (let j = 0; j < this.jsonData[i].children.length; j++) {
          const datar = this.jsonData[i].children[j]
          tag.push(datar.state)// 运行状态
          tag.push(datar.rfdl)// 日发电量
          tag.push(datar.speed)// 风速
          // tag.push(sqlTable + datar.power)// 有功功率
          tag.push(datar.y_power)// 有功功率
          tag.push(datar.w_power)// 无功功率
          tag.push(datar.LimitedWork)// 限功
          tag.push(datar.fault)// 故障
        }
        tags.push(tag.join('|'))
      }
      // eslint-disable-next-line prefer-const
      let requestUrl = []
      requestUrl.push(this.$axios.post(this.$url.realTimeUrl, { // 环线1
        tags: tags[0]
      }))
      requestUrl.push(this.$axios.post(this.$url.realTimeUrl, { // 环线2
        tags: tags[1]
      }))
      requestUrl.push(this.$axios.post(this.$url.realTimeUrl, { // 环线3
        tags: tags[2]
      }))
      requestUrl.push(this.$axios.post(this.$url.realTimeUrl, { // 环线4
        tags: tags[3]
      }))
      requestUrl.push(this.$axios.post(this.$url.realTimeUrl, { // 环线5
        tags: tags[4]
      }))
      this.$axios.all(requestUrl)
        .then(this.$axios.spread((res1, res2, res3, res4, res5) => {
          // 格式化环线数据
          this.formatData(0, results, res1.data.values)
          this.formatData(1, results, res2.data.values)
          this.formatData(2, results, res3.data.values)
          this.formatData(3, results, res4.data.values)
          this.formatData(4, results, res5.data.values)
          this.chartData = results
          this.$parent.getPointData()// 调用父组件获取数据方法，刷新首页全场相关数据和风机状态统计
        }))
        .catch((error) => {
          console.error(error)
        })
      // 当接口连接断开时模拟临时数据使页面正常加载
      if (this.chartData.length === 0) {
        this.chartData = results
      }
    },
    /**
     *格式化环线风机数据
     *@param {Number} index 标记环线，0为环线一，以此类推
     *@param {Array} results 环线数据集合
     *@param {String} res 测点数据查询结果，
     */
    formatData (index, results, res) {
      /* eslint-disable */
      const data = res.split('|')
      const tagLen = 7
      const num = data.length / tagLen
      let ypower = 0 // 总有功
      let wpower = 0// 总无功
      for (let i = 0; i < num; i++) {
        const sta = Number(data[i * tagLen + 0])
        results[index].children[i].state = this.workingState[sta] // 风机状态
        // // 限功状态判断:风机为发电状态且限功运行状态
        // const xiangong = Number(data[i * tagLen + 5])
        // if (sta === 32 && xiangong !== 0) {
        //   results[index].children[i].state = '限功'
        // }
        // // 故障状态判断：故障状态 风机故障自动转为停机
        // const guzhang = Number(data[i * tagLen + 6])
        // if (sta === 2 && guzhang !== 0) {
        //   results[index].children[i].state = '故障'
        // }
        results[index].children[i].rfdl = Number(data[i * tagLen + 1]).toFixed(2) // 日有功发电量
        results[index].children[i].speed = Number(data[i * tagLen + 2]).toFixed(2)// 风速
        results[index].children[i].y_power = Number(data[i * tagLen + 3]).toFixed(2)// 有功功率
        results[index].children[i].w_power = Number(data[i * tagLen + 4]).toFixed(2)// 无功功率
        results[index].children[i].powerRatio = Number(data[i * tagLen + 3]) / 2000 * 100 // 功率比例

        ypower += Number(results[index].children[i].y_power)
        wpower += Number(results[index].children[i].w_power)
      }
      //
      results[index].zyg = ypower.toFixed(2)// 总有功
      results[index].zwg = wpower.toFixed(2)// 总无功
      // 最大风速
      let max = results[index].children[0].speed
      for (let i = 1; i < results[index].children.length; i++) {
        const cur = results[index].children[i].speed
        cur > max ? max = cur : null
      }
      results[index].maxSpeed = Number(max).toFixed(2)
      // 最小风速
      let min = results[index].children[0].speed
      for (let i = 1; i < results[index].children.length; i++) {
        const cur = results[index].children[i].speed
        cur < min ? min = cur : null
      }
      results[index].minSpeed = Number(min).toFixed(2)
      /* eslint-disable */
    },
    /**
     * 跳转明细页面
     * @param {String} val 风机名称 如F01,用来标记风机跳转到指定风机明细页面
     */
    openIndexDetail (val) {
      document.getElementById('linkOpen' + val).click()
    }
  },
  destroyed () {
    // 销毁定时任务，关闭当前组件时触发
    window.clearInterval(this.timer)
  },
  beforeDestroy () {
    // 销毁定时任务，当前组件销毁时触发
    window.clearInterval(this.timer)
    this.timer = null
  },
  mounted () {

    // 加载测点配置文件
    this.$axios
      .get('/jsonFile/index/indexChart.json')
      .then(response => {
        this.jsonData = response.data

        // 模拟临时数据
        this.tempData = JSON.parse(JSON.stringify(this.jsonData))//防止数据污染
        for (let k = 0; k < 5; k++) {
          for (let j = 0; j < this.tempData[k].children.length; j++) {
            const field = Object.keys(this.tempData[k].children[j])
            for (let i = 0; i < field.length; i++) {
              const name = field[i]
              if (name === "name") {//略过风机编号
                continue
              }
              this.tempData[k].children[j][name] = 0
            }
          }
        }
        // 获取风机列表数据
        this.getChartData()
        //定时刷新风机列表数据
        this.timer = setInterval(() => {
          this.getChartData()
        }, this.$globals.IndexChartCmpt_interval)// public/config/global.js 可配置（打包后config/global.js）
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
<style lang="less" scoped>
#indexCmpt {
  width: 100%;
  height: 99%;
  //display: grid;
  align-content: flex-start;
  overflow-y: scroll;
  .main-detail:hover {
    cursor: pointer;
  }
  > div {
    float: left;
    width: 100%;
    height: auto;
    border-bottom: 1px solid rgba(4, 43, 118, 1);
    .main-information {
      width: 170px;
      height: 87px;
      background: rgba(255, 255, 255, 0);
      opacity: 1;
      display: flex;
      margin-top: 8px;
      margin-left: 8px;
      float: left;

      > div {
        width: 21px;
        height: 80px;
        background: rgba(15, 126, 96, 1);
        border: 1px solid rgba(15, 126, 96, 1);
        opacity: 1;
      }

      > table {
        width: 142px;
        height: 80px;
        font-size: 12px !important;

        td:nth-child(odd) {
          text-align: left;
        }

        td:nth-child(even) {
          text-align: right;
        }

        .valueStyle {
          width: 25px;
          color: rgba(224, 207, 109, 1);
          font-weight: 800;
          opacity: 1;
        }
      }
    }

    .main-detail {
      width: 170px;
      height: 87px;
      background: rgba(255, 255, 255, 0);
      opacity: 1;
      display: flex;
      margin-top: 8px;
      margin-left: 8px;
      float: left;

      .main-detail-footer {
        width: 100px;
        height: 10px;
        background: rgba(2, 130, 224, 1);
        opacity: 1;
        border-radius: 5px;
        position: relative;
        top: 74px;
        left: -99px;
        flex-shrink: 0;
        overflow: hidden;
        > div {
          height: 100%;
          width: 0%;
          border-radius: 5px;
          background: rgb(28, 216, 207);
        }
      }

      .d-left {
        // width: 68px;
        height: 87px;

        > span {
          position: relative;
          top: -15px;
        }
      }
      .stateOne {
        > img {
          filter: invert(16%) sepia(100%) saturate(5746%) hue-rotate(205deg)
            brightness(85%) contrast(104%);
        }
      }

      .stateTwo {
        > img {
          filter: invert(52%) sepia(91%) saturate(1478%) hue-rotate(127deg)
            brightness(110%) contrast(101%);
        }
      }

      .stateThree {
        > img {
          -webkit-filter: contrast(200%) brightness(171%) saturate(200%)
            sepia(80%);
          filter: contrast(200%) brightness(171%) saturate(200%) sepia(80%);
        }
      }
      .stateFour {
        > img {
          filter: invert(62%) sepia(98%) saturate(1069%) hue-rotate(312deg)
            brightness(99%) contrast(101%);
        }
      }
      > table {
        width: 100px !important;
        height: 80px;
        font-size: 12px !important;
        flex-shrink: 0;

        td {
          width: 100px;
          text-align: right;
        }
        .valueStyle {
          width: 25px;
          color: rgba(224, 207, 109, 1);
          opacity: 1;
        }
      }
    }
  }
}
</style>
