import { service } from '../utils/index'

//登录接口
export function loginHome(username, password) {
  return service({
    url: `/login`,
    method: 'POST',
    params: {
      username,
      password
    }
  })
}
//报警次数最多
export function alarmTop10(username) {
  return service({
    url: `/alarmTop10`,
    method: 'GET',
    params: {
      username
    }
  })
}
//最近10次报警
export function alarmLately10(username) {
  return service({
    url: `/alarmLately10`,
    method: 'GET',
    params: {
      username
    }
  })
}
//设备统计报警占比
export function pushStatistics(username) {
  return service({
    url: `/pushStatistics`,
    method: 'GET',
    params: {
      username
    }
  })
}
//设备统计报警占比
export function pushAlarmType(username) {
  return service({
    url: `/pushAlarmType`,
    method: 'GET',
    params: {
      username
    }
  })
}
//7天报警分析
export function alarmTopByDay(username) {
  return service({
    url: `/alarmTopByDay`,
    method: 'GET',
    params: {
      username
    }
  })
}

// ----------------------------------------↑首页部分↑-------------------------------------------------------


export function realDataByCode(username, code, pno, pageSize) {
  return service({
    url: `/realDataByCode`,
    method: 'GET',
    params: {
      username, code, pno, pageSize
    }
  })
}
export function getRegion(username, code, otherParam) {
  return service({
    url: `/getRegion`,
    method: 'GET',
    params: {
      username, code, otherParam
    }
  })
}
export function getProject(username, code, pno, pageSize) {
  return service({
    url: `/getProject`,
    method: 'GET',
    params: {
      username, code, pno, pageSize
    }
  })
}
export function getDevice(username, pid, pno, pageSize) {
  return service({
    url: `/getDevice`,
    method: 'GET',
    params: {
      username, pid, pno, pageSize
    }
  })
}
export function getDeviceRealTime(username, did) {
  return service({
    url: `/getDeviceRealTime`,
    method: 'GET',
    params: {
      username, did
    }
  })
}


// ----------------------------------------↑实时数据↑-------------------------------------------------------
export function alarmInfo(username, code, pno, pageSize) {
  return service({
    url: `/alarmInfo`,
    method: 'GET',
    params: {
      username, code, pno, pageSize
    }
  })
}
// ----------------------------------------↑报警信息↑-------------------------------------------------------