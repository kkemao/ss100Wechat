import systemConfig from '../config';
const baseUrl = systemConfig.baseUrl;
const Api = {
    getAllArticle: `${baseUrl}/api/wechat/article/all`,
    queryLabel: `${baseUrl}/api/wechat/label/all`,
    getQuestion: `${baseUrl}/api/wechat/question/test`,
    getWXSession: `${baseUrl}/api/wechat/auth/session`
}
export default Api;