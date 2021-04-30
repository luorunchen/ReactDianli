import React, { Component } from "react";
import { Row, Col } from "antd";
import "./PersonalCenter.css";
export default class PersonalCenter extends Component {
  render() {
    return (
      <div id="PersonalCenter">
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
