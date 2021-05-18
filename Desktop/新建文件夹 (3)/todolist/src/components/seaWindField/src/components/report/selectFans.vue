<!--
模块：选择风机组件 by 孔祥义
  提供选择风机功能
-->
<template>
  <div class='selectFans'>
    筛选
    <br>
    <!-- 风机筛选框 -->
    <el-input v-model="searchFans"
              size="mini"
              placeholder="输入关键字搜索" />
    <!-- 风机列表 -->
    <el-table :data="fansData.filter(data => !searchFans || data.name.toLowerCase().includes(searchFans.toLowerCase()))"
              style="width: 100%"
              height="250"
              ref="multipleTableFans"
              @select-all="selectAllFans"
              @row-click="rowClick"
              @select="handleSelectionChangeFans"
              @selection-change="handleSelectionChange1">

      <el-table-column type="selection"
                       width="55">
      </el-table-column>
      <el-table-column label=""
                       prop="name">
        <template slot="header"
                  slot-scope="">
          <span @click="clearFans"
                style="cursor: pointer;">清空</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'selectFans',
  data () {
    return {
      // 选中的风机id
      fanIds: [],
      // 风机过滤条件
      searchFans: '',
      // 选中的风机数据
      multipleSelectionFans: [],
      // 风机数据
      fansData: [],
      // 判断是否改变了风机选中项
      isChangeSelectFans: false
    }
  },
  methods: {
    /**
     * 风机发生选中或者取消选中事件
     * @param {Array} val 当前选中的风机信息
     */
    handleSelectionChangeFans (val) {
      this.isChangeSelectFans = true
      this.multipleSelectionFans = val
    },
    /**
     * 选中的风机选中项发送改变
     * @param {Array} val 当前选中的行信息
     */
    handleSelectionChange1 (val) {
      if (this.isChangeSelectFans) {
        this.multipleSelectionFans = val
        this.isChangeSelectFans = false
        return
      }
      this.toggleSelection()
    },
    /**
     * 清空风机选中
     */
    clearFans () {
      this.isChangeSelectFans = true
      this.$refs.multipleTableFans.clearSelection()
      this.multipleSelectionFans = []
    },
    /**
     * 改变风机选中的行
     */
    toggleSelection () {
      if (this.multipleSelectionFans) {
        this.multipleSelectionFans.forEach(row => {
          this.isChangeSelectFans = true
          this.$refs.multipleTableFans.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTableFans.clearSelection()
      }
    },
    /**
     * 全选方法
     * @param {Arrya} val 选中的风机
     */
    selectAllFans (val) {
      this.multipleSelectionFans = val
    },
    /**
     * 根据传入的id修改风机选中项
     * @param {Strign} ids 将要被选中的风机id
     */
    changeSelectFansFromOld (ids) {
      this.clearFans()
      // eslint-disable-next-line prefer-const
      let list = ids.split(',')
      this.multipleSelectionFans = this.fansData.filter(i => {
        return list.find(ii => {
          return ii === i.id
        })
      })
      this.toggleSelection()
    },
    /**
     * 获取风机数据
     */
    getFanData () {
      this.$axios
        .get('/jsonFile/warn/FansData.json')
        .then(response => {
          this.fansData = response.data
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
      this.isChangeSelectFans = true
      this.$refs.multipleTableFans.toggleRowSelection(row)
    }
  },
  mounted () {
    this.getFanData()
  },
  computed: {
  },
  watch: {
    // 选中的数据发生改变
    multipleSelectionFans: function () {
      if (this.multipleSelectionFans.length > 0) {
        this.fanIds = []
        this.multipleSelectionFans.forEach(i => {
          this.fanIds.push(i.id)
        })
        this.$emit('confirmSelectFans', this.fanIds)
      } else {
        this.fanIds = []
        this.$emit('confirmSelectFans', this.fanIds)
      }
    }
  }
}
</script>
<style lang="less" >
.selectFans .el-table .cell {
  cursor: pointer;
}
</style>
