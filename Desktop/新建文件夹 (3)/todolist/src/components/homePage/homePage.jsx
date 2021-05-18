import React, { Component, useState } from "react";
import { Row, Col, Modal, Table, Timeline, Button, Input, Upload } from "antd";

// import ImgCrop from "antd-img-crop";

import { ClockCircleOutlined, ToolOutlined } from "@ant-design/icons";
import * as echarts from "echarts";
import "./homePage.css";
import TerminalInformation from "../TerminalInformation/TerminalInformation";
import {
  alarmTop10,
  alarmLately10,
  pushStatistics,
  pushAlarmType,
  alarmTopByDay,
  projectHome,
} from "../../api";
export default class homePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmTop10List: [],
      alarmLately10List: [],
      getDid: "",
    };
  }
  async componentDidMount() {
    let list = [];
    const userName = sessionStorage.getItem("userName");
    // 最多10次报警
    alarmTop10(userName).then((res) => {
      console.log(res);

      //React 数组渲染需要KEY值
      res.data.forEach((element, index) => {
        element.key = index + 1;

        list.push(element);
      });

      this.setState({
        alarmTop10List: list,
      });
      // console.log(this.state, 9999999999);
    });
    //最近10次报警
    alarmLately10(userName).then((res) => {
      console.log(res.data, "222");
      this.setState({
        alarmLately10List: res.data,
      });
    });
    //设备统计状态
    pushStatistics(userName).then((res) => {
      const myChart = echarts.init(
        document.getElementById("equipmentStatistics_left")
      );
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
            data: [
              {
                value: res.data.alar,
                name: "报警",
                itemStyle: { color: "rgb(194,53,49)" },
              },
              {
                value: res.data.normal,
                name: "正常",
                itemStyle: { color: "#159960" },
              },
            ],
          },
        ],
      });
    });
    //设备统计类型
    pushAlarmType(userName).then((res) => {
      console.log(res.data.mess, 99999);
      let data = [];
      res.data.mess.forEach((el) => {
        data.push({ name: el.name, value: el.num });
      });
      const myChart = echarts.init(
        document.getElementById("equipmentStatistics_right")
      );
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
    //7天报警分析
    alarmTopByDay(userName).then((res) => {
      const myChart = echarts.init(document.getElementById("top"));
      myChart.setOption({
        legend: {
          data: ["隐患值"],
          textStyle: {
            color: "#fft",
          },
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
          top: "20px",
          left: "30px",
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
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
            itemStyle: { color: "red" },
          },
        ],
      });
    });
    let citys = [];
    await projectHome(userName).then((res) => {
      console.log(res.data, "//////////////////////");

      res.data.list.forEach((el, index) => {
        console.log(el);
        let a = el.longitude.split(",");
        citys.push({
          lnglat: [a[0] * 1, a[1] * 1],
          style: el.aPid == "" ? 0 : 1,
        });
      });
    });
    console.log(citys, 6666666666);
    var map = new AMap.Map("map", {
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
    var style = [
      {
        url: "https://a.amap.com/jsapi_demos/static/images/mass0.png",
        anchor: new AMap.Pixel(6, 6),
        size: new AMap.Size(20, 20),
      },
      {
        url: "https://a.amap.com/jsapi_demos/static/images/mass1.png",
        anchor: new AMap.Pixel(4, 4),
        size: new AMap.Size(20, 20),
      },
      {
        url: "https://a.amap.com/jsapi_demos/static/images/mass2.png",
        anchor: new AMap.Pixel(3, 3),
        size: new AMap.Size(5, 5),
      },
    ];
    var mass = new AMap.MassMarks(citys, {
      opacity: 0.8,
      zIndex: 111,
      cursor: "pointer",
      style: style,
    });

    var marker = new AMap.Marker({ content: " ", map: map });

    mass.on("mouseover", function (e) {
      marker.setPosition(e.data.lnglat);
      marker.setLabel({ content: e.data.name });
    });

    mass.setMap(map);
  }
  // componentWillMount() {}
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

      return (
        <>
          <Timeline
            style={{
              color: "#fff",
              marginTop: "20px",
              fontSize: "16px",
            }}
          >
            {this.state.alarmLately10List.map((item, index) => {
              return (
                <Timeline.Item
                  key={index}
                  dot={
                    <ClockCircleOutlined
                      style={{
                        color: "#17bc76",
                      }}
                    />
                  }
                >
                  <p onClick={() => visibleShow(item.did)}>
                    <span style={{ color: "#17bc76" }}>{item.alarmDate}</span>
                    <ToolOutlined /> 处理
                  </p>
                  <div onClick={() => showModal(item.did)}>
                    <p> 设备编号:{item.imei} </p>
                    <p> 设备名称:{item.device_name} </p>
                    <p> 设备类型:{item.dType} </p>
                    <p> 报警值:{item.alarmValue} </p>
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
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
          {/* 处理弹窗 */}
          <Modal
            width={500}
            title="设备报警处理 "
            visible={visible}
            onOk={() => {
              setVisible(false);
            }}
            onCancel={() => {
              setVisible(false);
            }}
            okText="报警解除"
            okType="danger"
            // footer={null}
          >
            <p> 设备名称：</p>
            <Input />
            <p> 内容：</p>

            <Input.TextArea rows={4} />
            <Demo />
          </Modal>
        </>
      );
    };
    const Demo = () => {
      const [fileList, setFileList] = useState([]);

      const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
      };

      const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
      };

      return (
        <Upload
          action="http://121.36.6.48/dianLi/upload"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
        >
          {fileList.length < 4 && "+ 上传图片"}
        </Upload>
      );
    };

    const columns = [
      {
        title: "设备名称",
        dataIndex: "device_name",
        key: "device_name",
      },
      {
        title: "设备地址",
        dataIndex: "adss",
        key: "adss",
      },
      {
        title: "报警次数",
        dataIndex: "alarmNum",
        key: "alarmNum",
      },
      {
        title: "最后一次报警时间",
        dataIndex: "alarmTime",
        key: "alarmTime",
      },
    ];

    return (
      <div className="homePage">
        <Row gutter={20}>
          <Col span={19}>
            <Row gutter={20}>
              <Col span={11}>
                <div className="info">
                  <div className="infoCopy">
                    <div className="infoTitle">设备报警次数TOP10</div>
                    <Table
                      dataSource={this.state.alarmTop10List}
                      columns={columns}
                      pagination={{ position: ["none"] }}
                      scroll={
                        this.state.alarmTop10List.length > 4 ? { y: 150 } : {}
                      }
                      size="small"
                    />
                  </div>
                </div>
                <div className="info" style={{ marginTop: "30px" }}>
                  <div className="infoCopy">
                    <div className="infoTitle">设备统计</div>

                    <Row>
                      <Col span={11}>
                        <div id="equipmentStatistics_left"></div>
                      </Col>
                      <Col span={13}>
                        {" "}
                        <div id="equipmentStatistics_right"></div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col span={13}>
                <div className="infoMap">
                  <div className="infoMapCopy">
                    <div className="infoTitle">地图</div>
                    <div id="map"></div>
                  </div>
                </div>
              </Col>
            </Row>
            <div
              className="info"
              style={{ marginTop: "20px", height: "230px" }}
            >
              <div className="infoCopy">
                <div className="infoTitle">安全综合隐患指数TOP1</div>
                <div id="top"></div>
              </div>
            </div>
          </Col>
          <Col span={5}>
            <div className="infoAlarm">
              <div className="infoAlarmCopy">
                <div className="infoTitle">最近10次报警</div>
                <div className="scroll">
                  <App />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
