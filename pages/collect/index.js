// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      }
    ],
  },
  onShow() {
    const collect = wx.getStorageSync('collect') || [];
    this.setData({
      collect
    })
  },
  handleTabsItemChange(e) {
    var index = e.detail;
    this.changeItemByIndex(index);
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
})