/* 
  给输入框板顶 值改变事件  input事件
    1.获取到输入框的值
    2.合法性判断
    3.检验通过 把输入框的值 发送到后台
    4.返回的数据打印到页面上
  防抖（防止抖动）
    1.定时器实现（解决）
      1.定义全局定时器id
    2.防抖一般用于输入框 防止重复输入 重复发送请求
    3.节流一般用在页面上拉和下拉

*/
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消按钮是否显示
    isFocus: false,
    inpValue: ""
  },
  TimeId: -1,
  // 输入框的值 改变 就会触发事件
  handleInput(e) {
    // 1 获取输入框的值
    const value = e.detail.value;
    // 2 检查合法性
    clearTimeout(this.TimeId);

    if (!value.trim()) {
      // 值不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    // 显示取消按钮
    this.setData({
      isFocus: true
    })
    // 准备发送请求
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 500)
  },
  // 发送请求 获取搜索建议的函数
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    console.log(res);
    this.setData({
      goods: res.data.message
    })
  },
  // 点击取消按钮
  handleCancel(e) {
    clearTimeout(this.TimeId);
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    })
  },


})