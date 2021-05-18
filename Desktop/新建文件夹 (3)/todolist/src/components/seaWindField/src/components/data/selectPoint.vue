<!--
模块：选择测点组件 by 孔祥义
  引用组件：
    选择风机组件  @/components/data/selectFans
-->
<template>
  <div class='selectPoint'>
    <!-- title区域 -->
    <div class="title">
      <div>测点检索器</div>
      <div title="确认选择"
           @click="confirmPoints"> <i class="iconfont iconqueding"></i></div>
    </div>
    <!-- 查询div -->
    <div class="search-div">

      <el-popover popper-class="fans-popover"
                  width="200"
                  v-model="isShowSelectFans"
                  trigger="click">
        <select-fans ref="selectFans"
                     @confirmSelectFans="confirmSelectFans"></select-fans>
        <span id="selectFansSpan"
              class="select-fans-span"
              slot="reference">
          选中 {{fansList.length}} 台
        </span>
      </el-popover>
      <el-input v-model="params.pointVale"
                size="mini"
                placeholder="输入关键字搜索" />
      <div><i @click="search"
           class="iconfont iconsousuo">检索</i></div>
    </div>
    <!-- 测点div -->
    <el-table :data="pointsData.slice((pageIndex-1)*pageSize,pageIndex*pageSize)"
              style="width: 100%"
              height="300"
              @row-click="rowClick"
              :row-key="getRowKeyPoints"
              ref="multipleTablePoints"
              @selection-change="handleSelectionChangePoints">

      <el-table-column type="selection"
                       :reserve-selection="true"
                       width="55">
      </el-table-column>
      <el-table-column label=""
                       prop="name">
        <template slot="header"
                  slot-scope="">
          <span @click="clearPoints"
                style="cursor: pointer;">清空</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageIndex-0"
                     :page-sizes="[10, 20, 50, 100,200]"
                     pager-count:5
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="pointsData.length">
      </el-pagination>
    </div>

  </div>
</template>

<script>
const selectFans = () =>
  import('@/components/data/selectFans').then(m => m.default)

export default {
  name: 'selectPoint',
  components: { selectFans },
  data () {
    return {
      // 选中风机数组
      fansList: [],
      // 当前选中的测点
      multipleSelectionPoints: [],
      // 累计选择测点
      multipleSelectionPointsAll: [],
      // 测点数据
      pointsData: [],
      // 当前页
      pageIndex: 1,
      // 每页大小
      pageSize: 10,
      // 查询参数
      params: {
        // 查询测点的关键字
        pointVale: '',
        // 风机id字符串
        fanIds: ''
      },
      // 历史过滤条件
      oldParams: null,
      // 是否展示了选择风机弹框
      isShowSelectFans: false,
      // 配置的原始测定数据
      tagInfo: [],
      // 全部测点数据
      pointsDataAll: []
    }
  },
  methods: {
    /**
     * 获取测点数据
     */
    getTagInfoData () {
      // 定义查询风机的数据
      // eslint-disable-next-line prefer-const
      let fanStr = []
      // 组织查询的风机数据
      this.fansList.forEach(e => {
        fanStr.push('ZQ:F' + e)
      })
      this.$axios
        .post(this.$url.tagInfoUrl, { fjs: fanStr.join('|') })
        .then(response => {
          this.pointsDataAll = response.data
          // 处理返回结果
          this.pointsDataAll = []
          response.data.forEach(e => {
            this.pointsDataAll.push({
              id: e.taglogicid,
              name: e.tagdesc
            })
          })
          this.pointsData = this.pointsDataAll.filter(data => !this.params.pointVale || data.name.toLowerCase().includes(this.params.pointVale.toLowerCase()))
        })
        .catch((error) => {
          console.error(error)
        })
    },
    /**
     * 获取验证查询参数
     */
    search () {
      this.pointsData = this.pointsDataAll.filter(data => !this.params.pointVale || data.name.toLowerCase().includes(this.params.pointVale.toLowerCase()))
      if (this.checkSearch()) {
        this.params.fanIds = this.fansList.join(',')
        this.oldParams = JSON.stringify(this.params)
        this.pageIndex = '1'
      } else {
        this.params = JSON.parse(this.oldParams)
      }
    },
    /**
     * 查询前的表单验证
     * @return {Boolean} 验证结果
     */
    checkSearch () {
      if (this.fansList.length === 0) {
        this.$message.warning('请选择风机')
        return false
      }
      return true
    },
    /**
     * 每页条数改变事件
     * @param {Number} val 当前每页条数
     */
    handleSizeChange (val) {
      this.params = JSON.parse(this.oldParams)
      this.pageSize = val
    },
    /**
     * 当前页改变事件
     * @param {Number} val 当前页
     */
    handleCurrentChange (val) {
      this.params = JSON.parse(this.oldParams)
      this.pageIndex = val
    },

    /**
     * 确认选中测点
     */
    confirmPoints () {
      document.getElementById('pointsImput').click()
    },
    /**
     * 测点选中项发生改变事件
     * @param {Array} val 当前选中的测点
     */
    handleSelectionChangePoints (val) {
      this.multipleSelectionPoints = val
    },
    /**
     * 清空选中测点
     */
    clearPoints () {
      this.$refs.multipleTablePoints.clearSelection()
      this.multipleSelectionPoints = []
    },
    /**
     * 获取每行的唯一标识
     * @param {Object} row 每行的数据
     */
    getRowKeyPoints (row) {
      return row.id
    },
    /**
     * 选择风机组件，风机选中改变触发事件
     * @param {Array} val 当前选中的风机信息。风机id
     */
    confirmSelectFans (val) {
      this.fansList = val
      // this.initPoints()
      // 获取测点数据
      this.getTagInfoData()
    },
    /**
     * 监听第测点选择框的点击事件，用来隐藏选择风机弹出框
     * @param {Object} e 鼠标单击产生的实际对象
     */
    popoverClick (e) {
      if (e.target.id !== 'selectFansSpan') {
        this.isShowSelectFans = false
      }
    },
    /**
     * 行点击事件
     * @param {Object} row 当前点击的行信息
     */
    rowClick (row) {
      this.$refs.multipleTablePoints.toggleRowSelection(row)
    }
  },
  mounted () {
    // 对历史查询参数进行初始化
    this.oldParams = JSON.stringify(this.params)
  },
  computed: {
  },
  watch: {
    /**
     * 选中的数据发生改变
     */
    multipleSelectionPoints: function (n, o) {
      if (n.length > 20) {
        this.$message.warning('最多选中20个测点')
        this.$refs.multipleTablePoints.clearSelection()
        o.forEach(row => {
          this.$refs.multipleTablePoints.toggleRowSelection(row)
        })
      }
      const difference = o.filter(x => !n.includes(x))
      this.multipleSelectionPointsAll = this.multipleSelectionPointsAll.concat(n)
      this.multipleSelectionPointsAll = Array.from(new Set(this.multipleSelectionPointsAll))
      this.multipleSelectionPointsAll = this.multipleSelectionPointsAll.filter(x => !difference.includes(x))
      this.$emit('confirmSelectPoint', this.multipleSelectionPointsAll)
    },
    /**
     * 表格数据发生改变,用来改变下方页码的显示
     */
    pointsData: function () {
      let span = document.getElementById('my-total-page')
      if (!span) {
        span = document.createElement('span')
        span.id = 'my-total-page'
        // eslint-disable-next-line prefer-const
        let pageDom = document.querySelectorAll('.points-popover .page .el-pagination')[0]
        pageDom.appendChild(span)
      }
      span.innerHTML = '/' + Math.ceil(this.pointsData.length / this.pageSize) + '页'
    },
    /**
     * 选择风机显示隐藏状态改变后的回调函数
     * @val 当前isShowSelectFans的值
     */
    isShowSelectFans (val) {
      if (val) {
        document.getElementsByClassName('points-popover')[0].addEventListener('click', this.popoverClick)
      } else {
        document.getElementsByClassName('points-popover')[0].removeEventListener('click', this.popoverClick)
      }
    }
  }
}
</script>
<style lang="less" >
.selectPoint .el-table .cell {
  cursor: pointer;
}
</style>
