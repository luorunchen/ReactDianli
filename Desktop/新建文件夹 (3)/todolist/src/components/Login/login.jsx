import React, { Component } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginHome } from "../../api/index";
import { Link, Redirect } from "react-router-dom";

import "./login.css";
export default class login extends Component {
  constructor() {
    super();
  }

  onFinish = (values) => {
    console.log("Success:", values);
    loginHome(values.username, values.password).then((res) => {
      console.log(res.data.list[0].status);
      if (res.data.list[0].status == true) {
        message.success("登录成功", 1.5);
        sessionStorage.setItem("userName", values.username);
        this.props.history.push("/home/homePage");
      } else {
        message.error(res.data.list[0].mess);
      }
    });
  };
  render() {
    return (
      <div className="login">
        <h1>电力系统登录</h1>
        <Card style={{ width: 390 }}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item name="username">
              <Input
                onChange={this.inputhandle}
                size="large"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item name="password">
              <Input
                size="large"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              {/* <Link to="/home/homePage"> */}
              <Button
                block
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
              {/* </Link> */}
              {/* <Button block htmlType="submit" className="login-form-button">
                取消
              </Button> */}
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}
