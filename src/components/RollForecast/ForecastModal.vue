<template>
  <modal width="90%" height="800px" :mask-closable="false"
         v-model="areaModal" :fullscreen="isFullScreen"
         :title="title">

    <el-carousel :interval="4000" type="card" id="forecastPanel" :height="panelHeight">
      <el-carousel-item v-for="item in 6" :key="item">
        <h3 class="medium">{{ item }}</h3>
        <el-table
          :data="tableData1"
          style="width: 100%">
          <el-table-column
            prop="date"
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
      </el-carousel-item>
    </el-carousel>

    <div slot="footer">
      <Button type="error" size="large" long @click="cancelFullScreen">{{fullScreenText}}</Button>-->
    </div>
  </modal>
</template>

<script>

  export default {
    name: "forecast-modal",
    data() {
      return {
        panelHeight: '550px',
        isFullScreen: true,
        fullScreenText: '关闭全屏',
        title: '',
        areaModal: false,
        centerDialogVisible: false,
        tableData: [],   //用于轮播的数据
        tableData1: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
      }
    },
    methods: {
      openForecastModal(table) {
        this.areaModal = true;
        this.title = "未来10天天气预报",
        //this.centerDialogVisible = true;
        this.tableData = table;
      },
      cancelFullScreen(){
        this.isFullScreen = !this.isFullScreen;
        if(this.isFullScreen){
          this.fullScreenText = '关闭全屏';
          this.panelHeight = '500px';
        }else{
          this.fullScreenText = '打开全屏';
          this.panelHeight = '300px';
        }
      }
    }
  }
</script>

<style scoped>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }


</style>
