<!--
模块：风机明细页面 数据组件 by 莫裕达
    风机明细页面子组件，对应数据tab页
    引用组件：
        数据模块组件（components/indexDetailCmpt/dataCmpt/DataModule.vue）
-->
<template>
  <div id="dataCmpt">
    <!--itemId:风机编号 如 F01，可用于拼接测点名称，data：测点信息集合， iconfontClass:标题图标样式,name:标题,field:弹窗配置文件名称 （下同）-->
    <!-- 通用 -->
    <dataModule v-if="isLoad"
                :itemId="itemId"
                :data="data['tongyong']"
                :field="'tongyong'"
                :name="'通用'"
                :iconfontClass="'icontongyong'">
    </dataModule>
    <!-- 变桨 -->
    <dataModule v-if="isLoad"
                :itemId="itemId"
                :data="data['bianjiang']"
                :field="'bianjiang'"
                :name="'变桨'"
                :iconfontClass="'iconbianjiang'">
    </dataModule>
    <!-- 交流器&电网 -->
    <dataModule v-if="isLoad"
                :itemId="itemId"
                :data="data['jiaoliuqi']"
                :field="'jiaoliuqi'"
                :name="'交流器&电网'"
                :iconfontClass="'iconjiaoliuqidianwang'">
    </dataModule>
    <!-- 传动 -->
    <dataModule v-if="isLoad"
                :itemId="itemId"
                :data="data['chuandong']"
                :field="'chuandong'"
                :name="'传动'"
                :iconfontClass="'iconchuandong'">
    </dataModule>
    <!-- 机舱&偏航 -->
    <dataModule v-if="isLoad"
                :itemId="itemId"
                :data="data['jicang']"
                :field="'jicang'"
                :name="'机舱&偏航'"
                :iconfontClass="'iconjicangpianhang'">
    </dataModule>
    <!-- 发电机 -->
    <dataModule v-if="isLoad"
                :itemId="itemId"
                :data="data['fadianji']"
                :field="'fadianji'"
                :name="'发电机'"
                :iconfontClass="'iconfadianji'">
    </dataModule>
  </div>
</template>
<script>
// 数据模块组件
const dataModule = () =>
  import('@/components/indexDetailCmpt/dataCmpt/DataModule.vue').then(m => m.default)
export default {
  props: ['itemId'], // 父组件传递进来的参数，风机编号 如 F01，可用于拼接测点名称F
  components: {
    dataModule
  },
  data: function () {
    return {
      isLoad: false, // 标识加载完数据之后在加载页面，防止控制台报错
      data: null // 测点数据
    }
  },
  methods: {

  },
  mounted () {
    this.isLoad = false
    // 加载测点配置文件
    this.$axios
      .get('/jsonFile/indexDetail/shujuquanlan.json')
      .then(response => {
        // 获取测点列表数据
        this.data = response.data
        this.isLoad = true
      })
      .catch((error) => {
        this.isLoad = true
        console.log(error)
      })
  }
}
</script>
<style lang="less" scoped>
#dataCmpt {
  width: 96%;
  height: 84%;
  background: #0029c4;
  opacity: 1;
  margin-top: 15px;
  margin-left: 14px;
}
</style>
