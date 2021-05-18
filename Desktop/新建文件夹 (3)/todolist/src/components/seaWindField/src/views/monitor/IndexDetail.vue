<!--
模块：风机明细页面 by 莫裕达
    首页点击风机进入，展示对应风机相关数据
    引用组件：
        数据组件（components/indexDetailCmpt/DataCmpt.vue）
        图形组件（components/indexDetailCmpt/ChartCmpt.vue）
        箱变组件（components/indexDetailCmpt/BoxChange.vue）
-->
<template>
  <div id="indexDetail">
    <!-- 返回首页按钮 -->
    <div class="top-menu">
      <router-link :to="{path:'/index'}"><i class="iconfont iconfanhuianniu"></i></router-link>
    </div>
    <div class="indexDetail-body">
      <el-container>
        <!-- 全览（数据、图形、箱变） -->
        <el-main width="50%">
          <div class="b-left">
            <div class="div-title">全览</div>
            <div style="width:100%;height:20px">
              <el-row>
                <el-col :span="8">
                  <div class="tab-content"
                       @click="chooseTab(1)"
                       :class="{ 'active': isActive===1 }">数据</div>
                </el-col>
                <el-col :span="8">
                  <div class="tab-content"
                       @click="chooseTab(2)"
                       :class="{ 'active': isActive===2 }">图形</div>
                </el-col>
                <el-col :span="8">
                  <div class="tab-content"
                       @click="chooseTab(3 )"
                       :class="{ 'active': isActive===3 }">箱变</div>
                </el-col>
              </el-row>
            </div>
            <!-- 加载组件  itemId：向子组件传入参数，风机编号，如01-->
            <component v-if="itemId"
                       v-bind:is="component"
                       :itemId="itemId"></component>
            <div class="left-footer">
            </div>
          </div>
        </el-main>
        <!-- 右上角风机基本信息 -->
        <el-aside width="50%">
          <div class="b-top"
               v-if="basisData">
            <el-row>
              <el-col :span="8">
                <div class="grid-content-1 col-border-2">
                  <i class="iconfont iconfengjixinghao"></i>
                  <p>
                    <span>风机型号：</span>
                    <span style="font-weight: 800;">{{basisData.fjxh}}</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content-1 col-border-2">
                  <i class="iconfont iconfengjizhuangtai"></i>
                  <p>
                    <!-- 根据状态码显示对应状态名称 -->
                    <span>风机状态：</span>
                    <span>{{basisData.fjzt}}</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content-1 col-border-2">
                  <i class="iconfont iconyougonggongshuai"></i>
                  <p>
                    <span>有功功率：</span>
                    <span style="font-weight: 800;">{{basisData.yggl}}</span>
                    <span>&nbsp;&nbsp;kW</span>
                  </p>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="grid-content-2 col-border-1">
                  <i class="iconfont iconfengsu"></i>
                  <p>
                    <span>风速：</span>
                    <span style="font-weight: 800;">{{basisData.fs}}</span>
                    <span>&nbsp;&nbsp;m/s</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content-2 col-border-1">
                  <i class="iconfont iconfengxiang"></i>
                  <p>
                    <span>风向：</span>
                    <span style="font-weight: 800;">{{basisData.fx}}</span>
                    <span>&nbsp;&nbsp;°</span>
                  </p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content-2 col-border-1">
                  <i class="iconfont iconzongfadianliang"></i>
                  <p>
                    <span>总发电量：</span>
                    <span style="font-weight: 800;">{{basisData.zfdl}}</span>
                    <span>&nbsp;&nbsp;kWh</span>
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- 风机全览列表（实时告警、历史告警） -->
          <div class="b-bottom">
            <div class="div-title">{{itemId}}风机全览</div>
            <el-row>
              <el-col :span="12">
                <div class="tab-content"
                     @click="getListData (1)"
                     :class="{ 'active': alarmActive===1 }">实时告警</div>
              </el-col>
              <el-col :span="12">
                <div class="tab-content"
                     @click="getListData (2)"
                     :class="{ 'active': alarmActive===2 }">历史告警</div>
              </el-col>
            </el-row>
            <div class="table">
              <el-table :data="tableData"
                        border
                        height='99%'
                        style="width:100%">
                <el-table-column type="index"
                                 label="序号"
                                 width="50">
                </el-table-column>
                <el-table-column v-for="item in tableColumn"
                                 :key="item.index"
                                 :prop="item.prop"
                                 :label="item.label">
                </el-table-column>
              </el-table>
            </div>
            <!-- 分页 -->
            <div class="page">
              <el-pagination @size-change="handleSizeChange"
                             @current-change="handleCurrentChange"
                             :current-page="pageIndex-0"
                             :page-sizes="[10, 20, 50, 100,200]"
                             :page-size="pageSize-0"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="total-0">
              </el-pagination>
            </div>
          </div>
        </el-aside>
      </el-container>

    </div>
  </div>
</template>
<script>
// 数据组件
const dataCmpt = () =>
  import('@/components/indexDetailCmpt/DataCmpt').then(m => m.default)
// 图形组件
const chartCmpt = () =>
  import('@/components/indexDetailCmpt/ChartCmpt').then(m => m.default)
// 箱变组件
const boxChange = () =>
  import('@/components/indexDetailCmpt/BoxChange').then(m => m.default)
export default {
  data: function () {
    return {
      tableColumn: [], // 实时告警和历史告警表格表头信息
      errorCode: null, // 告警信息
      jsonData: null, // 测点信息对象，从json文件中获取
      workingState: { // 风机状态
        1: '发电', 2: '限功', 3: '待机', 4: '停机', 5: '故障', 6: '维护', 7: '初始化', 8: '启动', 9: '加速', 10: '通信中断'
      },
      point: [], // 测点信息
      alarmActive: 1, // 风机全览活动tab页 1：实时告警 2：历史告警
      timer: null, // 绑定定时任务以便离开时销毁
      itemId: null, // 接收首页传递的参数
      tableData: [], // 全览列表数据
      listTable: [], // 全览列表分页数据
      basisData: null, // 风机基础数据（右上角）
      component: dataCmpt, // 绑定组件
      total: 0, // 总页数
      pageIndex: 1, // 当前页
      pageSize: 20, // 每页条数
      isActive: 1 // 活动tab页 1：数据 2：图形 3：箱变
    }
  },
  methods: {
    /**
     * 获取XX风机全览(实时告警、历史告警)列表数据
     * @param  {Number} val 1：实时告警 2：历史告警
     */
    getListData (val) {
      let tableColumn = []
      this.pageIndex = 1
      this.alarmActive = val
      const results = []
      const date = new Date()
      let stime = ''// 开始时间
      let etime = ''// 结束时间
      if (val === 2) { // 历史告警查询本月数据
        tableColumn = [
          { label: '触发时间', prop: 'cfTime' },
          { label: '回复时间', prop: 'hfTime' },
          { label: '描述', prop: 'describe' },
          { label: '故障代码', prop: 'faultCode' }
        ]
        stime = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/01 00:00:00').getTime()// 当月开始时间
      } else { // 实时告警查询当天数据
        tableColumn = [
          { label: '触发时间', prop: 'cfTime' },
          { label: '描述', prop: 'describe' },
          { label: '故障代码', prop: 'faultCode' }
        ]
        stime = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 00:00:00').getTime()// 当天开始时间
      }
      this.tableData = []
      etime = date.getTime()
      this.tableColumn = tableColumn
      this.$axios
        .post(this.$url.alarm, {
          begin: this.$moment(stime).format('YYYYMMDDHHmmss'),
          end: this.$moment(etime).format('YYYYMMDDHHmmss'),
          wtID: this.point.join(','),
          statCode: ''
        })
        .then(response => {
          if (response.data.length > 0 && response.data[0].begin) {
            response.data.forEach(e => {
              const begin = this.getDateForString(e.begin)
              const end = this.getDateForString(e.end)
              const describe = this.errorCode[e.statCode]
              if (describe) { // 故障描述为空就不显示
                const obj = {
                  cfTime: this.$moment(begin).format('YYYY-MM-DD HH:mm:ss'), // 触发时间
                  hfTime: this.$moment(end).format('YYYY-MM-DD HH:mm:ss'), // 回复时间
                  describe: this.errorCode[e.statCode], // 描述
                  faultCode: e.statCode// 故障代码
                }
                results.push(obj)
              }
            })
            this.tableData = results
            // 对表格数据按照指定字段排序
            this.tableData.sort((a, b) => {
              const at = new Date(a.cfTime.replace('-', '/')).getTime()
              const bt = new Date(b.cfTime.replace('-', '/')).getTime()
              if (at > bt) {
                return 1
              } else if (at < bt) {
                return -1
              } else {
                return 0
              }
            })
            this.paging()// 对数据进行分页
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     *根据时间字符串生成相应的时间戳
     *@param {String} date 时间字符串：202002020202
     *@return {Date} 时间错 ms
     */
    getDateForString (date) {
      const yy = date.substring(0, 4)
      const mt = date.substring(4, 6)
      const dd = date.substring(6, 8)
      const hh = date.substring(8, 10)
      const mm = date.substring(10, 12)
      const ss = date.substring(12, 14)
      return new Date(yy + '/' + mt + '/' + dd + ' ' + hh + ':' + mm + ':' + ss).getTime()
    },
    /**
     * 对数据进行分页
     */
    paging () {
      // eslint-disable-next-line prefer-const
      let list = []
      this.total = this.tableData.length
      const pageIndex = Number(this.pageIndex)
      const pageSize = Number(this.pageSize)
      const last = pageIndex * pageSize > this.tableData.length ? this.tableData.length : pageIndex * pageSize
      for (let i = (pageIndex - 1) * pageSize; i < last; i++) {
        list.push(this.tableData[i])
      }
      this.listTable = list
    },
    /**
     * 获取风机基础数据（右上角）
     */
    getBasisData () {
      // eslint-disable-next-line prefer-const
      let tags = []// 测点名称集合
      // 将json数据进行转换防止数据污染
      // eslint-disable-next-line prefer-const
      let results = {
        fjxh: 'H120',
        fjzt: 0,
        yggl: 0,
        fs: 0,
        fx: 0,
        zfdl: 0
      }
      const name = 'ZQ:'
      tags.push(name + this.itemId + this.jsonData[0].tag)// 风机状态
      tags.push(name + this.itemId + this.jsonData[1].tag)// 有功功率
      tags.push(name + this.itemId + this.jsonData[2].tag)// 风速
      tags.push(name + this.itemId + this.jsonData[3].tag)// 风向
      tags.push(name + this.itemId + this.jsonData[4].tag)// 发电量
      tags.push(name + this.itemId + this.jsonData[5].tag)// 限功
      tags.push(name + this.itemId + this.jsonData[6].tag)// 故障
      this.$axios.post(this.$url.realTimeUrl, {
        tags: tags.join('|')
      })
        .then(response => {
          const ret = response.data.values.split('|')
          if (isNaN(ret[0])) {
            throw ret
          }

          results.fjxh = 'H120'// 型号
          results.fjzt = this.workingState[Number(ret[0])]// 风机状态
          results.yggl = Number(ret[1]).toFixed(2)// 有功功率
          results.fs = Number(ret[2]).toFixed(2)// 风速
          results.fx = Number(ret[3]).toFixed(2)// 风向
          results.zfdl = Number(ret[4]).toFixed(2)// 发电量

          // 限功状态判断:风机为发电状态且限功运行状态
          // const xiangong = Number(ret[5])
          // if (results.fjzt === 32 && xiangong !== 0) {
          //   results.fjzt = '限功'
          // }
          // // 故障状态判断：故障状态 风机故障自动转为停机
          // const guzhang = Number(ret[6])
          // if (results.fjzt === 2 && guzhang !== 0) {
          //   results.fjzt = '故障'
          // }
          this.basisData = results
        })
        .catch((error) => {
          console.log(error)
        })
      // 设置默认值，防止接口无数据返回时页面信息不加载
      if (this.basisData === null) {
        this.basisData = results
        this.basisData.fjzt = this.workingState[0]// 风机状态
      }
    },
    /**
     * 切换tab页
     *  @param {Number} isActive 当前活动tab页 1：数据 2：图形 3：箱变
     */
    chooseTab (isActive) {
      if (isActive === 1) { // 数据
        this.isActive = isActive
        this.component = dataCmpt // 绑定对应组件，下同
      } else if (isActive === 2) { // 图形
        this.isActive = isActive
        this.component = chartCmpt
      } else if (isActive === 3) { // 箱变
        this.isActive = isActive
        this.component = boxChange
      }
    },
    /**
     *  改变每页条数
     *  @param {Number} val 每页显示条数
     */
    handleSizeChange (val) {
      this.pageSize = val
    },
    /**
     *  切换当前页
     *  @param {Number} val 第几页
     */
    handleCurrentChange (val) {
      this.pageIndex = val
    }
  },
  mounted () {
    this.itemId = this.$route.query.id// 风机id ： F01
    // 加载测点配置文件
    // eslint-disable-next-line prefer-const
    let requestUrl = []
    requestUrl.push(this.$axios.get('/jsonFile/indexDetail/basicData.json')) // 获取故障描述
    requestUrl.push(this.$axios.get('jsonFile/common/errorCode.json')) // 获取故障描述
    this.$axios.all(requestUrl)
      .then(this.$axios.spread((res1, res2) => {
        this.jsonData = res1.data
        this.errorCode = res2.data
        this.errorCode.error.forEach(e => { // 故障测点
          this.point.push('ZQ:' + this.itemId + e)
        })
        this.errorCode.warn.forEach(e => { // 故障测点
          this.point.push('ZQ:' + this.itemId + e)
        })
        // 获取XX风机全览列表数据，默认获取实时告警
        this.getListData(1)
        // 获取风机基础数据（右上角）
        this.getBasisData()
        // 接收首页传递的参数，如 01 ，与风机编号相同，用于拼接测点名称
        // 定时刷新数据
        this.timer = setInterval(() => {
          this.getBasisData()
        }, this.$globals.IndexDetail_interval)// public/config/global.js 可配置（打包后config/global.js）
      }))
      .catch((error) => {
        console.log(error)
      })
  },
  destroyed () {
    // 销毁定时任务，关闭当前组件时触发
    window.clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
#indexDetail {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  width: 100%;
  height: 980px;
  border-left: 1px solid rgba(0, 60, 155, 1);
  opacity: 1;
  /* 全览标题按钮样式*/
  .div-title {
    width: 100%;
    height: 30px;
    background: rgba(0, 90, 241, 0);
    opacity: 1;
    text-align: center;
    font-size: 14px;
    font-family: Segoe UI;
    color: rgba(255, 255, 255, 1);
    line-height: 30px;
  }
  /* 返回按钮样式*/
  .top-menu {
    width: 100%;
    height: 56px;
    background: rgba(4, 32, 105, 1);
    opacity: 1;

    .iconfanhuianniu:before {
      content: '\e644' !important;
      font-size: 35px !important;
      color: #fd9a4b !important;
      position: relative !important;
      right: 48% !important;
      top: 6px !important;
    }
    a {
      text-decoration: none;
    }
    .router-link-active {
      text-decoration: none;
    }
  }
  .indexDetail-body {
    width: 100%;
    height: 90%;
    /* 右上角风机基本信息 、风机全览列表相关样式 */
    .el-aside {
      height: 100%;
      /* 右上角风机基本信息相关样式 */
      .b-top {
        width: 96%;
        height: 352px;
        background: rgba(0, 41, 196, 1);
        border: 3px solid rgba(10, 141, 249, 1);
        opacity: 1;
        margin-top: 20px;
        margin-left: 20px;

        .el-row {
          height: 50%;
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
        .grid-content-1 {
          text-align: center;
          min-height: 174px;
          margin-right: 2px;
          background: rgba(0, 41, 196, 1);
          position: relative;
        }
        .grid-content-2 {
          text-align: center;
          min-height: 175px;
          margin-right: 2px;
          background: rgba(0, 41, 196, 1);
          position: relative;
        }
        .col-border-1 {
          border-top: 1px solid #4de0d7;
        }
        .col-border-2 {
          border-bottom: 1px solid #4de0d7;
        }
        .iconfengjixinghao:before,
        .iconfengjizhuangtai:before,
        .iconyougonggongshuai:before,
        .iconfengsu:before,
        .iconfengxiang:before,
        .iconzongfadianliang:before {
          font-size: 87px;
          color: rgba(233, 151, 72, 1);
          position: relative;
          top: 45px;
          //  left: 42px;
        }

        p {
          text-align: center;
          position: relative;
          top: 28px;
        }
      }
      /* 、风机全览列表相关样式 */
      .b-bottom {
        width: 96%;
        height: 452px;
        background: rgba(0, 41, 196, 1);
        border: 3px solid rgba(10, 141, 249, 1);
        opacity: 1;
        margin-top: 20px;
        margin-left: 20px;

        .el-row {
          line-height: 24px;
          background: rgba(2, 78, 213, 1);
          &:last-child {
            margin-bottom: 0;
          }
        }
        .el-col {
          border: 0.5px solid rgba(0, 41, 196, 1);
          border-radius: 4px;
        }
        .el-col:hover {
          cursor: pointer;
          background: #005af1;
        }

        .table {
          height: 360px !important;
        }
      }
    }
    /* 全览（数据、图形、箱变）相关样式*/
    .el-main {
      width: 1px;
      height: 100%;
      .b-left {
        width: 100%;
        height: 830px;
        background: rgba(0, 41, 196, 1);
        border: 3px solid rgba(10, 141, 249, 1);
        opacity: 1;
        position: relative;

        .el-row {
          margin-bottom: 24px;
          background: rgba(2, 78, 213, 1);
          &:last-child {
            margin-bottom: 0;
          }
        }
        .el-col {
          border: 0.5px solid rgba(0, 41, 196, 1);
          border-radius: 4px;
        }
        .el-col:hover {
          cursor: pointer;
          background: #005af1;
        }

        .tab-content {
          text-align: center;
          min-height: 24px;
          line-height: 24px;
        }

        .left-footer {
          width: 100%;
          height: 40px;
          position: absolute;
          bottom: 5px;

          .el-row {
            height: 100%;
            line-height: 40px;
            background: #0029c4;
          }

          .iconqidong:before,
          .icontingji:before,
          .iconfuwei:before,
          .iconkongzhi:before,
          .iconsuoding:before {
            font-size: 12px;
          }
        }
      }
    }
    .el-container {
      width: 100%;
      height: 100%;
    }
  }
}
.active {
  background: #005af1;
}
/deep/.is-scrolling-none {
  height: 325px !important;
}
</style>
