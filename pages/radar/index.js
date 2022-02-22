import * as echarts from '../../ec-canvas/echarts';
import {
  shareMessage
} from '../../common/index';
const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "rgba(128,128,128,0.1)",
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      // shape: 'circle',
      splitNumber: 1,
      splitArea: {
        areaStyle: {
          color: "rgba(49, 62, 230,0.1)"
        }
      },
      axisLine: {
        lineStyle: {
          color: 'gba(49, 62, 230,0.1)'
        }
      },
      axisName: {
        color: '#fff',
        formatter: function (value, indicator) {
          return '{a|' + value + '}';
        },
        rich: {
          a: {
            color: '#ccc',
            fontSize: '12rpx'
          },
          b: {
            color: 'yellow'
          },
          c: {
            backgroundColor: {
              image: '../../img/icons/bar.png'
            },
            width: 10,
            height: 10
          }
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.05)'
        }
      },
      center: ['50%', '53%'],
      indicator: app.globalData.labelList.filter(item => item.level === 1).map(item => ({
        name: item.name,
        max: 500
      }))
    },
    symbol: "true",
    series: [{
      name: '预算',
      type: 'radar',
      itemStyle: {
        color: 'transparent',
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(255,255,255,0.1)' // 0% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(255,255,255,0.5)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
      data: [{
        value: app.globalData.testValue,
        name: '预算'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

Component({
  onShareAppMessage: res => shareMessage,
  properties: {
    labelList: Object
  },
  data: {
    ec: {
      onInit: initChart
    }
  },
  attached() {
    
  }
});