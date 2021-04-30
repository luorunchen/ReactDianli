import React from 'react';
//引入一些模块
import { BrowserRouter, Router, Route } from "react-router-dom";
import HomePage from '../components/homePage/homePage.jsx'
import Home from '../components/title/title.jsx'
import realTimeData from '../components/realTimeData/realTimeData.jsx'
import Login from '../components/Login/login.jsx'
import AlarmInfo from '../components/AlarmInfo/AlarmInfo.jsx'
import monitoringCenter from '../components/monitoringCenter/monitoringCenter.jsx'
import PersonalCenter from '../components/PersonalCenter/PersonalCenter.jsx'
function router() {
  return (
    <>
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/home/AlarmInfo" component={AlarmInfo} />
      {/* <Route path="/home" component={HomePage} /> */}
      <Route path="/home/homePage" component={HomePage} />
      {/* <Route path="/home" component={HomePage} /> */}
      <Route path="/home/realTimeData" component={realTimeData} />
      <Route path="/home/monitoringCenter" component={monitoringCenter} />
      <Route path="/home/PersonalCenter" component={PersonalCenter} />
    </>);
}

export default router;