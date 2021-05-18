<!--
模块：首页表格列表 基本信息组件 by 莫裕达
    首页表格列表子组件，展示基本信息相关测点数据
-->
<template>
  <div id="basicInfo">
    <el-table :data="listData"
              style="width: 100%"
              size="small"
              height="99%">

      <el-table-column prop="ORDERNO"
                       label="风机名">
      </el-table-column>
      <el-table-column prop="WORKMOD"
                       label="当前状态">
      </el-table-column>
      <el-table-column prop="WSPEED"
                       label="风速(m/s)">
      </el-table-column>
      <el-table-column prop="FDJ_SPEED"
                       label="发电机转速(mp)">
      </el-table-column>
      <el-table-column prop="CE301SET"
                       label="有功功率设定(kW)">
      </el-table-column>
      <el-table-column prop="CE301S_B"
                       label="有功功率设定反馈(kW)">
      </el-table-column>
      <el-table-column prop="CE302SET"
                       label="无功功率设定(kVar)">
      </el-table-column>
      <el-table-column prop="CE302S_B"
                       label="无功功率设定反馈(kVar)">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'BasicInfo',
  data: function () {
    return {
      listData: [], // 列表数据
      point: [], // 测点信息
      pointList: [], // 测点名集合
      timer: null, // 绑定定时任务以便离开时销毁
      tableObj: { // 临时存放，用于给列表赋值
        ORDERNO: '0', // 风机名
        WORKMOD: '0', // 当前状态
        WSPEED: '0', // 风速
        FDJ_SPEED: '0', // 发电机转速
        CE301SET: '0', // 有功功率设定
        CE301S_B: '0', // 有功功率设定反馈
        CE302SET: '0', // 无功功率设定
        CE302S_B: '0'// 无功功率设定反馈
      },
      WORKMOD: { // 风机状态
        1: '初始',
        2: '停机',
        4: '待机',
        8: '启动',
        16: '加速',
        32: '发电',
        64: '维护'
      }
    }
  },

  methods: {
    /**
     * 初始化测点信息
     */
    initData () {
      for (let i = 2; i < 76; i++) {
        const num = (i + '').padStart(2, '0')
        if (i !== 42) {
          // eslint-disable-next-line prefer-const
          let obj = { ...this.tableObj }
          obj.ORDERNO = 'F' + num
          this.listData.push(obj)
          this.point.forEach(e => {
            this.pointList.push('ZQ:F' + num + e)
          })
        }
      }
    },
    /**
     * 获取相关测点数据
     */
    getPointData () {
      this.$axios
        .post(this.$url.realTimeUrl, { tags: this.pointList.join('|') })
        .then(response => {
          const list = response.data.values.split('|')
          if (isNaN(list[0])) {
            throw list
          }
          for (var i = 0; i < list.length; i += 9) {
            this.listData[i / 9].WORKMOD = this.WORKMOD[list[i]]// 当前状态
            this.listData[i / 9].WSPEED = (Number(list[i + 1])).toFixed(1)// 风速
            this.listData[i / 9].FDJ_SPEED = (Number(list[i + 2])).toFixed(1)// 发电机转速
            this.listData[i / 9].CE301SET = (Number(list[i + 3])).toFixed(1)// 有功功率设定
            this.listData[i / 9].CE301S_B = (Number(list[i + 4])).toFixed(1)// 有功功率设定反馈
            this.listData[i / 9].CE302SET = (Number(list[i + 5])).toFixed(1) // 无功功率设定
            this.listData[i / 9].CE302S_B = (Number(list[i + 6])).toFixed(1)// 无功功率设定反馈

            // 限功状态判断:风机为发电状态且限功运行状态
            if (Number(list[i]) === 32 && Number(list[i + 7]) === 1) {
              this.listData[i / 9].WORKMOD = '限功'
            }
            // 故障状态判断：故障状态 风机故障自动转为停机
            if (Number(list[i]) === 2 && Number(list[i + 8]) === 1) {
              this.listData[i / 9].WORKMOD = '限功'
            }
          }
          this.$parent.initData()// 调用父组件获取数据方法，刷新首页全场相关数据和风机状态统计
        })
        .catch((error) => {
          console.error(error)
        })
    }

  },
  mounted () {
    // 加载测点配置文件
    this.$axios
      .get('/jsonFile/index/basicInfo.json')
      .then(response => {
        // 获取测信息
        const jsonData = response.data
        for (let i = 0; i < jsonData.length; i++) {
          this.point.push(jsonData[i].tag)
        }
        // 初始化测点信息
        this.initData()
        // 获取测点数据
        this.getPointData()
        // 定时刷新测点数据
        this.timer = setInterval(() => {
          this.getPointData()
        }, this.$globals.BasicInfo_interval)// public/config/global.js 可配置（打包后config/global.js）
      })
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
#basicInfo {
  width: 100%;
  height: 99% !important;
}
</style>
