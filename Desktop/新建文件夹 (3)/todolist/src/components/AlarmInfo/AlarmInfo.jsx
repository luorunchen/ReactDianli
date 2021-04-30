import React, { Component } from "react";
import { Row, Col } from "antd";
import "./Alarm.css";
export default class AlarmInfo extends Component {
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
              </div>
            </div>
          </Col>
          <Col span={19}>
            <div className="right">
              <div className="rightCopy"></div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
