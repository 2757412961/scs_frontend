<template>
  <div>
    <div class="lawAreabtn_class" :style="this.lawRightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="rightBtn" style="font-size: 25px;" :icon="this.btnIconData" circle
                   @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="lawAreaForecast_panel" class="lawAreaPanel_class" v-model="activeNames" @change="rightBarHide">

      <el-collapse-item id="rightBar" style="border: 4px solid rgb(28, 94, 133);border-radius: 9px;"
                        name="rightSide"
                        :class="[this.lawRightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">
        <div class="lawAreaBarTitle">
          <div>执法海域</div>
        </div>
        <div class="lawAreaBarTitle">
          <el-switch v-model="isShowLayer" active-text="显示执法海域"></el-switch>
        </div>
        <div class="lawAreaBarTitle" style="font-weight: initial;font-size: 16px; margin-bottom: 0">
          海域预报：{{ this.lawAreaName }}
        </div>

        <div class="lawAreaTableDiv">
          <div v-for="data in lawAreaForecastData">
            <table border="1px" cellspacing="0" class="altrowstable">
              <tr class="headrowcolor">
                <th colspan="2">
                  <div>
                    {{ util.transDate2MMHHMM(new Date(data.qbsj + (data.ybtc-12) * 60 * 60 * 1000)) }}
                    至
                    {{ util.transDate2MMHHMM(new Date(data.qbsj + data.ybtc * 60 * 60 * 1000)) }}
                  </div>
                </th>
              </tr>
              <tr>
                <td style="width: 45%;" class="evenrowcolor">天气情况</td>
                <td>{{ data.tqqk }}</td>
              </tr>
              <tr>
                <td style="width: 45%;" class="evenrowcolor">风向</td>
                <td>{{ data.fx }}</td>
              </tr>
              <tr>
                <td style="width: 45%;" class="evenrowcolor">风速（级）</td>
                <td :style="setColorByfs(data.fs)">{{ data.fs }}</td>
              </tr>
              <tr>
                <td style="width: 45%;" class="evenrowcolor">视程范围（公里）</td>
                <td>{{ data.scfw }}</td>
              </tr>
              <tr>
                <td style="width: 45%;" class="evenrowcolor">风浪（米）</td>
                <td :style="setColorBylang(data.fl)">{{ data.fl }}</td>
              </tr>
              <tr>
                <td style="width: 45%;" class="evenrowcolor">涌浪（米）</td>
                <td :style="setColorBylang(data.yl)">{{ data.yl }}</td>
              </tr>
            </table>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
    import {globalBus} from "../globalBus";

    export default {
        name: "LawArea",
        data() {
            return {
                lawAreaJson: require('../../../static/resources/LawArea.json'),  // 执法海域json
                lawAreaName: "None",
                lawAreaForecastData: [{
                    "hymc": "黄岩岛",
                    "ybtc": 72,
                    "qbsj": 1593993600000,
                    "tqqk": "小雨",
                    "fx": "东南",
                    "fs": "4-5",
                    "scfw": "10-15",
                    "fl": "0.6",
                    "yl": "1.1"
                }],

                btnIconData: 'el-icon-d-arrow-right',  //按钮图标
                activeNames: ['rightSide'],
                lawRightIsHide: false,

                isShowLayer: true,
            }
        },
        methods: {
            drawLawArea() {
                globalBus.$emit('lawAreaDraw', this.lawAreaJson);
            },
            changeLawAreaName() {
                globalBus.$on('changeLawAreaName', (newName) => {
                    this.lawAreaName = newName;
                });
            },
            firstLawAreaNameChange() {
                this.lawAreaName = '钓鱼岛';
            },

            // 根据数值返回颜色，风六级以上为红色，否则为黑色
            setColorByfs(fs) {
                let lst = fs.split('-');
                for (let i = 0; i < lst.length; i++) {
                    if (lst[i] != "" && parseInt(lst[i]) >= 6) {
                        return 'color: red;';
                    }
                }
            },
            // 浪包括风浪和涌浪，3m以上为红色，否则为黑色
            setColorBylang(lang) {
                if (parseInt(lang) >= 3) {
                    return 'color: red;';
                }
            },

            //侧边栏动画
            rightBarHide() {
                this.lawRightIsHide = !this.lawRightIsHide;
                if (this.lawRightIsHide) {
                    this.btnIconData = 'el-icon-d-arrow-left';
                    this.activeNames = ['no'];
                } else {
                    this.btnIconData = 'el-icon-d-arrow-right';
                    this.activeNames = ['rightSide'];
                }
            },

        },
        watch: {
            lawAreaName: function () {
                this.$axios
                    .get(`/api/SCSServices/getZfhyByName.action`, {
                        params: {
                            areaName: this.lawAreaName
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        this.lawAreaForecastData = res.data;
                    })
                    .catch((res) => {
                        this.$confirm('服务器失联！lawAreaName ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })
            },
            isShowLayer: function (val, oldVal) {
                if (val) {
                    this.drawLawArea();
                } else {
                    globalBus.$emit('clearMapLawAreaLayer', 'nothing');
                }
            },
        },
        beforeCreate() {

        },
        created() {
            console.log("LawArea is created");
        },
        beforeMount() {

        },
        mounted() {
            console.log("LawArea is mounted");
            this.drawLawArea();
            this.changeLawAreaName();
            this.firstLawAreaNameChange();
        },
        beforeUpdate() {

        },
        updated() {

        },
        beforeDestroy() {

        },
        destroyed() {
            console.log("LawArea is destroyed");
        }
    }
</script>

<style scoped>

  .lawAreaTable {
    width: 96%;
    margin: 2%;
    border: 2px solid black;
    border-radius: 6px;
  }

  .lawAreaBarTitle {
    width: 96%;
    font-size: 20px;
    line-height: 1.7;
    font-weight: bold;
    border: 2px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
  }

  .lawAreaTableDiv {
    height: calc(64vh);
    overflow-y: scroll;
    width: 98%;
    margin-left: 2%;
  }

  #rightBtn .el-button {
    font-size: 30px;
  }

  .lawAreabtn_class {
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
  }

  .lawAreaPanel_class {
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

  /*滚动条整体样式*/
  .lawAreaTableDiv::-webkit-scrollbar {
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  /*滚动条里面小方块*/
  .lawAreaTableDiv::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #c2d1e0;
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

  /*滚动条里面轨道*/
  .lawAreaTableDiv::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
    margin-top: 16px;
  }

  /* 表格样式 */
  table.altrowstable {
    font-family: verdana, arial, sans-serif;
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #a9c6c9;
    border-collapse: separate;
    margin-top: 16px;
    border-radius: 5px;
  }

  table.altrowstable th {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #a9c6c9;
  }

  table.altrowstable td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #a9c6c9;
  }

  .headrowcolor {
    /*background-color: #6B8FB7;*/
    /*opacity: 0.7;*/
    font-size: 17px;
    color: #7ad6ff;
  }

  .oddrowcolor {
    /*background-color: #f2faff;*/
  }

  .evenrowcolor {
    /*background-color: #6B8FB7;*/
    opacity: 0.7;
    color: black;
    font-size: 13px;
    font-weight: bolder;
  }

</style>
