import { request } from "../../request/index.js";
/* 
  点击轮播图显示 大图 
    1.给轮播图绑定点击事件
    2.调用小程序的api previewImage

  点击 加入购物车
    1.先绑定点击事件
    2.获取缓存中的购物车数据
    3.先判断 当前的商品是否已经存在于 购物车
    4.已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充到缓存中
    5.不存在于购物车数组中 直接给购物车数组添加一个新元素 带上一个购买数量属性num 重新把购物车的数组 填充到缓存中
  
  商品收藏功能
    1.页面onShow的时候 加载缓存中的商品收藏数据
    2.判断当前是行频是不是被收藏的
      1.是 改变页面的图标
      2.不是 ————
    3.点击商品收藏按钮
      1.判断商品是否存在于缓存数组之中
        1.存在 删除商品
        2.没有 把商品添加到收藏数组中
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },

  // 商品对象
  GoodsInfo: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    var goods_id = options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: goods_id });
    // console.log(res.data.message.pics[0].pics_mid);
    this.GoodsInfo = res.data.message;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断商品是否被收藏了
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.data.message.goods_name,
        goods_price: res.data.message.goods_price,
        // iphone部分手机 不识别 webp图片格式

        goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.data.message.pics
      }
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 构造要预览的图片数组
    var urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    // 接受传递过来的参数
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  // 点击商品收藏收藏
  handleCollect() {
    let isCollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    // 判断该商品是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 当index ！= -1
    if (index !== -1) {
      // 能找到 收藏过了
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: "取消收藏",
        icon: "success",
        mask: true
      })
    } else {
      // 没有收藏 添加商品对象
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true
      })
    }
    // 把数组存储到缓存之中
    wx.setStorageSync('collect', collect);
    // 修改data中的属性
    this.setData({
      isCollect
    })
  },

  // 点击加入购物车
  handleCartAdd(e) {
    // 获取缓存中的购物车 数组
    var cart = wx.getStorageSync('cart') || [];
    // 判断商品对象是否存在于购物车之中
    var index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index == -1) {
      // 不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 把购物车重新添加到缓存中
    wx.setStorageSync('cart', cart);
    // 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'scuess',
      mask: true,

    })
  }


})