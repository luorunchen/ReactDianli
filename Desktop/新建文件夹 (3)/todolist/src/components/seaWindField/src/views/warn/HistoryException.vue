<!--
模块：设备告警--历史异常 by 孔祥义
  电场方说此页面不要
-->
<template>
  <div id='HistoryException'>
    <div class="title">
      <div class="my-btn">
        <el-select class="dataType"
                   v-model="dataTypeValue">
          <el-option v-for="item in dataType"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="startTime"
                        type="datetime"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="endTime"
                        type="datetime"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="my-btn">
        查询
        <i class="iconfont iconsousuo"></i>
      </div>
      <div @click="exportExcel"
           class="my-btn">导出
        <i class="iconfont icondaochu"></i>
      </div>
    </div>
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
                         label="异常时间"
                         width="">
        </el-table-column>
        <el-table-column prop="field7"
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
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageIndex-0"
                     :page-sizes="[10, 20, 50, 100,200]"
                     :page-size="pageSize-0"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total-0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryException',
  data () {
    return {
      isSon: true,
      tableData: [],
      dataType: [
        {
          value: '0',
          label: '任意'
        }, {
          value: '1',
          label: '日'
        }, {
          value: '2',
          label: '月'
        }, {
          value: '3',
          label: '年'
        }
      ],
      dataTypeValue: '0',
      startTime: '',
      endTime: '',
      isChangeSelect: false,
      total: '',
      pageIndex: '',
      pageSize: ''
    }
  },
  methods: {
    // 导出的方法
    exportExcel () {
      // 设置Excel的表格表头
      const tHeader = ['异常点', '异常时间', '当前值', '最小值', '最大值']
      // 设置Excel的表格列对应的字段
      const filterVal = ['field1', 'field2', 'field7', 'field3', 'field4']
      // 文件名
      var filrName = '历史异常列表'
      if (this.tableData.length === 0) {
        this.$message.error('暂无数据，无法导出！')
        return
      }
      this.$axios
        .get('/jsonFile/warn/HistoryException.json')
        .then(response => {
          const list = response.data.list // 把data里的tableData存到list
          const data = list.map(v => filterVal.map(j => v[j]))
          this.$exportExcel(tHeader, data, filrName)
        })
        .catch((error) => {
          this.$message.error('导出失败')
          console.log(error)
        })
    },
    // 获取表格信息
    getTableData () {
      console.log('search')
      this.$axios
        .get('/jsonFile/warn/HistoryException.json')
        .then(response => {
          this.tableData = response.data.list
          this.total = response.data.total
          this.pageIndex = response.data.pageIndex
          this.pageSize = response.data.pageSize
        })
        .catch((error) => {
          console.log(error)
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      console.log(`当前页: ${val}`)
    }
  },
  mounted () {
    this.getTableData()
    this.getFansData()
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
#HistoryException {
  height: 100%;
  display: flex;
  flex-direction: column;
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
      /deep/.el-checkbox__label {
        color: white !important;
      }
      .el-select,
      .el-input {
        margin: -8px;
        input,
        .el-input__inner {
          border: none;
          background-color: #0000;
          color: white;
        }
      }
      /deep/.el-input__inner {
        background: #0000;
        color: white;
        // border: 1px solid rgba(44, 93, 119, 1);
        border: none;
      }
      .dataType {
        width: 100px;
      }
    }
  }
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
    padding-top: 5px;
  }
}
</style>
