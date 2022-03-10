// components/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap(e) {
      // 获取索引
      var currentIndex = e.currentTarget.dataset.index
      // 触发 父组件中的事件  自定义
      this.triggerEvent("tabsItemChange", currentIndex);
    }
  }
})
