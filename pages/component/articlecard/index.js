import {
  shareMessage
} from '../../../common/index';
import util from '../../../common/util';

const app = getApp();

Component({
  properties: {
    info: Object
  },
  onShareAppMessage: res => shareMessage,
  data: {
  },
  // ready: function() {
  //   const info = this.data.info;
  //   info.cover = util.imageAddPrefix(info.cover);
  //   this.setData({info});
  // },
  methods: {
    navToDetail() {
      app.globalData.articleDetailInfo = this.data.info;
      wx.navigateTo({
        url: `/pages/articledetail/index?id=${this.data.info.id}`,
      })
    }
  }
});