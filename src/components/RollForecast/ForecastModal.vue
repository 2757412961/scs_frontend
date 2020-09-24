<template>
  <modal width="90%" height="300px" :mask-closable="false"
         v-model="forecastModal" :fullscreen="isFullScreen" id="forecast_modal"
         :title="title">
    <div slot="close"></div>
    <div slot="header" style="text-align: center;display: inline-block;width: 100%">
      <div style="width:15%;float: left;height: 100%" class="ivu-modal-header-inner">{{title}}</div>
      <div style="width: 40%;float: right;margin-top: -0.4%;">
        <el-button size="medium" icon="el-icon-plus" circle @click="ratePlus"></el-button>
        <el-button size="medium" v-bind:icon="iconData" circle @click="playOrPause"></el-button>
        <el-button size="medium" icon="el-icon-minus" circle @click="rateMinus"></el-button>

        <el-button size="medium" v-bind:icon="fullScreenIcon" circle @click="fullScreenFun"></el-button> <!--切换全屏-->

        <el-button style="float: right" @click="forecastModal=false" size="medium" icon="el-icon-close" circle></el-button>
      </div>
    </div>
    <div class="inner-container" id="aniDiv" :style="[rollTime,playOrNot]">

<!--  近海海区DIV   -->
      <div v-for="table in this.tableData" v-if="!forecastType">
        <div class="offShoreDiv">
          <div style="width: 100%;font-size: 20px; line-height: 2.6;font-weight: bold;color: black">
            <div style="display: inline-block;width: 45%;margin-left: 5%;">
              海区要素预报
            </div>
            <div style="margin-right: 5%; float: right;">
              {{transferTime(table.data[0].qbsj + (table.data[0].ybtc-12)*60*60*1000)}} 至 {{transferTime(table.data[0].qbsj + table.data[0].ybtc*60*60*1000)}}
            </div>
          </div>
        </div>
        <el-table
          :data="table.data" border
          style="width: 100%;font-size: 18px;">
          <el-table-column
            align="center"
            type="index"
            :index=1
            label="海区"
            width="80">
          </el-table-column>

          <el-table-column
            align="center"
            prop="hqmc"
            label="海区名称">
          </el-table-column>

          <el-table-column
            align="center"
            prop="tqqk"
            label="天气">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fx"
            label="风向">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fs"
            label="风力(级)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="scfw"
            label="视程(公里)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fl"
            label="风浪(米)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="yl"
            label="涌浪(米)">
          </el-table-column>

        </el-table>
      </div>
      <div v-for="table in this.tableData" v-show="playDiv" v-if="!forecastType">
        <div class="offShoreDiv">
          <div style="width: 100%;font-size: 20px; line-height: 2.6;font-weight: bold;color: black">
            <div style="display: inline-block;width: 45%;margin-left: 5%;">
              海区要素预报
            </div>
            <div style="margin-right: 5%; float: right;">
              {{transferTime(table.data[0].qbsj + (table.data[0].ybtc-12)*60*60*1000)}} 至 {{transferTime(table.data[0].qbsj + table.data[0].ybtc*60*60*1000)}}
            </div>
          </div>
        </div>
        <el-table
          :data="table.data" border
          style="width: 100%;font-size: 18px;">
          <el-table-column
            align="center"
            type="index"
            :index=1
            label="海区"
            width="80">
          </el-table-column>

          <el-table-column
            align="center"
            prop="hqmc"
            label="海区名称">
          </el-table-column>

          <el-table-column
            align="center"
            prop="tqqk"
            label="天气">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fx"
            label="风向">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fs"
            label="风力(级)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="scfw"
            label="视程(公里)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fl"
            label="风浪(米)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="yl"
            label="涌浪(米)">
          </el-table-column>

        </el-table>
      </div>
<!--  执法海域DIV    -->
      <div v-for="table in this.tableData" v-if="forecastType">
        <div class="offShoreDiv">
          <div style="width: 100%;font-size: 20px; line-height: 2.6;font-weight: bold;color: black">
            <div style="display: inline-block;width: 45%;margin-left: 5%;">
              {{table.data[0].hymc}}(方圆100公里)未来十天风浪预报
            </div>
          </div>
        </div>
        <el-table
          :data="table.data"
          border
          :stripe="true"
          style="width: 100%;font-size: 18px;">
          <el-table-column
            align="center"
            prop="[ybrq,ybsc]"
            label="时间">
            <template slot-scope="scope">
              {{transferTime(scope.row.ybrq + (scope.row.ybsc == '-'?0:scope.row.ybsc)*60*60*1000)}}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="fx"
            label="风向">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fl"
            label="风力(级)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="zf"
            label="阵风(级)">

          </el-table-column>

          <el-table-column
            align="center"
            prop="lg"
            label="浪高(米)">
          </el-table-column>
        </el-table>
      </div>
      <div v-for="table in this.tableData" v-show="playDiv" v-if="forecastType">
        <div class="offShoreDiv">
          <div style="width: 100%;font-size: 20px; line-height: 2.6;font-weight: bold;color: black">
            <div style="display: inline-block;width: 45%;margin-left: 5%;">
              {{table.data[0].hymc}}(方圆100公里)未来十天风浪预报
            </div>
          </div>
        </div>
        <el-table
          :data="table.data"
          border
          :stripe="true"
          style="width: 100%;font-size: 18px;">
          <el-table-column
            align="center"
            prop="[ybrq,ybsc]"
            label="时间">
            <template slot-scope="scope">
              {{transferTime(scope.row.ybrq + (scope.row.ybsc == '-'?0:scope.row.ybsc)*60*60*1000)}}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            prop="fx"
            label="风向">
          </el-table-column>

          <el-table-column
            align="center"
            prop="fl"
            label="风力(级)">
          </el-table-column>

          <el-table-column
            align="center"
            prop="zf"
            label="阵风(级)">

          </el-table-column>

          <el-table-column
            align="center"
            prop="lg"
            label="浪高(米)">
          </el-table-column>
        </el-table>
      </div>

    </div>

    <div slot="footer" style="height: 1%;">
    </div>
  </modal>
</template>

<script>

  export default {
    name: "forecast-modal",
    data() {
      return {
        fullScreenIcon: 'el-icon-full-screen',
        iconData:'el-icon-caret-right', //是否播放
        rateNum: 0.5, //播放速度控制
        rollTime:{
          'animation-duration':'30s'
        },
        playOrNot:{
          'animation-play-state':'paused'
        },
        forecastType: false,  // true 执法海域  false 近海海区
        panelHeight: '550px',
        isFullScreen: false,
        fullScreenText: '关闭全屏',
        title: '',
        forecastModal: false,
        tableData: [],   //用于轮播的数据
        playDiv: false,  //如果没有开始播放，仅显示一个div
      }
    },
    methods: {
      openForecastModal(table, selectAreaType) {
        this.forecastModal = true;
        this.forecastType = selectAreaType;
        if (!selectAreaType){ //如果是近海海区，转换数据
            this.tableData = this.convertTableData(table);
            this.title = "近海海区要素预报";
          } else {   //如果是执法海域，直接赋值
          this.tableData = table;
          this.title = "执法海域未来10天风浪预报";
        }
        this.rateNum = 0.5;
        this.rollTime = {'animation-duration':this.tableData.length*this.tableData[0].data.length*this.rateNum + "s"};
      },
      convertTableData(offShoreAreaData) {   //近海海区预报需要对数据格式进行些变换
        var resultArr = new Array();
        let areaNum = offShoreAreaData.length; //预报海区个数
        let forecastNum = offShoreAreaData[0].data.length;  // 每个海区的预报次数
        for(let i=0; i<forecastNum; i++){
          var tempArr = new Array();

          for(let j=0; j<areaNum; j++){
            tempArr.push(offShoreAreaData[j].data[i]);
          }
          resultArr.push({"data":tempArr});
          tempArr = undefined;
        }
        return resultArr;
      },

      // 将json串的一串数字时间进行解析
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
        var newDate = jsonDate.format("yyyy-MM-dd hh:mm:ss");
        return newDate;
      },
      // 暂停播放/继续播放
      playOrPause(){
        if (this.iconData == 'el-icon-caret-right'){ //开始播放
          this.playDiv = true;
          this.iconData = 'el-icon-d-caret';
          this.playOrNot = {'animation-play-state':'running'};
        } else { //暂停播放
          this.playDiv = false;
          this.playOrNot = {'animation-play-state':'paused'};
          this.iconData = 'el-icon-caret-right';
        }
      },
      //播放速度降低
      rateMinus(){
        if (this.rateNum >= 3){
          this.$confirm('播放速度已经最低！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }else{
          this.rateNum += 0.5;
          this.rollTime = {'animation-duration':this.tableData.length*this.tableData[0].data.length*this.rateNum + "s"};
        }
      },
      //播放速度加快
      ratePlus(){
        if (this.rateNum <= 0){
          this.$confirm('播放速度已经最高！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }else{
          this.rateNum -= 0.1;
          this.rollTime = {'animation-duration':this.tableData.length*this.tableData[0].data.length*this.rateNum + "s"};
        }
      },
      fullScreenFun(){
        this.isFullScreen = !this.isFullScreen;
        let element = document.documentElement;
        if (this.isFullScreen){
          this.fullScreenIcon = 'el-icon-aim';
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        } else {
          this.fullScreenIcon = 'el-icon-full-screen';

          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      },
    },
    watch:{
      isFullScreen: function (val) {
        var domEl = document.getElementById('aniDiv').parentNode;
        if (val){ //值为真，全屏，去掉height，隐藏overflow
          domEl.style.setProperty("height","auto");
          domEl.style.setProperty("overflow-y","hidden");
        } else {  //值不为真，非全屏，设置height，展开overflow-y
          domEl.style.setProperty("height","450px");
          domEl.style.setProperty("overflow-y","scroll");
        }
      }
    }
  }
</script>

<style scoped>

  .inner-container {
    animation: myMove linear infinite;
    -webkit-animation: myMove linear infinite;
    /*animation-duration: 20s;*/
    animation-fill-mode: forwards;
  }

  /*文字无缝滚动*/
  @keyframes myMove {
    0% {
      transform: translateY(0);
      -webkit-transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
    }
  }

  .offShoreDiv{
    width: 100%;
    margin-top: 1%;
    margin-bottom: 0.5%;
    border-radis:2px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(215, 218, 226);
    display: flow;
  }

</style>

<style>
  #forecast_modal .ivu-modal-body {
    /*overflow: hidden;*/
    bottom: 0;
    overflow-y: scroll;
    height: 450px;
  }
  #forecast_modal .ivu-modal-footer {
    background: white;
    /*padding: 0;*/
  }
  #forecast_modal .ivu-modal-wrap {
    overflow: hidden;
  }

  #forecast_modal .ivu-modal-content{
    /*margin-top: -3%;*/
  }

  #aniDiv .el-table th.gutter {
    display: table-cell!important;
  }

</style>
