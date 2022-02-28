import {
  shareMessage
} from '../../common/index';
import util from '../../common/util';
import {
  updateArticleCount
} from '../../common/request';
const app = getApp();

Page({
  onShareAppMessage: res => shareMessage,
  data: {
    cover: "http://localhost:8080/fileUpload/2022-02-11/zengkefan__12__1644574928850.jpeg",
    info: {
      // title: "七夕消息推送模板，直接",
      // sketch: "七夕商家大战，其本质是用户注意力的战争。循规蹈矩将被打入冷宫，打破常规放有一线生机。",
      // create_time: "2022-02-18",
      // auth: '' || "转载",
      // labelname: "互联网",
      // cover: "http://localhost:8080/fileUpload/2022-02-11/zengkefan__12__1644574928850.jpeg"
    }
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '文章详情',
    })
    if (app.globalData.articleDetailInfo) {
      let detail = app.globalData.articleDetailInfo;
      updateArticleCount({id: detail.id});
      // infos = infos.replace(/\n/g,"\\n").replace(/\r/g,"\\r");
      // console.log('zkf-----', infos);
      // const detail = JSON.parse('zkf', infos)
      const content = JSON.parse(detail.content.replace(/\n/g,"\\n").replace(/\r/g,"\\r")).map(item => {
        if (item.type === 1) {
          item.content = util.imageAddPrefix(item.content);
        }
        return item;
      });
      this.setData({
        info: {
          ...detail,
          cover: util.imageAddPrefix(detail.cover),
          content
        }
      });
    }
  },
  onReady() {},
  open: function (e) {
    wx.navigateTo({
      url: '../' + e.target.dataset.chart.id + '/index'
    });
  }
});