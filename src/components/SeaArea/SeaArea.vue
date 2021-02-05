<!--
近海预报 页面
2020年9月24日16:38:03
zzhe
-->
<template>
  <div>


    <div style="width: 100%; width: 25%">
      <el-collapse style="position: absolute; bottom: 0; width: 100%">
        <el-collapse-item name="onlyOne">
          <template slot="title">
            <div style="width: 100%;"><h2 style="color: white">近海预报</h2></div>
          </template>

          <div class="seaAreaBarTitle">
            <el-tag type="warning" size="medium" style="font-size: 18px;">
              第{{this.tableDataIndex}}海区：{{this.forecastData[parseInt(this.tableDataIndex)-1].data[0].hqmc}}
            </el-tag>
          </div>

          <el-table :data="forecastData[parseInt(this.tableDataIndex)-1].data" stripe border fit height="200"
                    class="seaAreaTable">
            <el-table-column prop="hqmc" label="海区名称" sortable></el-table-column>
            <el-table-column prop="qbsj" label="日期" sortable width="200">
              <template slot-scope="scope">
                <div>
                  {{ util.transDate2MMHHMM(new Date(scope.row.qbsj + (scope.row.ybtc - 12) * 60 * 60 * 1000)) }}
                  至
                  {{ util.transDate2MMHHMM(new Date(scope.row.qbsj + scope.row.ybtc * 60 * 60 * 1000)) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="tqqk" label="天气情况" sortable></el-table-column>
            <el-table-column prop="fx" label="风向" sortable></el-table-column>
            <el-table-column prop="fs" label="风速（级）" sortable>
              <template slot-scope="scope">
                <div :style="windSpeedJudge(scope.row.fs)">{{scope.row.fs}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="scfw" label="视程范围（公里）" sortable></el-table-column>
            <el-table-column prop="fl" label="风浪" sortable></el-table-column>
            <el-table-column prop="yl" label="涌浪" sortable></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
    // 引入海区数据用于绘制
    import seaAreaJson from '../../../static/resources/SeaArea.json'
    import {globalBus} from '../globalBus';

    export default {
        name: "SeaArea",
        data() {
            return {
                btnIconData: 'el-icon-d-arrow-right',//按钮图标
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
                activeNames: ['rightSide'],
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
                this.drawSeaArea(this.seaAreaList.SeaArea, this.forecastData);
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
                if (this.rightIsHide) {
                    this.btnIconData = 'el-icon-d-arrow-left'
                    this.activeNames = ['no']
                } else {
                    this.btnIconData = 'el-icon-d-arrow-right'
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
            windSpeedJudge(windSpeed) {
                if (windSpeed.indexOf('-') != -1) {
                    let numArr = windSpeed.split('-');
                    for (let i = 0; i < numArr.length; i++) {
                        if (numArr[i] > 5) {  //如果大于5，修改为红色
                            return {
                                color: 'red'
                            };
                        }
                    }
                } else {
                    if (windSpeed > 5) {
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
            updateTableDataIndex() {
                globalBus.$on('updateSeaAreaDataIndex', (newVal) => {
                    this.tableDataIndex = newVal;
                })
            },

        }
    }
</script>

<style scoped>

  .seaAreaBarTitle {
    font-size: 20px;
    line-height: 1.7;
    font-weight: initial;
    /*border: 2px solid #3681aa;*/
    /*border-radius: 7px;*/
    margin: 5px 10px 5px 10px;
  }

  .seaAreaTable {
    margin: 0 10px 0 10px;
  }

  /* 表格格高间距缩短 */
  /deep/ .el-table td, .el-table th {
    padding: 6px 0;
  }

  /* 底部背景改为黑色 */
  /deep/ .el-collapse-item__header {
    background-color: #545C64;
  }

  /* 底部背景改为黑色 */
  /deep/ .el-collapse-item__header.is-active {
    border-bottom-color: transparent;
    background-color: #545C64;
  }

  /* 表格底部留白去除不掉 */
  /deep/ .el-collapse-item__content {
    padding-bottom: 0px;
  }

  /* 右边箭头 */
  /deep/ .el-collapse-item__arrow {
    color: white;
  }

</style>
