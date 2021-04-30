import React, { Component } from "react";
import { Row, Col } from "antd";
import "./realTimeData.css";
import { realDataByCode } from "../../api/index.js";
export default class realTimeData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftList: [],
    };
  }
  componentDidMount() {
    const userName = sessionStorage.getItem("userName");
    realDataByCode(userName, "", 1, 1000).then((res) => {
      console.log(res.data.data, 2222);
      this.setState({
        leftList: res.data.data,
      });
    });
  }
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
