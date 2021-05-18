<!--
模块：风机明细页面  弹窗组件 by 莫裕达
    点击数据个模块显示弹窗，展示改模块相关测点数据
-->
<template>
  <div id="bianjiang"
       v-if="data">
    <div class="tab-title">
      <i :class='["iconfont",iconfontClass]'></i>
      <div><span>{{title}}</span></div>
    </div>
    <div class="tab-body">
      <el-row v-for="item in data"
              :key="item.index">
        <el-col :span="16">
          <div class="font-1">{{item.name}}</div>
        </el-col>
        <el-col :span="6">
          <div v-if="item.isState === false">{{item.value}}</div>
          <div v-if="item.isState === true">
            <div v-show="item.value === 0"
                 class="failureState-1"></div>
            <div v-show="item.value !== 0"
                 class="failureState-2"></div>

            <!-- <div v-show="item.value === 0 && item.negation === true"
                 class="failureState-2"></div>
            <div v-show="item.value !== 0 && item.negation === true"
                 class="failureState-1"></div> -->
          </div>
        </el-col>
        <el-col :span="2">
          <div class="unit"
               v-if="item.isState === false">{{item.unit}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  // 父组件传递进来的参数，itemId:风机编号 如 F01，可用于拼接测点名称 iconfontClass:标题图标样式,title:标题,itemData:配置文件名称
  props: ['itemId', 'iconfontClass', 'title', 'itemData'],
  data: function () {
    return {
      timer: null, // 绑定定时任务以便离开时销毁
      data: null // 列表数据
    }
  },
  methods: {
    /**
     * 获取测点列表数据
     * @param {Object}} jsonData 测点信息对象，从json文件中获取
     */
    initData (jsonData) {
      // eslint-disable-next-line prefer-const
      let tags = [] // 测点名称集合
      // eslint-disable-next-line prefer-const
      let results = []// 存放查询结果
      const indexs = [] // 保存缺失的测点下标
      // 初始化测点数据
      for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i].tagName !== '') { // 过滤缺少的测点
          tags.push(jsonData[i].tagName.replace('val', this.itemId))
        } else {
          indexs.push(jsonData[i].name)
        }
        // eslint-disable-next-line prefer-const
        let obj = {
          name: jsonData[i].name, // 测点描述
          value: 0, // 值
          unit: jsonData[i].unit, // 单位
          isState: jsonData[i].isState, // 是否为状态
          negation: jsonData[i].negation// 是否取反，个别测点状态值与其他测点相反
        }
        results.push(obj)
      }
      this.$axios.post(this.$url.realTimeUrl, {
        tags: tags.join('|')
      })
        .then(response => {
          const ret = response.data.values.split('|')
          let inx = 0 // 却少测点个数
          for (let i = 0; i < ret.length; i++) {
            const name = results[i + inx].name
            if (indexs.indexOf(name) > -1) {
              inx += 1
            }
            if (results[i + inx].isState === true) { // 测点为状态时不保留小数，以方便判断
              results[i + inx].value = Number(ret[i])
            } else {
              results[i + inx].value = Number(ret[i]).toFixed(2)
            }
          }
          this.data = results
        })
        .catch((error) => {
          console.log(error)
        })
      // 当接口未返回数据时，生成临时数据时页面正常加载
      if (this.data === null) {
        this.data = results
      }
    }
  },
  mounted () {
    // 加载测点配置文件
    this.$axios
      .get('/jsonFile/indexDetail/' + this.itemData + '.json')
      .then(response => {
        const jsonData = response.data
        // 获取测点列表数据
        this.initData(jsonData)
        // 定时刷新测点数据
        this.timer = setInterval(() => {
          this.initData(jsonData)
        }, this.$globals.PopupWindow_interval)// public/config/global.js 可配置（打包后config/global.js）
      })
      .catch((error) => {
        console.log(error)
      })
  },
  destroyed () {
    // 离开时销毁定时任务
    window.clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
#bianjiang {
  width: 94%;
  background: #0029c4;
  opacity: 1;
  /**弹窗标题 */
  .tab-title {
    width: 640px;
    height: 40px;
    background: #0047be;
    opacity: 1;
    margin-left: -20px;
    margin-top: -70px;
    z-index: -1;
    > * {
      float: left;
      line-height: 35px;
      margin-left: 5px;
    }

    > div {
      width: 200px;
      height: 27px;
      border-left: 2px solid rgb(31, 113, 212);
      line-height: 26px;
      margin-top: 5px;
      text-align: left;

      > span {
        font-size: 16px;
        font-family: Segoe UI;
        font-weight: 400;
        margin-left: 5px;
        color: rgba(255, 255, 255, 1) !important;
        opacity: 1;
      }
    }

    .icontongyong,
    .iconbianjiang,
    .iconjiaoliuqidianwang,
    .iconchuandong,
    .iconjicangpianhang,
    .iconfadianji {
      line-height: 35px;
      font-size: 26px;
      color: #0a8df9;
    }
  }
  /**测点列表 */
  .tab-body {
    height: 430px;
    width: 668px;
    overflow-y: scroll;

    .unit {
      text-align: left;
      text-indent: 15px;
    }

    .last-row {
      border-bottom: 1px solid #0029c4 !important;
    }

    .el-row {
      margin-left: 3%;
      height: 40px;
      width: 94%;
      border-bottom: 1px solid rgba(31, 113, 212, 1);

      .font-1 {
        text-align: left;
      }
    }
    .el-col {
      line-height: 40px;
      text-align: right;
      color: rgba(255, 255, 255, 1) !important;
      /**状态图标样式 */
      .failureState-1 {
        width: 24px;
        height: 24px;
        background: radial-gradient(
          circle,
          rgba(229, 229, 229, 1) 0%,
          rgba(109, 109, 109, 1) 100%
        );
        border-radius: 50%;
        opacity: 1;
        float: right;
        margin-top: 7px;
      }
      .failureState-2 {
        width: 24px;
        height: 24px;
        background: radial-gradient(circle, #3ffb82 0%, #9e9e9e 100%);
        border-radius: 50%;
        opacity: 1;
        float: right;
        margin-top: 7px;
      }
    }
    .tab-content {
      text-align: center;
      min-height: 24px;
      line-height: 24px;
    }
  }
}
</style>
