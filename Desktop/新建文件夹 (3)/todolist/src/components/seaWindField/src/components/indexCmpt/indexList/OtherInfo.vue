<!--
模块：首页表格列表 其他信息组件 by 莫裕达
    首页表格列表子组件，展示其他信息相关测点数据
-->
<template>
  <div id="otherInfo">
    <el-table :data="listData"
              style="width: 100%"
              size="small"
              height="99%">

      <el-table-column prop="ORDERNO"
                       label="风机名">
      </el-table-column>
      <el-table-column prop="CE401"
                       label="功率因数">
      </el-table-column>
      <el-table-column prop="CLX_TEMP3"
                       label="齿轮箱油温度（°C）">
      </el-table-column>
      <el-table-column prop="CLX_PRE1"
                       label="齿轮箱进口压力（bar）">
      </el-table-column>
      <el-table-column prop="ANGLE_PH"
                       label="偏航方向角">
      </el-table-column>
      <el-table-column prop="YAR_STA_S"
                       label="顺时针偏航状态">
        <template v-slot:default="scope">
          <div :class="{'ball-div':true,'green-ball':scope.row.YAR_STA_S ===1}"></div>
        </template>
      </el-table-column>
      <el-table-column prop="YAR_STA_N"
                       label="逆时针偏航状态">
        <template v-slot:default="scope">
          <div :class="{'ball-div':true,'green-ball':scope.row.YAR_STA_N ===1}"></div>
        </template>
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
        CE401: '0', // 功率因数
        CLX_TEMP3: '0', // 齿轮箱油温度（°C）
        CLX_PRE1: '0', // 齿轮箱进口压力（bar）
        ANGLE_PH: '0', // 偏航方向角
        YAR_STA_S: '0', // 顺时针偏航状态
        YAR_STA_N: '0'// 逆时针偏航状态
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
            this.listData[i / 6].CE401 = (Number(list[i])).toFixed(1)// 功率因数
            this.listData[i / 6].CLX_TEMP3 = (Number(list[i + 1])).toFixed(1)// 齿轮箱油温度（°C）
            this.listData[i / 6].CLX_PRE1 = (Number(list[i + 2])).toFixed(1)// 齿轮箱进口压力（bar）
            this.listData[i / 6].ANGLE_PH = (Number(list[i + 3])).toFixed(1)// 偏航方向角
            this.listData[i / 6].YAR_STA_S = (Number(list[i + 4])) // 顺时针偏航状态
            this.listData[i / 6].YAR_STA_N = (Number(list[i + 5]))// 逆时针偏航状态
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
      .get('/jsonFile/index/otherInfo.json')
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
        }, this.$globals.OtherInfo_interval)// public/config/global.js 可配置（打包后config/global.js）
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
#otherInfo {
  width: 100%;
  height: 99% !important;
  .ball-div {
    height: 20px;
    width: 20px;
    border-radius: 11px;
    background: radial-gradient(circle, #e5e5e5 0%, #6d6d6d 100%);
    margin-left: 50%;
    transform: translate(-50%, 0);
  }
  .green-ball {
    background: radial-gradient(circle, #3ffb82 0%, #9e9e9e 100%);
  }
}
</style>
