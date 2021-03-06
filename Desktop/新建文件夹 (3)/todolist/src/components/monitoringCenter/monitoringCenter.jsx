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
              ????????????
            </Button>
            <Table
              dataSource={this.state.getRegisterList}
              pagination={{ position: ["none"] }}
              size="small"
            >
              <Column title="??????" dataIndex="key" key="key"></Column>
              <Column title="????????????" dataIndex="name" key="key" />
              <Column title="????????????" dataIndex="phone" key="key" />
              <Column title="??????" dataIndex="company" key="key" />
              <Column title="??????" dataIndex="adss" key="key" />
              <Column title="??????" dataIndex="role" key="key" />

              <Column
                title="??????"
                key="action"
                render={(text, record) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#009688", border: "none" }}
                    >
                      ????????????
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "red", border: "none" }}
                    >
                      ????????????
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
              ????????????
            </Button>
            <Table
              dataSource={this.state.getRoleList}
              pagination={{ position: ["none"] }}
              size="small"
            >
              <Column title="??????" dataIndex="key" key="key"></Column>
              <Column title="????????????" dataIndex="name" key="key" />
              <Column title="?????????" dataIndex="create_user" key="key" />
              <Column title="??????" dataIndex="region_name" key="key" />
              <Column title="????????????" dataIndex="createDate" key="key" />

              <Column
                title="??????"
                key="action"
                render={(text, record) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#009688", border: "none" }}
                    >
                      ????????????
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "red", border: "none" }}
                    >
                      ????????????
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
              ????????????
            </Button>
            <Table
              dataSource={this.state.getProjectList}
              pagination={{ position: ["none"] }}
              size="small"
            >
              <Column title="??????" dataIndex="key" key="key"></Column>
              <Column title="????????????" dataIndex="name" key="key" />
              <Column title="????????????" dataIndex="adss" key="key" />
              <Column title="?????????" dataIndex="fName" key="key" />
              <Column title="???????????????" dataIndex="fPhone" key="key" />
              <Column title="?????????" dataIndex="zName" key="key" />
              <Column title="???????????????" dataIndex="zPhone" key="key" />
              <Column title="????????????" dataIndex="remark" key="key" />

              <Column
                title="??????"
                key="action"
                render={(text, record) => (
                  <Space size="small">
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "#009688", border: "none" }}
                    >
                      ????????????
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ border: "none" }}
                    >
                      ????????????
                    </Button>
                    <Button
                      size="small"
                      type="primary"
                      style={{ background: "red", border: "none" }}
                    >
                      ????????????
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
            <Column title="??????" dataIndex="key" key="key"></Column>
            <Column title="????????????" dataIndex="pname" key="key" />
            <Column title="????????????" dataIndex="dname" key="key" />
            <Column title="????????????" dataIndex="imei" key="key" />

            <Column title="????????????" dataIndex="adss" key="key" />
            <Column title="????????????" dataIndex="heartbeatTime" key="key" />

            <Column
              title="??????"
              key="action"
              render={(text, record) => (
                <Space size="small">
                  <Button
                    size="small"
                    type="primary"
                    style={{ background: "#009688", border: "none" }}
                  >
                    ????????????
                  </Button>

                  <Button
                    size="small"
                    type="primary"
                    style={{ background: "red", border: "none" }}
                  >
                    ????????????
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
                <div className="infoTitle">????????????</div>
                <ul>
                  <li
                    onClick={() => this.name("User")}
                    className={this.state.name == "User" ? "bg" : ""}
                  >
                    <TeamOutlined style={{ fontSize: "16px" }} />
                    ????????????
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;???
                  </li>
                  <li
                    onClick={() => this.name("jurisdiction")}
                    className={this.state.name == "jurisdiction" ? "bg" : ""}
                  >
                    <LockOutlined style={{ fontSize: "16px" }} />
                    ????????????
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;???
                  </li>
                  <li
                    onClick={() => this.name("project")}
                    className={this.state.name == "project" ? "bg" : ""}
                  >
                    <SolutionOutlined style={{ fontSize: "16px" }} />
                    ????????????
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;???
                  </li>
                  <li
                    onClick={() => this.name("equipment")}
                    className={this.state.name == "equipment" ? "bg" : ""}
                  >
                    <LaptopOutlined style={{ fontSize: "16px" }} />
                    ????????????
                    &#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;???
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
