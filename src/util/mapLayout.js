import echarts from 'echarts/lib/echarts';
import utils from './util'

export default {
  typh_forecast_feature: null, // 预报起点的 Feature


  // 台风绘图
  drawTyph(data,) {

  },
  // 从mapLayout中转移
  typhChinaForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawChinaJapan()
    this.$axios
      .get(`/api/SCSServices/getTyphForecastChinaJapan.action`, {
        params: {
          typhNum: typhNum,
          staTime: typhTime
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'China';
          let nowPoint = fromLonLat([data[i]['lon'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, data[i]['strength'], countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawChinaJapan ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhUSAEuropeForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawUSAEurope() USA
    this.$axios
      .get(`/api/SCSServices/getTyphForecastUSAEurope.action`, {
        params: {
          typhNum: typhModelNum,
          staTime: typhTime,
          modelType: 'ENS'
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'USA';
          let strength = this.calStrengthBySpeed(data[i]['speed']);
          let nowPoint = fromLonLat([data[i]['lng'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, strength, countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawUSAEurope USA ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhEuropeForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawUSAEurope() Europe
    this.$axios
      .get(`/api/SCSServices/getTyphForecastUSAEurope.action`, {
        params: {
          typhNum: typhModelNum,
          staTime: typhTime,
          modelType: 'EENS'
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'Europe';
          let strength = this.calStrengthBySpeed(data[i]['speed']);
          let nowPoint = fromLonLat([data[i]['lng'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, strength, countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawUSAEurope Europe ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhTEPOForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawTEPO()
    this.$axios
      .get(`/api/SCSServices/getTyphForecastTEPO.action`, {
        params: {
          typhNum: typhModelNum,
          staTime: typhTime
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'TEPO';
          let strength = this.calStrengthBySpeed(data[i]['speed']);
          let nowPoint = fromLonLat([data[i]['lng'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, strength, countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawUSAEurope TEPO ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhJapanForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawChinaJapan()
    this.$axios
      .get(`/api/SCSServices/getTyphForecastJapan.action`, {
        params: {
          typhNum: typhNum,
          staTime: typhTime
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'Japan';
          let nowPoint = fromLonLat([data[i]['lon'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, data[i]['strength'], countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawJapan ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhKoreaForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawChinaJapan()
    this.$axios
      .get(`/api/SCSServices/getTyphForecastKorea.action`, {
        params: {
          typhNum: typhNum,
          staTime: typhTime
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'Korea';
          let nowPoint = fromLonLat([data[i]['lon'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, data[i]['strength'], countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawKorea ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhHongKongForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawChinaJapan()
    this.$axios
      .get(`/api/SCSServices/getTyphForecastHongKong.action`, {
        params: {
          typhNum: typhNum,
          staTime: typhTime
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'HongKong';
          let nowPoint = fromLonLat([data[i]['lon'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, data[i]['strength'], countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawHongKong ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
  typhTaiwanForecastDraw(countryLayer) {
    if (this.typh_forecast_feature == null) return;
    countryLayer.getSource().clear();

    let typhRouteInfo = this.typh_forecast_feature.get('data');
    let typhNum = typhRouteInfo.typhNum;
    let typhModelNum = this.typh_forecast_feature.get('typhModelNum');
    let typhTime = typhRouteInfo.routeTime;
    let cenX = typhRouteInfo.lon;
    let cenY = typhRouteInfo.lat;

    // function drawChinaJapan()
    this.$axios
      .get(`/api/SCSServices/getTyphForecastTaiwan.action`, {
        params: {
          typhNum: typhNum,
          staTime: typhTime
        }
      })
      .then((res) => {
        console.log(res);
        let data = res.data;
        let lastPoint = fromLonLat([cenX, cenY]);

        for (let i = 0; i < data.length; i++) {
          let type = 'Taiwan';
          let nowPoint = fromLonLat([data[i]['lon'], data[i]['lat']]);

          this.drawTyphForecastFeature(data[i], type, lastPoint, nowPoint, data[i]['strength'], countryLayer);
          lastPoint = nowPoint;
        }
      })
      .catch((res) => {
        this.$confirm('服务器失联！typhForecastDraw drawTaiwan ', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      });
  },
















}
