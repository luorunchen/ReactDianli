<!--
模块：风机明细页面 图形组件 by 莫裕达
    风机明细页面子组件，对应图形（曲线对比）tab页，
    引用组件：
        曲线对比组件（components/indexDetailCmpt/chartCmpt/CurveComparison.vue）
-->
<template>
  <div id="chartCmpt">
    <div class="top-chart">
      <!-- 加载曲线对此组件 count：用来区分上下曲线对比框，防止上下组件数据干扰；itemId：风机编号，如01-->
      <curve-comparison :count="0"
                        :itemId='itemId'></curve-comparison>
    </div>
    <div class="buttom-chart">
      <curve-comparison :count="1"
                        :itemId='itemId'></curve-comparison>
    </div>
  </div>
</template>
<script>
// 曲线对比组件
const curveComparison = () =>
  import('@/components/indexDetailCmpt/chartCmpt/CurveComparison').then(m => m.default)
export default {
  props: ['itemId'], // 父组件传递进来的参数，风机编号 如 F01，可用于拼接测点名称
  components: {
    curveComparison
  },
  data: function () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
#chartCmpt {
  width: 96%;
  height: 84%;
  background: #0029c4;
  opacity: 1;
  margin-top: 15px;
  margin-left: 14px;

  .top-chart {
    margin-left: 0.5%;
    width: 99%;
    height: 48%;
    background: rgba(0, 41, 196, 1);
    border: 3px solid rgba(10, 141, 249, 1);
    opacity: 1;
  }

  .buttom-chart {
    margin-left: 0.5%;
    margin-top: 2%;
    width: 99%;
    height: 48%;
    background: rgba(0, 41, 196, 1);
    border: 3px solid rgba(10, 141, 249, 1);
    opacity: 1;
  }
}
</style>
<style lang="less">
</style>
