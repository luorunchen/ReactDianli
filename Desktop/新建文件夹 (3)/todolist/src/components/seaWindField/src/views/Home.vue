<!--
模块：页面主体框架部分页面 by 孔祥义
  页面头部和左侧菜单
  主体区域背景样式和主要区域大小
-->

<template>
  <div id="home">
    <el-container>
      <!-- 头部区域 -->
      <el-header class="my-el-header">
        <div>
          <!-- 左侧区域 -->
          <div class="l">
            <!-- logodiv -->
            <div class="logo"></div>
            <span>枣强-中国海装风场监控系统</span>
          </div>
          <!-- 右侧区域 -->
          <div class="r">
            <el-tooltip class="item"
                        effect="dark"
                        content="过程回放"
                        placement="bottom">
              <el-button size="mini"
                         type="primary"
                         @click="playBack">回放</el-button>
            </el-tooltip>
            <select v-model="electricField"
                    name
                    id>
              <option value="0">辉煌枣强风电场</option>
            </select>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- 左侧菜单区域 -->
        <el-aside class="my-el-aside"
                  :width="isCollapse ? '70px' : '200px'">
          <!-- 菜单主体部分 -->
          <div class="menu-div">
            <!-- 根据当前路由信息，决定活跃的菜单 -->
            <el-menu class="el-menu-vertical-demo my-class"
                     unique-opened
                     router
                     :default-active="$route.path"
                     :collapse="isCollapse">
              <el-menu-item index="/index">
                <i class="iconfont iconcaidan-shishijiankong"></i>
                <span slot="title">实时监控</span>
              </el-menu-item>
              <el-submenu :index="item.id"
                          v-for="(item, i) in menuList"
                          :key="i">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span slot="title">{{ item.name }}</span>
                </template>
                <el-menu-item :index="subItem.id"
                              v-for="(subItem, i) in item.children"
                              :key="i">
                  <i :class="subItem.icon"></i>
                  <span slot="title">{{ subItem.name }}</span>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <!-- 折叠按钮 -->
          <el-menu class="el-menu-vertical-demo btn-menu"
                   :collapse="isCollapse">
            <el-menu-item index="0"
                          @click="fold">
              <i class="el-icon-d-arrow-right"
                 v-show="isCollapse"></i>
              <span slot="title">
                <i v-show="!isCollapse"
                   class="el-icon-d-arrow-left"></i>
                <span v-show="isCollapse">展开</span>
              </span>
            </el-menu-item>
          </el-menu>
          <!-- 左侧时钟 -->
          <div v-show="!isCollapse"
               class="clock">
            <div>
              <span>{{ clockDate }}</span>
              <span>{{ clockWeek }}</span>
            </div>
            <span>{{ clockTime }}</span>
          </div>
        </el-aside>
        <!-- 主体区域 -->
        <el-main class="my-el-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 时钟用变量
      clockTime: '',
      clockDate: '',
      clockWeek: '',
      // 菜单数据
      menuList: [
        {
          id: '2',
          name: '系统报表',
          icon: 'iconfont iconcaidan-xitongbaobiao',
          children: [
            {
              id: '/customReport',
              name: '自定义报表',
              icon: 'iconfont iconcaidan-xitongbaobiao'
            },
            {
              id: '/PowerCurve',
              name: '功率曲线',
              icon: 'iconfont iconcaidan-shebeibaojing'
            },
            {
              id: '/WindRose',
              name: '风玫瑰图',
              icon: 'iconfont iconcaidan-xitongbaobiao'
            }
          ]
        },
        {
          id: '3',
          name: '设备告警',
          icon: 'iconfont iconcaidan-shebeibaojing',
          children: [
            {
              id: '/RealTimeWarn',
              name: '实时告警',
              icon: 'iconfont iconcaidan-shebeibaojing'
            },
            {
              id: '/HistoryWarn',
              name: '历史告警',
              icon: 'iconfont iconcaidan-shebeibaojing'
            }
            // {
            //   id: '/RealTimeException',
            //   name: '实时异常',
            //   icon: 'iconfont iconcaidan-xitongbaobiao'
            // },
            // {
            //   id: '/HistoryException',
            //   name: '历史异常',
            //   icon: 'iconfont iconcaidan-xitongbaobiao'
            // }
          ]
        },
        {
          id: '4',
          name: '数据查询',
          icon: 'iconfont iconcaidan-shujuchaxun',
          children: [
            {
              id: '/History',
              name: '历史数据',
              icon: 'iconfont iconcaidan-shujuchaxun'
            },
            {
              id: '/RealTime',
              name: '实时数据',
              icon: 'iconfont iconcaidan-shujuchaxun'
            }
          ]
        }
      ],
      // 左侧菜单是否处于折叠状态
      isCollapse: false,
      // 首页电厂选中项
      electricField: '0'
    }
  },
  methods: {
    /**
     *  时钟方法，获取当前时间，并处理成需要的显示效果
     * */
    clock () {
      const date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? '0' + d : d
      var h = date.getHours()
      h = h < 10 ? '0' + h : h
      var minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      var second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      this.clockTime = h + ':' + minute + ':' + second
      this.clockDate = y + '-' + m + '-' + d
      this.clockWeek = '星期' + '日一二三四五六'.charAt(date.getDay())
    },
    /**
     *   折叠展开点击事件
     * */
    fold () {
      this.isCollapse = !this.isCollapse
    },
    /**
     * 打开过程回放系统
     */
    playBack () {
      this.$confirm('此操作将进入过程回放, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.location.href = this.$globals.playBackUrl
        })
        .catch(() => { })
    }
  },
  mounted () {
    // 主页面左下角时间定时器
    setInterval(() => {
      this.clock()
    }, 1000)
  },
  computed: {},
  watch: {}
}
</script>

<style lang="less" scoped>
#home {
  height: 100%;
  > section {
    height: 100%;
    > section {
      height: 100%;
    }
  }
  //头部区域
  .my-el-header {
    color: #333;
    text-align: center;
    line-height: 50px;
    width: 1920px;
    height: 50px;
    background: rgba(12, 34, 73, 1);
    opacity: 1;
    > div {
      display: flex;
      justify-content: space-between;
      > div {
        display: inline-block;
      }
      .l {
        .logo {
          background-image: url('../assets/logo.png');
          height: 34px;
          width: 94px;
          background-size: contain;
          display: inline-block;
          background-repeat: no-repeat;
          position: relative;
          top: 10px;
        }
        span {
          font-size: 18px;
          font-family: Segoe UI;
          font-weight: 400;
          color: rgba(108, 158, 203, 1);
          opacity: 1;
        }
      }
      .r {
        font-size: 12px;
        font-family: Segoe UI;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        opacity: 1;

        .el-button {
          margin-right: 20px;
          background: #3a8ee6;
        }

        .el-icon-video-camera-solid:before {
          content: '\e796';
          font-size: 30px;
          position: relative;
          top: 4px;
          right: 14px;
          cursor: pointer;
        }
        select {
          width: 180px;
          color: rgba(255, 255, 255, 1);

          height: 25px;
          background: rgba(255, 255, 255, 0);
          border: 1px solid rgba(10, 141, 249, 1);
          opacity: 1;
          border-radius: 4px;
        }
      }
    }
  }
  //左侧区域
  .my-el-aside {
    text-align: center;
    // border: 1px solid rgba(0, 60, 155, 1);
    background: linear-gradient(
      180deg,
      rgba(0, 46, 162, 1) 0%,
      rgba(0, 111, 206, 1) 50%,
      rgba(0, 46, 162, 1) 100%
    );
    opacity: 1;
    box-shadow: 1px 1px 1px #003c9b;
    transition: 0.3s;
    .clock {
      font-size: 14px;
      font-family: Segoe UI;
      font-weight: 400;
      line-height: 19px;
      color: rgba(255, 255, 255, 1);
      opacity: 1;
      position: absolute;
      bottom: 31px;
      left: 30px;
      span {
        margin-left: 10px;
      }
    }
    li {
      background-image: linear-gradient(
        138deg,
        rgba(4, 38, 123, 1) 0%,
        rgba(12, 118, 190, 1) 100%
      );
      background-color: #0c76be;
    }
    .menu-div {
      li {
        text-align: left;
      }
      .iconfont {
        margin-right: 16px;
        color: #f89e5f;
      }
      span {
        font-size: 14px;
        font-family: Segoe UI;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        opacity: 1;
      }
      .el-menu-item.is-active {
        span {
          color: #6c9ecb !important;
        }
        .iconfont {
          color: #6c9ecb;
        }
      }
      .el-menu-item.is-active::after {
        content: '';
        width: 0;
        height: 0;
        border: 16px solid;
        border-color: transparent #0249b1 transparent transparent;
        position: absolute;
        right: 0px;
        top: 11px;
      }
      .el-submenu {
        .el-menu-item {
          height: 50px;
          line-height: 50px;
          padding: 0 45px;
          min-width: 199px;
        }
      }
      .el-menu-item,
      /deep/.el-submenu > .el-submenu__title {
        padding-right: 50px;
      }
      /deep/.el-submenu__title:hover,
      .el-menu-item.is-active {
        background: #001084 !important;
      }
      /deep/.el-submenu__title .el-submenu__icon-arrow {
        color: rgba(255, 255, 255, 1);
      }
    }
    .el-menu {
      border: none;
      width: 70px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 199px;
      // min-height: 400px;
    }
  }
  //主体部分
  .my-el-main {
    width: 90%;
    text-align: center;
    // border: 1px solid rgba(0, 60, 155, 1);
    background: linear-gradient(
      180deg,
      rgba(0, 46, 162, 1) 0%,
      rgba(0, 111, 206, 1) 50%,
      rgba(0, 46, 162, 1) 100%
    );
    opacity: 1;
    font-size: 14px;
    font-family: Segoe UI;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    opacity: 1;
    padding: 0px;
    overflow-x: hidden;
  }
}
</style>
