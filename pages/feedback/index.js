// pages/feedback/index.js
Page({

  /**
   * 点击“+”触发tap事件
   *  1.调用小程序内置的选择图片的api
   *  2.获取图片路径 数组
   *  3.把图片路径 存储到 data变量中
   *  4.页面就可以根据 图片数组 进行循环显示 自定义组件
   * 点击自定义图片组件
   *  1.获取被点击的元素的索引
   *  2.获取data中的图片数组
   *  3.根据索引 删除对应的元素
   *  4.把数组重新设置回data中
   * 用户点击提交按钮
   *  1.获取文本域的内容
   *    1.data中定义变量 表示 输入框内容
   *    2.文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中
   *  2.对文本内容做合法性的验证
   *  3.验证通过  用户选择的图片  上传到专门的图片服务器  返回图片外网链接
   *  4.文本域 和 外网的图片的路径一起提交到服务器
   *  5.清空内容
   *  6.返回到上一页面
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 的数组
    chooseImgs: [],
    // 文本域中的内容
    textVal: ""
  },
  // 外网的图片路径数组
  upLoadImgs: [],
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
  // 点击加号 选择图片事件
  handleChooseImg() {
    // 调用小程序内置的选择图片的api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          // 把图片数组拼接
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },
  // 点击了自定义图片组件
  handleRemoveImg(e) {
    // 获取被点击的组件的index
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除数组
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击事件
  handleFormSubmit(e) {
    // 获取文本域中的内容
    const { textVal, chooseImgs } = this.data;
    // 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: "none",
        mask: true
      });
      return;
    }
    wx.showToast({
      title: '正在上传中...',
      mask: true
    })
    // 判断有没有上传的图片数组
    if (chooseImgs.length != 0) {
      // 准备上传图片 到专门的图片服务器
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片上传到哪里
          url: "https://www.hualigs.cn/api/upload",
          formData:{
            token: "c4f63ccf110fed2a193930b03da7a6d1",
            apiType: "ali",
            // privateStorage: "ftp"
          },

          // 被上传的图片的路径 
          filePath: v,
          // 上传的文件的名称 后台来获取文件 file
          name: "file",
          success: (res) => {
            console.log(res);
            let url = JSON.parse(res.data).url;
            this.upLoadImgs.push(url);

            // 所有的图片都上传完毕 才触发
            if (i == chooseImgs.length - 1) {
              wx.hideLoading();

              console.log("已经提交到后台中");
              this.setData({
                textVal: "",
                chooseImgs: [],
              })
              wx.navigateBack({
                delta: 1
              })
            }

          }
        })
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1
      })
    }

  }

})