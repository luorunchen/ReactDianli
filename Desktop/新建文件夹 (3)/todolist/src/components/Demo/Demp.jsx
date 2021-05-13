import React, { Component, useState } from "react";
import { Row, Col, Tree, Card, Divider } from "antd";
import {
  realDataByCode,
  getRegion,
  getProject,
  alarmInfo,
} from "../../api/index.js";
export default class Demp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftList: [],
      rightList: [],
      ket: 2,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.ket === this.state.ket) {
      //传入的count与组件当前props的count比较,count没改变，return false，不渲染
      return true; //不渲染
    } else {
      return false;
    }
  }

  componentDidMount() {
    //改变渲染状态
    setTimeout(() => {
      this.setState({
        ket: 3,
      });
    }, 1000);

    const userName = sessionStorage.getItem("userName");
    if (this.props.pageState == 2000) {
      alarmInfo(userName, "", 1, 1000).then((res) => {
        console.log(res.data.data, 1321);
        this.props.getName([...res.data.data]);
      });
    }
    getRegion(userName, "", "zTreeAsyncTest").then((res) => {
      let arr = [];
      let realList = [];
      res.data.forEach((el, index) => {
        arr.push({
          title: el.name,
          key: index + 1,
          code: el.code,
          type: el.type,
        });
        if (this.props.pageState == 1000) {
          realDataByCode(userName, el.code, 1, 1000).then((res) => {
            realList.push(res.data.data[0]);

            this.setState({
              rightList: realList,
            });
          });
        }
      });

      this.setState({
        leftList: arr,
      });
    });
  }

  onSelect = (selectedKeys, selectedNodes) => {
    const userName = sessionStorage.getItem("userName");
    const num = selectedNodes.node.code.substring(9, 14) * 1;

    if (this.props.pageState == "1000") {
      //判断是否是最后一级
      if (num > 1000) {
        getProject(userName, selectedNodes.node.code, 1, 1000).then((res) => {
          this.props.getName([...res.data.data]);
        });
      } else {
        realDataByCode(userName, selectedNodes.node.code, 1, 1000).then(
          (res) => {
            this.props.getName([...res.data.data]);
          }
        );
      }
    } else {
      alarmInfo(userName, selectedNodes.node.code, 1, 1000).then((res) => {
        console.log(res.data.data, 1321);
        this.props.getName([...res.data.data]);
      });
    }

    // this.forceUpdate();
  };

  render() {
    function updateTreeData(list, key, children) {
      return list.map((node) => {
        if (node.key === key) {
          return { ...node, children };
        }

        if (node.children) {
          return {
            ...node,
            children: updateTreeData(node.children, key, children),
          };
        }
        return node;
      });
    }

    const userName = sessionStorage.getItem("userName");

    const Demo = () => {
      const [treeData, setTreeData] = useState(this.state.leftList);

      function onLoadData({ key, children, code }) {
        return new Promise((resolve) => {
          if (children) {
            resolve();
            return;
          }

          getRegion(userName, code, "zTreeAsyncTest").then((res) => {
            let arr = [];

            res.data.forEach((el, index) => {
              arr.push({
                title: el.name,
                key: `${key}+${index}`,
                isLeaf: el.isParent == "false" ? true : false,
                code: el.code,
                type: el.type,
              });
            });
            setTreeData((origin) => updateTreeData(origin, key, arr));
          });

          // realDataByCode(userName, codeDate, 1, 1000).then((res) => {});
          // console.log(children, 66666);
          // setTimeout(() => {

          resolve();
        }, 1000);
        // });
      }

      return (
        <Tree.DirectoryTree
          onSelect={this.onSelect}
          loadData={onLoadData}
          treeData={treeData}
          onLoad={this.onLoad}
          height={720}
          onExpand={(a, b) => {
            //判断是否切换公司
            if (a.length > 1 && typeof a[a.length - 1] == "string") {
              console.log(a[a.length - 1].split("+"), 46545646);
              this.props.getTitle(b.node.title);
            } else {
              //切换公司,数据变更
              if (a.length > 0) {
                a.splice(0, a.length - 1);
              }
              this.props.getTitle(b.node.title, "switch");
              this.setState({ expandedKeys: a });
            }
            // console.log(expandedKeys.pop(), 46548161);
            // if(expandedKeys.pop())
            // if (b.expanded) {
            //   if (a.length > 0) {
            //     a.splice(0, a.length - 1);
            //   }
            // }
            // this.setState({ expandedKeys: a });
          }}
        />
      );
    };

    return (
      <div>
        <Demo />
      </div>
    );
  }
}
