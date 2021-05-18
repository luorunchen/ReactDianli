<!--
模块：数据查询--历史数据 by 孔祥义
  引用组件：
    历史曲线组件  '@/components/data/CurveComparisonRealTime
    测点组件  @/components/data/selectPoint
-->
<template>
  <div id='RealTime'>
    <!-- 查询div -->
    <div class="title">
      <span>选择测点:</span>
      <div class="my-btn">
        <el-popover popper-class="points-popover"
                    width="360"
                    visible-arrow="false"
                    trigger="click">
          <!-- 测点组件 -->
          <select-point @confirmSelectPoint="confirmSelectPoint"></select-point>
          <el-input slot="reference"
                    id="pointsImput"
                    v-model="points"
                    readonly
                    placeholder="请选择"></el-input>
        </el-popover>
      </div>
    </div>
    <!-- 页面主体部分 -->
    <div class="table">
      <div class="t"></div>
      <div class="main">
        <div class="chart">
          <!-- 实时曲线组件 -->
          <curve-comparison-RealTime :count="0"
                                     :pointsData="selectPoints"></curve-comparison-RealTime>
        </div>
        <div class="chart">
          <!-- 实时曲线组件 -->
          <curve-comparison-RealTime :count="1"
                                     :pointsData="selectPoints"></curve-comparison-RealTime>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 历史曲线组件
const CurveComparisonRealTime = () =>
  import('@/components/data/CurveComparisonRealTime').then(m => m.default)
// 测点选择组件
const selectPoint = () =>
  import('@/components/data/selectPoint').then(m => m.default)

export default {
  name: 'RealTime',
  components: { CurveComparisonRealTime, selectPoint },
  data () {
    return {
      // 测点选中项
      selectPoints: []
    }
  },
  methods: {
    /**
     * 确认选中测点回调函数，将组建选中的测点信息传递会父组件
     * @param {Array} val 测点选择组件中选中的测点信息
     */
    confirmSelectPoint (val) {
      this.selectPoints = val
    }
  },
  mounted () {
  },
  computed: {
    // 计算测点选中信息
    points () {
      return this.selectPoints.length > 0 ? '已选中' + this.selectPoints.length + '个测点' : ''
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
//定义页面内的元素的样式
#RealTime {
  height: 100%;
  display: flex;
  flex-direction: column;
  //查询栏div的样式
  .title {
    font-size: 12px;
    font-family: Segoe UI;
    font-weight: 400;
    line-height: 16px;
    color: rgba(255, 255, 255, 1);
    opacity: 1;
    width: 100%;
    height: 50px;
    background: rgba(4, 32, 105, 1);
    opacity: 1;
    display: flex;
    .my-btn {
      height: 18px;
      background: rgba(255, 255, 255, 0);
      border: 1px solid #1882f8;
      opacity: 1;
      border-radius: 4px;
      padding: 8px;
      margin-top: 6px;
      margin-left: 7px;
      cursor: pointer;
      .el-select,
      .el-input {
        margin: -8px;
        input,
        .el-input__inner {
          border: none;
          background-color: rgba(255, 255, 255, 0);
          color: white;
        }
      }
      /deep/.el-input__inner {
        background: rgba(255, 255, 255, 0);
        color: white;
        // border: 1px solid rgba(44, 93, 119, 1);
        border: none;
      }
    }
    > span {
      display: inline-block;
      line-height: 46px;
      margin-left: 10px;
      min-width: 60px;
    }
  }
  //主体部分样式
  .table {
    flex: 0.95;
    background: #042069;
    border: 1px solid #0a8df9;
    opacity: 1;
    border-radius: 2px;
    padding-bottom: 0px;
    margin: 10px;
    display: flex;
    flex-direction: column;
    .t {
      height: 30px;
      background: rgba(0, 47, 162, 1);
      opacity: 1;
      border-radius: 1px 1px 0px 0px;
    }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      .chart {
        flex: 0.5;
        margin: 10px;
        background: rgba(0, 41, 196, 1);
        border: 3px solid rgba(10, 141, 249, 1);
        opacity: 1;
      }
      .chart:last-child {
        margin-top: 0px;
      }
    }
  }
}
</style>
<style lang="less">
//修改ellementui默认样式，以及测点选择框内的样式
.points-popover {
  width: 360px !important;
  height: 396px !important;
  background: rgba(0, 41, 196, 1) !important;
  border: 1px solid rgba(10, 141, 249, 1) !important;
  font-size: 12px !important;
  font-family: Segoe UI !important;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 1) !important;
  opacity: 1;
  .popper__arrow {
    display: none !important;
  }

  .title {
    width: 349px;
    height: 20px;
    background: #001f95;
    opacity: 1;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    > div:first-child {
      font-size: 14px;
    }
    > div:last-child {
      cursor: pointer;
    }
  }
  .search-div {
    padding: 5px 10px;
    > span {
      display: inline-block;
      width: 57px;
      height: 15px;
      background: #0029c4;
      border: 1px solid #1882f8;
      box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.3);
      opacity: 1;
      padding: 5px;
      border-radius: 4px;
      margin-right: 10px;
    }

    .el-input {
      width: 190px;
      height: 20px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(24, 130, 248, 1);
      opacity: 1;
      border-radius: 4px;
    }
    > div {
      display: inline-block;
    }
    i {
      display: inline-block;
      width: 45px;
      height: 17px;
      background: #0029c4;
      border: 1px solid #1882f8;
      opacity: 1;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 5px;
      font-size: 13px;
      padding: 5px;
    }
    input {
      height: 25x;
    }
  }
  .page {
    margin-top: 5px;
    .el-pager li {
      display: none;
    }
    .el-pagination__total {
      width: 43px;
      margin-left: -9px;
      margin-right: 18px;
    }
    .el-pagination .el-select .el-input {
      width: 86px;
      margin-right: 0px;
    }
    .el-pagination__jump {
      margin: 0px;
    }
  }
}
</style>
