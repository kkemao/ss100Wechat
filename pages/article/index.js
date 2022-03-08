// pages/article/index.js
import {
    shareMessage
} from '../../common/index';
import util from '../../common/util';
import {
    getArticleByLabelId
} from '../../common/request';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "测评解读",
        labelList: [],
        currentLabelIndex: 0,
        labelArticleList: [],
        navbarHeight: 28
    },

    onShareAppMessage: res => shareMessage,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const currentLabelIndex = Number(options.currentIndex || this.data.currentLabelIndex);
        this.setData({
            currentLabelIndex,
        });
        let ll = app.globalData.labelList;
        ll = ll.filter(item => item.level === 1);
        // 适配自定义标题栏高度
        const res = wx.getSystemInfoSync();
        this.setData({
            navbarHeight: res.statusBarHeight,
            labelList: ll
        });
        this.getArticle(ll[currentLabelIndex].id);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    getArticle: async function (labelId) {
        try {
            const res = await getArticleByLabelId({
                labelId
            });
            if (res.statusCode === 200) {
                const data = res.data;
                this.setData({
                    labelArticleList: data.map(item => {
                        return {
                            ...item,
                            children: item.children.map(item => {
                                return {
                                    ...item,
                                    create_time: item.create_time.split(' ')[0],
                                    cover: util.imageAddPrefix(item.cover)
                                }
                            })
                        }
                    })
                })
            }
        } catch (error) {
            wx.showModal({
                content: error.message || '网络异常，请稍后再试。'
            })
        }
    },
    onClickLabel: function (e) {
        const currentIndex = e.currentTarget.dataset.currentindex;
        this.setData({
            currentLabelIndex: currentIndex,
            labelArticleList: []
        });
        this.getArticle(this.data.labelList[currentIndex].id);
    },
    seemore: function (e) {
        const {labelid, labelname} = e.currentTarget.dataset;
        wx.navigateTo({
          url: `/pages/articlebylabel/index?id=${labelid}&labelname=${labelname}`,
        })
    },
    onBack: function () {
        wx.reLaunch({
            url: '/pages/index/index',
        })
    }
})