import {
  shareMessage
} from '../../common/index';
const app = getApp();

Page({
  onShareAppMessage: res => shareMessage,
  data: {
    title: '评测得分',
  },
  onLoad: function (options) {

    // 适配自定义标题栏高度
    const res = wx.getSystemInfoSync();
    this.setData({
      navbarHeight: res.statusBarHeight
    });
  },
  onReady() {},
  gohome: function() {
    wx.navigateBack({
      delta: 10,
    })

    // relaunch会闪屏
    // wx.reLaunch({
    //   url: '/pages/index/index',
    // })
  }
});