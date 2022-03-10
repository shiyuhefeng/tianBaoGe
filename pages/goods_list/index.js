/* 
  1.用户上划页面 滚动条触底 开始加载下一页数据
    1.找到滚动条触底事件
    2.判断还有没有下一条数据
      1.获取到总页数
      2.获取到当前的页码
      3.判断当前页码 是否大于或者等于总页数
        总页数 = Math.ceil(总条数 / 页容量pagesize )
        表示 没有下一页数据

    3.加入没有下一条数据 弹出一个提示
    4.加入还有下一条数据 来加载下一页数据
      1.当前的页码++
      2.重新发送请求 
      3.数据请求回来  要对data中的数据进行拼接  而不是直接替换
  2.下啦刷新页面
    1.触发下拉刷新事件  需要在页面的json中开i一个配置项
      找到触发下拉的逻辑
    2.重置 数据 数组
    3.重置页码   设置为1
    4.重新发送请求
    5.数据关闭 手动关闭
*/

import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });

    var total = res.data.message.total;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },


  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    var index = e.detail;
    var tabs = this.data.tabs;
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].isActive = false;
    }
    tabs[index].isActive = true;
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      // console.log("没有下一页数据");
      wx - wx.showToast({
        title: '没有下一页数据'
      })
    } else {
      // console.log("有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh() {
    this.setData({
      goodsList: [],
    })
    this.QueryParams.pagenum = 1;
    this.getGoodsList();
  },

})