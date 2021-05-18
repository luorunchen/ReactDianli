<!--
模块：应用入口vue文件 by 孔祥义
  定义全局的样式
-->
<template>
  <div id="app">
    <router-link to="/"></router-link>
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
//引入在线icon
// @import "//at.alicdn.com/t/font_1762543_c9ujtl9mrsi.css";

html,
body,
#app {
  height: 100%;
  margin: 0px;
  padding: 0px;
}
body {
  overflow: hidden;
}
//滚动条样式
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #1f95d4;
  width: 6px;
}
::-webkit-scrollbar-track-piece {
  background-color: rgba(255, 255, 255, 0);
}
::-webkit-scrollbar-corner {
  width: 10px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0);
}

body /deep/ {
  .el-loading-spinner i {
    color: white;
  }
  .el-loading-spinner .el-loading-text {
    color: white;
  }
  .el-input__inner {
    line-height: 25px;
  }
  // //弹框样式
  // .el-dialog {
  //   position: relative;
  //   margin: 0 auto 50px;
  //   border-radius: 2px;
  //   box-sizing: border-box;
  //   background: rgba(8, 44, 68, 1);
  //   border: 1px solid rgba(112, 112, 112, 1);
  //   box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.39);
  //   color: white;
  //   .el-dialog__title {
  //     color: white;
  //     float: left;
  //     border-left: 4px solid #19acb3;
  //     padding-left: 10px;
  //     top: -8px;
  //     position: relative;
  //   }
  //   .el-dialog__headerbtn .el-dialog__close {
  //     color: white;
  //   }
  // }
  /**弹窗样式 */
  .el-dialog {
    background: #0029c4;
    border: 2px solid #0a8df9;
    font-size: 14px;
    font-family: Segoe UI;
    font-weight: 400;
    line-height: 19px;
    color: rgba(255, 255, 255, 1) !important;

    .el-dialog__header {
      height: 10px;
      background: #0047be !important;
    }
    .el-dialog__body {
      background: #0029c4 !important;
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 4px;
      right: 8px;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      cursor: pointer;
      font-size: 24px;
      font-weight: 900;
    }
  }
  //表格样式
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(33, 102, 180, 1);
  }
  .el-table--border th.gutter:last-of-type {
    border: 1px solid rgba(10, 141, 249, 1);
  }
  .el-table {
    font-size: 14px;
    font-family: Segoe UI;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(15, 56, 84, 0);
    border: none;
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background-color: rgba(255, 255, 255, 0);
      border-color: #3c6b81;
    }
    th {
      font-size: 14px;
      background: #0034a4;
      color: rgba(255, 255, 255, 0.8);
      padding: 3px 0;
    }
    td {
      padding: 3px 0;
    }
    tr:nth-child(odd) {
      background: #0063b3;
    }
    tr:nth-child(even) {
      background: rgba(0, 78, 181, 1);
    }
    .cell {
      padding: 0px !important;
      text-align: center;
    }
    .el-table__body tr.hover-row > td,
    .el-table__body tr.hover-row.current-row > td,
    .el-table__body tr.hover-row.el-table__row--striped > td,
    .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background: rgba(33, 102, 180, 1);
    }
    td,
    th {
      border-right: 1px solid rgba(22, 64, 88, 1);
      border-bottom: none;
      border: 1px solid rgba(10, 141, 249, 1);
    }
    .el-table--border th,
    .el-table--border td {
      border-right: 1px solid rgba(22, 64, 88, 1);
      border-bottom: none;
    }
    th.is-leaf,
    td {
      // border: none;
      border: 1px solid rgba(10, 141, 249, 1);
    }
    .el-table__fixed,
    .el-table__fixed-right {
      box-shadow: 3px 0px 8px rgba(0, 0, 0, 0.77);
    }
    .el-table--border th.gutter:last-of-type {
      // border: none;
      border: 1px solid rgba(10, 141, 249, 1);

      border-bottom-width: 1px;
    }
    .el-table__fixed::before,
    .el-table__fixed-right::before {
      display: none;
    }
    .el-checkbox__inner,
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      border-color: #3c6b81;
      background-color: rgba(255, 255, 255, 0);
    }
  }

  /deep/.el-table__footer-wrapper tbody td,
  /deep/.el-table__fixed-footer-wrapper tbody td {
    color: white !important;
    background: rgba(9, 31, 57, 1) !important;
    border-top: none;
    :last-child {
      // border: none;
      border: 1px solid rgba(10, 141, 249, 1);
    }
    border-right: 1px solid #63c0e1;
    .my-table-foot {
      display: flex;
      padding-left: 12px;
      justify-content: space-between;
      padding-right: 12px;
      span {
        color: #63c0e1;
        margin-right: 10px;
      }
    }
  }
  .el-table__footer-wrapper {
    border-top: 1px solid rgba(39, 87, 112, 1);
  }
  .el-table--group::after,
  .el-table--border::after,
  .el-table::before {
    display: none;
  }

  /* 树形结构节点添加连线 */
  .tree-container {
    .el-tree {
      background-color: rgba(255, 255, 255, 0);
    }
    .tree .el-tree-node {
      position: relative;
      padding-left: 16px;
    }

    .tree .el-tree-node__children {
      padding-left: 16px;
    }

    .tree .el-tree-node :last-child:before {
      height: 38px;
      border-color: #50748a;
    }

    .tree .el-tree > .el-tree-node:before {
      border-left: none;
    }
    .el-tree > .el-tree-node:after {
      border-top: none;
    }

    .tree .el-tree-node:before {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-color: #50748a;
    }

    .tree .el-tree-node:after {
      content: "";
      left: -4px;
      position: absolute;
      right: auto;
      border-width: 1px;
      border-color: #50748a;
    }
    .tree .el-tree-node__expand-icon.is-leaf {
      display: none;
    }

    .tree .el-tree-node:before {
      border-left: 1px solid #b8b9bb;
      bottom: 0px;
      height: 100%;
      top: -26px;
      width: 1px;
    }

    .tree .el-tree-node:after {
      border-top: 1px solid;
      height: 20px;
      top: 12px;
      width: 24px;
      border-color: #50748a;
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      display: none;
    }
    .el-tree-node__label {
      font-size: 14px;
      font-family: Segoe UI;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.8);
      margin-left: -5px;
    }
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content,
    .el-tree-node__content:hover {
      background-color: rgba(255, 255, 255, 0);
    }
    .el-tree-node__content:hover .el-tree-node__label {
      color: #40e9da;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: rgba(255, 255, 255, 0);
      border-color: #50748a;
    }
  }
  // 分页全局样式修改
  /deep/.el-pagination {
    color: white;
    .el-pagination__total {
      margin-right: 10px;
      font-weight: normal;
      color: white;
      // position: relative;
      // right: -1162px;
    }
    .el-pagination__sizes .el-input .el-input__inner:hover,
    .el-pagination__sizes .el-input .el-input__inner,
    span,
    ul,
    li,
    input,
    li:before {
      background-color: rgba(255, 255, 255, 0);
      color: white;
      :hover {
        color: #40e9da !important;
      }
    }
    button,
    .el-pagination .btn-prev,
    .el-pagination .btn-next {
      background-color: rgba(255, 255, 255, 0) !important;
      color: white !important;
      :hover {
        color: #40e9da !important;
      }
    }
  }
  /deep/ .el-picker-panel {
    .el-date-picker__time-header {
      input {
        // color: white !important;
      }
    }
  }
}
//分页组件样式
.page {
  .el-icon-more,
  span,
  input,
  button {
    background-color: rgba(142, 142, 142, 0) !important;
    color: white !important;
  }
  li {
    background-color: rgba(142, 142, 142, 0) !important;
    color: white;
  }
}
</style>
