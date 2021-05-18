import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
//  实时监控主页面
import Index from '../views/monitor/Index.vue'
//  实时监控明细面
import IndexDetail from '../views/monitor/IndexDetail.vue'
// 自定义报表页面
import CustomReport from '../views/report/CustomReport.vue'
// 功率曲线
import PowerCurve from '../views/report/PowerCurve.vue'
// 风玫瑰图
import WindRose from '../views/report/WindRose.vue'
// 实时告警
import RealTimeWarn from '../views/warn/RealTimeWarn.vue'
// 历史告警
import HistoryWarn from '../views/warn/HistoryWarn.vue'
// 实时异常
import RealTimeException from '../views/warn/RealTimeException.vue'
// 历史异常
import HistoryException from '../views/warn/HistoryException.vue'
// 历史数据
import History from '../views/data/History.vue'
// 实时数据
import RealTime from '../views/data/RealTime.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: Index
      }, {
        path: '/indexDetail',
        name: 'IndexDetail',
        component: IndexDetail
      },
      {
        path: '/CustomReport',
        name: 'CustomReport',
        component: CustomReport
      }, {
        path: '/PowerCurve',
        name: 'PowerCurve',
        component: PowerCurve
      }, {
        path: '/WindRose',
        name: 'WindRose',
        component: WindRose
      }, {
        path: '/RealTimeWarn',
        name: 'RealTimeWarn',
        component: RealTimeWarn
      }, {
        path: '/HistoryWarn',
        name: 'HistoryWarn',
        component: HistoryWarn
      }, {
        path: '/RealTimeException',
        name: 'RealTimeException',
        component: RealTimeException
      }, {
        path: '/HistoryException',
        name: 'HistoryException',
        component: HistoryException
      }, {
        path: '/History',
        name: 'History',
        component: History
      }, {
        path: '/RealTime',
        name: 'RealTime',
        component: RealTime
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  base: '/eleWang2',
})

export default router
