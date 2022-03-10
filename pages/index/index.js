import { request } from "../../request/index.js";
wx - Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数组
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //  https://api-hmugo-web.itheima.net/api/public/v1/goods/detail?goods_id=43986


  onLoad: function (options) {
    //   // 发送异步请求获取轮播图数据
    //   wx - wx.request({
    //     url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //     complete: (res) => { },
    //     fail: (res) => { },
    //     success: (result) => {
    //       this.setData({
    //         swiperList: result.data.message
    //       })
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        this.setData({
          swiperList: result.data.message
        })
      })
  },
  // 获取分类导航数据
  // https://api-hmugo-web.itheima.net/api/public/v1/home/catitems
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        this.setData({
          catesList: result.data.message
        })
      })
  },

  // 获取
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        var data = JSON.stringify(result.data.message);
        var data1 = data.replace(/goods_list/g, 'goods_list/index')
        var data2 = JSON.parse(data1)
        this.setData({
          floorList: data2
        })
      })
  }
})