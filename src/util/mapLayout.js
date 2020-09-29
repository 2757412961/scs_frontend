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

  // 台风风圈颜色变量
  colorTyphWind: {
    "30KTS": {
      CN_Name: "7级",
      color: "#20fa5a"
    },
    "8": {
      CN_Name: "8级",
      color: "#53D5CD"
    },
    "50KTS": {
      CN_Name: "10级",
      color: "#ffd82b"
    },
    "64KTS": {
      CN_Name: "11级",
      color: "#ff350e"
    },
  },

  // 台风预报颜色变量
  colorTyphForecast: {
    "Center": {
      CN_Name: "中心",
      color: "#C9172C"
    },
    "China": {
      CN_Name: "中国",
      color: "#1B08A3"
    },
    "Japan": {
      CN_Name: "日本",
      color: "#050505"
    },
    "Europe": {
      CN_Name: "欧洲",
      color: "#E7F350"
    },
    "USA": {
      CN_Name: "美国",
      color: "#15cd53"
    },
    "TEPO": {
      CN_Name: "TEPO",
      color: "#BA2DA9"
    },
  },

  // 台风绘图
  drawTyph(data,) {

  },


}
