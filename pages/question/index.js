import {
  shareMessage
} from '../../common/index';
import {
  getQuestionList,
  saveAnswer
} from '../../common/request';
import util from '../../common/util';
const app = getApp();

/**
 * question type值   1 单选  2 多选  3 判断
 * 答案  0 => T    1 => F
 * 答案  0 => A    1 => B    2 => C   3 => D   如ACD 对应023
 */
Page({
  onShareAppMessage: res => shareMessage,
  currentStartTime: new Date().getTime(),
  answerList: [],
  data: {
    questionList: [],
    currentIndex: 0,
    currentQuestionInfo: {},
    // answerList: [],
    selectKey: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    tfKey: ['T', 'F'],
    questionType: ['', '单选题', '多选题', '判断题'],
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '测评',
    })
    this.currentStartTime = new Date().getTime();
    this.getQuestionListFun();
  },
  onReady() {},

  getQuestionListFun: async function () {
    try {
      const res = await getQuestionList();
      if (res && res.data) {
        const {
          data
        } = res;
        this.setData({
          questionList: data.map(item => {
            return {
              ...item,
              cover: util.imageAddPrefix(item.cover),
              options: item.type === 3 ? [{
                value: "正确",
                checked: 0
              }, {
                value: "错误",
                checked: 0
              }] : item.options.split('||').map(i => ({
                value: i,
                checked: 0
              }))
            }
          })
        });
      } else {
        wx.showModal({
          content: res.msg || '网络异常，请稍后再试。'
        })
      }
    } catch (error) {
      wx.showModal({
        content: error.message || '网络异常，请稍后再试。'
      })
    }
  },
  checkboxChange: function (e) {
    const {
      currentIndex,
      questionList
    } = this.data;
    let {
      options
    } = questionList[currentIndex];
    options = options.map(item => {
      return {
        ...item,
        checked: 0
      }
    });
    if (questionList[currentIndex].type === 2) {
      e.detail.value.map(item => {
        options[item].checked = 1;
      });
    } else if (e.detail.value.length) {
      options[e.detail.value[e.detail.value.length - 1]].checked = 1;
    }
    questionList[currentIndex].options = options;
    this.setData({
      questionList
    });
    this.changeAnswerList();
  },
  consoleLog: function () {
    console.log('zkf', this.answerList);
  },
  changeAnswerList: function () {
    const {
      currentIndex,
      questionList,
      selectKey,
      tfKey
    } = this.data;
    // 保存当前题目的答案
    const ans = [];
    questionList[currentIndex].options.map((item, index) => {
      if (item.checked) {
        ans.push(questionList[currentIndex].type === 3 ? tfKey[index] : selectKey[index]);
      }
    });
    const ct = new Date().getTime() - this.currentStartTime;
    const currentAnswer = this.answerList[currentIndex] || {};

    // 如果是返回上一题 需要重新处理答题记录把答题时间增加
    currentAnswer.answer = ans.join('');
    currentAnswer.questionId = questionList[currentIndex].id;
    currentAnswer.labelId = questionList[currentIndex].parent_id;
    currentAnswer.costTime = (currentAnswer.costTime || 0) + ct;
    currentAnswer.defaultAnswer = questionList[currentIndex].answer;
    this.answerList[currentIndex] = currentAnswer;
  },
  changeProgressPrev: function () {
    this.changeProgress(-1);
  },
  changeProgressNext: function () {
    this.changeProgress(1);
  },
  changeProgress: function (num) {
    const {
      currentIndex,
      questionList,
    } = this.data;
    this.changeAnswerList();
    if (currentIndex + num > questionList.length) {
      return;
    }
    this.setData({
      currentIndex: currentIndex + num
    })
    this.currentStartTime = new Date().getTime();
  },
  openresult: async function () {
    const {
      phoneNumber
    } = app.globalData;
    if (!phoneNumber) {
      wx.showModal({
        content: '暂无权限，请先注册'
      })
      return;
    }

    try {
      const res = await saveAnswer({
        phoneNumber,
        answerList: JSON.stringify(this.answerList)
      });
      const rightAnswer = this.answerList.filter(item => item.defaultAnswer === item.answer);
      this.labelScore(rightAnswer);
      wx.showToast({
        title: '测评成功',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/result/index?score=${rightAnswer.length * 5}`,
            })
          }, 2000)
        }
      })
    } catch (error) {
      wx.showModal({
        content: error.message
      })
    }
  },
  labelScore: function (rightAnswer) {
    const labelList = app.globalData.labelList.filter(item => item.level === 1);
    const al = {};
    labelList.map(item => {
      al[item.id] = {
        name: item.name,
        score: 0
      }
    });

    rightAnswer.map(item => {
      al[item.labelId].score = al[item.labelId].score + 1;
    });
    wx.setStorageSync('ssScoreObj', al)
  }
});