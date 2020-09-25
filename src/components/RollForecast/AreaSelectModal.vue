<template>
  <!--滚动预报-区域选择Modal-->
  <modal width="800" :mask-closable="false"
         v-model="areaModal"
         :title="title" @on-ok="openForecastModal"
        @on-cancel="loading=true">
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-table
            @row-click="selectAddData"
            v-loading="loading"
            :data="unSelectedTable"
            border
            highlight-current-row
            height="320px"
            style="overflow-y: auto">
            <el-table-column
              prop="areaName"
              label="未选区域：">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="4">
        <el-row align="middle" class="buttonStyle">
          <el-button round type="primary" @click="addArea" icon="el-icon-arrow-right"></el-button>
        </el-row>
        <el-row align="middle" class="buttonStyle">
          <el-button round type="primary" @click="allAdd" icon="el-icon-d-arrow-right"></el-button>
        </el-row>
        <el-row align="middle" class="buttonStyle">
          <el-button round type="primary" @click="deleteArea"  icon="el-icon-arrow-left"></el-button>
        </el-row>
        <el-row align="middle" class="buttonStyle">
          <el-button round type="primary" @click="allDelete"  icon="el-icon-d-arrow-left"></el-button>
        </el-row>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple" >
          <el-table
            @row-click="selectDeleteData"
            v-loading="loading"
            :data="tableData"
            border
            highlight-current-row
            height="320px"
            style="overflow-y: auto">
            <el-table-column
              prop="areaName"
              label="已选区域：">
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <forecast-modal ref="forecastModal" ></forecast-modal>
  </modal>
</template>

<script>
  import ForecastModal from "./ForecastModal";

  export default {
    name: "roll-modal",
    components: {
      ForecastModal
    },
    data() {
      return {
        forecastType: false,
        loading: true,
        areaModal: false,
        title: '',
        tableData: [],
        unSelectedTable: [],
        deletedArea: {areaName:'',data:''},
        addedArea: {areaName:'',data:''},
      }
    },
    methods: {
      openRollForecastModal(areaType) {
        this.areaModal = true;
        this.forecastType = areaType;
        this.unSelectedTable = undefined;
        this.unSelectedTable = new Array();
        if (areaType) {
          this.title = "执法海域";
          var api = `/api/SCSServices/getLawEnforceArea.action`;
          this.$axios.get(api)
            .then((response) => {
              this.tableData = response.data;
              this.loading = false;
            })
            .catch((response) => {
              //失败回调
              this.$confirm('服务器失联！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            })
        } else {
          var api = `/api/SCSServices/getOffShoreArea.action`;
          this.title = "近海海区";
          this.$axios.get(api)
            .then((response) => {
              this.tableData = response.data;
              this.loading = false;
            })
            .catch((response) => {
              //失败回调
              this.$confirm('服务器失联！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            })
        }
      },

      selectDeleteData(row, event, column){ //获取选中的待删除row
        this.deletedArea = row;
      },
      selectAddData(row, event, column){ //获取选中的待添加row
        this.addedArea = row;
      },
      // 将数据删除至维选中区域
      deleteArea(){
        if(this.deletedArea.areaName == ""){
          this.$confirm('未选中数据！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }else {
          //表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
          this.tableData.splice(this.tableData.indexOf(this.deletedArea), 1);
          this.unSelectedTable.push(this.deletedArea);
        }
      },
      // 将数据从删除去移至选中区
      addArea(){
        if(this.addedArea.areaName == ""){
          this.$confirm('未选中数据！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }else {
          this.unSelectedTable.splice(this.unSelectedTable.indexOf(this.addedArea), 1);
          this.tableData.push(this.addedArea);
        }
      },
      // 将未选中区域数据，全部添加至选中区域
      allAdd(){
        if(this.unSelectedTable.length < 1){
          this.$confirm('全部数据已选中！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }else{
          var that = this.tableData;
          this.unSelectedTable.forEach(function (areaValue) {
            that.push(areaValue)
          })
          this.unSelectedTable = undefined;
          this.unSelectedTable = new Array();
        }
      },
      // 将选中区域数据，全部添加未选中区
      allDelete(){
        if(this.tableData.length < 1){
          this.$confirm('全部数据未选中！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }else{
          var that = this.unSelectedTable;
          this.tableData.forEach(function (areaValue) {
            that.push(areaValue)
          })
          this.tableData = undefined;
          this.tableData = new Array();
        }
      },
      //打开预报面板
      openForecastModal(){
        if (this.loading == false) { //表格中数据已加载完成
          this.loading = true;  //将表格加载设置为true
          // this.areaModal = true; //打开预测轮播，不关闭区域选择
          // 打开预报模态框
          this.$refs.forecastModal.openForecastModal(this.tableData, this.forecastType );
        }else{
          this.$confirm('数据未加载完成！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          })
        }
      },

    }
  }
</script>

<style scoped>
  .buttonStyle{
    margin-top: 20%;
    padding-left: 20%;
  }
</style>
