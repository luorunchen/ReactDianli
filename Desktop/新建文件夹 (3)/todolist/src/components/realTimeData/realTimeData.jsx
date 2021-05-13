import React, { Component, useState } from "react";
import { Row, Col, Tree, Card, Divider, List } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import "./realTimeData.css";
import img from "../../assets/images/供电公司.png";
import Demo from "../Demo/Demp";
import {
  realDataByCode,
  getRegion,
  getDevice,
  getDeviceRealTime,
} from "../../api/index.js";
export default class realTimeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightList: [],
      key: 1,
      Hierarchy: 1,
      showState: 1,
      getDeviceRealTimeList: [],
      title: "新能源电力安防一体化监测平台",
    };
  }
  componentDidMount() {
    const userName = sessionStorage.getItem("userName");
    getRegion(userName, "", "zTreeAsyncTest").then((res) => {
      let arr = [];
      let realList = [];
      res.data.forEach((el, index) => {
        arr.push({ title: el.name, key: index + 1, code: el.code });
        realDataByCode(userName, el.code, 1, 1000).then((res) => {
          realList.push(res.data.data[0]);
          this.setState({
            rightList: realList,
          });
        });
      });
    });
  }

  //更新右边的展示数据
  getName = (name) => {
    this.setState({
      rightList: [...name],
      Hierarchy: 1,
      showState: 1,
    });
  };

  getTitle = (name, title) => {
    if (title != "switch") {
      //抬头赋值
      this.state.title += ` 〉${name}`;
    } else {
      //清空重置抬头
      this.state.title = `新能源电力安防一体化监测平台`;
      this.state.title += ` 〉${name}`;
    }
  };
  handleClick = (type, code, pid, did) => {
    const userName = sessionStorage.getItem("userName");
    //////console.log(type, code.substring(9, 14), pid, "type");
    // code.substring(10, 14);
    const num = code.substring(9, 14) * 1;
    //////console.log(num);
    if (num > 1000 && type == undefined) {
      //////console.log(">>>>>>>>>");
      getDevice(userName, pid, 1, 1000).then((res) => {
        this.setState({
          rightList: [...res.data.data],
          Hierarchy: 2,
        });
      });
    }
    if (this.state.Hierarchy == 2) {
      getDeviceRealTime(userName, did).then((res) => {
        res.data.alarms.forEach((el) => {
          el.tiem = res.data.deviceInfo.heartbeatTime;
        });
        let humData = [];
        let tempData = [];
        let timeData = [];
        res.data.deviceDatas.forEach((el) => {
          humData.push(el.hum);
          timeData.push(el.time);
          tempData.push(el.temp);
        });
        //////console.log(humData, tempData, 6546);
        const myChart = echarts.init(document.getElementById("ecartTop"));
        myChart.setOption({
          legend: {
            data: ["湿度"],
            textStyle: {
              color: "#fft",
            },
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: timeData,
            axisLabel: {
              textStyle: {
                color: "#fff", //坐标值得具体的颜色
              },
            },

            splitArea: {
              show: true,
              //修改背景色
              areaStyle: {
                color: ["rgba(6,47,43,0.8)", "rgba(6,47,43,0.8)"],
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#fff", //坐标值得具体的颜色
              },
            },
            // axisLine: {
            //   splitLine: { show: false },
            //   lineStyle: {
            //     color: "#000",
            //     width: 1, //这里是为了突出显示加上的
            //   },
            // },
          },
          grid: {
            top: "30px",
            left: "50px",
            right: "30px",
            bottom: "70px",
          },
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: 20,
            },
            {
              start: 0,
              end: 20,
            },
          ],

          series: [
            {
              name: "隐患值",
              data: humData,
              type: "line",
              itemStyle: { color: "red" },
            },
          ],
        });
        const myChartCopy = echarts.init(
          document.getElementById("ecartBottom")
        );
        myChartCopy.setOption({
          legend: {
            data: ["温度"],
            textStyle: {
              color: "#fft",
            },
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: timeData,
            axisLabel: {
              textStyle: {
                color: "#fff", //坐标值得具体的颜色
              },
            },

            splitArea: {
              show: true,
              //修改背景色
              areaStyle: {
                color: ["rgba(6,47,43,0.8)", "rgba(6,47,43,0.8)"],
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              textStyle: {
                color: "#fff", //坐标值得具体的颜色
              },
            },
            // axisLine: {
            //   splitLine: { show: false },
            //   lineStyle: {
            //     color: "#000",
            //     width: 1, //这里是为了突出显示加上的
            //   },
            // },
          },
          grid: {
            top: "30px",
            left: "50px",
            right: "30px",
            bottom: "70px",
          },
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: 20,
            },
            {
              start: 0,
              end: 20,
            },
          ],

          series: [
            {
              name: "隐患值",
              data: tempData,
              type: "line",
              itemStyle: { color: "red" },
            },
          ],
        });
        this.setState({
          getDeviceRealTimeList: res.data.deviceInfo,
          getDeviceRealTimeListAlarms: res.data.alarms,
        });
      });
      this.setState({
        showState: 2,
      });
    }
    // //////console.log(this.state.Hierarchy);
  };

  render() {
    const data = [
      {
        title: "湿度",
        num: `${this.state.getDeviceRealTimeList.hum}%`,
        tiem: this.state.getDeviceRealTimeList.heartbeatTime,
      },
      {
        title: "温度",
        num: `${this.state.getDeviceRealTimeList.temp}℃`,
        tiem: this.state.getDeviceRealTimeList.heartbeatTime,
      },
      {
        title: "信号值",
        num: this.state.getDeviceRealTimeList.rssi,
        tiem: this.state.getDeviceRealTimeList.heartbeatTime,
      },
    ];

    return (
      <div id="realTimeData">
        <Row gutter={20}>
          <Col span={5}>
            <div className="left">
              <div className="leftCopy">
                <input
                  type="text"
                  placeholder="搜索地区或机构名称"
                  className="bodyLeftInput"
                />
                <Demo
                  getName={this.getName}
                  ket={2}
                  getTitle={this.getTitle}
                  pageState={1000}
                />
              </div>
            </div>
          </Col>
          <Col span={19}>
            <div className="right">
              <div className="rightCopy">
                <span>{this.state.title}</span>
                <Divider style={{ borderColor: "#08382A", borderWidth: 3 }} />
                <div className="site-card-wrapper">
                  <Row gutter={[10, 30]}>
                    {this.state.showState == 1 ? (
                      this.state.rightList.map((el, index) => {
                        return (
                          <Col
                            span={6}
                            key={index}
                            onClick={() =>
                              this.handleClick(el.type, el.code, el.pid, el.did)
                            }
                          >
                            <Card title="设备总数:1" bordered={false}>
                              <Row gutter={20}>
                                <Col span={6}>
                                  <img src={img} alt="" />
                                </Col>
                                <Col span={18}>
                                  <p>
                                    {this.state.Hierarchy == 1
                                      ? el.name
                                      : el.dname}
                                  </p>
                                  <span>
                                    {this.state.Hierarchy == 1
                                      ? el.rdate != undefined
                                        ? `更新时间:${el.rdate}`
                                        : `项目地址:${el.adss}`
                                      : `设备编号:${el.imei}`}
                                  </span>
                                </Col>
                              </Row>
                              <Row
                                gutter={20}
                                style={{
                                  textAlign: "center",
                                  marginTop: "20px",
                                }}
                              >
                                <Col span={7}>
                                  <p>
                                    {this.state.Hierarchy != 1 ? "" : el.anum}
                                  </p>
                                  <span>
                                    {this.state.Hierarchy != 1 ? "" : "报警"}
                                  </span>
                                </Col>
                                <Divider
                                  type="vertical"
                                  style={{
                                    height: 60,
                                    width: "2px",
                                    height: "40px",
                                    backgroundImage:
                                      "linear-gradient(to top, #083c31 , #159960 ,#083c31 )",
                                  }}
                                />
                                <Col span={7}>
                                  <p>
                                    {this.state.Hierarchy == 1
                                      ? el.nanum
                                      : el.alarmNum}
                                  </p>
                                  <span>
                                    {this.state.Hierarchy != 1
                                      ? "未处理"
                                      : "正常"}
                                  </span>
                                  {/* <p>{el.nanum}</p>
                                <span>正常</span> */}
                                </Col>
                                <Divider
                                  type="vertical"
                                  style={{
                                    height: 60,
                                    width: "2px",
                                    height: "40px",
                                    backgroundImage:
                                      "linear-gradient(to top, #083c31 , #159960 ,#083c31 )",
                                  }}
                                />
                                <Col span={7}>
                                  <p>
                                    {this.state.Hierarchy == 1
                                      ? `${el.onlie} / ${el.offline}`
                                      : el.alarmType}
                                  </p>
                                  <span>
                                    {this.state.Hierarchy != 1
                                      ? "状态"
                                      : "在线/离线"}
                                  </span>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        );
                      })
                    ) : (
                      <Col span={24}>
                        <Row gutter={10}>
                          <Col span={7}>
                            <div className="terminalInformationTop">
                              <div className="infoTitle">终端信息</div>
                              <div className="scroll">
                                <p>
                                  <span>设备名称:</span>
                                  {this.state.getDeviceRealTimeList.dname}
                                </p>
                                <p>
                                  <span>报警状态:</span>
                                  {this.state.getDeviceRealTimeList.dname}
                                </p>
                                <p>
                                  <span>设备类型:</span>
                                  {this.state.getDeviceRealTimeList.type}
                                </p>
                                <p>
                                  <span>设备编号:</span>
                                  {this.state.getDeviceRealTimeList.imei}
                                </p>
                                <p>
                                  <span>创建时间:</span>
                                  {
                                    this.state.getDeviceRealTimeList
                                      .heartbeatTime
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="terminalInformationBottom">
                              <div className="infoTitle">传感器数据</div>
                              <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      title={
                                        <span href="https://ant.design">
                                          {item.title}
                                        </span>
                                      }
                                      description={
                                        <div>
                                          <ClockCircleOutlined />
                                          {item.tiem}
                                        </div>
                                      }
                                    />
                                    <div>{item.num}</div>
                                  </List.Item>
                                )}
                              />
                              <div className="infoTitle">报警</div>
                              <List
                                itemLayout="horizontal"
                                dataSource={
                                  this.state.getDeviceRealTimeListAlarms
                                }
                                renderItem={(item) => (
                                  <List.Item>
                                    <List.Item.Meta
                                      title={
                                        <span href="https://ant.design">
                                          {item.typeName}
                                        </span>
                                      }
                                      description={
                                        <div>
                                          <ClockCircleOutlined />
                                          {item.tiem}
                                        </div>
                                      }
                                    />
                                    <div>{item.alarmValue}</div>
                                  </List.Item>
                                )}
                              />
                            </div>
                          </Col>
                          <Col span={17}>
                            <div className="terminalInformationTopEcart">
                              <div className="infoTitle">湿度趋势变化图</div>
                              <div id="ecartTop"></div>
                            </div>
                            <div className="terminalInformationBottomEcart">
                              <div className="infoTitle">温度趋势变化图</div>
                              <div id="ecartBottom"></div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
