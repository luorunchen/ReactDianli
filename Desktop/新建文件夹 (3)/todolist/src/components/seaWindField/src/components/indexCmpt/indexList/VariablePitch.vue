<!--
模块：首页表格列表 变桨信息组件 by 莫裕达
    首页表格列表子组件，展示变桨信息相关测点数据
-->
<template>
  <div id="variablePitch">
    <el-table :data="listData"
              style="width: 100%"
              size="small"
              height="99%">

      <el-table-column prop="ORDERNO"
                       label="风机名">
      </el-table-column>
      <el-table-column prop="CV10002"
                       label="叶片1实际浆距角（°）">
      </el-table-column>
      <el-table-column prop="CV10003"
                       label="叶片2实际浆距角（°）">
      </el-table-column>
      <el-table-column prop="CV10004"
                       label="叶片3实际浆距角（°）">
      </el-table-column>
      <el-table-column prop="BJ_SPEED1"
                       label="叶片1实际变浆速率（°/s）">
      </el-table-column>
      <el-table-column prop="BJ_SPEED2"
                       label="叶片2实际变浆速率（°/s）">
      </el-table-column>
      <el-table-column prop="BJ_SPEED3"
                       label="叶片3实际变浆速率（°/s）">
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
        CV10002: '0', // 叶片1实际浆距角（°）
        CV10003: '0', // 叶片2实际浆距角（°）
        CV10004: '0', // 叶片3实际浆距角（°）
        BJ_SPEED1: '0', // 叶片1实际变浆速率（°/s）
        BJ_SPEED2: '0', // 叶片2实际变浆速率（°/s）
        BJ_SPEED3: '0'// 叶片3实际变浆速率（°/s）
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
          for (var i = 0; i < list.length; i += 6) {
            this.listData[i / 6].CV10002 = (Number(list[i])).toFixed(1)// 叶片1实际浆距角（°）
            this.listData[i / 6].CV10003 = (Number(list[i + 1])).toFixed(1)// 叶片2实际浆距角（°）
            this.listData[i / 6].CV10004 = (Number(list[i + 2])).toFixed(1)// 叶片3实际浆距角（°）
            this.listData[i / 6].BJ_SPEED1 = (Number(list[i + 3])).toFixed(1) // 叶片1实际变浆速率（°/s）
            this.listData[i / 6].BJ_SPEED2 = (Number(list[i + 4])).toFixed(1) // 叶片2实际变浆速率（°/s）
            this.listData[i / 6].BJ_SPEED3 = (Number(list[i + 5])).toFixed(1)// 叶片3实际变浆速率（°/s）
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
      .get('/jsonFile/index/variablePitch.json')
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
        }, this.$globals.VariablePitch_interval)// public/config/global.js 可配置（打包后config/global.js）
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
#variablePitch {
  width: 100%;
  height: 99% !important;
}
</style>
