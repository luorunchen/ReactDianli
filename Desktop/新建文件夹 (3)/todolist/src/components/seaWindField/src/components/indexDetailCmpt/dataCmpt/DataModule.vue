<!--
模块：风机明细页面 数据模块组件 by 莫裕达
    风机明细页面子组件，对应数据tab页
    引用组件：
        弹窗组件（components/indexDetailCmpt/dataCmpt/PopupWindow.vue）
-->
<template>
  <div class="DataModule"
       :id="'DataModule-' + iconfontClass">
    <div class="d-tab">
      <div class="tab-title"
           @click="openDialog()">
        <i :class="['iconfont',iconfontClass]"></i>
        <div></div>
        <span>{{name}}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <el-row v-for="item in this.listData"
              :key="item.index">
        <el-col :span="16">
          <div style="text-align:left;">{{item.name}}</div>
        </el-col>
        <el-col :span="6">
          <div v-if="item.isState === false">{{item.value}}</div>
          <div v-if="item.isState === true">
            <div v-show="item.value ===0"
                 class="failureState-1">
            </div>
            <div v-show="item.value !==0"
                 class="failureState-2"></div>
          </div>
        </el-col>
        <el-col :span="2">
          <div>{{item.unit}}</div>
        </el-col>
      </el-row>
    </div>
    <!-- 模块弹窗 -->
    <el-dialog :modal="false"
               :append-to-body="true"
               v-if="dialogTableVisible"
               width="700px"
               v-drag
               :visible.sync="dialogTableVisible">
      <!-- 引入对应弹窗子组件 itemId:风机编号 如 01，可用于拼接测点名称 iconfontClass:标题图标样式,title:标题,itemData:配置文件名称-->
      <popupWindow :key="keys"
                   :itemId="itemId"
                   :iconfontClass="iconfontClass"
                   :title="name"
                   :itemData="field"></popupWindow>
    </el-dialog>
  </div>

</template>
<script>
// 弹窗组件
const popupWindow = () =>
  import('@/components/indexDetailCmpt/dataCmpt/PopupWindow.vue').then(m => m.default)
export default {
  // 父组件传递进来的参数，itemId:风机编号 如 F01，可用于拼接测点名称，data：测点信息集合， iconfontClass:标题图标样式,name:标题,field:弹窗配置文件名称
  props: ['itemId', 'data', 'field', 'name', 'iconfontClass'],
  components: {
    popupWindow
  },
  data () {
    return {
      keys: 0, // 组件key值，改变时可以使组件重新加载
      cmptParam: { // 组件参数
        iconfontClass: '', // 标题图标样式
        title: '', // 标题
        itemData: ''// 配置文件名称
      },
      timer: null, // 绑定定时任务以便离开时销毁
      dialogTableVisible: false, // 显示弹窗
      isLoad: false, // 标识是否加载完成
      listData: []
    }
  },
  methods: {
    /**
     * 打开弹窗
     */
    openDialog () {
      this.cmptParam.iconfontClass = this.icontongyong// 弹窗标题图标样式
      this.cmptParam.title = this.name// 弹窗标题
      this.cmptParam.itemData = this.field// 弹窗对应测点信息文件名
      // this.keys = new Date().getTime()// 更新key使组件重新加载
      this.dialogTableVisible = true// 显示弹窗
    }, /**
     * 获取列表数据、
     * @param {Object}} jsonData 测点信息对象，从json文件中获取
     */
    initData () {
      // eslint-disable-next-line prefer-const
      let tags = []// 测点名称集合
      // eslint-disable-next-line prefer-const
      let results = [] // 存放查询结果
      const name = 'ZQ:'
      const len = this.data.length
      // 初始化测点数据
      for (let i = 0; i < len; i++) {
        tags.push(name + this.itemId + this.data[i].tag)// 插入测点名
        // eslint-disable-next-line prefer-const
        let obj = {
          name: this.data[i].name, // 测点描述
          value: 0,
          unit: this.data[i].unit, // 测点单位
          isState: this.data[i].isState // 是否为状态

        }
        results.push(obj)
      }
      this.$axios.post(this.$url.realTimeUrl, {
        tags: tags.join('|')
      })
        .then(response => {
          const ret = response.data.values.split('|')
          for (let i = 0; i < len; i++) { // 循环结果集，插入查询数据
            if (results[i].isState === true) { // 通用
              results[i].value = Number(ret[i])// 状态值转为数字，方便判断
            } else {
              results[i].value = Number(ret[i]).toFixed(2)
            }
          }
          this.listData = results
        })
        .catch((error) => {
          console.log(error)
        })
      // 当接口未返回数据时，生成临时数据时页面正常加载
      if (this.listData.length === 0) {
        this.listData = results
      }
    }
  },
  mounted () {
    this.initData()
    // 定时刷新测点数据
    this.timer = setInterval(() => {
      this.initData()
    }, this.$globals.DataModule_interval)// public/config/global.js 可配置（打包后config/global.js）
  },
  destroyed () {
    // 离开时销毁定时任务
    window.clearInterval(this.timer)
  }

}
</script>
<style lang="less" scoped>
.DataModule {
  width: 47%;
  float: left;
  margin-left: 13px;
  margin-top: 20px;
  .d-tab {
    width: 100%;
    height: 219px;
    background: #0029c4;
    border: 2px solid #0a8df9;
    opacity: 1;

    .tab-title {
      cursor: pointer;
      width: 100%;
      height: 40px;
      background: rgba(0, 71, 190, 1);
      opacity: 1;
      > * {
        float: left;
        line-height: 35px;
        margin-left: 5px;
      }

      > div {
        width: 0px;
        height: 27px;
        border: 1px solid rgb(31, 113, 212);
        margin-top: 5px;
        // position: relative;
        // top: -30px;
        // left: 8%;
      }
      > span {
        font-size: 16px;
        font-family: Segoe UI;
        font-weight: 400;
        line-height: 35px;
        color: rgba(255, 255, 255, 1);
        opacity: 1;
      }

      .el-icon-arrow-right {
        content: "\e6e0";
        font-size: 17px;
        font-weight: 900;
        margin-right: 10px;
        float: right !important;
      }

      .icontongyong,
      .iconbianjiang,
      .iconjiaoliuqidianwang,
      .iconchuandong,
      .iconjicangpianhang,
      .iconfadianji {
        font-size: 26px;
        color: #0a8df9;
      }
    }

    .el-row {
      margin-left: 3%;
      height: 40px;
      width: 94%;
      border-bottom: 1px solid rgba(31, 113, 212, 1);
    }
    .el-row:last-child {
      border-bottom: 1px solid #0029c4 !important;
    }
    .el-col {
      line-height: 40px;
      text-align: right;
      /**状态图标样式 */
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
