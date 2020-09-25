import echarts from 'echarts/lib/echarts';
import utils from './util'

export default {
  // 台风颜色变量
  colorTyphStrength: {
    "TD": {
      CN_Name: "热带低压",
      color: "#00F806"
    },
    "TS": {
      CN_Name: "热带风暴",
      color: "#0062FF"
    },
    "STS": {
      CN_Name: "强热带风暴",
      color: "#FFF500"
    },
    "TY": {
      CN_Name: "台风",
      color: "#F8AD09"
    },
    "STY": {
      CN_Name: "强台风",
      color: "#F56CF0"
    },
    "SUPERTY": {
      CN_Name: "超强台风",
      color: "#FA020b"
    },
  },
  colorTyphSpeed: {
    "30KTS": {
      CN_Name: "7级",
      color: "#3CC239"
    },
    "8": {
      CN_Name: "8级",
      color: "#53D5CD"
    },
    "50KTS": {
      CN_Name: "10级",
      color: "#B89A20"
    },
    "64KTS": {
      CN_Name: "11级",
      color: "#F10600"
    },
  },

  // 台风绘图
  drawTyph(data,) {

  },


}
