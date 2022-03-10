import { request } from "../../request/index.js";
Page({

  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "代付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
  },

  onShow(options) {
    let pages = getCurrentPages()
    let currentpage = pages[pages.length - 1].options
    // console.log(currentpage)
    const { type } = currentpage
    this.getOrders(type)
    wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
    this.changeItemByIndex(type - 1);
    const token = wx.getStorageSync("token");
    // console.log(token);
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      }); return;
    }
  },

  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } })
    // console.log(res);
    this.setData({
      orders: res.orders
    })
  },

  changeItemByIndex(index) {
    var tabs = this.data.tabs;
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].isActive = false;
    }
    tabs[index].isActive = true;
    this.setData({
      tabs
    })
  },


  handleTabsItemChange(e) {
    var index = e.detail;
    this.changeItemByIndex(index);
  },
})