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
  colorTyphWind: {
    "30KTS": {
      CN_Name: "7级",
      color: "#0aFA0d"
    },
    "8": {
      CN_Name: "8级",
      color: "#53D5CD"
    },
    "50KTS": {
      CN_Name: "10级",
      color: "#eec828"
    },
    "64KTS": {
      CN_Name: "11级",
      color: "#ff350e"
    },
  },
  colorTyphForecast: {
    "Core": {
      CN_Name: "中心",
      color: "#0aFA0d"
    },
    "Center": {
      CN_Name: "中央",
      color: "#53D5CD"
    },
    "Japan": {
      CN_Name: "日本",
      color: "#eec828"
    },
    "Europe": {
      CN_Name: "欧洲",
      color: "#ff350e"
    },
    "USA": {
      CN_Name: "美国",
      color: "#ff350e"
    },
    "TEPO": {
      CN_Name: "TEPO",
      color: "#ff350e"
    },
  },

  // 台风绘图
  drawTyph(data,) {

  },


}
