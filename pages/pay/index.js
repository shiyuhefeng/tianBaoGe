/* 
  1.页面加载的时候
    1.从缓存中获取购物车数据 渲染到页面中
      这些数据 checked=true
  2.微信支付
    1.哪些人 哪些账号可以实现微信支付
      1.企业账号 
      2.企业账号的小程序后台中 必须 给开发者添加上白名单
        1.一个appid可以绑定多个开发者账号
        2.开发者公用APPID和开发权限


*/

Page({
  data: {
    address: {},
    cart: [],
    totalNUm: 0,
    totalPrice: 0
  },

  onShow() {
    // 获取地址信息
    var address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    var cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    var totalPrice = 0;
    var totalNum = 0;
    // 循环购物车
    for (var i = 0; i < cart.length; i++) {
      totalPrice += cart[i].goods_price * cart[i].num;
      totalNum += cart[i].num;
    }
    // 把购物车数组重新设置data和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  // 点击支付
  handleOrderPay() {
    // // 判断缓存中有没有token
    // var token = wx.getStorageSync('token');
    // // 判断
    // if (!token) {
    //   wx.navigateTo({
    //     // 添加收款码
    //     url: '/pages/auth/index',
    //   })
    // }


    // 购物车删除数据
    var cart = wx.getStorageSync('cart');
    cart = cart.filter(v => !v.checked);
    wx.setStorageSync('cart', cart);
    wx.navigateTo({
      url: '/pages/auth/index',
    })
  }

})
