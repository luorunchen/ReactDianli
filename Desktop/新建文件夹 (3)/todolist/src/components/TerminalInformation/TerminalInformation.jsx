import React, { Component } from "react";
import { Row, Col, List } from "antd";
import "./TerminalInformation.css";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getDeviceRealTime } from "../../api/index.js";
import * as echarts from "echarts";
export default class TerminalInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getDeviceRealTimeList: [],
      getDeviceRealTimeListAlarms: [],
    };
  }
  componentDidMount() {
    // console.log(this.props, 2222222222222222);
    this.stateFun(this.props.getDid);
  }
  //监听父组件传过来的值
  componentWillReceiveProps(nextProps, newProps) {
    // console.log(nextProps.getDid, newProps, "///////////////////");
    // console.log(this.props, 2222222222222222);
    this.stateFun(nextProps.getDid);
  }

  stateFun = (data) => {
    const userName = sessionStorage.getItem("userName");
    getDeviceRealTime(userName, data).then((res) => {
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
      const myChartCopy = echarts.init(document.getElementById("ecartBottom"));
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
      <div style={{ width: "100%" }}>
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
                    {this.state.getDeviceRealTimeList.heartbeatTime}
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
                          <span href="https://ant.design">{item.title}</span>
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
                  dataSource={this.state.getDeviceRealTimeListAlarms}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <span href="https://ant.design">{item.typeName}</span>
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
      </div>
    );
  }
}
