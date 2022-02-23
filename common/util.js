import systemConfig from '../config';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const setNavHeight = (setHeight) => {
  let navbarheight = 28;
  wx.getSystemInfo().then(res => {
    navbarheight = res.statusBarHeight;
    setHeight && setHeight(navbarheight);
  })
}

const urlTobase64 = (imgPath, callback) => {
  //读取图片的base64文件内容
  wx.getFileSystemManager().readFile({
    filePath: imgPath, //选择图片返回的相对路径
    encoding: 'base64', //编码格式
    success: res => {
      //成功的回调
      callback && callback(res.data)
    }
  })
}
const compressImg = (url, size, cb) => {
  const standardsize = 200000;
  const _s = Math.min(standardsize / size, 1);
  if (_s === 1) {
    console.log('图片未超过大小限制，不进行压缩');
    cb && cb(url);
  } else {
    console.log(`图片超过大小限制，压缩到${Math.floor(_s * 100)}`);
    wx.compressImage({
      src: url, // 图片路径
      quality: Math.floor(_s * 100), // 压缩质量
      success: res => {
        cb && cb(res.tempFilePath);
      },
      fail: () => {
        cb && cb(url);
      }
    })
  }

}

/**
 *  计算页面头部（包含设备状态栏）布局样式信息（供标题对齐胶囊菜单）
 * @param {number} statusBarHeight 手机状态栏的高度
 * @param {object} menuButtonData 胶囊菜单栏的信息
 * @returns {object} { headerHeight：number (头部高度),headerPaddingBottom: number（头部底部距页面内容的距离）, headerTitleTop: number （头部底部距页面内容的距离）}  
 */
const computedHeaderLayout = (statusBarHeight, menuButtonData) => {
  const {
    top, // 胶囊菜单距离头部状态栏顶部的距离 
    height, // 胶囊菜单的高度
  } = menuButtonData; // 胶囊菜单信息
  const diffHeight = top - statusBarHeight; // 胶囊菜单距离头部状态栏底部的距离
  const headerHeight = top + diffHeight + height;
  const headerPaddingBottom = diffHeight; // 保持胶囊菜单底部距离页面内容的差值，与距离头部状态栏底部的距离一致
  const headerTitleTop = top + height / 2 // 计算胶囊距离头部状态栏顶部的距离
  return {
    headerHeight,
    headerPaddingBottom,
    headerTitleTop
  }
}

/**
 *  数组序列化为一行n列
 * @param {array} source 需要被序列化的数组
 * @param {number} n  每行列数
 * @return {array} 被序列化的数组 
 */
const arraySerializeColumn = (source, n) => {
  if (typeof n !== 'number') {
    return source;
  }
  const target = [];
  let count = 0;
  source.forEach((item, index) => {
    if (!target[count]) {
      target[count] = [item];
    } else {
      target[count].push(item)
      if ((index + 1) % n === 0) {
        count++
      }
    }
  });
  return target;
};

/**
 *  生成随机uuid(网上抄的) 
 * @return {string} 生成随机uuid 
 */
const genUuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
  return uuid
};


/**
 * @description: 获取当前setQueryString拼接QueryString
 * @param {object} params 需要拼接的参数对象
 * @return {string} 拼接好的QueryString
 */
const setQueryString = (params) => {
  let queryString = '?';
  let keys = Object.keys(params);
  keys.forEach(key => {
    const value = params[key];
    if (
      value === undefined ||
      value === null ||
      Object.is(value, NaN) ||
      value === ''
    ) {
      return;
    }
    if (queryString === '?') {
      queryString += `${key}=${value}`;
    } else {
      queryString += `&${key}=${value}`;
    }
  });
  return queryString === '?' ? '' : queryString;
};

/**
 * @description: 适配IOS设备不识别new Date时间格式中的的"-"
 * @param {string} dateStr 需要兼容的日期字符串
 * @return {string} 
 */
const adapterIOSDate = (dateStr) => {
  if (dateStr && typeof dateStr === 'string') {
    return dateStr.replace(/-/g, '/');
  }
  return dateStr;
};
const imageAddPrefix = (url) =>{
  if(!url)return '';
  return url.startsWith("http") ? url : systemConfig.imagePrefix + url;
}

module.exports = {
  formatTime,
  urlTobase64,
  setNavHeight,
  compressImg,
  computedHeaderLayout,
  arraySerializeColumn,
  genUuid,
  setQueryString,
  adapterIOSDate,
  imageAddPrefix
}