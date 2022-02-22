import {
  shareMessage
} from '../../../common/index';

const app = getApp();

Component({
  properties: {
    info: Object
  },
  onShareAppMessage: res => shareMessage,
  data: {
  },
  methods: {
    navToDetail() {
      wx.navigateTo({
        url: `/pages/articledetail/index?id=${this.data.info.id}&info=${JSON.stringify(this.data.info)}`,
      })
    }
  }
});