// pages/user/index.js
Page({

  data: {
    userInfo: {},
    // 表示被收藏的商品的数量
    collectNums: 0

  },

  onShow() {
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync('collect') || [];

    this.setData({
      userInfo,
      collectNums: collect.length
    })
  }

})