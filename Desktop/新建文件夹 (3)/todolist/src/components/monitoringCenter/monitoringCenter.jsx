import React, { Component } from "react";
import { Row, Col, Button, Table, Space } from "antd";
import {
  TeamOutlined,
  LockOutlined,
  SolutionOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import "./monitoringCenter.css";
import {
  getRegister,
  getRole,
  getProject,
  getDevice,
} from "../../api/index.js";
export default class monitoringCenter extends Component {
  constructor() {
    super();
    this.state = {
      name: "User",
      getRegisterList: [],
      getRoleList: [],
      getProjectList: [],
      getDeviceList: [],
    };
  }
  componentDidMount() {
    const userName = sessionStorage.getItem("userName");
    getRegister(userName).then((res) => {
      let data = [];
      res.data.data.forEach((el, index) => {
        el.key = index + 1;
        data.push(el);
      });
      this.setState({
        getRegisterList: data,
      });
    });
    getRole(userName).then((res) => {
      console.log(res.data.data, "/////////////");
      let data = [];
      res.data.data.forEach((el, index) => {
        el.key = index + 1;
        data.push(el);
      });
      this.setState({
        getRoleList: data,
      });
    });
    getProject(userName, "all", 1, 1000).then((res) => {
      console.log(res.data);
      let data = [];
      res.data.data.forEach((el, index) => {
        el.key = index + 1;
        data.push(el);
      });
      this.setState({
        getProjectList: data,
      });
    });
    getDevice(userName, "all", 1, 1000).then((res) => {
      // console.log(res.data.data, "......................");
      let data = [];
      res.data.data.forEach((el, index) => {
        el.key = index + 1;
        data.push(el);
      });
      this.setState({
        getDeviceList: data,
      });
    });
  }
  name = (data) => {
    console.log(data);
    this.setState({
      name: data,
    });
  };
  render() {
    const isLoggedIn = this.state.name;

    const Sutton = () => {
      const { Column, ColumnGroup } = Table;
      if (isLoggedIn == "User") {
        return (
          <div>
            <Button type="primary" style={{ margin: "10px" }}>
              新增用户
            </Button>
            <Table
              dataSource={this.state.getRegisterList}
              pagination={{ position: ["none"] }}
              size="small"
            >
              <Column title="序号" dataIndex="key" key="key"></Column>
              <Column title="用户名称" dataIndex="name" key="key" />
              <Column title="手机号码" dataIndex="phone" key="key" />
              <Column title="公司" dataIndex="company" key="key" />
              <Column title="地址" dataIndex="adss" key="key" />
              <Column title="角色" dataIndex="role" key="key" />

              <Column
                title="操作"
                key="action"
                render={(text, record) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#009688", border: "none" }}
                    >
                      编辑用户
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "red", border: "none" }}
                    >
                      删除用户
                    </Button>
                  </Space>
                )}
              />
            </Table>
          </div>
        );
      } else if (isLoggedIn == "jurisdiction") {
        return (
          <div>
            <Button type="primary" style={{ margin: "10px" }}>
              新增权限
            </Button>
            <Table
              dataSource={this.state.getRoleList}
              pagination={{ position: ["none"] }}
              size="small"
            >
              <Column title="序号" dataIndex="key" key="key"></Column>
              <Column title="角色名称" dataIndex="name" key="key" />
              <Column title="创建人" dataIndex="create_user" key="key" />
              <Column title="区域" dataIndex="region_name" key="key" />
              <Column title="创建时间" dataIndex="createDate" key="key" />

              <Column
                title="操作"
                key="action"
                render={(text, record) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#009688", border: "none" }}
                    >
                      编辑权限
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "red", border: "none" }}
                    >
                      删除权限
                    </Button>
                  </Space>
                )}
              />
            </Table>
          </div>
        );
      } else if (isLoggedIn == "project") {
        return (
          <div>
            <Button type="primary" style={{ margin: "10px" }}>
              新增项目
            </Button>
            <Table
              dataSource={this.state.getProjectList}
              pagination={{ position: ["none"] }}
              size="small"
            >
              <Column title="序号" dataIndex="key" key="key"></Column>
              <Column title="项目名称" dataIndex="name" key="key" />
              <Column title="项目位置" dataIndex="adss" key="key" />
              <Column title="防火员" dataIndex="fName" key="key" />
              <Column title="防火员电话" dataIndex="fPhone" key="key" />
              <Column title="责任人" dataIndex="zName" key="key" />
              <Column title="责任人电话" dataIndex="zPhone" key="key" />
              <Column title="项目描述" dataIndex="remark" key="key" />

              <Column
                title="操作"
                key="action"
                render={(text, record) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#009688", border: "none" }}
                    >
                      编辑项目
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ border: "none" }}
                    >
                      新增设备
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "red", border: "none" }}
                    >
                      删除项目
                    </Button>
                  </Space>
                )}
              />
            </Table>
          </div>
        );
      } else {
        return (
          <Table
            dataSource={this.state.getDeviceList}
            pagination={{ position: ["none"] }}
            size="small"
          >
            <Column title="序号" dataIndex="key" key="key"></Column>
            <Column title="项目名称" dataIndex="pname" key="key" />
            <Column title="设备名称" dataIndex="dname" key="key" />
            <Column title="设备编号" dataIndex="imei" key="key" />

            <Column title="设备位置" dataIndex="adss" key="key" />
            <Column title="创建时间" dataIndex="heartbeatTime" key="key" />

            <Column
              title="操作"
              key="action"
              render={(text, record) => (
                <Space size="small">
                  <Button
                    size="small"
                    type="primary"
                    style={{ background: "#009688", border: "none" }}
                  >
                    编辑设备
                  </Button>

                  <Button
                    size="small"
                    type="primary"
                    style={{ background: "red", border: "none" }}
                  >
                    删除设备
                  </Button>
                </Space>
              )}
            />
          </Table>
        );
      }
    };

    return (
      <div id="monitoringCenter">
        <Row gutter={20}>
          <Col span={5}>
            <div className="left">
              <div className="leftCopy">
                <div className="infoTitle">监控后台</div>
                <ul>
                  <li
                    onClick={() => this.name("User")}
                    className={this.state.name == "User" ? "bg" : ""}
                  >
                    <TeamOutlined style={{ fontSize: "16px" }} />
                    用户模块
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;＞
                  </li>
                  <li
                    onClick={() => this.name("jurisdiction")}
                    className={this.state.name == "jurisdiction" ? "bg" : ""}
                  >
                    <LockOutlined style={{ fontSize: "16px" }} />
                    权限模块
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;＞
                  </li>
                  <li
                    onClick={() => this.name("project")}
                    className={this.state.name == "project" ? "bg" : ""}
                  >
                    <SolutionOutlined style={{ fontSize: "16px" }} />
                    项目模块
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;＞
                  </li>
                  <li
                    onClick={() => this.name("equipment")}
                    className={this.state.name == "equipment" ? "bg" : ""}
                  >
                    <LaptopOutlined style={{ fontSize: "16px" }} />
                    设备模块
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;＞
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col span={19}>
            <div className="right">
              <div className="rightCopy"></div>

              <Sutton />
              {/* {button} */}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
