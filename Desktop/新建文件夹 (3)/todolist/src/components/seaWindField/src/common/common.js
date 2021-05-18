import axios from 'axios'
import { Message } from 'element-ui'
export default {
  /*
  1 -- 时间间隔
  2 -- 查询类型
  3 -- 曲线类型1
  4 -- 曲线类型2
  5 -- 报表类型1
  6 -- 报表类型2
  */
  // 查询电场下拉框数据
  async findSelectByKey (key1, key2) {
    try {
      const res = await axios.get('/jsonFile/common/findSelectByKey' + key1 + '.json', {
        // 请求参数
        params: {
          // 可能需要的标识
          key1: key1,
          // 可能需要的标识
          key2: key2
        }
      })
      return res.data
    } catch (err) {
      console.log(err)
      Message.error('下拉框数据查询异常')
    }
  }
}
