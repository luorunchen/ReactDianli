import React, { Component, useState } from "react";
import { Row, Col, Tree, Card, Divider, Button } from "antd";
import "./Alarm.css";
import Demo from "../Demo/Demp";
import img from "../../assets/images/供电公司.png";
export default class realTimeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rightList: [],
      title: "新能源电力安防一体化监测平台",
    };
  }
  componentDidMount() {}
  //更新右边的展示数据
  getName = (name) => {
    this.setState({
      rightList: [...name],
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
    console.log(this.state.title);
  };
  MouseEnterhandle = (data) => {
    console.log(data);
    var lnglat = data.longitude.split(",");
    var map = new AMap.Map("map", {
      resizeEnable: true, //是否监控地图容器尺寸变化
      zoom: 15, //初始化地图层级
      center: lnglat,
      // layers: [
      //   // 卫星
      //   new AMap.TileLayer.Satellite(),
      //   // 路网
      //   new AMap.TileLayer.RoadNet(),
      // ], //初始化地图中心点
    });

    var marker = new AMap.Marker({
      position: lnglat,
    });
    marker.setMap(map);
    var content =
      `<div class="info-title">${data.adss}</div><div class="info-content">` +
      `<img src=${img}>` +
      `<ul>
        <li>设备名称：${data.device_name}</li>
        <li>设备类型：${data.dType}</li>
        <li>报警类型：${data.typeName}</li>
        <li>联系电话：${data.zPhone}</li>
        <li> 
            <button >
                报警处理
            </button></li>
      </ul>`;
    var infowindow1 = new AMap.AdvancedInfoWindow({
      content: content,
      offset: new AMap.Pixel(0, -30),
    });
    infowindow1.open(map, lnglat);
  };
  render() {
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
                  pageState={2000}
                />
              </div>
            </div>
          </Col>
          <Col span={19}>
            <div className="right">
              <div className="rightCopy">
                <span>{this.state.title}</span>
                <Divider style={{ borderColor: "#08382A", borderWidth: 2 }} />

                <Row gutter={10}>
                  <Col span={5}>
                    <div className="scroll">
                      {this.state.rightList.map((el, index) => {
                        return (
                          <div
                            className="card"
                            key={index}
                            onMouseEnter={() => this.MouseEnterhandle(el)}
                          >
                            <Row>
                              <Col span={6}>
                                <img src={img} alt="" />
                              </Col>
                              <Col span={18}>
                                <p>{el.device_name}</p>
                                <span>{el.alarmTime}</span>
                              </Col>
                              <ul>
                                <li>
                                  <span>设备类型：</span>
                                  {el.dType}
                                </li>
                                <li>
                                  <span>报警类型：</span>
                                  {el.typeName}
                                </li>
                                <li>
                                  <span>联系人 &nbsp; &nbsp;：</span>
                                  {el.zName}
                                </li>
                                <li>
                                  <span>联系电话：</span>
                                  {el.zPhone}
                                </li>
                                <li>
                                  <span>设备地址：</span>
                                  {el.adss}
                                </li>
                              </ul>
                            </Row>
                          </div>
                        );
                      })}
                    </div>
                  </Col>

                  <Col span={19}>
                    <div id="map"></div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
