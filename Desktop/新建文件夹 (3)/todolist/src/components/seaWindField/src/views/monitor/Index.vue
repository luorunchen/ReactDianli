<!--
模块：实时监控页面（首页） by 莫裕达
    系统首页
    引用组件：
        风机列表组件（components/indexCmpt/IndexChartCmpt.vue）
        表格列表组件（components/indexCmpt/IndexListCmpt.vue）
-->
<template>
  <div id="indexMain">
    <div class="top-menu">
      <div :class="{ 'active': active===1 }"
           @click="activityMenu(1)"><i class="iconfont iconshouyeqiehuantubiao2"></i></div>
      <div :class="{ 'active': active===2 }"
           @click="activityMenu(2)"><i class="iconfont iconshouyeqiehuantubiao3"></i></div>

    </div>
    <div class="index-body">
      <component v-bind:is="component"
                 :key="timer"></component>
    </div>
    <div class="index-footer">
      <div class="footer-left">
        <el-row>
          <el-col :span="6">
            <div class="grid-content col-border-2">全场风机平均风速（m/s）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-2 font-style-1">{{wholeAudienceData.QCFJPJFS}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content col-border-2">全场风机总有功功率（kW）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-2 font-style-1">{{wholeAudienceData.QCFJZYGGL}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content col-border-2">全场风机总无功功率（kVar）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-2 font-style-1">{{wholeAudienceData.QCFJZWGGL}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content col-border-1">全场总发电量（MWh）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-1 font-style-1">{{wholeAudienceData.QCZFDL}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content col-border-1">全场日发电量（kWh）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-1 font-style-1">{{wholeAudienceData.QCRFDL}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content col-border-1">全场月发电量（kWh）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-1 font-style-1">{{wholeAudienceData.QCYFDL}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div class="grid-content col-border-3">全场年发电量（kWh）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-3 font-style-1">{{wholeAudienceData.QCNFDL}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content col-border-3 ">全场风机总有功功率设定（kW）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-3 font-style-1">{{wholeAudienceData.QCFJZYGGLSD}}</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content col-border-3 ">全场风机理论功率（kW）</div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content col-border-3 font-style-1">{{wholeAudienceData.QCFJLLGV}}</div>
          </el-col>
        </el-row>
      </div>

      <div class="footer-rigth">
        <el-row>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-1">初始化</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-1">{{machineStatusData.csh}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-2">加速</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-2">{{machineStatusData.js}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-3">维护</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-3">{{machineStatusData.wh}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-4">故障</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-2 bg-style-4">{{machineStatusData.gz}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-1">待机</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-1">{{machineStatusData.dj}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-2">启动</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-2">{{machineStatusData.qd}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-3">限功</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-3">{{machineStatusData.xg}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-4">停机</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-1 bg-style-4">{{machineStatusData.tj}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-1"></div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-1"></div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-2">发电</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-2">{{machineStatusData.fd}}</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-3"></div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-3"></div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-4">通信中断</div>
          </el-col>
          <el-col :span="3">
            <div class="grid-content col-border-3 bg-style-4">{{machineStatusData.txzd}}</div>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
// 风机列表组件
const IndexChart = () =>
  import('@/components/indexCmpt/IndexChartCmpt').then(m => m.default)
// 表格列表组件
const indexList = () =>
  import('@/components/indexCmpt/IndexListCmpt').then(m => m.default)
export default {
  data: function () {
    return {
      active: 1, // 当前活动页面 1：风机列表 ，2：表格列表
      timer: null, // 绑定组件key值，当值改变时组件自动刷新
      component: IndexChart, // 绑定组件
      wholeAudienceData: {
        QCFJPJFS: 0, // 全场风机平均风速
        QCFJZYGGL: 0, // 全场风机总有功功率
        QCFJZWGGL: 0, // 全场风机总无功功率
        QCZFDL: 0, // 全场总发电量
        QCRFDL: 0, // 全场日发电量
        QCYFDL: 0, // 全场月发电量
        QCNFDL: 0, // 全场年发电量
        QCFJZYGGLSD: 0, // 全场风机总有功功率设定
        QCFJLLGV: 0 // 全场风机理论功率（kW）
      },
      // 全场相关数据
      machineStatusData: {}, // 风机状态数据
      point: [], // 测点信息
      pointList: [], // 测点名集合
      totalGenerationPoint: [], // 有功发电量测点集合
      // 风机理论功率对应风速
      theoreticalPower: {},
      windowTimer: null
    }
  },
  methods: {
    /**
     * 切换tab页
     *  @param {Number} menuId 当前活动tab页  1：风机列表 ，2：表格列表
     */
    activityMenu (menuId) {
      this.timer = new Date().getTime()
      if (menuId === 1) { // 风机列表
        this.active = menuId
        this.component = IndexChart// 绑定对应组件，下同
      } else if (menuId === 2) { // 表格列表
        this.active = menuId
        this.component = indexList
      }
    },
    /**
     * 初始化测点信息
     */
    initData () {
      // 封装测点信息
      for (let i = 2; i < 76; i++) {
        const num = (i + '').padStart(2, '0')
        this.totalGenerationPoint.push('ZQ:F' + num + 'CE901FD')// 有功发电量
        if (i !== 42) {
          this.point.forEach(e => {
            this.pointList.push('ZQ:F' + num + e)
          })
        }
      }
      // 获取测点数据
      this.getPointData()
      // 定时刷新数据
      this.windowTimer = setInterval(() => {
        this.getPmData()
        this.getPointData()
      }, this.$globals.Index_interval)// public/config/global.js 可配置（打包后config/global.js）
    },
    /**
     * 获取测点数据
     */
    getPointData () {
      // 风机状态统计
      // eslint-disable-next-line prefer-const
      let stateResults = {
        fd: 0, //  发电
        xg: 0, // 限功
        dj: 0, // 待机
        tj: 0, // 停机
        csh: 0, // 初始化
        qd: 0, // 启动
        js: 0, // 加速
        gz: 0, // 故障
        wh: 0, // 维护
        txzd: 0// 通信中断
      }
      // 第一次统计风机状态个数
      if (Object.keys(this.machineStatusData).length === 0) {
        this.machineStatusData = stateResults
      }
      this.$axios
        .post(this.$url.realTimeUrl, { tags: this.pointList.join('|') })
        .then(response => {
          this.wholeAudienceData.QCFJPJFS = 0
          this.wholeAudienceData.QCFJZYGGL = 0
          this.wholeAudienceData.QCFJZWGGL = 0
          this.wholeAudienceData.QCZFDL = 0
          this.wholeAudienceData.QCRFDL = 0
          this.wholeAudienceData.QCFJZYGGLSD = 0
          this.wholeAudienceData.QCFJLLGV = 0
          const list = response.data.values.split('|')
          if (isNaN(list[0])) {
            throw list
          }
          for (var i = 0; i < list.length; i += 9) {
            // 统计全场相关数据
            this.wholeAudienceData.QCFJPJFS += Number(list[i + 0])
            this.wholeAudienceData.QCFJZYGGL += Number(list[i + 1])
            this.wholeAudienceData.QCFJZWGGL += Number(list[i + 2])
            this.wholeAudienceData.QCZFDL += Number(list[i + 3])
            this.wholeAudienceData.QCRFDL += Number(list[i + 4])
            this.wholeAudienceData.QCFJZYGGLSD += Number(list[i + 5])
            const llgl = this.theoreticalPower[Number(list[i + 0]).toFixed(1)]
            if (!isNaN(llgl)) {
              this.wholeAudienceData.QCFJLLGV += llgl
            }
            // 统计风机状态个数
            const stateCode = Number(list[i + 6]).toFixed(0)
            switch (Number(stateCode)) {
              case 1:// 发电
                stateResults.fd++
                break
              case 2:// 限功
                stateResults.xg++
                break
              case 3:// 待机
                stateResults.dj++
                break
              case 4:// 停机
                stateResults.tj++
                break
              case 5://  故障
                stateResults.gz++
                break
              case 6:// 维护
                stateResults.wh++
                break
              case 7:// 初始化
                stateResults.csh++
                break
              case 8:// 启动
                stateResults.qd++
                break
              case 9://  加速
                stateResults.js++
                break
              case 10:// 通信中断
                stateResults.txzd++
                break
              default:
                break
            }
          }
          this.wholeAudienceData.QCFJPJFS = (this.wholeAudienceData.QCFJPJFS / (73 - stateResults.txzd)).toFixed(2)// 全场风机平均风速（出去断连风机）
          this.wholeAudienceData.QCFJZYGGL = Math.round(this.wholeAudienceData.QCFJZYGGL)// 全场风机总有功功率
          this.wholeAudienceData.QCFJZWGGL = Math.round(this.wholeAudienceData.QCFJZWGGL)// 全场风机总无功功率
          // 启用发电量维护时，加上维护发电量常数
          if (this.$globals.PmData.IS_MAINTAIN) {
            this.wholeAudienceData.QCRFDL = Math.round(this.wholeAudienceData.QCRFDL + this.$globals.PmData.DAY_ZQ)// 全场日发电量
            this.wholeAudienceData.QCZFDL = Math.round((this.wholeAudienceData.QCZFDL + this.$globals.PmData.TOTAL_ZQ) / 1000)// 全场总发电量
          } else {
            this.wholeAudienceData.QCRFDL = Math.round(this.wholeAudienceData.QCRFDL)// 全场日发电量
            this.wholeAudienceData.QCZFDL = Math.round(this.wholeAudienceData.QCZFDL / 1000)// 全场总发电量
          }
          this.wholeAudienceData.QCFJZYGGLSD = Math.round(this.wholeAudienceData.QCFJZYGGLSD)// 全场风机总有功功率设定
          this.wholeAudienceData.QCFJLLGV = Math.round(this.wholeAudienceData.QCFJLLGV)// 全厂理论功率
          this.machineStatusData = stateResults
        })
        .catch((error) => {
          console.error(error)
        })

      // 查询历史测点数据
      // 组织需要查询的点和参数
      const time = new Date()
      const startTime = new Date()
      const startTimeStr = this.$moment(time).format('YYYYMMDDHHmmss')
      const startTimeNum = time.getTime()
      let interval = 0

      startTime.setHours(0, 0, 0, 0)
      // 查询全场月发电量
      // 做时间差，取首尾两端数据，相减得查询时间内发电量
      const time2 = this.$moment(startTime.setDate(1)).format('YYYYMMDDHHmmss') + '-' + startTimeStr
      interval = Math.floor((startTimeNum - startTime.getTime()) / 1000)
      this.getYMData(time2, interval, 1)

      // 查询全场年发电量
      // 做时间差，取首尾两端数据，相减得查询时间内发电量
      const time3 = this.$moment(startTime.setMonth(0)).format('YYYYMMDDHHmmss') + '-' + startTimeStr
      interval = Math.floor((startTimeNum - startTime.getTime()) / 1000)
      this.getYMData(time3, interval, 2)
    },
    /**
     * 查询年月数据
     * @param {String} time 查询的时间
     * @param {Number} interval 查询的时间间隔
     * @param {Number} type 查询的类型 1:月发电量，2：年发电量
     */
    getYMData (time, interval, type) {
      this.$axios
        .post(this.$url.historicalUrl, {
          tags: this.totalGenerationPoint.join('|'),
          time: time,
          interval: interval
        })
        .then(response => {
          const list = response.data.values.split('|')
          if (list.length === 1) {
            throw list
          }
          let sum = 0
          list.forEach((e, i) => {
            const l = e.split(';').map(Number)
            if (time.substring(0, 4) === '2020' && type === 2) {
              sum += l[1]
            } else {
              sum += (l[1] - l[0])
            }
          })
          const pmData = {
            QCNFDL: 0,
            QCYFDL: 0
          }
          // 启用维护发电量
          if (this.$globals.PmData.IS_MAINTAIN) {
            pmData.QCNFDL = this.$globals.PmData.YEAR_ZQ
            pmData.QCYFDL = this.$globals.PmData.MONTH_ZQ
          }
          // 年发电量
          if (time.substring(0, 4) === '2020' && type === 2) { // 2020年没有年初数据，年发电量= 当前时刻总发电量 - 发电量常数（全场截止2020-01-01 总发电量）
            this.wholeAudienceData.QCNFDL = Math.round(sum - this.$globals.yearCapacity + pmData.QCNFDL)// GLOBAL为全局常量对象，在public/config/global.js下可修改变量值（打包后config/global.js下修改）
          } else if (time.substring(0, 4) !== '2020' && type === 2) {
            this.wholeAudienceData.QCNFDL = Math.round(sum + pmData.QCNFDL)
          }
          // 月发电量
          if (type === 1) {
            this.wholeAudienceData.QCYFDL = Math.round(sum + pmData.QCYFDL)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    /**
     * 获取发电量维护数据
     */
    getPmData () {
      this.$axios
        .post(this.$url.getPmData, {
          keyS: 'DAY_ZQ,MONTH_ZQ,YEAR_ZQ,TOTAL_ZQ,IS_MAINTAIN'
        })
        .then(response => {
          const data = response.data.data
          data.forEach(d => {
            this.$globals.PmData[d.key] = d.value ? Number(d.value) : 0
          })
        })
        .catch(e => { })
    }

  },
  mounted () {
    //  获取发电量维护数据
    this.getPmData()
    // // 加载测点配置文件/理论功率配置文件信息
    this.$axios.all([
      this.$axios.get('/jsonFile/index/index.json'),
      this.$axios.get('/jsonFile/common/theoreticalPower.json')])
      .then(this.$axios.spread((res1, res2) => {
        this.theoreticalPower = res2.data
        // 获取测信息
        const jsonData = res1.data
        for (let i = 0; i < jsonData.length; i++) {
          this.point.push(jsonData[i].tag)
        }

        // 初始化引入的组件
        this.timer = new Date().getTime()
        // 默认加载风机列表页
        this.activityMenu(1)
        // 初始化测点信息及数据
        this.initData()
      })).catch((error) => {
        console.log(error)
      })
  },
  destroyed () {
    // 销毁定时任务，关闭当前组件时触发
    window.clearInterval(this.windowTimer)
  }

}
</script>

<style lang="less" scoped>
#indexMain {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  width: 100%;
  height: 98%;
  border-left: 1px solid rgba(0, 60, 155, 1);
  opacity: 1;
  display: flex;
  flex-direction: column;
  /**顶部菜单栏 */
  .top-menu {
    border-bottom: 2px solid rgba(4, 32, 105, 1);
    width: 100%;
    height: 56px;
    background: rgba(4, 32, 105, 1);
    opacity: 1;

    > div {
      width: 110px;
      height: 56px;
      float: left;
    }

    > div:hover {
      cursor: pointer;
    }
    .el-icon-video-camera-solid:before {
      color: white;
      font-size: 45px;
      line-height: 56px;
    }

    .iconshouyeqiehuantubiao1:before {
      content: '\e63c';
      font-size: 40px;
      position: relative;
      top: 5px;
    }
    .iconshouyeqiehuantubiao2:before {
      content: '\e634';
      font-size: 40px;
      position: relative;
      top: 5px;
    }

    .iconshouyeqiehuantubiao3:before {
      content: '\e642';
      font-size: 40px;
      position: relative;
      top: 5px;
    }
  }
  /**中间区域（引入组件） */
  .index-body {
    width: 100%;
    height: 74%;
  }
  /**全场、状态 统计相关样式 */
  .index-footer {
    width: 100%;
    height: 171px;
    background: rgba(0, 58, 162, 1);
    opacity: 1;
    bottom: 0px;
    display: flex;

    .col-border-1 {
      border-top: 1px solid #4de0d7;
      border-bottom: 1px solid #4de0d7;
    }
    .col-border-2 {
      border-bottom: 1px solid #4de0d7;
    }
    .col-border-3 {
      border-top: 1px solid #4de0d7;
    }

    .font-style-1 {
      font-size: 12px;
      font-family: Segoe UI;
      color: rgba(224, 207, 109, 1);
      opacity: 1;
    }

    .bg-style-1 {
      background: #004fb5;
    }
    .bg-style-2 {
      background: #00e2b2;
    }
    .bg-style-3 {
      background: #fbd33e;
    }
    .bg-style-4 {
      background: #fd7371;
    }

    .footer-left {
      width: 840px;
      margin-top: 16px;
      .el-row {
        background: #4de0d7;
        background: linear-gradient(
          90deg,
          #00ffff 99%,
          rgba(0, 38, 113, 1) 99%
        );
        font-size: 12px;
        font-family: Segoe UI;
        line-height: 36px;
        color: rgba(255, 255, 255, 1);
        &:last-child {
          margin-bottom: 0;
        }
      }
      .grid-content {
        text-align: center;
        min-height: 38px;
        margin-right: 2px;
        background: rgba(0, 38, 113, 1);
      }
    }
    .footer-rigth {
      width: 840px;
      margin-top: 16px;
      margin-left: 30px;
      .el-row {
        background: #4de0d7;
        background: linear-gradient(
          90deg,
          #00ffff 99%,
          rgba(0, 38, 113, 1) 99%
        );
        font-size: 12px;
        font-family: Segoe UI;
        line-height: 36px;
        color: rgba(255, 255, 255, 1);
        &:last-child {
          margin-bottom: 0;
        }
      }
      .grid-content {
        text-align: center;
        min-height: 38px;
        margin-right: 2px;
        // background: rgba(0, 38, 113, 1);
      }
    }
  }
}
/**选中tab页样式 */
.active {
  background: rgba(236, 165, 106, 1);

  .iconshouyeqiehuantubiao1:before {
    color: #000;
  }
  .iconshouyeqiehuantubiao2:before {
    color: #000;
  }
  .iconshouyeqiehuantubiao3:before {
    color: #000;
  }
}
</style>
