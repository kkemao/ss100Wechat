// pages/articlebylabel/index.js
import {
    shareMessage
} from '../../common/index';
import util from '../../common/util';
import {
    getArticleByLabelParentId,
} from '../../common/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        articleList: [],
        page: 1,
        pageSize: 10,
        total: 0
    },
    onShareAppMessage: res => shareMessage,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.labelname,
        })
        this.getArticleListByLabelId(options.id);
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

    getArticleListByLabelId: async function (id) {
        const {
            page,
            pageSize
        } = this.data;
        try {
            const res = await getArticleByLabelParentId({
                page,
                pageSize,
                label_children_id: id
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
                    articleList: data,
                    total: res.total
                })
            }
        } catch (error) {

        }
    },
})