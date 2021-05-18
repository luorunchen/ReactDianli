import React, { Component, useState } from "react";
import "./MonitorBackground.css";
import { Row, Col, Modal, Input } from "antd";
import imgLeft from "../../assets/images/bigData_1.png";
import imgCenter from "../../assets/images/bigData_2.png";
import imgRight from "../../assets/images/bigData_3.png";
import imgTop from "../../assets/images/top.png";
import imgBottom from "../../assets/images/drop.png";
import TerminalInformation from "../TerminalInformation/TerminalInformation";
import { jkAlarmData, AlarmCount, alarmInfo } from "../../api/index.js";
import * as echarts from "echarts";
export default class MonitorBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: [],
      flag: true,
      alarmInfoList: [],
    };
    this.manage = React.createRef();
    this.srcoll = React.createRef();
    this.serviceData = React.createRef();
    this.alarmRecord = React.createRef();
  }
  componentDidMount() {
    const userName = sessionStorage.getItem("userName");
    var map = new AMap.Map("MonitorBackground", {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 11, //初始化地图层级
      center: [116.397428, 39.90923],
      layers: [
        // 卫星
        new AMap.TileLayer.Satellite(),
        // 路网
        new AMap.TileLayer.RoadNet(),
      ], //初始化地图中心点
    });
    jkAlarmData(userName).then((res) => {
      // console.log(res.data["服务次数"], 66666666666666);
      let data = [];
      let num = "00" + res.data["服务次数"];

      this.setState({
        num: num.split(""),
      });
      // console.log(this.state.num, 66666666);
      res.data.data.forEach((el) => {
        data.push({ name: el.name, value: el.num });
      });
      const myChart = echarts.init(document.getElementById("echart"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
          textStyle: {
            color: "#fft",
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "60%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      });
    });
    AlarmCount(userName).then((res) => {
      console.log(res, 465456);
      // for (key in res.data) {
      //   console.log(key);

      //   //add your statement to get key value
      // }

      let ket = Object.keys(res.data);
      var myColor = ["#81E7ED"]; //内柱状图颜色
      var dataLine = [
        res.data["报警点位"],
        res.data["接入点数"],
        res.data["报警次数"],
      ];
      // let positionLeft = 0.4,
      //   max = 100 + 2 * positionLeft;
      const myChart = echarts.init(document.getElementById("echarts"));
      myChart.setOption({
        grid: [
          {
            left: "8%",
            top: "12%",
            right: "5%",
            bottom: "8%",
            containLabel: true,
          },
          {
            left: "10%",
            top: "12%",
            right: "5%",
            bottom: "8%",
            containLabel: true,
          },
        ],
        xAxis: [
          {
            max: 100,
            show: false,
          },
        ],
        yAxis: [
          {
            axisTick: "none",
            axisLine: "none",
            offset: "27",
            axisLabel: {
              textStyle: {
                color: "#fff", //y轴字体颜色
                fontSize: "16",
              },
            },
            data: ["报警点位", "接入点数", "报警次数"],
          },
          {
            // axisTick: "none",
            // axisLine: "none",
            show: false,
            axisLabel: {
              textStyle: {
                color: "#ffffff",
                fontSize: "14",
              },
            },
            data: [1, 1, 1],
          },
          {
            axisLine: {
              lineStyle: {
                color: "rgba(0,0,0,0)", //y轴线颜色
              },
            },
            data: [],
          },
          {
            //设置柱状图右边参数
            // show: true,
            // inverse: true,
            data: dataLine,
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
          },
        ],
        series: [
          {
            name: "条",
            type: "bar",
            stack: "b",
            yAxisIndex: 0,
            data: dataLine,
            label: {
              normal: {
                show: false,
                position: "right",
                distance: 10,
                formatter: function (param) {
                  return param.value + "%";
                },
                textStyle: {
                  color: "#ffffff",
                  fontSize: "12",
                },
              },
            },
            barWidth: 11,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: "#FF0000" },
                  { offset: 1, color: "#FF7744" },
                ]),

                barBorderRadius: [100, 100, 100],
              },
            },
            z: 2,
          },
          {
            //背景灰框
            name: "白框",
            type: "bar",
            yAxisIndex: 1,
            barGap: "-100%", //设置-100% 则表示灰色柱状图与红色柱状图重合
            data: [99.8, 99.9, 99.9],
            barWidth: 11,
            itemStyle: {
              normal: {
                color: "rgba(37,72,67,.7)",
                barBorderRadius: [100, 100, 100],
              },
            },
            z: 1, // 设置维度越高这表示覆盖低的
          },
        ],
      });
    });
    alarmInfo(userName, "", 1, 1000).then((res) => {
      console.log(res.data.data, "////////////");
      this.setState({
        alarmInfoList: res.data.data,
      });
      console.log(this.state.alarmInfoList, 666666666666666);
    });
  }

  open = () => {
    // console.log(this.srcoll);
    if (this.state.flag) {
      this.manage.current.style.height = `600px`;
      this.srcoll.current.style.height = `540px`;
    } else {
      this.manage.current.style.height = `250px`;
      this.srcoll.current.style.height = `190px`;
    }
    this.setState({
      flag: !this.state.flag,
    });
  };
  btnOff = (state, name) => {
    console.log(state, name);
    // this.srcoll
    switch (name) {
      case "serviceData":
        this.serviceData.current.style.display = state;
        break;
      case "alarmRecord":
        this.alarmRecord.current.style.display = state;
        break;
      case "alarmEquipment":
        this.manage.current.style.display = state;
        break;

      default:
        break;
    }
  };
  render() {
    const App = () => {
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [visible, setVisible] = useState(false);
      const showModal = (did) => {
        this.state.getDid = did;
        setIsModalVisible(true);
      };
      const visibleShow = (did) => {
        this.state.getDid = did;
        setVisible(true);
      };
      //
      return (
        <>
          <>
            {this.state.alarmInfoList.map((el, index) => {
              return (
                <ul key={index} onClick={() => showModal(el.did)}>
                  <li>
                    <span>设备名称：</span>
                    {el.device_name}
                  </li>
                  <li>
                    <span>设备编号： </span>
                    {el.imei}
                  </li>
                  <li>
                    <span>设备地址： </span>
                    {el.adss}
                  </li>
                  <li>
                    <span>报警类型： </span>
                    {el.typeName}
                  </li>
                  <li>
                    <span>报警时间： </span>
                    {el.alarmTime}
                  </li>
                </ul>
              );
            })}
          </>
          {/* <Button type="primary">Open Modal</Button> */}
          {/* 终端信息弹窗 */}
          <Modal
            width={1200}
            title="终端信息"
            visible={isModalVisible}
            onOk={() => {
              setIsModalVisible(false);
            }}
            onCancel={() => {
              setIsModalVisible(false);
            }}
            footer={null}
          >
            <TerminalInformation getDid={this.state.getDid} />
          </Modal>
        </>
      );
    };
    return (
      <div id="MonitorBackground">
        <div className="serviceData" ref={this.serviceData}>
          <div className="serviceDataCopy"></div>
          <div className="infoTitle">2021年服务数据</div>
          <div
            className="offBtn"
            onClick={() => this.btnOff("none", "serviceData")}
          >
            X
          </div>
          <Row gutter={20}>
            <Col span={12}>
              <div id="echart"></div>
            </Col>
            <Col span={12}>
              <p>
                现场服务
                {this.state.num.map((el, index) => {
                  return (
                    <span className="spanT" key={index}>
                      {el}
                    </span>
                  );
                })}
                次
              </p>
              <p>
                已处理隐患
                <span className="spanT">2</span>
                <span className="spanT">0</span>次
              </p>
              <p>
                待处理隐患 <span className="spanT">7</span>次
              </p>
            </Col>
          </Row>
        </div>
        <div className="alarmRecord" ref={this.alarmRecord}>
          <div className="alarmRecordCopy"></div>
          <div className="infoTitle">2021年报警记录</div>
          <div
            className="offBtn"
            onClick={() => this.btnOff("none", "alarmRecord")}
          >
            X
          </div>
          <div id="echarts"></div>
        </div>
        <div className="alarmEquipment" ref={this.manage}>
          <div className="alarmEquipmentCopy"></div>
          <div className="infoTitle">当前报警设备</div>
          <div
            className="offBtn"
            onClick={() => this.btnOff("none", "alarmEquipment")}
          >
            X
          </div>
          <div ref={this.srcoll} className="srcollWapper">
            <App />
          </div>

          <div className="imgWapper" onClick={this.open}>
            <img
              src={this.state.flag ? imgBottom : imgTop}
              alt=""
              width="20px"
              height="20px"
            />
          </div>
        </div>
        <div className="btnBottom">
          <div
            className="one"
            onClick={() => this.btnOff("block", "serviceData")}
          >
            <img src={imgLeft} alt="" />
            <p>服务数据</p>
          </div>
          <div
            className="two"
            onClick={() => this.btnOff("block", "alarmRecord")}
          >
            <img src={imgCenter} alt="" />
            <p>报警设备</p>
          </div>
          <div
            className="three"
            onClick={() => this.btnOff("block", "alarmEquipment")}
          >
            <img src={imgRight} alt="" />
            <p>报警记录</p>
          </div>
        </div>
      </div>
    );
  }
}
