import {
  shareMessage
} from '../../common/index';
const app = getApp();

Page({
  onShareAppMessage: res => shareMessage,
  data: {
    title: '测评得分',
    score: 0,
  },
  onLoad: function (options) {
    const {
      score
    } = options;
    this.setData({
      score
    });
    // 适配自定义标题栏高度
    const res = wx.getSystemInfoSync();
    this.setData({
      navbarHeight: res.statusBarHeight
    });
  },
  onReady() {},
  goArticle: function () {
    wx.navigateTo({
      url: '/pages/article/index',
    })
  },
  gohome: function () {

    // echart不刷新 需研究 
    // wx.navigateBack({
    //   delta: 10,
    // })

    // relaunch会闪屏
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
});