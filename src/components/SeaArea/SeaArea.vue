<!--
近海预报 页面
2020年9月24日16:38:03
zzhe
-->
<template>
  <div>
    <div class="seaAreabtn_class"  :style="this.rightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="rightBtn" style="font-size: 25px;" :icon="this.btnIconData" circle @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="seaAreaForecast_panel" class="seaAreaPanel_class"
                 v-model="activeNames" @change="rightBarHide">

      <el-collapse-item id="rightBar" style="border: 4px solid rgb(28, 94, 133);border-radius: 9px;"
                        name="rightSide" :class="[this.rightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']" >
        <div class="seaAreaBarTitle">
            近海预报
        </div>
        <div class="seaAreaBarTitle" style="font-weight: initial;">
          第{{this.tableDataIndex}}海区：{{this.forecastData[parseInt(this.tableDataIndex)-1].data[0].hqmc}}
        </div>
        <div id="forecastTableDiv" class="seaAreaTableDiv">
          <div v-for="data in this.forecastData[parseInt(this.tableDataIndex)-1].data">
            <table id="seaAreaTable_id" border="1px" cellspacing="0" class="seaAreaTable">
              <tr>
                <td colspan="2">
                  <div style="font-size: 20px; line-height: 2.3; font-weight: bold; background-color:rgba(142, 206, 240,0.9) ">
                    {{transferTime(data.qbsj + (data.ybtc-12)*60*60*1000)}} 至 {{transferTime(data.qbsj + data.ybtc*60*60*1000)}}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width: 45%;">
                  天气情况
                </td>
                <td>
                  {{data.tqqk}}
                </td>
              </tr>
              <tr>
                <td style="width: 45%;">
                  风向
                </td>
                <td>
                  {{data.fx}}
                </td>
              </tr>
              <tr>
                <td style="width: 45%;">
                  风速(级)
                </td>
                <td>
                  <p :style="windSpeedJudge(data.fs)"> {{data.fs}}</p>
                </td>
              </tr>
              <tr>
                <td style="width: 45%;">
                  视程范围(公里)
                </td>
                <td>
                  {{data.scfw}}
                </td>
              </tr>
              <tr>
                <td style="width: 45%;">
                  风浪(米)
                </td>
                <td>
                  {{data.fl}}
                </td>
              </tr>
              <tr>
                <td style="width: 45%;">
                  涌浪(米)
                </td>
                <td>
                  {{data.yl}}
                </td>
              </tr>
            </table>

          </div>

        </div>

      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
  // 引入海区数据用于绘制
  import seaAreaJson from '../../../static/resources/SeaArea.json'
  import { globalBus } from '../globalBus';
    export default {
        name: "SeaArea",
      data(){
          return{
            btnIconData:'el-icon-d-arrow-right',//按钮图标
            seaAreaList: [],
            forecastData: [{
              "data": [
                {
                  "ybtc": 12,
                  "hqbh": 1,
                  "qbsj": 1593950400000,
                  "tqqk": "小雨",
                  "fx": "南-东南",
                  "fs": "4-5",
                  "scfw": "5-10",
                  "fl": "轻浪",
                  "yl": "中涌",
                  "hqmc": "渤海"
                }]
            }], //预报数据
            tableDataIndex: 1, //用于展示表格的数据index，默认为0(第一个数据)
            activeNames:['rightSide'],
            rightIsHide: false,
          }
      },
      created() {
          this.seaAreaList = seaAreaJson.SeaAreaList;
          this.getOffShoreForecast();
      },
      mounted() {
          // this.getOffShoreForecast();
        this.updateTableDataIndex();
      },
      watch: {
        forecastData: function (val) {
          this.drawSeaArea(this.seaAreaList.SeaArea,this.forecastData);
        }
      },
      methods: {
        //绘制海区 2020年9月24日19:04:50
        drawSeaArea(areaList, areaForecastData) {
          globalBus.$emit('drawSeaArea', areaList, areaForecastData);
        },

        // 获取近海区域预报信息
        getOffShoreForecast() {
          var api = `/api/SCSServices/getOffShoreArea.action`;
          this.$axios.get(api).then((response) => {
            this.forecastData = response.data;
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
          if (this.rightIsHide){
              this.btnIconData='el-icon-d-arrow-left'
              this.activeNames = ['no']
          } else {
            this.btnIconData='el-icon-d-arrow-right'
            this.activeNames = ['rightSide']
          }
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
          var newDate = jsonDate.format("MM-dd hh:mm");
          return newDate;
        },

        //判断风速是否大于5，大于5就变红色
        windSpeedJudge(windSpeed){
          if (windSpeed.indexOf('-') != -1){
            let numArr = windSpeed.split('-');
            for (let i=0; i<numArr.length; i++){
              if(numArr[i] > 5){  //如果大于5，修改为红色
                return {
                  color: 'red'
                };
              }
            }
          } else {
            if (windSpeed > 5){
              return {
                color: 'red'
              };
            }
          }
          return {
            color: ''
          };

        },

        //更新tableDataIndex的值
        updateTableDataIndex(){
          globalBus.$on('updateSeaAreaDataIndex',(newVal) => {
            this.tableDataIndex = newVal;
          })
        },

      }
    }
</script>

<style>

  .seaAreaTable{
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
    margin-top: 6%;
    border: 2px solid black;
    border-radius: 6px;
  }

  .seaAreaBarTitle {
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

  #rightBtn .el-button{
    font-size: 25px;
  }
  .seaAreabtn_class{
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
  }

  .seaAreaPanel_class{
    margin-left: 78%;
    margin-top: 1%;
    width: 21%;
    position: fixed;
    border: 0;
  }

  #rightBar .el-collapse-item__header{
    font-size: 0px;
    /*width: 45px;*/
    height: 0px;
    /*border-radius: 30px;*/
    /*margin-left: -19%;*/
    border: 0;
  }

  #rightBar .el-collapse-item__content{
    padding-bottom: 15px;
  }

  #rightBar .el-collapse-item__wrap {
    border-radius: 4px;
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

  .seaAreaTableDiv::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .seaAreaTableDiv::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: #99d2f1;
    background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
  }
  .seaAreaTableDiv::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
  }
</style>
