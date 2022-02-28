import Api from './api';
import systemConfig from '../config';
import util from './util';

const errFun = info => {
    wx.showModal({
        title: '温馨提示',
        content: '系统繁忙，请稍后再试',
        success: res => {}
    })
}
const getToken = () => {
    let token = '';
    const userInfo = wx.getStorageSync('ss100-userInfo');
    if (userInfo && userInfo.token) {
        token = userInfo.token;
    }
    return token;
}
const commonAction = (type, apiAddress, params) => {
    return new Promise((resolve, reject) => {
        const config = {
            url: apiAddress,
            method: type,
            header: {
                token: getToken()
            }
        };
        switch (type.toLowerCase()) {
            case 'get':
                config.url += util.setQueryString(params || {});
                break;
            case 'post':
            case 'put':
                config.data = JSON.stringify(params);
                break;
            default:
                break;
        }
        wx.request({
            ...config,
            success: res => {
                const {
                    data
                } = res;
                if (res.statusCode >= 400) {
                    errFun(data);
                }
                resolve(data);
            },
            fail: err => {
                errFun(err.errMsg);
                reject(err);
            }
        });
    })
}

export const commonGet = (params, apiAddress) => commonAction('get', apiAddress, params);
export const commonPost = (params, apiAddress) => commonAction('post', apiAddress, params);
export const commonPut = (params, apiAddress) => commonAction('put', apiAddress, params);

export const getLabelList = () => commonGet({}, Api.queryLabel);
export const getArticleList = () => commonGet({}, Api.getAllArticle);
export const queryArticleList = (params) => commonPost(params, Api.getAllArticle);
export const getQuestionList = () => commonGet({}, Api.getQuestion);
export const getWXSession = (params) => commonGet(params, Api.getWXSession);
export const createAuth = (params) => commonPost(params, Api.createAuth);
export const saveAnswer = (params) => commonPost(params, Api.saveAnswer);
export const updateLogin = (params) => commonGet(params, Api.updateLogin);
export const getArticleByLabelId = (params) => commonGet(params, Api.getArticleByLabelId);
export const getArticleByLabelParentId = (params) => commonPost(params, Api.getArticleByLabelParentId);
export const updateArticleCount = (params) => commonGet(params, Api.updateArticleCount);