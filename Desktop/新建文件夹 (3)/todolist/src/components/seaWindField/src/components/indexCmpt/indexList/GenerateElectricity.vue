<!--
模块：首页表格列表 发电信息组件 by 莫裕达
    首页表格列表子组件，展示发电信息相关测点数据
-->
<template>
  <div id="generateElectricity">
    <el-table :data="listData"
              style="width: 100%"
              size="small"
              height="99%">

      <el-table-column prop="ORDERNO"
                       label="风机名">
      </el-table-column>
      <el-table-column prop="CE301"
                       label="有功功率（kw）">
      </el-table-column>
      <el-table-column prop="CE302"
                       label="无功功率（kVar）">
      </el-table-column>
      <el-table-column prop="CE301_60S"
                       label="60秒平均有功功率（kw）">
      </el-table-column>
      <el-table-column prop="DCE901FD"
                       label="日有功发电量（kwh）">
      </el-table-column>
      <el-table-column prop="EFFHOURS"
                       label="有效风小时数（h）">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      listData: [], // 列表数据
      point: [], // 测点信息
      pointList: [], // 测点名集合
      timer: null, // 绑定定时任务以便离开时销毁
      tableObj: { // 临时存放，用于给列表赋值
        ORDERNO: '0', // 风机名
        CE301: '0', // 有功功率（kw）
        CE302: '0', // 无功功率（kVar）
        CE301_60S: '0', // 60秒平均有功功率（kw）
        DCE901FD: '0', // 日有功发电量（kwh）
        EFFHOURS: '0'// 有效风小时数（h）
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
          for (var i = 0; i < list.length; i += 5) {
            this.listData[i / 5].CE301 = (Number(list[i])).toFixed(1) // 有功功率（kw）
            this.listData[i / 5].CE302 = (Number(list[i + 1])).toFixed(1) // 无功功率（kVar）
            this.listData[i / 5].CE301_60S = (Number(list[i + 2])).toFixed(1) // 60秒平均有功功率（kw）
            this.listData[i / 5].DCE901FD = (Number(list[i + 3])).toFixed(1) // 日有功发电量（kwh）
            this.listData[i / 5].EFFHOURS = (Number(list[i + 4])).toFixed(1) // 有效风小时数（h）
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
      .get('/jsonFile/index/GenerateElectricity.json')
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
        }, this.$globals.GenerateElectricity_interval)// public/config/global.js 可配置（打包后config/global.js）
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
#generateElectricity {
  width: 100%;
  height: 99% !important;
}
</style>
