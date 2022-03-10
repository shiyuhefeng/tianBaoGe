/* 
  1.获取用户的收货地址
    1.绑定点击事件
    2.调用小程序内置api 获取用户的收货地址 wx.chooseAddress
  2.获取收货地址
    1.获取本地存储中的地址数据
    2.把数据 设置给data中的一个变量
  3.页面加载完毕
    1.获取缓存中的购物车数组
    2.把购物车的数据 填充到data数组
  4.全选的实现
    1.onShow 获取缓存中的购物车数据
    2.根据购物车中的商品数据进行计算 所有的商品都被选中 checked=true 全选就被选中
  5.总价格和总数量
    1.都需要商品被选中
    2.都需要商品被选中 我们才拿它来计算
    3.遍历
    4.判断商品是否被选中
    5.总价格 += 商品的单价 * 商品的数量
    6.总数量 += 商品的数量
    6.把计算后的价格和数量 设置到data中即可
  6.商品的选中
    1.绑定change事件
    2.获取到被修改的商品对象
    3.商品对象的选中状态 取反
    4.重新填充回data和缓存中
    5.重新计算全选 总价格 总数量
  7.全选和反选
    1.全选复选框绑定事件 change
    2.获取data中的全选变量 allChecked
    3.直接取反allChecked
    4.遍历购物车数组 让里面的选中状态都按照 allChecked 改变而改变
    5.把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回缓存中
  8.商品数量的编辑
    1."+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
      1."+" "+1"
      2."-" "-1"
    2.传递被点击的商品id goods_id
    3.获取data中的购物车数组 来获取需要被修改的商品对象
    4.当购物车数量等于 1 同时用户点击减号按钮 弹窗提示(showModal)
      1.确定 执行删除
      2.取消 什么都不做
    5.直接修改商品对象的数量 Num
    6.把cart数组 重新设置回data中 和 缓存
  9.点击结算
    1.判断有没有收货地址信息
    2.判断用户有没有选购商品
    3.经过以上验证 跳转到 支付页面
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalNUm: 0,
    totalPrice: 0
  },



  onShow(e) {
    // 1.获取缓存中的收货地址信息
    var address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    var cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },

  async handleChoseAdress(e) {
    const address = await wx.chooseAddress();
    wx.setStorageSync("address", address)
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品的id
    var goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    var { cart } = this.data;
    // 找到被修改的商品对象
    var index = cart.findIndex(v => v.goods_id == goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 商品全选功能
  handleItemAllChecked(e) {
    // 获取data中的数据
    var { cart, allChecked } = this.data;
    // 修改值 
    allChecked = !allChecked;
    // 循环修改cart数组
    for (var i = 0; i < cart.length; i++) {
      cart[i].checked = allChecked;
    }
    // 修改后的值 填充回data和缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑
  handleItemNumEdit(e) {
    // 获取传递过来的参数
    var { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    var { cart } = this.data;
    // 找到需要修改的商品的索引
    var index = cart.findIndex(v => v.goods_id == id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      wx.showModal({
        title: "提示",
        content: "您是否删除？",
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1)
            this.setCart(cart);
          } else if (res.cancel) {
            console.log("点了取消");
          }
        }
      })
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },
  // 点击结算
  handlePay(e) {
    var { address, totalNum } = this.data;
    if (!address.userName) {
      wx.showToast({
        title: "您还没有选择收货地址",
        icon: "none"
      })
      return;
    }
    if (totalNum == 0) {
      wx.showToast({
        title: '您还没有选购商品',
        icon: "none"
      })
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },

  // 设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    var allChecked = true;
    // 总价格 总数量
    var totalPrice = 0;
    var totalNum = 0;
    // 循环购物车
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].checked) {
        totalPrice += cart[i].goods_price * cart[i].num;
        totalNum += cart[i].num;
      } else {
        allChecked = false;
      }
    }
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 把购物车数组重新设置data和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart);
  }
})
