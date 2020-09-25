<template>
  <div>
    <div>
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
          <!-- 台风号、台风名表格-->
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
          <!-- 时间、风速-->
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
    </div>
    <div>
      <el-collapse id="forecastPanel" v-model="foreCheckActive" class="foreCheck" accordion>
        <el-collapse-item title="预报机构" name="1">
          <el-checkbox-group v-model="forecastCheckList" class="foreCheck">
            <el-checkbox label="中央"></el-checkbox>
            <el-checkbox label="美国"></el-checkbox>
            <el-checkbox label="欧洲"></el-checkbox>
            <el-checkbox label="TEPO"></el-checkbox>
          </el-checkbox-group>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <el-collapse id="legendPanel" v-model="legendActive" class="legendPanel" accordion>
        <el-collapse-item title="台风图例" name="1">
          <img
            class="legendImg"
            src="../../assets/legend/typhoon.png"></img>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
    import {globalBus} from '../globalBus';

    export default {
        name: "Typhoon",
        data() {
            return {
                forecastCheckList: [],
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
                        this.$confirm('服务器失联List！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })
                return 0;
            },

            // 获取现有台风的所有年份
            typhoonYear() {
                var api = '/api/SCSServices/typhoonYear.action';
                console.log('typhoonYear1');
                this.$axios.get(api)
                    .then((response) => {
                        if (response.data != null) {
                            // console.log(response);
                            // console.log(response.data[0].toString()+"***********");

                            for (var i = 0; i < response.data.length; i++) {

                                // iview的select复选框只支持对象数组
                                var object0 = {"value": response.data[i].toString()};
                                this.yearList.push(object0);
                            }
                            this.selectedYear = response.data[0].toString();
                            this.yearList.sort();
                            this.yearList.reverse();
                            this.yearList.reverse();
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
                        this.$confirm('服务器失联Year！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })
                return 0;
            },

            // 获取正在进行的台风
            typhoonOngoing() {
                var api = '/api/SCSServices/typhoonOngoing.action';
                console.log('typhoonOngoing1');
                this.$axios.get(api)
                    .then((response) => {

                        // console.log('----'+response.data['modelNum']);
                        if (response.data != null) {

                            this.selectedTyph = response.data['modelNum'];
                            console.log('OK');

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
                        this.$confirm('服务器失联Ongoing！', '提示', {
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
                console.log('typhoonRoute1');
                this.$axios.get(api)
                    .then((response) => {
                        console.log('typhoonRoute2');//成功回调
                        console.log(response);

                        if (response.data != null) {
                            for (var i = 0; i < response.data.length; i++) {
                                response.data[i]['routeTime'] = this.transferTime(response.data[i]['routeTime']);
                            }

                            this.typhMonitorList = response.data;
                            // console.log('++++++++++++++');
                            // console.log(this.typhMonitorList);

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
                        this.$confirm('服务器失联Route！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        })
                    })

                return 0;
            },

            // 把台风轨迹信息使用typhMonitor加载到轨迹表格中
            // 每加一条的同时修改typhMonitor，监听并在map中添加轨迹
            addToRouteTable() {

                for (var i = 0; i < this.typhMonitorList.length; i++) {
                    // console.log('+++++++++++++');
                    this.typhMonitor = this.typhMonitorList[i];
                    // console.log(this.typhMonitor);
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
            }
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
                console.log('where');
                globalBus.$emit('addTyphMonitor', val, oldVal);
            },
            typhMonitor: function (val, oldVal) {
                // console.log('where');
                // globalBus.$emit('addTyphMonitor', val, oldVal);

            }
        }
    }
</script>

<style>

  /*  .ivu-layout-header {
      background: rgb(84, 92, 100);
      padding: 0 10px;
      height: 61px;
      line-height: 60px;
      border-bottom: 1px solid #e6e6e6;
    }
    .ivu-layout-sider {
      background: rgb(84, 92, 100);
    }
    .rotate-icon{
      transform:translate(-40px,0px) rotate(-180deg);
    }
    .menu-item span{
      display: inline-block;
      overflow: hidden;
      width: 69px;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: bottom;
      transition: width .2s ease .2s;
    }
    .menu-item i{
      transform: translateX(0px);
      transition: font-size .2s ease, transform .2s ease;
      vertical-align: middle;
      font-size: 16px;
    }
    .vertical-center-modal{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .collapsed-menu span{
      width: 0px;
      transition: width .2s ease;
    }
    .collapsed-menu i{
      transform: translateX(0px);
      transition: font-size 0.2s ease 0.2s, transform .2s ease .2s;
      vertical-align: middle;
      font-size: 22px;
    }
    .ivu-modal{
      top: 0;
    }
    .bg {
      background : #dcdee2;
      position: absolute;
      bottom:0;
      top:61px;
      right:0;
      !*left:80%;*!
    }*/

  .legendPanel {
    position: fixed;
    /*width: 40%;*/
    left: 1.3%;
    bottom: 19%;
  }

  #legendPanel .legendImg {
    width: 300px;
    height: 125px;
    margin: 6.4px 6.4px;
    margin-bottom: 0;
  }

  #legendPanel .el-collapse-item__content {
    padding: 0;
  }

  #legendPanel .el-collapse-item__header {
    width: 5%;
    position: fixed;
    left: 1.3%;
    bottom: 15%;
    /*background-color: #6b8eb7;*/
    height: 25px;
    border: 0;
  }

  #forecastPanel .el-collapse-item__wrap {
    border-bottom: 0;
  }

  .foreCheck {
    position: fixed;
    width: 40%;
    left: 6.3%;
    bottom: 10%;
    /*background-color: #6b8fb8;*/
  }

  #forecastPanel .el-collapse-item__header {
    width: 5%;
    position: fixed;
    left: 1.3%;
    bottom: 10%;
    /*background-color: #6b8eb7;*/
    height: 25px;
    border: 0;
  }

  #forecastPanel .el-collapse-item__wrap {
    border-bottom: 0;
  }

  #forecastPanel .el-collapse-item {
    margin-bottom: 0;
  }

  #forecastPanel .el-collapse-item__wrap {
    background-color: white;
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
</style>
