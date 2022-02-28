import systemConfig from '../config';
const baseUrl = systemConfig.baseUrl;
const Api = {
    getAllArticle: `${baseUrl}/api/wechat/article/all`,
    queryLabel: `${baseUrl}/api/wechat/label/all`,
    getQuestion: `${baseUrl}/api/wechat/question/test`,
    getWXSession: `${baseUrl}/api/wechat/auth/session`,
    createAuth: `${baseUrl}/api/wechat/auth/create`,
    saveAnswer: `${baseUrl}/api/wechat/answer/save`,
    updateLogin: `${baseUrl}/api/wechat/updatelogin`,
    getArticleByLabelId: `${baseUrl}/api/wechat/getarticle`,
    getArticleByLabelParentId: `${baseUrl}/api/wechat/getarticle/labelparentid`,
    updateArticleCount: `${baseUrl}/api/wechat/updatearticlecount`,
}
export default Api;