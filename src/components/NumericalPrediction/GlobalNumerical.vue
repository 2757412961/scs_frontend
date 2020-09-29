<template>
  <div>
    <div class="globalNumBtn_class" :style="this.rightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="globalNumRightBtn" style="font-size: 30px;" :icon="this.btnIconData" circle
                   @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="predictPaper_panel" class="globalNumCollapse_class" v-model="activeNames" @change="rightBarHide">
      <el-collapse-item id="globalNumRightBar" name="rightSide"
                        :class="[this.rightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">

        <div class="globalNumPanelBody">
          <div class="predictPaper_title">
            精细化数值预报产品
          </div>

          <div class="globalNumPanelBody_div">
            <div>输入查询范围：拾取范围 清除</div>
            <div>
              <!--              <label class="globalNumInputLabel">北</label>-->
              <el-input
                placeholder="北纬"
                v-model="northInput" size="mini" class="globalNumInput"
                clearable>
              </el-input>
            </div>
            <div>
              <!--              <label class="globalNumInputLabel">西</label>-->
              <el-input
                placeholder="西经"
                v-model="westInput" size="mini" class="globalNumInput"
                clearable>
              </el-input>
              <el-input
                placeholder="东经"
                v-model="eastInput" size="mini" class="globalNumInput"
                clearable>
              </el-input>
              <!--              <label class="globalNumInputLabel">东</label>-->
            </div>
            <div>
              <!--              <label class="globalNumInputLabel">南</label>-->
              <el-input
                placeholder="南纬"
                v-model="southInput" size="mini" class="globalNumInput"
                clearable>
              </el-input>
            </div>
          </div>

          <div class="globalNumPanelBody_div"
               style="font-size: 14px; font-weight: normal;text-align: left;padding: 2%;padding-left: 6%">
            <div style="margin-bottom: 2%">气象起报时间：{{windForecastStart}}
              <el-select v-model="windTimeSelectedTime" placeholder="请选择" size="mini" style="width: 30%">
                <el-option
                  v-for="item in windForecastTimeSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="margin-bottom: 2%">海浪起报时间：{{waveForecastStart}}
              <el-select v-model="waveTimeSelectedTime" placeholder="请选择" size="mini" style="width: 30%">
                <el-option
                  v-for="item in waveForecastTimeSel"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="margin-bottom: 2%">预报时次：
              <el-select v-model="forecastSelectedTime" placeholder="请选择" size="mini" style="width: 30%">
                <el-option
                  v-for="(item, index) in forecastTimeSel"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="predictPaper_title">
            中国近海风浪预报查询
          </div>
          <div class="globalNumPanelBody_div">
            <div>10m风场</div>
            <div>海浪</div>
          </div>
          <div class="predictPaper_title">
            中国近海风浪格点预报查询
          </div>
          <div class="globalNumPanelBody_div">
            <div>10m风场(级)</div>
            <div>波高(米)</div>
          </div>

        </div>

      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
  import xml2js from 'x2js'
  import {globalBus} from "../globalBus";

  export default {
    name: "GlobalNumerical",
    data() {
      return {
        forecastTimeSel: ['000', '006', '012', '018', '024', '030',
          '036', '042', '048', '054', '060', '066', '072', '078', '084',
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

    watch: {
        waveTimeSelectedTime(val){
          this.addPngImage(val);
        }
    },
    methods: {
      // 贴图方法
      addPngImage(val){
        globalBus.$emit('addPngImageGlobalNum', this.getPngImageUrl(val))
      },

      // 获取WindPng图片
      getPngImageUrl(time){
        return 'http://' + this.$store.state.serverIP + '/img/ECMWF/' + time + '' + '/Wind_W10Contour_0_' + time + '.png'
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

<style>

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
    height: calc(80vh);
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
