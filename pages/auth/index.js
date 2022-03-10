import { request } from "../../request/index.js";
Page({
  onShow: function () {
    var timer = setTimeout(this.showMethod, 10000);
  },

  showMethod(e) {
    wx.showModal({
      title: '支付成功！',
      icon: "none",
      success: (res) => {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })

  },
})