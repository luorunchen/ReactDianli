import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import echarts from 'echarts'
// 组态图相关js引入
import './assets/ht/lib/core/JSyIzXFVSW8t.js'
import './assets/ht/lib/core/hTZRGeCbUxnJ.js'
import './assets/ht/lib/core/ht.js'
import './assets/ht/lib/core/buckle.js'

// 引入字体文件
import './assets/font/iconfont.css'
// eslint-disable-next-line no-unused-vars
import { Loading } from 'element-ui'

// 自定义公共方法
import common from './common/common.js'
// 格式化时间插件
import moment from 'moment'

// 格式化日期组件
Vue.prototype.$moment = moment
// 引入导出插件
const { export_json_to_excel: exportExcel } = require('./export/Export2Excel')
Vue.prototype.$exportExcel = exportExcel
Vue.prototype.$Loading = Loading
// json文件请求路径
// axios.defaults.baseURL = 'http://127.0.0.1:5500/zq/seaWindField/src/assets'
// axios.defaults.baseURL = 'http://127.0.0.1:5501/src/assets'
axios.defaults.baseURL = './'
axios.defaults.timeout = 1000 * 60 * 3
Vue.prototype.$axios = axios

Vue.config.productionTip = false
// 引入echarts组件
Vue.prototype.$echarts = echarts
// 引入公共方法
Vue.prototype.$common = common
// 引入url配置信息
// eslint-disable-next-line no-undef
Vue.prototype.$url = M_URL
// 引入全局常量配置信息
// eslint-disable-next-line no-undef
Vue.prototype.$globals = GLOBAL

// 设置全局loading样式
Vue.prototype.$loading1 = function () {
  return Vue.prototype.$loading({
    text: '加载数据中...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.5)'
  })
}

// 自定义拖动
Vue.directive('drag',
  function (el, binding) {
    const oDiv = el // 当前元素
    oDiv.onmousedown = function (e) {
      e.preventDefault()
      const bw = document.body.clientWidth
      const bh = document.body.clientHeight
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - oDiv.offsetLeft
      const disY = e.clientY - oDiv.offsetTop
      // 计算两边坐标
      document.onmousemove = function (e) {
        let l = 0; let t = 0
        // 拖动边界
        if (e.clientX >= bw) {
          l = bw - disX
        } else if (e.clientX <= 0) {
          // eslint-disable-next-line no-lone-blocks
          {
            l = 0 - disX
          }
        } else {
          l = e.clientX - disX
        }
        if (e.clientY >= bh) {
          t = bh - disY
        } else if (e.clientY <= 0) {
          t = 0 - disY
        } else {
          t = e.clientY - disY
        }
        // 移动当前元素
        oDiv.style.left = l + 'px'
        oDiv.style.top = t + 'px'
      }
      // 鼠标停止移动时，事件移除
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
