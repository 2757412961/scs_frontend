<template>
  <modal width="90%" height="800px" :mask-closable="false"
         v-model="forecastModal" :fullscreen="false" id="forecast_modal"
         :title="title">
<!--    <p slot="header" style="text-align: center">-->
<!--      <el-button icon="el-icon-search" circle></el-button>-->
<!--    </p>-->
    <div class="inner-container" id="aniDiv" :style="rollTime">

<!--  近海海区DIV   -->
      <div v-for="table in this.tableData" v-show="!forecastType">
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
      <div v-for="table in this.tableData" v-show="!forecastType">
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
      <div v-for="table in this.tableData" v-show="forecastType">
        <el-table
          :data="table.data"
          style="width: 100%;height: 300px">
          <el-table-column
            prop="hqmc"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </div>
      <div v-for="table in this.tableData" v-show="forecastType">
        <el-table
          :data="table.data"
          style="width: 100%;height: 300px">
          <el-table-column
            prop="hqmc"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div slot="footer">
<!--      <Button type="error" size="large" long @click="cancelFullScreen">{{fullScreenText}}</Button>-->
    </div>
  </modal>
</template>

<script>

  export default {
    name: "forecast-modal",
    data() {
      return {
        rollTime:{
          'animation-duration':'30s'
        },
        forecastType: false,  // true 执法海域  false 近海海区
        panelHeight: '550px',
        isFullScreen: true,
        fullScreenText: '关闭全屏',
        title: '',
        forecastModal: false,
        tableData: [],   //用于轮播的数据
      }
    },
      methods: {
        openForecastModal(table, selectAreaType) {
          this.forecastModal = true;
          this.forecastType = selectAreaType;
          this.title = "未来10天天气预报";
          if (!selectAreaType){ //如果是近海海区，转换数据
              this.tableData = this.convertTableData(table);
              console.log(this.tableData)
            } else {   //如果是执法海域，直接赋值
            this.tableData = table;
          }
          //循环创建table
            this.rollTime = {'animation-duration':this.tableData.length*this.tableData[0].data.length*0.5 + "s"};
        },
        cancelFullScreen() {
          this.isFullScreen = !this.isFullScreen;
          if (this.isFullScreen) {
            this.fullScreenText = '关闭全屏';
          } else {
            this.fullScreenText = '打开全屏';
          }
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
    overflow: hidden;
    bottom: 0;
  }
  #forecast_modal .ivu-modal-footer {
    padding: 0;
  }
  #forecast_modal .ivu-modal-wrap {
    overflow: hidden;
  }

  #forecast_modal .ivu-modal-content{
    margin-top: -2%;
  }

  #aniDiv .el-table th.gutter {
    display: table-cell!important;
  }

  /*#forecast_modal .ivu-modal-header{*/
  /*  padding: 0;*/
  /*}*/

</style>
