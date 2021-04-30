import React, { Component } from "react";
import "./title.css";
import { Row, Col, Button, Space } from "antd";
import { ExportOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default class title extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleName: "homePage",
    };
  }

  del = (param) => {
    // console.log(name, param, 222222222222);
    return () => {
      console.log(param); // hello
      this.setState({
        titleName: param,
      });
    };
  };
  // out = () => {
  //   return () => {};
  // };

  render() {
    return (
      <div className="title">
        <div className="titleTop">
          <Row>
            <Col span={6} offset={3}>
              <span>姓名</span>
              <span>权限</span>
              <span>日期</span>
            </Col>
            <Col span={6} offset={9}>
              <span>
                <Link to="/home/monitoringCenter">
                  <UserOutlined />
                  监控后台
                </Link>
              </span>
              <span>
                <Link to="/home/PersonalCenter">
                  <UserOutlined />
                  个人中心
                </Link>
              </span>
              <Link to="/login">
                <span>
                  <ExportOutlined />
                  退出
                </span>
              </Link>
            </Col>
          </Row>
        </div>
        <div className="titleBottom">
          <Row>
            <Col span={6} offset={2}>
              <div className="left">
                <Link to="/home/homePage">
                  <span
                    onClick={this.del("homePage")}
                    className={
                      this.state.titleName == "homePage" ? "falseBg" : "trueBg"
                    }
                  >
                    首页
                  </span>
                </Link>
                <Link to="/home/realTimeData">
                  <span
                    onClick={this.del("realTimeData")}
                    className={
                      this.state.titleName == "realTimeData"
                        ? "falseBg"
                        : "trueBg"
                    }
                  >
                    实时数据
                  </span>
                </Link>
                <Link to="/home/AlarmInfo">
                  <span
                    onClick={this.del("homeAlarmInformationPage")}
                    className={
                      this.state.titleName == "homeAlarmInformationPage"
                        ? "falseBg"
                        : "trueBg"
                    }
                  >
                    报警信息
                  </span>
                </Link>
              </div>
            </Col>

            <Col span={8}>
              <p>国家电网安防一体化监测平台</p>
            </Col>
            <Col span={8}>
              <span
                onClick={this.del("monitoringCenter")}
                className={
                  this.state.titleName == "monitoringCenter"
                    ? "falseBg"
                    : "trueBg"
                }
              >
                监控中心
              </span>
              <span
                onClick={this.del("statisticalInformation")}
                className={
                  this.state.titleName == "statisticalInformation"
                    ? "falseBg"
                    : "trueBg"
                }
              >
                统计信息
              </span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
