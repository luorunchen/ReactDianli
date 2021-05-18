<!--
模块：设备告警--历史告警 by 孔祥义
  引用组件：
    风机选择组件  @/components/report/selectFans
    选择列组件  @/components/report/selectCols
-->
<template>
  <div id='CustomReport'>
    <!-- 查询条件div -->
    <div class="title">
      <span>选择风机:</span>
      <div class="my-btn">
        <el-popover popper-class="fans-popover"
                    width="200"
                    trigger="click">
          <!-- 选择风机组件 -->
          <select-fans ref="selectFans"
                       @confirmSelectFans="confirmSelectFans"></select-fans>
          <el-input slot="reference"
                    v-model="fans"
                    readonly
                    placeholder="请选择"></el-input>

        </el-popover>
      </div>
      <span>选择报表:</span>
      <div class="my-btn">
        <el-select class="reportType"
                   v-model="params.reportTypeValue">
          <el-option v-for="item in reportType"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <!-- 报表模型 -->
      <div class="my-btn">
        <el-select class="modelType"
                   @change="modelChange"
                   v-model="params.modelTypeValue">
          <el-option v-for="item in modelType"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="my-btn">
        <el-popover popper-class="fans-popover"
                    width="200"
                    trigger="click">
          <!-- 选择列组件 -->
          <select-cols ref="selectCols"
                       @confirmSelectCols="confirmSelectCols"></select-cols>
          <el-input slot="reference"
                    v-model="cols"
                    readonly=""
                    placeholder="请选择"></el-input>

        </el-popover>
      </div>
      <!-- 时间类型 -->
      <div class="my-btn">
        <el-select class="dataType"
                   @change="dataTypeValueChange"
                   v-model="params.dataTypeValue">
          <el-option v-for="item in dataType"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="params.startTime"
                        :type="datePickerType"
                        :format="dataFormat"
                        :default-time="'00:00:00'"
                        :value-format="valueDataFormat"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div class="my-btn">
        <el-date-picker v-model="params.endTime"
                        :type="datePickerType"
                        :format="dataFormat"
                        :default-time="'23:00:00'"
                        :value-format="valueDataFormat"
                        placeholder="选择日期时间">
        </el-date-picker>
      </div>
      <div @click="search"
           class="my-btn">
        查询
        <i class="iconfont iconsousuo"></i>
      </div>
    </div>
    <div @click="exportExcel"
         style="background:#042069;width:100px"
         class="my-btn">
      导出数据到Exel
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="pageTableData"
                border
                ref="tableDom"
                :height='tableHeight'
                style="width: 100%">
        <el-table-column v-for="(i,index) in colData"
                         :key="index"
                         align="center"
                         :prop="i.value"
                         :fixed="i.value === 'name'||i.value==='time'"
                         show-overflow-tooltip
                         :label="i.name"
                         :min-width="i.width?i.width:210">
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page">
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageIndex"
                     :page-sizes="[10, 20, 50, 100,200]"
                     :page-size="pageSize-0"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length-0">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 选择风机组件
const selectFans = () =>
  import('@/components/report/selectFans').then(m => m.default)
// 选择列组件
const selectCols = () =>
  import('@/components/report/selectCols').then(m => m.default)

export default {
  name: 'CustomReport',
  components: { selectFans, selectCols },
  data () {
    return {
      // 表格数据
      tableData: [],
      // 列数据
      colData: [],
      // 报表类型数据
      reportType: [],
      // 报表模型数据
      modelType: [],
      // 时间类型数据
      dataType: [],
      // 风机input展示内容
      fans: '',
      // 风机选中数组
      fanList: [],
      // 列选择input展示内容
      cols: '',
      // 选择列数据
      colsList: [],
      // 当前页吗
      pageIndex: 1,
      // 每页数据数量
      pageSize: 100,
      // 查询参数
      params: {
        // 报表模型选中项
        reportTypeValue: '',
        // 报表模型
        modelTypeValue: '',
        // 时间类型
        dataTypeValue: '',
        // 选中的风机id
        fanIds: '',
        // 选中的列id
        colIds: '',
        // 开始时间--eg:2020-05-21 00:00:00
        startTime: this.$moment(new Date().getTime() - 3600 * 1000 * 24).format('YYYY/MM/DD HH:00:00'),
        // 结束时间--eg:2020-05-21 00:00:00
        endTime: this.$moment(new Date().getTime()).format('YYYY/MM/DD HH:00:00')
      },
      // 历史查询参数
      oldParams: null,
      // 展示时间格式化格式
      dataFormat: 'yyyy-MM-dd HH:00:00',
      // 时间格式化样式
      valueDataFormat: 'yyyy/MM/dd HH:00:00',
      // 日期选择框类型
      datePickerType: 'datetime',
      // 生成列表时间数组
      timeList: [],
      // 查询时间
      searchTime: '',
      // 查询类型
      searchType: '0',
      /* 为方便取值
        1：最大；
        2：最小；
        3：平均；
        4：求和；
        5：公式
      */
      typeObj: {
        1: 'max',
        2: 'min',
        3: 'avg',
        4: 'sum'
      },
      // 表格高度
      tableHeight: window.innerHeight - 204,
      // 风机测点与返回数据的对应关系
      ptod: {}
    }
  },
  methods: {
    /**
     * 导出的方法
     */
    exportExcel () {
      if (this.tableData.length === 0) {
        this.$message.warning('没有可以导出的数据')
        return
      }
      // 设置Excel的表格表头
      // eslint-disable-next-line prefer-const
      let tHeader = []
      // 设置Excel的表格列对应的字段
      // eslint-disable-next-line prefer-const
      let filterVal = []
      this.colData.forEach(i => {
        tHeader.push(i.name)
        filterVal.push(i.value)
      })
      const list = this.tableData // 把data里的tableData存到list
      const data = list.map(v => filterVal.map(j => v[j]))
      this.$exportExcel(tHeader, data, '自定义报表列表')
    },
    /**
     * 获取验证查询参数
     */
    search () {
      if (this.checkSearch()) {
        // 显示loadin框
        this.$loading1()
        setTimeout(() => {
          this.oldParams = JSON.stringify(this.params)
          this.pageIndex = 1
          this.getTableData()
        }, 0)
      } else {
        // this.params = JSON.parse(this.oldParams)
        // this.changeFansFromOld()
      }
    },
    /**
     * 获取表格信息
     *  */
    getTableData () {
      // 重新对表格的高度赋值，不然会显示异常
      // 初始化表格数据
      this.$axios
        .post(this.$url.dataStatistic, {
          tablename: 't_info_statistics',
          condition: this.initSearchParams()
        })
        .then(response => {
          // 初始化列数据
          this.colData = this.initColData()
          this.initTableData()
          this.$nextTick(() => {
            this.$refs.tableDom.doLayout()
            try {
              this.changeTableData(response.data)
              // 隐藏loading框
              this.$loading1().close()
            } catch (error) {
              console.error(error)
              // 隐藏loading框
              this.$loading1().close()
            }
          })
        })
        .catch((error) => {
          // 隐藏loading框
          this.$loading1().close()
          // this.$message.error('数据查询异常')
          console.log(error)
        })
    },
    /**
     * 查询前的表单验证
     * @return {Boolean} 验证结果；通过为true
     */
    checkSearch () {
      if (this.params.fanIds === '') {
        this.$message.warning('请选择风机')
        return false
      }
      if (this.colsList.length === 0) {
        this.$message.warning('请选择测点')
        return false
      }
      if (!this.params.startTime) {
        this.$message.warning('请选择开始时间')
        return false
      }
      if (!this.params.endTime) {
        this.$message.warning('请选择结束时间')
        return false
      }
      if (this.params.endTime <= this.params.startTime) {
        this.$message.warning('开始时间应小于结束时间')
        return false
      }
      if (!this.initTimeData()) {
        return false
      }
      return true
    },
    /**
     * 每页条数改变
     * @param {Number} val 当前每天条数数值
     */
    handleSizeChange (val) {
      this.params = JSON.parse(this.oldParams)
      this.changeFansFromOld()
      if (!this.checkSearch()) {
        return
      }
      this.pageSize = val
    },
    /**
     * 当前页变化事件
     * @param {Number} val 当前页
     */
    handleCurrentChange (val) {
      this.params = JSON.parse(this.oldParams)
      this.changeFansFromOld()
      if (!this.checkSearch()) {
        return
      }
      this.pageIndex = val
    },
    /**
     * 从历史查询参数中，获取数据，改变风机选中状态
     */
    changeFansFromOld () {
      this.$refs.selectFans.changeSelectFansFromOld(this.params.fanIds)
      this.changeColFromOld()
    },
    /**
     * 从历史查询参数中，获取数据，改变风机选中状态
     */
    changeColFromOld () {
      this.$refs.selectCols.changeSelectColsFromOld(this.params.colIds)
    },
    /**
     * 时间类型发生改变后触发的事件，根据不同的日期类型，设置日期格式和日期组件
     * @param {String} val 当前日期类型的值  0：任意；1：日；2：月；3：年
     */
    dataTypeValueChange (val) {
      this.params.startTime = ''
      this.params.endTime = ''
      if (val === '0') {
        this.dataFormat = 'yyyy-MM-dd HH:00:00'
        this.datePickerType = 'datetime'
      } else if (val === '1') {
        this.datePickerType = 'date'
        this.dataFormat = 'yyyy-MM-dd '
      } else if (val === '2') {
        this.datePickerType = 'month'
        this.dataFormat = 'yyyy-MM'
      } else if (val === '3') {
        this.datePickerType = 'year'
        this.dataFormat = 'yyyy'
      }
    },
    /**
     * 确认选中风机回调函数，将组建选中的测点信息传递会父组件
     * @param {Array} val 测点选择组件中选中的风机信息，id数组
     */
    confirmSelectFans (val) {
      this.fans = '已选择' + val.length + '台'
      this.fanList = val
      this.params.fanIds = val.join(',')
    },
    /**
     * 确认选中列回调函数，将组件选中的测点信息传递会父组件
     * @param {Array} val 测点选择组件中选中的列信息，列详细信息数组
     */
    confirmSelectCols (val) {
      this.cols = val.length + '  已选择'
      this.params.colIds = []
      this.colsList = val
      val.forEach(i => {
        this.params.colIds.push(i.id)
      })
      this.params.colIds = this.params.colIds.join(',')
    },
    /**
     * 模型选择框变化后事件，更具选择的不同模型，修改默认选中列
     * @param {Striing} val 当前选中的模型的key值
     */
    modelChange (val) {
      this.$refs.selectCols.changeSelectColsFromOld(this.modelType[Number(val) + 1].select)
    },
    /**
     * 初始化列数据
     * @return {Array} 初始化好的列数据数组
     */
    initColData () {
      // 默认第一列
      // eslint-disable-next-line prefer-const
      let list = [{ name: '风机名', value: 'name', width: '88' }]
      // 根据报表类型判断是否有时间列，自定义报表没有此列
      if (this.params.reportTypeValue !== '0') {
        list.push({ name: '时间', value: 'time', width: '166' })
      }
      // 循环选中的列数据
      this.colsList.forEach(e => {
        list.push({ name: e.name, value: 'field' + e.id, width: e.width })
      })
      return list
    },
    /**
     * 初始化时间，包括查询时间和列表时间
     * @return {Boolean} 返回时间范围是否符合要求
     */
    initTimeData () {
      this.timeList = []
      // 处理时间
      let st, et
      if (this.params.dataTypeValue === '0') {
        st = new Date(this.params.startTime).getTime()
        et = new Date(this.params.endTime).getTime()
      } else {
        st = new Date(this.params.startTime).setHours(0)
        // et = new Date(this.params.endTime).setHours(23, 59, 59)
        et = new Date(this.params.endTime).setHours(0)
      }

      this.searchTime = this.$moment(new Date(st).getTime() + 1000 * 60 * 60).format('YYYYMMDDHHmmss') + '-' + this.$moment(et).format('YYYYMMDDHHmmss')
      // 获取相差的小时数
      let time = Math.floor((et + 1000 - st) / 1000 / 60 / 60)
      // 根据报表类型，处理不同的时间
      if (this.params.reportTypeValue === '0') {
        this.timeList = ['1']
      } else if (this.params.reportTypeValue === '1') {
        // 判断时间范围是否合适
        // if (time === 0 || (time === 1 && this.$moment(st).format('mmss') !== '0000' && this.$moment(et).format('HH') !== '23')) {
        //   this.$message.warning('所选时间间隔过短')
        //   return false
        // }
        if (time === 0) {
          this.$message.warning('所选时间间隔过短')
          return false
        }
        if (this.$moment(st).format('mmss') === '0000') {
          this.timeList.push(this.$moment(st).format('YYYY-MM-DD HH:00:00'))
        }
        for (let i = 1; i < time; i++) {
          this.timeList.push(this.$moment(st + i * 1000 * 60 * 60).format('YYYY-MM-DD HH') + ':00:00')
        }
        // if (this.$moment(st).format('mmss') !== '0000' && this.$moment(et).format('mmss') === '5959') {
        //   this.timeList.push(this.$moment(et + 1000 - 1000 * 60 * 60).format('YYYY-MM-DD HH:00:00'))
        // }
      } else if (this.params.reportTypeValue === '2') {
        // 将小时数转换为天，方便判断
        time = Math.floor(time / 24)
        // if (time === 0 || (time === 1 && this.$moment(st).format('HHmmss') !== '000000' && this.$moment(et).format('HHmmss') !== '230000')) {
        if (time === 0 || (time === 1 && this.$moment(st).format('HH') !== '00')) {
          this.$message.warning('所选时间间隔过短')
          return false
        }
        if (this.$moment(st).format('HHmmss') === '000000') {
          this.timeList.push(this.$moment(st).format('YYYY-MM-DD HH:00:00'))
        }
        for (let i = 1; i < time; i++) {
          this.timeList.push(this.$moment(st + i * 1000 * 60 * 60 * 24).format('YYYY-MM-DD') + ' 00:00:00')
        }
        // if (this.$moment(st).format('HHmmss') !== '000000' && this.$moment(et).format('HHmmss') === '230000') {
        //   this.timeList.push(this.$moment(et + 1000 - 1000 * 60 * 60 * 24).format('YYYY-MM-DD HH:00:00'))
        // }
      } else if (this.params.reportTypeValue === '3') {
        // 将小时数转换为最小月，方便判断
        time = Math.ceil((time + 25) / 24 / 28)
        const monthNum = (new Date(et).getFullYear() - new Date(st).getFullYear()) * 12 + new Date(et).getMonth() - new Date(st).getMonth()
        if (monthNum < 2 && (time < 2 || (time < 4 &&
          !(monthNum === 0 && this.$moment(st).format('DDHHmmss') === '01000000' &&
            this.$moment(et).format('yyyyMM') !== this.$moment(et + 1000 * 60 * 60 * 24).format('yyyyMM')) &&
          !(monthNum > 0 && (this.$moment(st).format('DDHHmmss') === '01000000' ||
            this.$moment(et).format('yyyyMM') !== this.$moment(et + 1000 * 60 * 60 * 24).format('yyyyMM')))
        ))) {
          this.$message.warning('所选时间间隔过短')
          return false
        }
        // 判断是否为特殊开始时间，即每月1号
        if (this.$moment(st).format('DDHHmmss') === '01000000') {
          this.timeList.push(this.$moment(st).format('YYYY-MM-DD HH:00:00'))
        }

        for (let i = 1; i < time; i++) {
          // 如果开始时间加上i个最小月日期后，等于结束时间年月，则退出循环
          if (monthNum === 0 || this.$moment(st + 1000 * 60 * 60 * 24 * 28 * i).format('yyyy-MM') === this.$moment(et).format('yyyy-MM')) {
            break
          }
          // 判断开始时间加最小月是否跨月，
          if (this.$moment(st + 1000 * 60 * 60 * 24 * 28 * (i - 1)).format('yyyyMM') !== this.$moment(st + 1000 * 60 * 60 * 24 * 28 * i).format('yyyyMM')) {
            this.timeList.push(this.$moment(st + 1000 * 60 * 60 * 24 * 28 * i).format('yyyy-MM') + '-01 00:00:00')
          }
        }
        // 判断是否为特殊结束时间，即每月最后一号
        if (monthNum > 0 && this.$moment(et).format('yyyyMM') !== this.$moment(et + 1000 * 60 * 60 * 24).format('yyyyMM')) {
          this.timeList.push(this.$moment(et).format('YYYY-MM' + '-01 00:00:00'))
        }
      }
      return true
    },
    /**
     * 初始化表格数据
     */
    initTableData () {
      this.tableData = []
      // 循环选中风机
      this.params.fanIds.split(',').forEach(id => {
        // 循环时间数组
        this.timeList.forEach(t => {
          this.tableData.push(this.getTableObj('F' + id, t))
        })
      })
      this.tableData.push(this.getTableObj('统计', ''))
    },
    /**
     * 处理表格数据，生产1行数据
     * @param {String} fan 列表风机列数据
     * @param {String} time 列表时间列数据
     * @return {Object} 一行列表数据
     */
    getTableObj (fan, time) {
      // eslint-disable-next-line prefer-const
      let obj = { name: fan, time: time }
      // 风机选择的列，生产对应列的默认数据
      this.colsList.forEach(e => {
        obj['field' + e.id] = ''
      })
      return obj
    },
    /**
     * 根据接口要求和查询条件组织查询参数
     * @return {String} 返回组织好的查询参数
     */
    initSearchParams () {
      // 条件类型说明 0 返回该条条件下的小时值记录；1返回该条件下的平均值 一天一个值
      // 定义查询条件类型，并判断
      let type = 1

      // eslint-disable-next-line prefer-const
      let params = []
      if (this.params.reportTypeValue === '1' || this.params.reportTypeValue === '0') {
        type = 0
      }
      // eslint-disable-next-line prefer-const
      let pl = []
      // 可能需要新增的测点数组
      let apl = []
      let index
      this.ptod = {}
      this.params.fanIds.split(',').forEach(id => {
        this.colsList.forEach(e => {
          // 判断测点数据是否需要公式计算
          if (e.cal === '') {
            apl = ['ZQ:F' + id + e.point]
          } else {
            apl = []
            // 拆分计算测点数据需要的测点
            e.point.split('|').forEach(p1 => {
              if (p1 !== '统计时间') {
                apl.push('ZQ:F' + id + p1)
              }
            })
          }
          // 对需要查询的测点进行循环，并判断是否已经查询过改测点，并将风机测点的索引保存指定对象中
          apl.forEach(p => {
            index = pl.findIndex(p1 => {
              return p1 === p
            })
            if (index !== -1) {
              this.ptod[p] = index
            } else {
              this.ptod[p] = pl.length
              pl.push(p)
              params.push(this.searchTime + ',' + p + ',' + 'ZQF' + id + ',' + type)
            }
          })
        })
      })
      return params.join(';')
    },
    /**
     * 根据查询出来的结果，和查询条件，组织数据
     * @param {Array} l 查询结果数组
     */
    changeTableData (l) {
      // 根据报表类型的判断初步区分
      // 自定义报表
      if (this.params.reportTypeValue === '0') {
        this.colsList.forEach((c, i) => {
          this.tableData.forEach((t, ii) => {
            let num = 0
            if (ii !== this.tableData.length - 1) {
              if (c.type === 5) {
                num = this.calTableData(c, 'ZQ:F' + this.fanList[ii],
                  (new Date(this.params.endTime).getTime() - new Date(this.params.startTime).getTime()) / 1000 / 60 / 60, l)
              } else {
                const key = this.ptod['ZQ:F' + this.fanList[ii] + c.point]
                const dobj = l[key][Object.getOwnPropertyNames(l[key])]
                const dnl = Object.getOwnPropertyNames(dobj).sort()
                switch (c.type) {
                  case 1:// 最大
                    num = dobj[dnl[0]]
                    for (const d in dobj) {
                      num = num < dobj[d] ? dobj[d] : num
                    }
                    break
                  case 2:// 最小
                    num = dobj[dnl[0]]
                    for (const d in dobj) {
                      num = num > dobj[d] ? dobj[d] : num
                    }
                    break
                  case 3:// 平均
                    for (const d in dobj) {
                      num += dobj[d]
                    }
                    num = num / dnl.length
                    break
                  case 4:// 求和
                    for (const d in dobj) {
                      num += dobj[d]
                    }
                    break
                  default:
                    num = -9999
                    break
                }
              }
            }
            // 对表格数据赋值
            t['field' + c.id] = num.toFixed(2)
          })
        })
        // 计算统计数据
        this.sumTableData()
        // 分段日报表
      } else if (this.params.reportTypeValue === '1') {
        // 循环风机
        let count1 = 0
        let count = 0
        for (let i = 0; i < this.fanList.length; i++) {
          count1 += count
          // 循环测点
          this.colsList.forEach((c, ii) => {
            let dobj = {}
            if (c.type !== 5) {
              const key = this.ptod['ZQ:F' + this.fanList[i] + c.point]
              // 获取返回数据，将数据放到表格中
              dobj = l[key][Object.getOwnPropertyNames(l[key])]
            }
            for (let ti = count1; ti < this.tableData.length; ti++) {
              if (this.tableData[ti].name !== 'F' + this.fanList[i]) {
                count = ti - count1
                break
              }
              const time = this.$moment(new Date(this.tableData[ti].time).getTime() + 1000 * 60 * 60).format('YYYYMMDDHHmmss')
              if (c.type === 5) {
                this.tableData[ti]['field' + c.id] = (Number(this.calTableData(c, 'ZQ:F' + this.fanList[i],
                  1, l, time))).toFixed(2)
              } else {
                this.tableData[ti]['field' + c.id] = (Number(dobj[time])).toFixed(2)
              }
            }
          })
        }
        // 计算统计数据
        this.sumTableData()
        // 分段月报表
      } else if (this.params.reportTypeValue === '2') {
        // 循环风机
        let count1 = 0
        let count = 0
        for (let i = 0; i < this.fanList.length; i++) {
          count1 += count
          // 循环测点
          this.colsList.forEach((c, ii) => {
            let dobj = {}
            if (c.type !== 5) {
              const key = this.ptod['ZQ:F' + this.fanList[i] + c.point]
              // 获取返回数据，将数据放到表格中
              dobj = l[key][Object.getOwnPropertyNames(l[key])]
            }
            for (let ti = count1; ti < this.tableData.length; ti++) {
              if (this.tableData[ti].name !== 'F' + this.fanList[i]) {
                count = ti - count1
                break
              }
              const time = this.$moment(this.tableData[ti].time).format('YYYYMMDD')
              let num
              if (c.type === 5) {
                num = this.calTableData(c, 'ZQ:F' + this.fanList[i],
                  24, l, time)
              } else {
                const d = dobj[time]
                if (d) {
                  num = d[this.typeObj[c.type]]
                } else {
                  num = -9999
                }
              }
              this.tableData[ti]['field' + c.id] = num.toFixed(2)
            }
          })
        }
        this.sumTableData()
        // 分段年报表
      } else if (this.params.reportTypeValue === '3') {
        // 循环风机
        let count1 = 0
        let count = 0
        for (let i = 0; i < this.fanList.length; i++) {
          count1 += count
          // 循环测点
          this.colsList.forEach((c, ii) => {
            let dobj = {}
            if (c.type !== 5) {
              const key = this.ptod['ZQ:F' + this.fanList[i] + c.point]
              // 获取返回数据，将数据放到表格中
              dobj = l[key][Object.getOwnPropertyNames(l[key])]
            }
            for (let ti = count1; ti < this.tableData.length; ti++) {
              if (this.tableData[ti].name !== 'F' + this.fanList[i]) {
                count = ti - count1
                break
              }
              // 获取当前月有多少天
              const day = this.getMonthDays(this.tableData[ti].time)
              // 获取年月时间，用来查询数据
              const time = this.$moment(this.tableData[ti].time).format('YYYYMM')
              let num = 0
              // 根据不同的类型处理数据
              switch (c.type) {
                case 0:// 做差；
                  num = dobj[time + day].max - dobj[time + '01'].min
                  break
                case 1:// 最大
                  num = -Infinity
                  // 循环属于当前月的数据
                  for (let d = 1; d <= day; d++) {
                    const ndobj = dobj[time + ('' + d).padStart(2, '0')]
                    num = num < ndobj.max ? ndobj.max : num
                  }
                  break
                case 2:// 最小
                  num = Infinity
                  // 循环属于当前月的数据
                  for (let d = 1; d <= day; d++) {
                    const ndobj = dobj[time + ('' + d).padStart(2, '0')]
                    num = num > ndobj.max ? ndobj.max : num
                  }
                  break
                case 3:// 平均
                  // 循环属于当前月的数据
                  for (let d = 1; d <= day; d++) {
                    const ndobj = dobj[time + ('' + d).padStart(2, '0')]
                    num += ndobj.avg
                  }
                  num = num / day
                  break
                case 4:// 求和
                  // 循环属于当前月的数据
                  for (let d = 1; d <= day; d++) {
                    const ndobj = dobj[time + ('' + d).padStart(2, '0')]
                    num += ndobj.sum
                  }
                  break
                case 5:// 公式
                  num = this.calTableData(c, 'ZQ:F' + this.fanList[i],
                    day * 24, l, time)
                  break
                default:
                  num = -9999
                  break
              }
              this.tableData[ti]['field' + c.id] = num.toFixed(2)
            }
          })
        }
        this.sumTableData()
      }
    },
    /**
     * 计算需要计算的测点数据并返回计算结果
     * @param {Object} p 包含测点基本信息的对象
     * @param {String} preStr 前缀，用来获取测点数据
     * @param {Number} t 统计时间
     * @param {Array} l 测点返回数据
     * @param {String} args1 当统计的类型不是0时，用来协助取数据的参数
     * @return {Number} 返回计算好的结果
     */
    calTableData (p, preStr, t, l, args1) {
      // 用来统计用来计算测点的数据
      const obj = {}
      let num = 1
      p.point.split('|').forEach(p => {
        if (p === '统计时间') {
          obj['p' + num] = t
        } else {
          let sum = 0
          const key = this.ptod[preStr + p]
          // 获取返回数据，将数据放到表格中
          const dobj = l[key][Object.getOwnPropertyNames(l[key])]
          if (this.params.reportTypeValue === '0') {
            for (const d in dobj) {
              sum += dobj[d]
            }
          } else if (this.params.reportTypeValue === '1') {
            sum = dobj[args1]
          } else if (this.params.reportTypeValue === '2') {
            sum = dobj[args1].sum
          } else if (this.params.reportTypeValue === '3') {
            for (let d = 1; d <= t / 24; d++) {
              const ndobj = dobj[args1 + ('' + d).padStart(2, '0')]
              sum += ndobj.sum
            }
          }
          obj['p' + num] = sum
        }
        num++
      })
      let cal = p.cal
      for (const k in obj) {
        cal = cal.replace(k, '(' + obj[k] + ')')
      }
      // eslint-disable-next-line no-eval
      return eval(cal)
    },
    /**
      * 统计列表数据，对列表最后一行赋值
      */
    sumTableData () {
      this.colsList.forEach((c, ii) => {
        let num = 0
        // 根据不同的统计类型分别统计
        switch (c.sumType) {
          case 0:// 求和
            this.tableData.forEach((t, i) => {
              if (i === this.tableData.length - 1) {
                t['field' + c.id] = num.toFixed(2)
              } else {
                num += Number(t['field' + c.id])
              }
            })
            break
          case 1:// 最大
            num = -Infinity
            this.tableData.forEach((t, i) => {
              if (i === this.tableData.length - 1) {
                t['field' + c.id] = num.toFixed(2)
              } else {
                num = Number(t['field' + c.id]) > num ? Number(t['field' + c.id]) : num
              }
            })
            break
          case 2:// 最小
            num = Infinity
            this.tableData.forEach((t, i) => {
              if (i === this.tableData.length - 1) {
                t['field' + c.id] = num.toFixed(2)
              } else {
                num = Number(t['field' + c.id]) < num ? Number(t['field' + c.id]) : num
              }
            })
            break
          case 3:// 平均
            this.tableData.forEach((t, i) => {
              if (i === this.tableData.length - 1) {
                t['field' + c.id] = (num / i).toFixed(2)
              } else {
                num += Number(t['field' + c.id])
              }
            })
            break
          default:
            num = -9999
            break
        }
      })
    },
    /**
      * 根据传入的时间，获取传入时间月份有多少天
      * @param {String} t 需要获取月份的日期
      * @param {Number} return 返回当前日期所属月份共有多少天
      */
    getMonthDays (t) {
      t = new Date(t)
      t.setDate(1)
      const s = t.getTime()
      const m = t.getMonth() + 1
      t.setMonth(m)
      const e = t.getTime()
      return (e - s) / 1000 / 60 / 60 / 24
    }
  },
  mounted () {
    // 查询上报状态下拉框数据
    this.$common.findSelectByKey(5, 1).then(res => {
      this.reportType = res
      this.params.reportTypeValue = this.reportType[0].key
      return this.$common.findSelectByKey(6, 1)
    })
      // 查询上报方式下拉框数据
      .then(res => {
        this.modelType = res
        this.params.modelTypeValue = this.modelType[0].key
        return this.$common.findSelectByKey(1, 1)
      })
      // 查询上报方式下拉框数据
      .then(res => {
        this.dataType = res
        this.params.dataTypeValue = this.dataType[0].key
        // 对必要参数初始化
        this.oldParams = JSON.stringify(this.params)
      })
  },
  computed: {
    /**
     * 根据分页信息，返回分好后的数据
     */
    pageTableData () {
      return this.tableData.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
    }
  }
}
</script>
<style lang="less" scoped>
#CustomReport {
  height: 100%;
  display: flex;
  flex-direction: column;
  // 查询div
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

    > span {
      display: inline-block;
      line-height: 46px;
      margin-left: 10px;
      min-width: 60px;
    }
  }
  // 表格主体
  .table {
    // flex: 1;
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
  // 分页
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
  // 自定义按钮类
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
    .modelType,
    .reportType {
      width: 120px;
    }
    .dataType {
      width: 100px;
    }
  }
}
</style>
<!--
风机选框样式修改，已经弹出选框内的样式修改
-->
<style lang="less">
.fans-popover .el-table {
  td,
  th {
    border: none !important;
    color: #000;
  }
  tr:nth-child(odd) {
    background-color: white;
  }
  th,
  tr:nth-child(even) {
    background-color: #e6e6e6;
  }
  tr:hover > td {
    background: #cccccc !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: teal;
  }
}
</style>
