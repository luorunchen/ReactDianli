import React, { Component } from "react";
import { Row, Col, Form, Input, Button, Checkbox } from "antd";
import "./PersonalCenter.css";
import { IdcardOutlined, LockOutlined } from "@ant-design/icons";
export default class PersonalCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "User",
    };
  }
  name = (data) => {
    this.setState({
      name: data,
    });
  };
  render() {
    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const tailLayout = {
      wrapperCol: {
        offset: 8,
        span: 16,
      },
    };
    const Demo = () => {
      const onFinish = (values) => {
        console.log("Success:", values);
      };

      const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
      };

      return (
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="旧密码"
            name="username"
            rules={[
              {
                required: true,
                message: "请输入正确的旧密码",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="password"
            rules={[
              {
                required: true,
                message: "请输入需要修改的新密码",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密码确认"
            name="passwordTrue"
            rules={[
              {
                required: true,
                message: "请输入需要修改的新密码",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      );
    };
    return (
      <div id="PersonalCenter">
        <Row gutter={20}>
          <Col span={5}>
            <div className="left">
              <div className="leftCopy">
                <div className="infoTitle">个人中心</div>
                <ul>
                  <li
                    onClick={() => this.name("User")}
                    className={this.state.name == "User" ? "bg" : ""}
                  >
                    <IdcardOutlined />
                    基础信息&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;＞
                  </li>
                  <li
                    onClick={() => this.name("password")}
                    className={this.state.name == "password" ? "bg" : ""}
                  >
                    <LockOutlined />
                    更改密码&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;＞
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col span={19}>
            <div className="right">
              <div className="rightCopy"></div>
              <div className="top">
                个人中心＞ {this.state.name == "User" ? "基础信息" : "更改密码"}
              </div>
              {this.state.name == "User" ? (
                <ul>
                  <li>
                    <span>单位档案：</span>深圳同创科技实业有限公司
                  </li>
                  <li>
                    <span>负责人：&#12288;</span>电力
                  </li>
                  <li>
                    <span>单位地址：</span>深圳市龙岗区真多利物业
                  </li>
                  <li>
                    <span>联系电话：</span>15625416589
                  </li>
                  <li>
                    <span>联系邮箱：</span>4654613134@qq.com
                  </li>
                  <li>
                    <span>接入单位：</span>121个
                  </li>
                  <li>
                    <span>接入设备：</span>260个
                  </li>
                </ul>
              ) : (
                <div className="wapper">
                  <Demo />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
