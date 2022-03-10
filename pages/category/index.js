import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的商品数据
    rightContent: [],
    // 被点击左侧的菜单
    currentIndex: 0,
    // 右侧内容滚动条的距离
    scrollTop: 0
  },

  // 接口的返回数据
  Cates: [],

  onLoad: function (options) {
    /*
      1.判断本地存储冲有没有旧数据
      2.没有旧数据 直接发送请求
      3.有旧的数据 同时 旧的数据没有过期 就使用本地存储中的旧数据即可
    */
    // 1.获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {
      // 不存在就发送请求 获取数据
      this.getCates();
    } else {
      // 有旧的数据存在
      // 定义一个过期时间
      if (Date.now() - Cates.time > 1000 * 100) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        var leftMenuList = this.Cates.map(v => v.cat_name);
        var rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  async getCates() {
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     this.Cates = res.data.message;

    //     // 把接口的数据存储到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //     // 构造左侧的大菜单数据
    //     var leftMenuList = this.Cates.map(v => v.cat_name);
    //     // 构造右侧的大菜单数据
    //     var rightContent = this.Cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })

    //   })

    // 使用es7的async await来发送请求
    const res = await request({ url: "/categories" });
    this.Cates = res.data.message;

    // 把接口的数据存储到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    // 构造左侧的大菜单数据
    var leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的大菜单数据
    var rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧的点击事件
  handleItemTap(e) {
    // console.log(e)
    var index = e.currentTarget.dataset.index
    var rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右边内容 scroll-view标签的离顶部的距离
      scrollTop: 0
    })
  }

})