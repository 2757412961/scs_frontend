import echarts from 'echarts/lib/echarts';
import utils from './util'

export default {
  // 台风颜色变量
  colorTyphStrength: {
    "TD": {
      name: "热带低压",
      color: "#00F806"
    },
    "TS": {
      name: "热带风暴",
      color: "#0062FF"
    },
    "STS": {
      name: "强热带风暴",
      color: "#FFF500"
    },
    "TY": {
      name: "台风",
      color: "#F8AD09"
    },
    "STY": {
      name: "强台风",
      color: "#F56CF0"
    },
    "SUPERTY": {
      name: "超强台风",
      color: "#FA020b"
    },
  },
  colorTyphSpeed: {
    "7": {
      name: "7级",
      color: "#3CC239"
    },
    "8": {
      name: "8级",
      color: "#53D5CD"
    },
    "10": {
      name: "10级",
      color: "#B89A20"
    },
    "12": {
      name: "11级",
      color: "#F10600"
    },
  },

  // 台风绘图
  drawTyph(data,) {

  },


}
