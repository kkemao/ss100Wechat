import {
  shareMessage
} from '../../common/index';
import util from '../../common/util';
import {
  queryArticleList, getLabelList, getWXSession
} from '../../common/request';
const app = getApp();

Page({
  onShareAppMessage: res => shareMessage,
  data: {
    articleList: [],
    labelList: []
  },
  onLoad() {
    this.getArticleListFun();
    this.queryLabelListFun();

    // wx.login({
    //   timeout: 10000,
    //   success: res => {
    //     console.log('zkf-login', res);
    //     const { code } = res;
    //     getWXSession({code});
    //   }
    // })
    wx.getUserInfo({
      success: res => {
        console.log('zkf', res);
      }
    })
  },
  onReady() {},
  async queryLabelListFun() {
    const res = await getLabelList();
    if(res && res.statusCode === 200){
      this.setData({
        labelList: res.data
      });
      app.globalData.labelList = res.data;
    }
  },
  getArticleListFun: async function () {
    try {
      const res = await queryArticleList({page: 1, pageSize: 5});
      if (res && res.data) {
        const data = res.data.map(item => {
          return {
            ...item,
            create_time: item.create_time.split(' ')[0],
            cover: util.imageAddPrefix(item.cover)
          }
        })
        this.setData({
          articleList: data
        })
      }
    } catch (error) {

    }
  },
  onChooseAvatar: async function(e) {
    console.log('zkf--', e);
  },
  open: function (e) {
    wx.navigateTo({
      url: '/pages/question/index'
    });
  },
  methods: {
    onChooseAvatar: async function(e) {
      console.log('zkf', e);
    },
    getPhoneNumber: async function(e){
      console.log('zkf', e);
    }
  }
});