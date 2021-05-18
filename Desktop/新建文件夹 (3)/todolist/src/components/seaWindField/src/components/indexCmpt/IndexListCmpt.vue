<!--
模块：实时监控页面（首页） 表格列表组件 by 莫裕达
    系统首页子组件，显示相关表格列表
    引用组件：
        基本信息组件（components/indexCmpt/indexList/BasicInfo.vue）
        变桨信息组件（components/indexCmpt/indexList/VariablePitch.vue）
        发电信息组件（components/indexCmpt/indexList/GenerateElectricity.vue）
        其他信息组件（components/indexCmpt/indexList/OtherInfo.vue）
-->
<template>
  <div id="indexList">
    <div class="tab">
      <div @click="activeTab=1"
           :class="{'active':activeTab === 1}"><i class="iconfont iconjibenxinxi"></i><span>基本信息</span></div>
      <div @click="activeTab=2"
           :class="{'active':activeTab === 2}"><i class="iconfont iconbianjiangxinxi"></i><span>变桨信息</span></div>
      <div @click="activeTab=3"
           :class="{'active':activeTab === 3}"><i class="iconfont iconfadianxinxi"></i><span>发电信息</span></div>
      <div @click="activeTab=4"
           :class="{'active':activeTab === 4}"><i class="iconfont iconqitaxinxi"></i><span>其他信息</span></div>
    </div>
    <!-- 根据选择引入相关组件 -->
    <component v-bind:is="components[activeTab]"></component>
  </div>
</template>
<script>
// 定义主要页面组件
const components = {
  // 基本信息组件
  1: () =>
    import('@/components/indexCmpt/indexList/BasicInfo').then(m => m.default),
  // 变桨信息组件
  2: () =>
    import('@/components/indexCmpt/indexList/VariablePitch').then(m => m.default),
  // 发电信息组件
  3: () =>
    import('@/components/indexCmpt/indexList/GenerateElectricity').then(m => m.default),
  // 其他信息组件
  4: () =>
    import('@/components/indexCmpt/indexList/OtherInfo').then(m => m.default)
}
export default {
  data: function () {
    return {
      activeTab: 1, // 活动tab页 1：基本信息，2：变桨信息，3：发电信息，4：其他信息
      components: components// 绑定组件
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {
      this.$parent.getPointData()// 调用父组件获取数据方法，刷新首页全场相关数据和风机状态统计
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
#indexList {
  width: 100%;
  height: 99%;
  overflow-y: scroll;
  .tab {
    width: 100%;
    height: 40px;

    > div {
      float: left;
      width: 100px;
      height: 40px;
      line-height: 40px;
      font-weight: 400;
      font-size: 14px;
      opacity: 1;
      background: rgba(0, 72, 236, 1);
      margin-left: 2px;

      > span {
        position: relative;
        top: -2px;
      }

      .iconjibenxinxi:before {
        font-size: 20px;
      }
    }

    > div:hover {
      cursor: pointer;
      color: rgba(4, 32, 105, 1);
      background: rgba(236, 165, 106, 1);
    }
  }

  .active {
    color: rgba(4, 32, 105, 1);
    background: rgba(236, 165, 106, 1) !important;
  }
}
</style>
