<template>
  <div>
    <!--    <div>
          <el-collapse id="tablePanel" class="tf_panel" v-model="activeName" accordion>
            <el-collapse-item title="" name="1" style="height: 100%;">
              <div
                style="height: 40px;margin-left: 1%; width: 98%; border: 1px solid #5b84cc; border-radius: 4px; margin-top: 1%"
                align="left">
                <span style="margin-left: 5%; height: 26px;margin-top: 3px">台风预警</span>
                <span style="margin-left: 5%; height: 26px;margin-top: 3px"><a href="" style="color: gray">返回</a></span>
              </div>

              <div
                style="height: 40px;margin-left: 1%; width: 98%; border: 1px solid #5b84cc; border-radius: 4px; margin-top: 1%"
                align="left">
                <span style="margin-left: 5%">年份：</span>
                <el-select v-model="selectedYear" placeholder="请选择" size="small"
                           style="width: 30%;height: 26px;margin-top: 3px">
                  <el-option
                    v-for="item in yearList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              &lt;!&ndash; 台风号、台风名表格&ndash;&gt;
              <el-table
                :data="typhList" height="250" border
                style="width: 98%;border: 1px solid #5b84cc; border-radius: 4px; margin-top: 1%;margin-left: 1%"
                @row-click="chooseTyph" :default-sort="{prop: 'typhNum', order: 'descending'}">
                <el-table-column
                  prop="typhNum"
                  label="台风号"
                  sortable>
                </el-table-column>
                <el-table-column
                  prop="typhName"
                  label="台风名"
                  sortable>
                </el-table-column>
              </el-table>
              &lt;!&ndash; 时间、风速&ndash;&gt;
              <el-table
                :data="routeList" height="250" border
                style="width: 98%;border: 1px solid #5b84cc; border-radius: 4px; margin-top: 1%;margin-left: 1%"
                @row-click="chooseTyph" :default-sort="{prop: 'time', order: 'descending'}">
                <el-table-column
                  prop="time"
                  label="时间"
                  sortable>
                </el-table-column>
                <el-table-column
                  prop="windSpeed"
                  label="风速"
                  sortable>
                </el-table-column>
              </el-table>

            </el-collapse-item>
          </el-collapse>
        </div>-->

    <div>
      <div class="typhoonBtn_class" :style="this.rightIsHide?'margin-left:95%':'margin-left:74%'">
        <el-row>
          <el-button id="rightBtn" style="font-size: 25px;" :icon="this.btnIconData" circle
                     @click="rightBarHide"></el-button>
        </el-row>
      </div>

      <el-collapse id="typhoonForecast_panel" class="typhoonPanel_class"
                   v-model="activeNames" @change="rightBarHide">

        <el-collapse-item id="rightBar" style="border: 3px solid rgba(28, 94, 133, 0.5);border-radius: 9px;"
                          name="rightSide"
                          :class="[this.rightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">
          <div class="typhoonBarTitle">
            台风预警
          </div>
          <div id="forecastTableDiv" class="typhoonTableDiv">
            <div
              style="height: 40px;margin-left: 1%; width: 98%; border: 1px solid #5b84cc; border-radius: 4px; margin-top: 1%"
              align="left">
              <span style="margin-left: 5%">年份：</span>
              <el-select v-model="selectedYear" placeholder="请选择" size="small"
                         style="width: 30%;height: 26px;margin-top: 3px">
                <el-option
                  v-for="item in yearList"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>

              <el-button type="text" size="small" @click="openDownloadDialog" style="margin-left: 80px">下载TEPO
              </el-button>
            </div>
            <!-- 台风号、台风名表格-->
            <el-table
              :data="typhList" height="38%" border
              style="width: 98%;border: 1px solid #5b84cc; border-radius: 4px; margin-top: 3%;margin-left: 1%"
              @row-click="chooseTyph" :default-sort="{prop: 'typhNum', order: 'descending'}"
              :row-style="{height:'40px'}"
              :cell-style="{padding:'0px'}"
            >
              <el-table-column
                prop="typhNum"
                label="台风号"
                sortable>
              </el-table-column>
              <el-table-column
                prop="typhName"
                label="台风名"
                sortable>
              </el-table-column>
            </el-table>
            <!-- 时间、风速-->
            <el-table
              :data="routeList" height="50%" border
              style="width: 98%;border: 1px solid #5b84cc; border-radius: 4px; margin-top: 3%;margin-left: 1%"
              @row-click="chooseTyphNum" :default-sort="{prop: 'time', order: 'descending'}"
              :row-style="{height:'40px'}"
              :cell-style="{padding:'0px'}"
            >
              <el-table-column
                prop="time"
                label="时间"
                sortable>
              </el-table-column>
              <el-table-column
                prop="windSpeed"
                label="风速"
                sortable>
              </el-table-column>
            </el-table>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="legendPanel">
      <transition name="el-zoom-in-center">
        <div v-show="showLegend" class="transition-box">
          <!--          <div>-->
          <!--            <img style="border: 4px solid rgba(255, 255, 255,0.7);border-radius: 8px;"-->
          <!--                 src="../../assets/legend/typhoon.png"></img>-->
          <!--          </div>-->
          <div class="foreCheck">
            <h3>台风风图：</h3>
            <el-row>
              <el-col :span="8" v-for="kts in ['30KTS', '50KTS', '64KTS']" :key="kts">
                <div style="float: right">
                  {{ colorTyphWind[kts].CN_Name }}风速：
                  <i class="fa fa-circle-o fa-lg" :style="{color: colorTyphWind[kts].color}"/>
                </div>
              </el-col>
            </el-row>

            <h3>气压带：</h3>
            <el-row>
              <el-col :span="8" v-for="ts in ['TD', 'TS', 'STS', 'TY', 'STY', 'SUPERTY']" :key="ts">
                <div style="float: right">
                  {{ colorTyphStrength[ts].CN_Name }}：
                  <i class="fa fa-circle fa-lg" :style="{color: colorTyphStrength[ts].color}"/>
                </div>
              </el-col>
            </el-row>

            <h3>预报中心：</h3>
            <el-checkbox-group v-model="forecastCheckList">
              <el-checkbox v-for="country in countryList" :label="country" :key="country">
                <div :style="{color:countryInfo[country].color}">
                  {{countryInfo[country].CN_Name}} - - -
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </transition>
    </div>
    <div @click="showLegend = !showLegend" class="legendPanel" style="bottom:75px; height: 2%">
      <el-button type="info" size="small" style="background: rgba(28, 94, 133,0.8)" round>
        {{this.showLegend?'收起':'展开'}}
      </el-button>
    </div>

    <DownloadTepoDialog ref="downloadTepoDialog"></DownloadTepoDialog>
  </div>
</template>

<script>
    import {fromLonLat, getTransform} from 'ol/proj';
    import Point from 'ol/geom/Point';
    import Feature from 'ol/Feature';

    import {globalBus} from '../globalBus';
    import DownloadTepoDialog from "../Dialog/DownloadTepoDialog";

    export default {
        name: "Typhoon",
        components: {
            DownloadTepoDialog
        },
        data() {
            return {
                showLegend: true,
                countryList: this.Constant.countryList.slice(),
                colorTyphStrength: this.Constant.colorTyphStrength,
                colorTyphWind: this.Constant.colorTyphWind,
                countryInfo: this.Constant.colorTyphForecast,
                forecastCheckList: ["China", "Japan", "Europe", "USA", "TEPO", "Korea", "Taiwan", "HongKong"],
                activeName: '1',
                foreCheckActive: '1',
                legendActive: '1',
                legendUrl: '../../',
                legendFit: 'scale-down',
                isCollapsed: false,

                // 台风表
                typhColumns: [
                    {
                        title: '台风号',
                        key: 'typhNum'
                    },
                    {
                        title: '台风名',
                        key: 'typhName'
                    }
                ],
                typhList: [],

                // 轨迹表
                routeColumns: [
                    {
                        title: '时间',
                        key: 'time'
                    },
                    {
                        title: '风速',
                        key: 'windSpeed'
                    }
                ],
                routeList: [],

                // selectedForecast: [],
                yearList: [],
                selectedYear: '',
                selectedTyph: '',

                typhMonitor: {},
                // 用对象数组可以直接保存后端发送的结果
                typhMonitorList: [{}],
                activeNames: ['rightSide'],
                rightIsHide: false,
                btnIconData: 'el-icon-d-arrow-right',//按钮图标
            };
        },
        computed: {
            rotateIcon() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : '',
                ]
            }
        },
        methods: {

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

            // 打开下载框
            openDownloadDialog() {
                this.$refs.downloadTepoDialog.openDialog();
            },

            // 获取特定年份的所有台风
            typhoonList(year) {
                this.typhList = [];
                var api = `/api/SCSServices/typhoonList.action?year=${year}`;
                this.$axios.get(api)
                    .then((response) => {
                        if (response.data != null) {

                            for (var i = response.data.length - 1; i >= 0; i--) {

                                // iview的select复选框只支持对象数组
                                var object0 = {
                                    "typhNum": response.data[i]['typhNum'],
                                    "typhName": response.data[i]['enName'] + (response.data[i]['chName'] == null ? '' : (' ' + response.data[i]['chName']))
                                };
                                this.typhList.push(object0);
                            }
                        } else {
                            // 若不成功，则弹出警告框
                            this.$confirm('无法获取当年台风数据！', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            })
                        }

                    })
                    .catch((response) => {
                        //失败回调
                        this.$confirm('服务器失联！typhoonList ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })
                return 0;
            },

            // 获取现有台风的所有年份
            typhoonYear() {
                var api = '/api/SCSServices/typhoonYear.action';
                this.$axios.get(api)
                    .then((response) => {
                        if (response.data != null) {
                            for (var i = 0; i < response.data.length; i++) {

                                // iview的select复选框只支持对象数组
                                var object0 = {"value": response.data[i].toString()};
                                this.yearList.push(object0);
                            }
                            this.selectedYear = response.data[0].toString();
                            // this.yearList.sort();
                            // this.yearList.reverse();
                            // this.yearList.reverse();
                        } else {
                            // 若不成功，则弹出警告框
                            this.$confirm('无法获取台风年份信息！', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            })
                        }

                    })
                    .catch((response) => {
                        //失败回调
                        this.$confirm('服务器失联！typhoonYear ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })
                return 0;
            },

            // 获取正在进行的台风
            typhoonOngoing() {
                var api = '/api/SCSServices/typhoonOngoing.action';
                this.$axios.get(api)
                    .then((response) => {

                        if (response.data != null) {
                            this.selectedTyph = response.data['typhNum'];
                        } else {
                            // 若不成功，则弹出警告框
                            this.$confirm('无法获取正在进行的台风！', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            })
                        }

                    })
                    .catch((response) => {
                        //失败回调
                        this.$confirm('服务器失联！typhoonOngoing ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })
                return 0;
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

            // 获取Ongoing或所选择的台风的行进路线
            typhoonRoute(typhNum) {
                var api = `/api/SCSServices/typhoonRoute.action?typhNum=${typhNum}`;
                // var api = `/api/SCSServices/typhoonRoute.action?typhNum=202001`;
                this.$axios.get(api)
                    .then((response) => {
                        console.log(response);

                        if (response.data != null) {
                            for (var i = 0; i < response.data.length; i++) {
                                response.data[i]['routeTime'] = this.transferTime(response.data[i]['routeTime']);
                            }

                            this.typhMonitorList = response.data;

                        } else {
                            // 若不成功，则弹出警告框
                            this.$confirm('无法获取台风路径信息！', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            })
                        }
                    })
                    .catch((response) => {
                        //失败回调
                        this.$confirm('服务器失联！typhoonRoute ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    });

                return 0;
            },

            // 把台风轨迹信息使用typhMonitor加载到轨迹表格中
            // 每加一条的同时修改typhMonitor，监听并在map中添加轨迹
            addToRouteTable() {
                this.routeList = [];

                for (var i = 0; i < this.typhMonitorList.length; i++) {
                    this.typhMonitor = this.typhMonitorList[i];
                    // 显示到轨迹表格
                    var object0 = {
                        "time": this.typhMonitorList[i]['routeTime'],
                        "windSpeed": this.typhMonitorList[i]['windSpeed']
                    };

                    // 添加到第一条，表格时间倒序，最近的在最上面
                    this.routeList.unshift(object0);
                }
            },

            chooseTyph(typhIndex) {
                this.selectedTyph = typhIndex['typhNum'];
            },

            chooseTyphNum(typhIndex) {
                console.log(typhIndex);
                let routeTime = typhIndex['time'];
                this.$axios
                    .get(`/api/SCSServices/typhoonRouteTableClick.action`, {
                        params: {
                            typhNum: this.selectedTyph,
                            routeTime: routeTime
                        }
                    })
                    .then((res) => {
                        if (res != null && res.data != null) {
                            let jsonObject = res.data;
                            console.log('jsonObject', jsonObject)

                            let typhRouteInfo = jsonObject['typhMonitorWeb'];
                            let typhInfo = jsonObject['typhInfo'];
                            typhRouteInfo.routeTime = this.transferTime(typhRouteInfo.routeTime);

                            var pointGeom = new Point(fromLonLat([typhRouteInfo.lon, typhRouteInfo.lat]));
                            var pointFeature = new Feature(pointGeom);
                            pointFeature.set('name', "typhPointFeature");
                            pointFeature.set('data', typhRouteInfo);
                            pointFeature.set('typhName', typhInfo.enName);
                            pointFeature.set('typhModelNum', typhInfo.typhNum);

                            globalBus.$emit('drawClickTyphRouteTablePopup', pointFeature);
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '数据不存在！'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '访问数据失败！'
                        });
                    });
            },

        },

        // 挂载到html后执行，发送台风数据查询并渲染
        mounted: function () {
            this.typhoonYear();
            this.typhoonOngoing();
        },

        watch: {
            selectedYear: function (val, oldVal) {
                this.typhoonList(val);
            },
            selectedTyph: function (val, oldVal) {
                this.typhoonRoute(val);
            },
            typhMonitorList: function (val, oldVal) {
                this.addToRouteTable();
                globalBus.$emit('addTyphMonitor', val, oldVal);
            },
            typhMonitor: function (val, oldVal) {
                // globalBus.$emit('addTyphMonitor', val, oldVal);
            },
            forecastCheckList: function (val, oldVal) {
                globalBus.$emit('syncForecastLayerState', this.forecastCheckList);
            },
        }
    }
</script>

<style>

  .typhoonBarTitle {
    width: 96%;
    font-size: 20px;
    line-height: 1.7;
    font-weight: bold;
    border: 2px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
  }

  .legendPanel {
    position: fixed;
    /*width: 40%;*/
    left: 1.3%;
    bottom: 190px;
  }

  .transition-box {
    /*margin-bottom: 10px;*/
    /*width: 200px;*/
    /**/
    /*border-radius: 4px;*/
    /*background-color: #409EFF;*/
    height: 125px; /*图片的高度*/
    text-align: left;
    color: #fff;
    /*padding: 40px 20px;*/
    box-sizing: border-box;
    /*margin-right: 20px;*/
  }

  #legendPanel .legendImg {
    height: 125px;
    border: 4px solid rgb(28, 94, 133);
    border-radius: 8px;
  }

  .foreCheck {
    width: 355px;
    color: rgba(0, 0, 0, 0.87);
    font-size: 12px;
    /*font-family: 楷体;*/
    background: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    padding: 15px;
  }

  h3 {
    font-family: 楷体;
  }

  .forecastPanel {
    position: fixed;
    /*width: 40%;*/
    left: 1.3%;
    bottom: 10%;
  }

  .tf_panel {
    position: relative;
    /*height: 500px;*/
    width: 20%;
    left: 78%;
    /*border: 3px solid #5b84cc;*/
    border-radius: 2px;
  }

  #tablePanel .el-collapse-item__header {
    width: 30px;
    position: fixed;
    right: 40%;
    background-color: #6b8eb7;
    height: 20px;
    border: 0;
    /*opacity: 0.9;*/
  }

  #tablePanel .el-collapse-item__content {
    padding-bottom: 5px;
  }


  .el-collapse {
    border: 0;
  }

  .el-table {
    font-size: 12px;
  }

  /* 滚动条的宽度*/
  /*  ::-webkit-scrollbar {*/
  /*    width: 10px;*/
  /*    height: 10px;*/
  /*  }*/
  /*滚动条的滑块*/
  ::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 3px;
  }

  /* 右侧边栏  start */

  .typhoonTableDiv {
    height: calc(75vh);
    overflow: hidden;
  }

  .typhoonPanel_class {
    margin-left: 78%;
    margin-top: 1%;
    width: 21%;
    position: fixed;
    border: 0;
  }

  #rightBtn .el-button {
    font-size: 25px;
  }

  .typhoonBtn_class {
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
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

  .el-table__body-wrapper::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
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

  .el-table__body-wrapper::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
  }

  /* 右侧边栏  end */


</style>
