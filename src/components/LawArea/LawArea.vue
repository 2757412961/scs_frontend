<template>
  <div>
    <div style="width: 100%; width: 25%">
      <el-collapse style="position: absolute; bottom: 0; width: 100%" @change="handleChange">
        <el-collapse-item name="onlyOne">
          <template slot="title">
            <div style="width: 100%; background-color: #fffdfe;"><h2>执法海域</h2></div>
          </template>

          <div class="lawAreaBarTitle">
            <el-tag type="warning" size="medium" style="font-size: 18px;">
              海域预报：{{ this.lawAreaName }}（
              <el-switch v-model="isShowLayer" active-text="显示执法海域"></el-switch>
              ）
            </el-tag>
          </div>

          <el-table :data="lawAreaForecastData" stripe border fit :height="tableHeight" class="lawAreaTable">
            <el-table-column prop="hymc" label="海域名称" sortable></el-table-column>
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
                <div :style="setColorByfs(scope.row.fs)">{{scope.row.fs}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="scfw" label="视程范围（公里）" sortable></el-table-column>
            <el-table-column prop="fl" label="风浪（米）" sortable>
              <template slot-scope="scope">
                <div :style="setColorBylang(scope.row.fl)">{{scope.row.fl}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="yl" label="涌浪（米）" sortable>
              <template slot-scope="scope">
                <div :style="setColorBylang(scope.row.yl)">{{scope.row.yl}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
    import {globalBus} from "../globalBus";
    import TestBottomSilder from "./TestBottomSilder";

    export default {
        name: "LawArea",
        components: {TestBottomSilder},
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

                tableHeight: 200, // 表格高度
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

            // 处理第一次打开表格底部有留白的情况
            handleChange(val) {
                console.log(val);
                this.tableHeight = 200;
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

  .lawAreaBarTitle {
    font-size: 20px;
    line-height: 1.7;
    font-weight: initial;
    border: 2px solid #3681aa;
    border-radius: 7px;
    margin: 0px 10px 0px 10px;
    /*margin-bottom: 0;*/
  }

  .lawAreaTable {
    margin: 0 10px 0 10px;
  }

  /* 表格格高间距缩短 */
  /deep/ .el-table td, .el-table th {
    padding: 6px 0;
  }

  /* 底部留白去除 */
  /deep/ .el-collapse-item__content {
    padding-bottom: 0px;
  }

</style>
