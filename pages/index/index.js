import {
  shareMessage
} from '../../common/index';
import util from '../../common/util';
import systemConfig from '../../config';

import {
  queryArticleList,
  getLabelList,
  getWXSession,
  updateLogin,
  createAuth
} from '../../common/request';
const app = getApp();

Page({
  onShareAppMessage: res => shareMessage,
  data: {
    articleList: [],
    labelList: [],
    phoneNumber: '',
    userInfo: {},
    answerList: null,
    radarLabelList: [],
    radarValues: [15, 20, 20, 15, 20],
    hasTest: false,
    totalScore: app.globalData.testValue.reduce((a, b) => a + b, 0)
  },
  onShow: function () {
    // this.setRadarList(this.data.labelList);
    const scoreObj = wx.getStorageSync('ssScoreObj');
    const radarLabelList = [],
      radarValues = [];
    if (scoreObj) {
      this.setData({
        hasTest: true
      });
      Object.values(scoreObj).map(item => {
        radarLabelList.push({
          name: item.name,
          max: 20
        });
        radarValues.push((item.score || 0) * 5);
      });
      app.globalData.radarLabelList = radarLabelList;
      app.globalData.testValue = radarValues;
      this.setData({
        radarLabelList,
        radarValues,
        totalScore: radarValues.reduce((a, b) => a + b, 0)
      });
    }
  },
  async onLoad() {
    const phoneNumber = wx.getStorageSync('ssPhoneNumber');
    const userInfo = wx.getStorageSync('ssUserinfo');
    const answerList = wx.getStorageSync('ssAnswerList');
    if (phoneNumber) {
      this.setData({
        phoneNumber
      });
      app.globalData.phoneNumber = phoneNumber;
    }
    if (userInfo) {
      this.setData({
        userInfo
      })
      app.globalData.userInfo = userInfo;
    } else {
      wx.getUserInfo({
        success: res => {
          wx.setStorageSync('ssUserinfo', res.userInfo);
          this.setData({
            userInfo: res.userInfo
          });
          app.globalData.userInfo = res.userInfo;
        }
      })
    }
    if (answerList) {
      this.setData({
        answerList
      });
    }
    await this.getArticleListFun();
    await this.queryLabelListFun();
    await this.getSession();
  },
  onReady() {},
  async queryLabelListFun() {
    const res = await getLabelList();
    if (res && res.statusCode === 200) {
      this.setData({
        labelList: res.data
      });
      app.globalData.labelList = res.data;
      this.setRadarList(res.data);
    }
  },
  setRadarList: function (list) {
    // if (!app.globalData.radarLabelList.length) {
    const radarLabelList = list.filter(item => item.level === 1).map(item => ({
      name: item.name,
      max: 20
    }));
    app.globalData.radarLabelList = radarLabelList;
    this.setData({
      radarLabelList
    });
    // }
  },
  getArticleListFun: async function () {
    try {
      const res = await queryArticleList({
        page: 1,
        pageSize: 5
      });
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
  open: async function (e) {
    await updateLogin({
      phoneNumber: app.globalData.phoneNumber
    });
    wx.navigateTo({
      url: '/pages/question/index'
    });
  },
  getSession: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          const {
            code
          } = res;
          getWXSession({
            code
          }).then(res => {
            const {
              session_key,
            } = res.data;
            if (session_key) {
              wx.setStorageSync("ssSessionKey", session_key);
              resolve(session_key);
            } else {
              reject(res);
            }
          }).catch(err => {
            reject(err)
          })
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  },
  getPhoneNumber: async function (event) {
    console.log('zkf-[??????]-???????????????????????????', event.detail);
    if (event.detail.errMsg !== 'getPhoneNumber:ok') return;
    wx.showLoading({
      title: '??????????????????',
    })
    try {
      const {
        iv,
        encryptedData
      } = event.detail;
      const appid = systemConfig.appid;
    //   const sessionKey = await this.getSession();
      const sessionKey = wx.getStorageSync("ssSessionKey");
      const {
        userInfo
      } = this.data;
      const params = {
        iv,
        encryptedData,
        appid,
        sessionKey,
        avatar: userInfo.avatarUrl,
        // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        gender: userInfo.gender||0,
        accountName: userInfo.nickName
      };
      //??????????????
      if (!iv || !encryptedData || !appid || !sessionKey) {
        wx.hideLoading();
        console.log("zkf - ??????????????????????????????????????????????????????????????????!");
        wx.showToast({
          title: "???????????????????????????!",
          icon: 'none'
        })
      }
      //????????????????????
      wx.showLoading({
        title: '?????????',
      });
      const res = await createAuth(params);
      wx.hideLoading();
      if (res && res.data) {
        console.log('zkf-[??????]-??????????????????:', res.data);
        wx.setStorageSync('ssPhoneNumber', res.data.phoneNumber);
        this.setData({
          phoneNumber: res.data.phoneNumber
        });
        app.globalData.phoneNumber = res.data.phoneNumber;
        this.open();
      } else {
        wx.showToast({
          title: `${res.msg||'????????????'}`,
          icon: 'none'
        })
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: `????????????`,
        icon: 'none'
      })
    }
  },
  toarticle: function () {
    wx.navigateTo({
      url: '/pages/article/index',
    })
  },
  labelToArticle: function(e){
    if(!this.data.hasTest)return;
    wx.navigateTo({
      url: `/pages/article/index?currentIndex=${e.currentTarget.dataset.index}`,
    })
  }
});