<!--
模块：选择风机组件 by 孔祥义
  提供选择列功能，主要被自定义报表引用
-->
<template>
  <div class='selectCols'>
    筛选
    <br>
    <el-input v-model="searchCols"
              size="mini"
              placeholder="输入关键字搜索" />
    <el-table :data="ColsData.filter(data => !searchCols || data.name.toLowerCase().includes(searchCols.toLowerCase()))"
              style="width: 100%"
              height="250"
              ref="multipleTableCols"
              @row-click="rowClick"
              @select-all="selectAllCols"
              @select="handleSelectionChangeCols"
              @selection-change="handleSelectionChange1">

      <el-table-column type="selection"
                       width="25">
      </el-table-column>
      <el-table-column label=""
                       prop="name">
        <template slot="header"
                  slot-scope="">
          <span @click="clearCols"
                style="cursor: pointer;">清空</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'selectCols',
  data () {
    return {
      // 过滤条件
      searchCols: '',
      // 选中的列
      multipleSelectionCols: [],
      /* type: 0:做差；
        1：最大；
        2：最小；
        3：平均；
        4：次数；
        5：公式
      */
      /* sumType: 0:求和
        1：最大；
        2：最小；
        3：平均；
      */
      // 列数据
      ColsData: [],
      // 是否改变列选中状态
      isChangeSelectCols: false

    }
  },
  methods: {
    /**
     * 风机发生选中或者取消选中事件
     * @param {Array} val 当前选中的风机信息
     */
    handleSelectionChangeCols (val) {
      this.isChangeSelectCols = true
      this.multipleSelectionCols = val
    },
    /**
     * 选中的风机选中项发送改变
     * @param {Array} val 当前选中的行信息
     */
    handleSelectionChange1 (val) {
      if (this.isChangeSelectCols) {
        this.multipleSelectionCols = val
        this.isChangeSelectCols = false
        return
      }
      this.toggleSelection()
    },
    /**
     * 清空风机选中
     */
    clearCols () {
      this.isChangeSelectCols = true
      this.$refs.multipleTableCols.clearSelection()
      this.multipleSelectionCols = []
    },
    /**
     * 改变风机选中的行
     */
    toggleSelection () {
      if (this.multipleSelectionCols) {
        this.multipleSelectionCols.forEach(row => {
          this.isChangeSelectCols = true
          this.$refs.multipleTableCols.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleTableCols.clearSelection()
      }
    },
    /**
     * 全选方法
     * @param {Array} val 选中的风机
     */
    selectAllCols (val) {
      this.multipleSelectionCols = val
    },
    /**
     * 根据传入的id修改风机选中项
     * @param {String} ids 将要被选中的风机id
     */
    changeSelectColsFromOld (ids) {
      if (ids === '-1') {
        this.multipleSelectionCols = this.ColsData
      } else {
        this.clearCols()
        // eslint-disable-next-line prefer-const
        let list = ids.split(',')
        this.multipleSelectionCols = this.ColsData.filter(i => {
          return list.find(ii => {
            return ii === i.id
          })
        })
      }
      this.toggleSelection()
    },
    /**
    * 获取列数据
    */
    getColData () {
      this.$axios
        .get('/jsonFile/report/ColsData.json')
        .then(response => {
          this.ColsData = response.data
        })
        .catch((error) => {
          this.$message.error('风机数据获取异常')
          console.log(error)
        })
    },
    /**
     * 行点击事件
     * @param {Object} row 当前点击的行信息
     */
    rowClick (row) {
      this.isChangeSelectCols = true
      this.$refs.multipleTableCols.toggleRowSelection(row)
    }
  },
  mounted () {
    //  获取列数据
    this.getColData()
  },
  computed: {
  },
  watch: {
    /**
     * 监听选中的数据发生改变
     */
    multipleSelectionCols: function () {
      this.$emit('confirmSelectCols', this.multipleSelectionCols)
    }
  }
}
</script>
<style lang="less" >
.selectCols .el-table .cell {
  text-align: left;
  cursor: pointer;
}
</style>
