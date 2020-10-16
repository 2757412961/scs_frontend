<template>
  <div>
    <div class="globalNumBtn_class" :style="this.rightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="globalNumRightBtn" style="font-size: 25px;" :icon="this.btnIconData" circle
                   @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="predictPaper_panel" class="globalNumCollapse_class" v-model="activeNames" @change="rightBarHide">
      <el-collapse-item id="globalNumRightBar" name="rightSide"
                        style="border: 4px solid rgb(28, 94, 133);border-radius: 9px;"
                        :class="[this.rightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">

        <div class="globalNumPanelBody">
          <div class="predictPaper_title" style="margin-top: 4%">
            精细化数值预报产品
          </div>

         <!-- <div class="globalNumPanelBody_div"
               style="font-size: 14px; font-weight: normal;text-align: left;padding: 2%;padding-left: 6%">
            <div style="margin-bottom: 2%">气象起报时间：{{windForecastStart}}
              <el-select v-model="windTimeSelectedTime" placeholder="请选择" size="mini" style="width: 30%" @change="addPngChangeHandler">
                <el-option
                  v-for="item in windForecastTimeSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="margin-bottom: 2%">海浪起报时间：{{waveForecastStart}}
              <el-select v-model="waveTimeSelectedTime" placeholder="请选择" size="mini" style="width: 30%" @change="addPngChangeHandler">
                <el-option
                  v-for="item in waveForecastTimeSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="margin-bottom: 2%">预报时次：
              <el-select v-model="forecastSelectedTime" placeholder="请选择" size="mini" style="width: 30%" @change="addPngChangeHandler">
                <el-option
                  v-for="(item, index) in forecastTimeSel"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>-->

          <div class="predictPaper_title" style="font-weight: normal;margin-top: 4%">
            中国近海风浪预报查询
          </div>
          <div class="globalNumPanelBody_div">
            <div style="margin: 2%">
              <el-radio v-model="globalNumRadio" label="1" border @change="addPngChangeHandler">10米风场</el-radio>
              <el-radio v-model="globalNumRadio" label="2" border @change="addPngChangeHandler">海浪</el-radio>
            </div>
          </div>
          <div class="predictPaper_title" style="font-weight: normal;margin-top: 4%">
            中国近海风浪格点预报查询
          </div>
          <div class="globalNumPanelBody_div">
            <div style="margin: 2%">
              <el-radio v-model="globalNumRadio" label="3" border @change="addPngChangeHandler">10m风场(级)</el-radio>
              <el-radio v-model="globalNumRadio" label="4" border @change="addPngChangeHandler">波高(米)</el-radio>
            </div>
          </div>


          <div class="globalNumPanelBody_div" style="margin-top: 4%">
            <div class="globalNum_draw_div">
              <div style="width: 40%; font-size: 16px;margin-left: 5%">输入查询范围：</div>
              <div style="width: 26%; font-size: 16px; cursor: pointer;margin-left: 2%;margin-right: 2%;color: blue"
                   @click="drawRectangle(true)">拾取范围</div>
              <div style="width: 18%; font-size: 16px; cursor: pointer;margin-left: 1%;color: blue"
                   @click="drawRectangle(false)">清除</div>
            </div>
            <div>
              <label class="globalNumInputLabel">北</label>
              <el-input
                placeholder="上"
                v-model="northInput" size="mini" class="globalNumInput"
                @input="globalNumInputChange"
                clearable>
              </el-input>
            </div>
            <div>
              <label class="globalNumInputLabel">西</label>
              <el-input
                placeholder="左"
                v-model="westInput" size="mini" class="globalNumInput"
                @input="globalNumInputChange"
                clearable>
              </el-input>
              <el-input
                placeholder="右"
                v-model="eastInput" size="mini" class="globalNumInput"
                @input="globalNumInputChange"
                clearable>
              </el-input>
              <label class="globalNumInputLabel">东</label>
            </div>
            <div>
              <label class="globalNumInputLabel">南</label>
              <el-input
                placeholder="下"
                v-model="southInput" size="mini" class="globalNumInput"
                @input="globalNumInputChange"
                clearable>
              </el-input>
            </div>
          </div>

          <div class="predictPaper_title" style="margin-top: 6%;border: 0">
            {{windForecastStart}}&nbsp;&nbsp;{{this.windTimeSelectedTime.slice(8, 10)}}时
          </div>
        </div>

      </el-collapse-item>

    </el-collapse>

    <div id="gloNum_legendImgPanel" v-show="(this.globalNumRadio==1 || this.globalNumRadio==2)?true:false">
      <div class="gloNum_legendPanel">
          <transition name="el-zoom-in-center">
            <div v-show="showLegend" class="transition-box">
                <img style="border: 4px solid rgba(255, 255, 255,0.7);border-radius: 8px;height: 45px"
                     :src="this.globalNumRadio==1?this.wind_legend:this.wave_legend"></img>
            </div>
          </transition>
      </div>
      <div @click="showLegend = !showLegend" class="gloNum_legendPanel"
           style="bottom:16.5%; height: 2%;left:1.3%">
        <el-button type="info" size="small" style="background: rgba(97, 134, 180,0.8)" round>{{this.showLegend?'收起':'展开'}}</el-button>
      </div>
    </div>

<!--  预报时次和时间选择框  -->
    <div id="gloNum_forecastRatePanel">
      <div class="gloNum_forecastRatePanel">
          <transition name="el-zoom-in-center">
            <div v-show="showForecastRate" class="transition-box">
              <div class="gloNum_foreCheck">
                  <el-checkbox  :disabled="(this.globalNumRadio==2 || this.globalNumRadio==4)?true:false" label="101" v-model="gloNum_checkRadio" class="gloNum_elRadio_forecastRate">
                    气象起报时间：{{windForecastStart}}
                      <el-select  :disabled="(this.globalNumRadio==2 || this.globalNumRadio==4)?true:false"
                                  v-model="windTimeSelectedTime" placeholder="请选择" size="mini" style="width: 30%;opacity: 0.7;" @change="addPngChangeHandler">
                        <el-option
                          v-for="item in windForecastTimeSel"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-checkbox >
                  <el-checkbox  :disabled="(this.globalNumRadio==1 || this.globalNumRadio==3)?true:false" :selected="true" label="102" v-model="gloNum_checkRadio"  class="gloNum_elRadio_forecastRate">
                    海浪起报时间：{{waveForecastStart}}
                      <el-select  :disabled="(this.globalNumRadio==1 || this.globalNumRadio==3)?true:false"
                                  v-model="waveTimeSelectedTime" placeholder="请选择" size="mini" style="width: 30%;opacity: 0.7;" @change="addPngChangeHandler">
                        <el-option
                          v-for="item in waveForecastTimeSel"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-checkbox >
                <div class="block" style="margin-top: -1%;display: flex">
                  <span style="margin-top: 1%;margin-right: 1%; font-size: 14px;font-weight: bold;color: black">
                    预报时次：</span>
                  <el-slider style="width: 91%"
                    v-model="valueSlider"
                    :marks="sliderMarks"
                    :min="0"
                    :max="120"
                    :step="6" @change="addPngChangeHandler"
                    show-stops>
                  </el-slider>
                </div>
              </div>
            </div>
          </transition>
      </div>
      <div @click="showForecastRate = !showForecastRate" class="gloNum_forecastRatePanel"
           style="bottom:12%; height: 0%;right:1.3%; padding: 0">
        <el-button type="info" size="small" style="background: rgba(97, 134, 180,0.8)" round>{{this.showForecastRate?'收起':'展开'}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import xml2js from 'x2js'
  import {globalBus} from "../globalBus";
  import wind_legend from "../../assets/legend/10mWind.jpg"
  import wave_legend from "../../assets/legend/wave.jpg"

  export default {
    name: "GlobalNumerical",
    data() {
      return {
        sliderMarks: {
          0:'000', 6:'006', 12:'012', 18:'018', 24:'024', 30:'030', 36:'036',
          42:'042', 48:'048', 54:'054',60:'060', 66:'066', 72:'072', 78:'078',
          84:'084', 90:'090', 96:'096', 102:'102', 108:'108', 114:'114', 120:'120'
        },
        valueSlider: 12,
        gloNum_checkRadio: ['101','102'],
        wind_legend: wind_legend,
        wave_legend: wave_legend,
        showForecastRate: true, //预报时次显示
        showLegend: true, // legend显示
        fullViewExtent: [-180, -90, 180,90], //整个页面显示贴图
        globalNumRadio: '1', // 选择风浪/海浪【(格点)】查询
        forecastTimeSel: ['000', '006', '012','018', '024', '030', '036', '042', '048', '054',
          '060', '066', '072', '078', '084',
          '090', '096', '102', '108', '114', '120'],
        forecastSelectedTime: '000', //预报时次
        waveForecastTimeSel: [],
        waveTimeSelectedTime: '', //风浪选中的值 yyyymmddhh
        windForecastTimeSel: [],
        windTimeSelectedTime: '', //气象选中的值 yyyymmddhh
        windForecastStart: '加载中...',
        waveForecastStart: '加载中...',
        northInput: '',
        southInput: '',
        eastInput: '',
        westInput: '',
        rightIsHide: false,
        btnIconData: 'el-icon-d-arrow-right',//按钮图标
        activeNames: ['rightSide'],
      }
    },
    created() {
      this.initPage();
    },
    mounted() {
      this.fillLonlatInput()
    },
    methods: {
      // 输入框值改变事件
      globalNumInputChange(){
        this.fullViewExtent = [this.westInput, this.southInput, this.eastInput,this.northInput];
        this.addPngChangeHandler()
      },
      // 填充4个经纬度输入框的值
      fillLonlatInput(){
        globalBus.$on('fillGlobalNumLonlatInput',(leftBottom,rightTop) => {
          this.westInput = leftBottom[0];
          this.southInput = leftBottom[1];
          this.eastInput = rightTop[0];
          this.northInput = rightTop[1];
          this.fullViewExtent = [this.westInput, this.southInput, this.eastInput,this.northInput];
          // this.fullViewExtent = [leftBottom[0],leftBottom[1],rightTop[0],rightTop[1]];
        })
      },

      // 绘制矩形并拾取范围方法
      drawRectangle(flag){
        // 调用maplayout中的绘图方法
        if (!flag){  //如果点击了清除按钮，初始化拾取范围的值
          this.westInput= -180;
          this.southInput = -90;
          this.eastInput = 180;
          this.northInput = 90;
          this.fullViewExtent = [this.westInput, this.southInput, this.eastInput,this.northInput];
        }
        globalBus.$emit('drawRectangle', flag)
      },

      // 贴图事件触发
      addPngChangeHandler(){
        /**
         *  globalNumType
         *   1 === 气象图
         *   2 === 风浪图
         *   3 === 气象格点图
         *   4 === 风浪格点图
         * */
        switch (this.globalNumRadio) {
          case '1':  //风浪-10米风场
            this.addPngImage(this.windTimeSelectedTime, '/Wind_W10Contour_')
            break;
          case '2':  //风浪-海浪
            this.addPngImage(this.waveTimeSelectedTime, '/Wave_Swh_')
            break;
          case '3':  //格点-10米风场
            this.addPngImage(this.windTimeSelectedTime, '/Wind_W10Grid_')
            break;
          case '4':  //格点-波高
            this.addPngImage(this.waveTimeSelectedTime, '/Wave_SwhGrid_')
            break;
        }
      },

      // 贴图方法
      addPngImage(val, suffix){
        /**
         *  globalNumType
         *   1 === 气象图
         *   2 === 风浪图
         *   3 === 气象格点图
         *   4 === 风浪格点图
         * */
        //                                             图片Url                            贴图类型             可视范围
        globalBus.$emit('addPngImageGlobalNum', this.getPngImageUrl(val, suffix), this.globalNumRadio, this.fullViewExtent)
      },

      // 获取Png图片url
      getPngImageUrl(time, suffix){
        return 'http://' + this.$store.state.serverIP + '/img/ECMWF/' + time + suffix + parseInt(this.valueSlider) + '_' + time + '.png'
      },

      // 页面参数初始化
      initPage() {
        //读取气象08时预报xml(早的)
        this.getXmlByurl('/img/ECMWF/wind08.xml');
        //读取气象20时预报xml（晚的）
        this.getXmlByurl('/img/ECMWF/wind20.xml');
        //读取风浪08时预报xml(早的)
        this.getXmlByurl('/img/ECMWF/wave08.xml');
        //读取风浪20时预报xml（晚的）
        this.getXmlByurl('/img/ECMWF/wave20.xml');
      },

      // 气象起报时间   海浪起报时间  下拉菜单排序方法
      sortForecastSel(array, key){
        return array.sort(function(a,b){
          let x=parseInt(a[key]);
          let y=parseInt(b[key]);
          return ((x<y)?-1:((x>y)?1:0));
        });
      },
      // 发送 xml 获取请求的方法
      getXmlByurl(suffix) {
        this.$axios.get('http://' + this.$store.state.serverIP + suffix)
          .then(response => {
            let xmlText = response.data;
            let jsText = (new xml2js()).xml2js(xmlText);
            if (jsText.hasOwnProperty('MaxMinValue')) { //有值，加入到数组
              let dateData = jsText.MaxMinValue._date;
              if (dateData.length === 10) { // 10位的日期：yyyymmddhh
                if (suffix.indexOf('wind') != -1){
                  this.windForecastStart = dateData.slice(4, 6) + '月' + dateData.slice(6, 8) + '日';
                  let hour = dateData.slice(8, 10);
                  this.windForecastTimeSel.push({'value': dateData, 'label': hour + ' 时'});
                  this.sortForecastSel(this.windForecastTimeSel,'value')
                  this.windTimeSelectedTime = this.windForecastTimeSel[0].value

                  //时间加载完毕，默认贴图风场
                  this.addPngChangeHandler()

                } else if(suffix.indexOf('wave') != -1){
                  this.waveForecastStart = dateData.slice(4, 6) + '月' + dateData.slice(6, 8) + '日';
                  let hour = dateData.slice(8, 10);
                  this.waveForecastTimeSel.push({'value': dateData, 'label': hour + ' 时'});
                  this.sortForecastSel(this.waveForecastTimeSel,'value')
                  this.waveTimeSelectedTime = this.waveForecastTimeSel[0].value
                }
              }
            } else {
              //失败回调
              this.$confirm('后台日期格式错误！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            }
          })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },

      //侧边栏动画
      rightBarHide() {
        this.rightIsHide = !this.rightIsHide;
        if (this.rightIsHide) {
          this.btnIconData = 'el-icon-d-arrow-left'
          this.activeNames = ['no']
        } else {
          this.btnIconData = 'el-icon-d-arrow-right'
          this.activeNames = ['rightSide']
        }
      },

    },
  }
</script>
<style scoped>
  .gloNum_elRadio_forecastRate{
    margin-top: 1%;
    font-size: 14px;
    font-weight: bold;
    color: black
  }
  .globalNum_draw_div {
    display: -webkit-inline-box;
    width: 100%;
  }
  .gloNum_legendPanel {
    position: fixed;
    /*width: 40%;*/
    left: 1.3%;
    bottom: 8%;
  }
  .transition-box {
    height: 40px; /*图片的高度*/
    text-align: center;
    color: #fff;
    box-sizing: border-box;
  }
  .gloNum_forecastRatePanel{
    position: fixed;
    /*width: 40%;*/
    right: 3.5%;
    bottom: 4%;
    padding: 2%;
  }
  .gloNum_foreCheck {
    width: 65vw;
    background: rgba(238, 243, 239,0.8);
    border-radius: 8px;
    height: 220%;
    padding-left: 2%;
    padding-right: 2%;
  }

</style>

<style>
  #gloNum_forecastRatePanel .el-checkbox__label {
    margin-left: -10%;
  }

  .globalNumInputLabel {
    font-weight: initial;
    font-size: 16px;
  }

  .globalNumInput {
    width: 35%;
    margin-bottom: 2%;
  }

  .globalNumPanelBody_div {
    width: 96%;
    font-size: 20px;
    line-height: 1.7;
    font-weight: bold;
    border: 1px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
  }

  .globalNumPanelBody {
    height: calc(66vh);
  }

  .predictPaper_title {
    width: 96%;
    font-size: 20px;
    line-height: 1.7;
    font-weight: bold;
    border: 2px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
  }


  /** 右侧边栏**/
  #globalNumRightBtn .el-button {
    font-size: 30px;
  }

  .globalNumBtn_class {
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
  }

  .globalNumCollapse_class {
    margin-left: 78%;
    margin-top: 1%;
    width: 21%;
    position: fixed;
    border: 0;
  }

  #globalNumRightBar .el-collapse-item__header {
    font-size: 0px;
    height: 0px;
    border: 0;
  }

  #globalNumRightBar .el-collapse-item__content {
    padding-bottom: 15px;
  }

  #globalNumRightBar .el-collapse-item__wrap {
    border-radius: 8px;
  }

  .seaAreRightInner-container-right {
    animation: RightBarMoveRight linear;
    -webkit-animation: RightBarMoveRight linear;
    animation-fill-mode: forwards;
    animation-play-state: running;
    animation-duration: 0.2s;
  }

  .seaAreRightInner-container-left {
    animation: RightBarMoveLeft linear;
    -webkit-animation: RightBarMoveLeft linear;
    animation-fill-mode: forwards;
    animation-play-state: running;
    animation-duration: 0.3s;
  }

  /*右侧边栏向右移动*/
  @keyframes RightBarMoveRight {
    0% {
      transform: translateX(0);
      -webkit-transform: translateX(0);
    }
    100% {
      transform: translateX(110%);
      -webkit-transform: translateX(110%);
    }
  }

  /*右侧边栏向左移动*/
  @keyframes RightBarMoveLeft {
    0% {
      transform: translateX(120%);
      -webkit-transform: translateX(120%);
    }
    100% {
      transform: translateX(0);
      -webkit-transform: translateX(0);
    }
  }

  /** 右侧边栏**/
</style>
