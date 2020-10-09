<template>
  <div>
    <div class="lawAreabtn_class" :style="this.lawRightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="rightBtn" style="font-size: 30px;" :icon="this.btnIconData" circle
                   @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="lawAreaForecast_panel" class="lawAreaPanel_class" v-model="activeNames" @change="rightBarHide">

      <el-collapse-item id="rightBar" name="rightSide"
                        :class="[this.lawRightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">
        <div class="lawAreaBarTitle">执法海域</div>
        <div class="lawAreaBarTitle">
          <el-switch v-model="isShowLayer" active-text="显示执法海域"></el-switch>
        </div>
        <div class="lawAreaBarTitle">{{ this.lawAreaName }}</div>

        <div class="lawAreaTableDiv">
          <div v-for="data in lawAreaForecastData">
            <table border="1px" cellspacing="0" class="lawAreaTable">
              <tr>
                <th colspan="2">
                  <div style="font-size: 20px; line-height: 2.3">
                    {{ util.transDate2MMHHMM(new Date(data.qbsj + (data.ybtc-12) * 60 * 60 * 1000)) }}
                    至
                    {{ util.transDate2MMHHMM(new Date(data.qbsj + data.ybtc * 60 * 60 * 1000)) }}
                  </div>
                </th>
              </tr>
              <tr><td style="width: 45%;">天气情况</td><td>{{ data.tqqk }}</td></tr>
              <tr><td style="width: 45%;">风向</td><td>{{ data.fx }}</td></tr>
              <tr><td style="width: 45%;">风速（级）</td><td :style="setColorByfs(data.fs)">{{ data.fs }}</td></tr>
              <tr><td style="width: 45%;">视程范围（公里）</td><td>{{ data.scfw }}</td></tr>
              <tr><td style="width: 45%;">风浪（米）</td><td :style="setColorBylang(data.fl)">{{ data.fl }}</td></tr>
              <tr><td style="width: 45%;">涌浪（米）</td><td :style="setColorBylang(data.yl)">{{ data.yl }}</td></tr>
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
    height: calc(70vh);
    overflow-y: scroll;
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

  #rightBar {
    font-size: 0px;
    /*width: 45px;*/
    height: 0px;
    /*border-radius: 30px;*/
    /*margin-left: -19%;*/
    border: 0;
    border-radius: 8px;
    padding-bottom: 15px;
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
