<!--
模块：风机明细页面 箱变组件 by 黎明
   风机明细页面子组件 箱变图及数据
-->
<template>
  <div id="boxChange">
    <div class="div-title">集电线</div>
    <div id="boxChangeContainer">
    </div>
  </div>
</template>
<script>
import json from '../../assets/ht/实时监控-风机-箱变页面.js'
export default {
  data: function () {
    return {
      data: []
    }
  },
  methods: {
    /**
     * 加载箱变图及数据
     */
    init () {
      console.log(json)
      const dataModel = new window.ht.DataModel()
      const graphView = window.graph = new window.ht.graph.GraphView(dataModel)
      dataModel.deserialize(json)
      graphView.mi(function (e) {
        if (e.kind === 'clickData') {
          if (e.data.getTag() === 'DJX') {
            window.location.href = 'index.html'
          }
        }
      })
      graphView.setMovableFunc(function () { })
      graphView.setPannable(false)
      graphView.handleScroll = function () { }
      const container = document.getElementById('boxChangeContainer')
      graphView.addToDOM(container)
      graphView.fitContent(true)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
#boxChange {
  width: 96%;
  height: 84%;
  background: #0029c4;
  border: 2px solid rgba(10, 141, 249, 1);
  opacity: 1;
  margin-top: 15px;
  margin-left: 14px;

  .div-title {
    width: 100%;
    height: 35px;
    background: rgba(0, 71, 190, 1);
    opacity: 1;
    line-height: 35px;
  }
  #boxChangeContainer {
    width: 100%;
    height: 660px;
    position: relative;
    /deep/canvas {
      position: relative !important;
    }
  }
}
</style>
