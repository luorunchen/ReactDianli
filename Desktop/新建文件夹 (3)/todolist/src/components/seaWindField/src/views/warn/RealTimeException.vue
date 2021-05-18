<!--
模块：设备告警--实时异常 by 孔祥义
  电场说此页面不要
-->
<template>
  <div id='RealTimeException'>
    <div class="table">
      <el-table :data="tableData"
                border
                height='100%'
                style="width: 100%">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column prop="field1"
                         label="异常点"
                         width="">
        </el-table-column>
        <el-table-column prop="field2"
                         label="当前值"
                         width="">
        </el-table-column>
        <el-table-column prop="field3"
                         label="最小值"
                         width="">
        </el-table-column>
        <el-table-column prop="field4"
                         label="最大值"
                         width="">
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    // 获取错误警告提醒信息
    getTableData () {
      console.log('search')
      this.$axios
        .get('/jsonFile/warn/RealTimeException.json')
        .then(response => {
          this.tableData = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted () {
    this.getTableData()
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
#RealTimeException {
  height: 100%;
  display: flex;
  flex-direction: column;
  .table {
    flex: 1;
    padding: 5px;
    padding-bottom: 0px;
    .table-inner-btn {
      cursor: pointer;
      width: 20px;
      height: 20px;
      background: #00d664;
      opacity: 1;
      color: white;
      margin: auto;
    }
  }
  .page {
    height: 40px;
    background: rgba(0, 41, 196, 1);
    opacity: 1;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px solid rgba(10, 141, 249, 1);
    border-top: none;
  }
}
</style>
