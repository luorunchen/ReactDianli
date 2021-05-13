import React, { Component } from "react";
import "./MonitorBackground.css";
import imgLeft from "../../assets/images/bigData_1.png";
import imgCenter from "../../assets/images/bigData_2.png";
import imgRight from "../../assets/images/bigData_3.png";
export default class MonitorBackground extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
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
  }
  render() {
    return (
      <div id="MonitorBackground">
        <div className="btnBottom">
          <div className="one">
            <img src={imgLeft} alt="" />
            <p>服务数据</p>
          </div>
          <div className="two">
            <img src={imgCenter} alt="" />
            <p>报警设备</p>
          </div>
          <div className="three">
            <img src={imgRight} alt="" />
            <p>报警记录</p>
          </div>
        </div>
      </div>
    );
  }
}
