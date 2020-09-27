<template>
  <div>
    <div class="predictBtn_class" :style="this.rightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="rightBtn" style="font-size: 30px;" :icon="this.btnIconData" circle
                   @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="predictPaper_panel" class="predictPaper_class" v-model="activeNames" @change="rightBarHide">
      <el-collapse-item id="rightBar" name="rightSide"
                        :class="[this.rightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">
        <div class="predictPaper_title">
          预报单
        </div>
        <div class="predictionContent_class">

          <div id="seaAreaPrediction" class="seaAreaPrediction">
            <div class="prediction_title">
              <span style="">海区预报单</span>
            </div>

            <div class="predictDivBtn_class" @click="seaAreaLoadFile">
              <span>加载</span>
            </div>

            <div class="predictionLeftSel">
              <span style="">年：</span>
              <el-select style="width: 60%" v-model="seaAreaSelectedYear" placeholder="请选择" size="mini" @change="seaAreaYearChange">
                <el-option
                  v-for="(item,index) in seaAreaYear"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style="">月：</span>
              <el-select style="width: 60%" v-model="seaAreaSelectedMonth" placeholder="请选择" size="mini" @change="seaAreaMonthChange">
                <el-option
                  v-for="(item,index)  in seaAreaMonth"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>

            <div class="predictionLeftSel">
              <span style="">日：</span>
              <el-select style="width: 60%" v-model="seaAreaSelectedDay" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item,index)  in seaAreaDay"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style="">20时</span>
              <div style="width: 60%; display: inline-block;">
              </div>
            </div>


          </div>

          <div id="lawAreaPrediction" class="seaAreaPrediction">
            <div class="prediction_title">
              <span style="">执法预报单</span>
            </div>

            <div class="predictDivBtn_class">
              <span style="">加载</span>
            </div>

            <div class="predictionLeftSel">
              <span style="">年：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style="">月：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionLeftSel">
              <span style="">日：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style="">20时</span>
              <div style="width: 60%; display: inline-block;">
              </div>
            </div>
          </div>

          <div id="typhoonPrediction" class="seaAreaPrediction">
            <div class="prediction_title">
              <span style="">台风预报单</span>
            </div>

            <div class="predictDivBtn_class">
              <span style="">加载</span>
            </div>

            <div class="predictionLeftSel" style="width: 90%">
              <span style="">台风编号：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel"  style="width: 90%">
              <span style="">预报次数：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionLeftSel"  style="width: 90%">
              <span style="">发布时间：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>

          <div id="tropicsPrediction" class="seaAreaPrediction">
            <div class="prediction_title">
              <span style="">热带低压消息</span>
            </div>

            <div class="predictDivBtn_class">
              <span style="">加载</span>
            </div>

            <div class="predictionLeftSel" style="width: 90%">
              <span style="">编号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel"  style="width: 90%">
              <span style="">预报次数：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionLeftSel"  style="width: 90%">
              <span style="">发布时间：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>

          <div id="tenDaysPrediction" class="seaAreaPrediction">
            <div class="prediction_title">
              <span style="">未来十天预报单</span>
            </div>

            <div class="predictDivBtn_class">
              <span style="">加载</span>
            </div>

            <div class="predictionLeftSel">
              <span style="">年：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style="">月：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionLeftSel">
              <span style="">日：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style=""></span>
              <div style="width: 60%; display: inline-block;">
              </div>
            </div>
          </div>

          <div id="icePrediction" class="seaAreaPrediction">
            <div class="prediction_title">
              <span style="">海冰预报单</span>
            </div>

            <div class="predictDivBtn_class">
              <span style="">加载</span>
            </div>

            <div class="predictionLeftSel">
              <span style="">年：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div class="predictionRightSel">
              <span style="">编号：</span>
              <el-select style="width: 60%" v-model="value" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>

        </div>

      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
  export default {
    name: "PredictionPaper",
    data() {
      return {
        rightIsHide: false,
        btnIconData: 'el-icon-d-arrow-right',//按钮图标
        activeNames: ['rightSide'],
        // 海区预报单下拉栏
        seaAreaYear: {},
        seaAreaMonth: {},
        seaAreaDay: {},
        seaAreaSelectedYear: '',
        seaAreaSelectedMonth: '',
        seaAreaSelectedDay: '',
        seaAreaFileName: '',

      }
    },
    created() {
      this.getSeaAreaForecastConditon(this.seaAreaSelectedYear,this.seaAreaSelectedMonth,"");
    },
    watch: {
      // 监听近海海区预报pdf
      seaAreaFileName(val){
        window.open("http://202.108.199.57/hqybd/" + val,'_blank');
      },
    },
    methods: {

      seaAreaLoadFile(){
        this.getSeaAreaForecastConditon(this.seaAreaSelectedYear,this.seaAreaSelectedMonth,this.seaAreaSelectedDay);
      },
      seaAreaYearChange(val){
        this.getSeaAreaForecastConditon(val,"","");
      },
      seaAreaMonthChange(val){
        this.getSeaAreaForecastConditon(this.seaAreaSelectedYear,val,"");
      },
      getSeaAreaForecastConditon(year,month,day){
        var api = `/api/SCSServices/getSeaAreaPrediction.action?year=${year}&month=${month}&day=${day}`;
        this.$axios.get(api).then((response) => {
          let seaAreaSelectData = response.data
          if (seaAreaSelectData.hasOwnProperty("year")){
            this.seaAreaYear = seaAreaSelectData.year;
            this.seaAreaSelectedYear = this.seaAreaYear[this.seaAreaYear.length-1];
          }
          if (seaAreaSelectData.hasOwnProperty("month")){
            this.seaAreaMonth = seaAreaSelectData.month;
            this.seaAreaSelectedMonth = this.seaAreaMonth[this.seaAreaMonth.length-1];
          }
          if (seaAreaSelectData.hasOwnProperty("day")){
            this.seaAreaDay = seaAreaSelectData.day;
            this.seaAreaSelectedDay = this.seaAreaDay[this.seaAreaDay.length-1];
          }
          if (seaAreaSelectData.hasOwnProperty("fileName")){
            this.seaAreaFileName = seaAreaSelectData.fileName[0];
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

      // 这里传输时时间戳变成了数字串形式，需要转换回去
      transferTime(cTime) {
        var jsonDate = new Date(parseInt(cTime));
        Date.prototype.format = function (format) {
          var o = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds()
          };
          if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
          }
          for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, o[k].toString().length == 2 ? o[k] : ("0" + o[k]).substr("" + o[k].length));
            }
          }
          return format;
        };
        var newDate = jsonDate.format("MM-dd hh:mm");
        return newDate;
      },

    },
    ////////end
  }
</script>

<style>
  .seaAreaTable {
    width: 96%;
    margin: 2%;
    border: 2px solid black;
    border-radius: 6px;
  }
  .predictionContent_class {
    height: calc(70vh);
    overflow-y: scroll;
  }

  .predictDivBtn_class {
    width: 20%;
    float: right;
    margin: 2%;
    margin-right: 10%;
    cursor: pointer;
    font-size: 16px;
    line-height: 1.6;
    font-weight: bold;
  }
  .predictDivBtn_class:hover {
    background-color: #99b3cc;
  }

  .prediction_title {
    width: 46%;
    margin: 2%;
    float: left;
    font-size: 16px;
    line-height: 1.6;
    font-weight: bold;
  }

  .predictionLeftSel {
    width: 46%;
    margin: 2%;
    float: left;
  }

  .predictionRightSel {
    width: 46%;
    margin: 2%;
    float: left;
  }

  .seaAreaPrediction {
    width: 96%;
    border: 1px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
    display: inline-block;
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

  .seaAreaTableDiv {
    height: calc(70vh);
    overflow-y: scroll;
  }

  #rightBtn .el-button {
    font-size: 30px;
  }

  .predictBtn_class {
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
  }

  .predictPaper_class {
    margin-left: 78%;
    margin-top: 1%;
    width: 21%;
    position: fixed;
    border: 0;
  }

  #rightBar .el-collapse-item__header {
    font-size: 0px;
    /*width: 45px;*/
    height: 0px;
    /*border-radius: 30px;*/
    /*margin-left: -19%;*/
    border: 0;
  }

  #rightBar .el-collapse-item__content {
    padding-bottom: 15px;
  }

  #rightBar .el-collapse-item__wrap {
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
</style>
