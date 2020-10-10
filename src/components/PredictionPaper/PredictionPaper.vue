<template>
  <!--预报单modal-->
  <modal width="800" :mask-closable="false"
         v-model="predictionModal"
         title="海区环境预报单" @on-ok="predictionModal=false"
         @on-cancel="loading=true">
    <div class="predictionContent_class">

      <div id="seaAreaPrediction" class="seaAreaPrediction">
        <div class="prediction_title">
          <span style="">海区预报单</span>
        </div>

        <div class="predictDivBtn_class" @click="seaAreaLoadFile">
          <span>加载</span>
        </div>

        <div class="predictionLeftSel">
          <span>年：</span>
          <el-select class="forecastPaperSel" v-model="seaAreaSelectedYear" placeholder="请选择" size="mini" @change="seaAreaYearChange">
            <el-option
              v-for="(item,index) in seaAreaYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span>月：</span>
          <el-select class="forecastPaperSel" v-model="seaAreaSelectedMonth" placeholder="请选择" size="mini" @change="seaAreaMonthChange">
            <el-option
              v-for="(item,index)  in seaAreaMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionLeftSel">
          <span>日：</span>
          <el-select class="forecastPaperSel" v-model="seaAreaSelectedDay" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index)  in seaAreaDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span style="">20时</span>
          <div style=" display: inline-block;" class="forecastPaperSel">
          </div>
        </div>

      </div>

      <div id="lawAreaPrediction" class="seaAreaPrediction">
        <div class="prediction_title">
          <span style="">执法预报单</span>
        </div>

        <div class="predictDivBtn_class" @click="lawAreaLoadFile">
          <span>加载</span>
        </div>

        <div class="predictionLeftSel">
          <span>年：</span>
          <el-select class="forecastPaperSel" v-model="lawAreaSelectedYear" placeholder="请选择" size="mini"  @change="lawAreaYearChange">
            <el-option
              v-for="(item,index) in lawAreaYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span>月：</span>
          <el-select class="forecastPaperSel" v-model="lawAreaSelectedMonth" placeholder="请选择" size="mini"  @change="lawAreaMonthChange">
            <el-option
              v-for="(item,index) in lawAreaMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionLeftSel">
          <span >日：</span>
          <el-select class="forecastPaperSel" v-model="lawAreaSelectedDay" placeholder="请选择" size="mini" @change="lawAreaDayChange">
            <el-option
              v-for="(item,index) in lawAreaDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span>时：</span>
          <el-select class="forecastPaperSel" v-model="lawAreaSelectedHour" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index) in lawAreaHour"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <div id="typhoonPrediction" class="seaAreaPrediction">
        <div class="prediction_title">
          <span style="">台风预报单</span>
        </div>

        <div class="predictDivBtn_class" @click="typhoonLoadFile">
          <span>加载</span>
        </div>

        <div class="predictionLeftSel" style="width: 90%">
          <span style="">台风编号：</span>
          <el-select style="width: 60%" v-model="typhoonSelectedNum" placeholder="请选择" size="mini" @change="typhoonNumChange">
            <el-option
              v-for="(item,index)  in typhoonNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel"  style="width: 90%">
          <span style="">预报次数：</span>
          <el-select style="width: 60%" v-model="typhoonSelectedReleaseNum" placeholder="请选择" size="mini" @change="typhoonReleaseNumChange">
            <el-option
              v-for="(item,index)  in typhoonReleaseNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionLeftSel"  style="width: 90%">
          <span style="">发布时间：</span>
          <el-select style="width: 60%" v-model="typhoonSelectedReleaseDate" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index)  in typhoonReleaseDate"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <div id="tropicsPrediction" class="seaAreaPrediction">
        <div class="prediction_title">
          <span style="">热带低压消息</span>
        </div>

        <div class="predictDivBtn_class" @click="tropicsLoadFile">
          <span>加载</span>
        </div>

        <div class="predictionLeftSel" style="width: 90%">
          <span style="">编号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-select style="width: 60%" v-model="tropicsSelectedNum" placeholder="请选择" size="mini" @change="tropicsNumChange">
            <el-option
              v-for="(item,index)  in tropicsNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel"  style="width: 90%">
          <span style="">预报次数：</span>
          <el-select style="width: 60%" v-model="tropicsSelectedReleaseNum" placeholder="请选择" size="mini" @change="tropicsReleaseNumChange">
            <el-option
              v-for="(item,index)  in tropicsReleaseNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionLeftSel"  style="width: 90%">
          <span style="">发布时间：</span>
          <el-select style="width: 60%" v-model="tropicsSelectedReleaseDate" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index)  in tropicsReleaseDate"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>

      <div id="tenDaysPrediction" class="seaAreaPrediction">
        <div class="prediction_title">
          <span style="">未来十天预报单</span>
        </div>

        <div class="predictDivBtn_class" @click="nextTenDaysLoadFile">
          <span>加载</span>
        </div>

        <div class="predictionLeftSel">
          <span>年：</span>
          <el-select class="forecastPaperSel" v-model="nextTenDaysSelectedYear" placeholder="请选择" size="mini" @change="nextTenDaysYearChange">
            <el-option
              v-for="(item,index) in nextTenDaysYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span>月：</span>
          <el-select class="forecastPaperSel" v-model="nextTenDaysSelectedMonth" placeholder="请选择" size="mini" @change="nextTenDaysMonthChange">
            <el-option
              v-for="(item,index) in nextTenDaysMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionLeftSel">
          <span>日：</span>
          <el-select class="forecastPaperSel" v-model="nextTenDaysSelectedDay" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index) in nextTenDaysDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span></span>
          <div style="display: inline-block;" class="forecastPaperSel">
          </div>
        </div>
      </div>

      <div id="icePrediction" class="seaAreaPrediction">
        <div class="prediction_title">
          <span style="">海冰预报单</span>
        </div>

        <div class="predictDivBtn_class" @click="seaIceLoadFile">
          <span>加载</span>
        </div>

        <div class="predictionLeftSel">
          <span>年：&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-select class="forecastPaperSel" v-model="seaIceSelectedYear" placeholder="请选择" size="mini" @change="seaIceYearChange">
            <el-option
              v-for="(item,index) in seaIceYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel">
          <span>编号：</span>
          <el-select style="width: 65%" v-model="seaIceSelectedNum" placeholder="请选择" size="mini" @change="seaIceNumChange">
            <el-option
              v-for="(item,index) in seaIceNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>

        <div class="predictionRightSel"  style="width: 90%">
          <span>周期：</span>
          <el-select style="width: 60%" v-model="seaIceSelectedCycle" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index)  in seaIceCycle"
              :key="index"
              :label="seaIceCycleName(item)"
              :value="item">
            </el-option>
          </el-select>
        </div>

      </div>

    </div>
  </modal>
</template>

<script>
  export default {
    name: "predictionPaper-modal",
    data() {
      return {
        predictionModal: false,
        rightIsHide: false,
        btnIconData: 'el-icon-d-arrow-right',//按钮图标
        activeNames: ['rightSide'],
        // 海区预报单下拉栏
        seaAreaYear: {},
        seaAreaMonth: {},
        seaAreaDay: {},
        seaAreaSelectedYear: '',
        seaAreaSelectedMonth: '',
        seaAreaSelectedDay: '',
        seaAreaPaperFileName: {}, //预报单名称
        // 执法预报单下拉栏
        lawAreaYear: {},
        lawAreaMonth: {},
        lawAreaDay: {},
        lawAreaHour: {},
        lawAreaSelectedYear: '',
        lawAreaSelectedMonth: '',
        lawAreaSelectedDay: '',
        lawAreaSelectedHour: '',
        lawAreaPaperFileName: {},
        // 台风预报单下拉栏
        typhoonNum: {},
        typhoonReleaseNum: {},
        typhoonReleaseDate: {},
        typhoonSelectedNum: '',
        typhoonSelectedReleaseNum: '',
        typhoonSelectedReleaseDate: '',
        typhoonPaperFileName: '',

        // 热带低压预报单下拉栏
        tropicsNum: {},
        tropicsReleaseNum: {},
        tropicsReleaseDate: {},
        tropicsSelectedNum: '',
        tropicsSelectedReleaseNum: '',
        tropicsSelectedReleaseDate: '',
        tropicsPaperFileName: {},

        // 未来十天预报单下拉栏
        nextTenDaysYear: {},
        nextTenDaysMonth: {},
        nextTenDaysDay: {},
        nextTenDaysSelectedYear: '',
        nextTenDaysSelectedMonth: '',
        nextTenDaysSelectedDay: '',
        nextTenDaysPaperFileName: {}, //预报单名称

        // 海冰预报单下拉栏
        seaIceYear: {},
        seaIceNum: {},
        seaIceCycle: {},
        seaIceSelectedYear: '',
        seaIceSelectedNum: '',
        seaIceSelectedCycle: '',
        seaIcePaperFileName: {}, //预报单名称
      }

    },
    /*created() {
      this.getSeaAreaForecastConditon("","","");
      this.getLawAreaForecastConditon("","","", "")
      this.getTyphoonForecastConditon("","","")
      this.getTropicsForecastConditon("","","")
      this.getNextTenDaysForecastConditon("","","");
      this.getSeaIceForecastConditon("","","");
    },*/
    watch: {
      // 监听近海海区预报pdf
      seaAreaPaperFileName(val){
       window.open("http://" + this.$store.state.serverIP + "/hqybd/" + val.fileName,'_blank');
      },

      // 监听执法海区预报pdf
      lawAreaPaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/zfybd/" + val.fileName,'_blank');
      },

      // 台风预报pdf
      typhoonPaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/tfybd/" + val.fileName,'_blank');
      },
      // 热带低压预报pdf
      tropicsPaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/tfybd/" + val.fileName,'_blank');
      },
      // 未来十天预报pdf
      nextTenDaysPaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/wlstybd/" + val.fileName,'_blank');
      },

      // 海冰预报pdf
      seaIcePaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/hbybd/" + val.fileName,'_blank');
      },

    },
    methods: {
      /**打开预报单modal**/
      openPredictionModal(){
        this.predictionModal = true
        this.getSeaAreaForecastConditon("","","");
        this.getLawAreaForecastConditon("","","", "")
        this.getTyphoonForecastConditon("","","")
        this.getTropicsForecastConditon("","","")
        this.getNextTenDaysForecastConditon("","","");
        this.getSeaIceForecastConditon("","","");
      },

      /**  海冰预报单  **/
      seaIceCycleName(val){
        if (val === 'x')
          return '旬预报'
        if (val === 'm')
          return '月预报'
        if (val === 'w')
          return '周预报'
      },
      seaIceLoadFile(){
        this.getSeaIceForecastConditon(this.seaIceSelectedYear, this.seaIceSelectedNum, this.seaIceSelectedCycle);
      },
      seaIceYearChange(val){
        this.getSeaIceForecastConditon(val,"","");
      },
      seaIceNumChange(val){
        this.getSeaIceForecastConditon(this.seaIceSelectedYear,val,"");
      },
      getSeaIceForecastConditon(year,iceNum,cycle){
        var api = `/api/SCSServices/getSeaIcePrediction.action?year=${year}&iceNum=${iceNum}&cycle=${cycle}`;
        this.$axios.get(api).then((response) => {
          let seaIceSelectData = response.data
          if (seaIceSelectData.hasOwnProperty("year")){
            this.seaIceYear = seaIceSelectData.year;
            this.seaIceSelectedYear = this.seaIceYear[this.seaIceYear.length-1];
          }
          if (seaIceSelectData.hasOwnProperty("iceNum")){
            this.seaIceNum = seaIceSelectData.iceNum;
            this.seaIceSelectedNum = this.seaIceNum[this.seaIceNum.length-1];
          }
          if (seaIceSelectData.hasOwnProperty("cycle")){
            this.seaIceCycle = seaIceSelectData.cycle;
            this.seaIceSelectedCycle = this.seaIceCycle[this.seaIceCycle.length-1];
          }
          if (seaIceSelectData.hasOwnProperty("fileName")){
            this.seaIcePaperFileName = {'fileName': seaIceSelectData.fileName[0],'id': new Date() };
          }
        })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },

      /**  海冰预报单  **/


      /**  未来十天预报单  **/
      nextTenDaysLoadFile(){
        this.getNextTenDaysForecastConditon(this.nextTenDaysSelectedYear,this.nextTenDaysSelectedMonth,this.nextTenDaysSelectedDay);
      },
      nextTenDaysYearChange(val){
        this.getNextTenDaysForecastConditon(val,"","");
      },
      nextTenDaysMonthChange(val){
        this.getNextTenDaysForecastConditon(this.nextTenDaysSelectedYear,val,"");
      },
      getNextTenDaysForecastConditon(year,month,day){
        var api = `/api/SCSServices/getNextTenDaysPrediction.action?year=${year}&month=${month}&day=${day}`;
        this.$axios.get(api).then((response) => {
          let nextTenDaysSelectData = response.data
          if (nextTenDaysSelectData.hasOwnProperty("year")){
            this.nextTenDaysYear = nextTenDaysSelectData.year;
            this.nextTenDaysSelectedYear = this.nextTenDaysYear[this.nextTenDaysYear.length-1];
          }
          if (nextTenDaysSelectData.hasOwnProperty("month")){
            this.nextTenDaysMonth = nextTenDaysSelectData.month;
            this.nextTenDaysSelectedMonth = this.nextTenDaysMonth[this.nextTenDaysMonth.length-1];
          }
          if (nextTenDaysSelectData.hasOwnProperty("day")){
            this.nextTenDaysDay = nextTenDaysSelectData.day;
            this.nextTenDaysSelectedDay = this.nextTenDaysDay[this.nextTenDaysDay.length-1];
          }
          if (nextTenDaysSelectData.hasOwnProperty("fileName")){
            this.nextTenDaysPaperFileName = {'fileName': nextTenDaysSelectData.fileName[0],'id': new Date() };
          }
        })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },
      /**  未来十天预报单  **/



      /**  热带低压预报单  **/
      tropicsLoadFile(){
        this.getTropicsForecastConditon(this.tropicsSelectedNum,this.tropicsSelectedReleaseNum,this.tropicsSelectedReleaseDate);
      },
      tropicsNumChange(val){
        this.getTropicsForecastConditon(val,"","");
      },
      tropicsReleaseNumChange(val){
        this.getTropicsForecastConditon(this.tropicsSelectedNum,val,"");
      },
      getTropicsForecastConditon(typhNum, releaseNum, releaseDate){ //参数与台风一致
        var api = `/api/SCSServices/getTropicsPrediction.action?typhNum=${typhNum}&releaseNum=${releaseNum}&releaseDate=${releaseDate}`;
        this.$axios.get(api).then((response) => {
          let tropicsSelectData = response.data
          if (tropicsSelectData.hasOwnProperty("typhNum")){
            this.tropicsNum = tropicsSelectData.typhNum;
            this.tropicsSelectedNum = this.tropicsNum[this.tropicsNum.length-1];
          }
          if (tropicsSelectData.hasOwnProperty("releaseNum")){
            this.tropicsReleaseNum = tropicsSelectData.releaseNum;
            this.tropicsSelectedReleaseNum = this.tropicsReleaseNum[this.tropicsReleaseNum.length-1];
          }
          if (tropicsSelectData.hasOwnProperty("releaseDate")){
            this.tropicsReleaseDate = tropicsSelectData.releaseDate;
            this.tropicsSelectedReleaseDate = this.tropicsReleaseDate[this.tropicsReleaseDate.length-1];
          }
          if (tropicsSelectData.hasOwnProperty("fileName")){
            this.tropicsPaperFileName = {'fileName': tropicsSelectData.fileName[0],'id': new Date() };
          }
        })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },

      /**  热带低压预报单  **/


      /**  台风预报单  **/
      typhoonLoadFile(){
        this.getTyphoonForecastConditon(this.typhoonSelectedNum,this.typhoonSelectedReleaseNum,this.typhoonSelectedReleaseDate);
      },
      typhoonNumChange(val){
        this.getTyphoonForecastConditon(val,"","");
      },
      typhoonReleaseNumChange(val){
        this.getTyphoonForecastConditon(this.typhoonSelectedNum,val,"");
      },
      getTyphoonForecastConditon(typhNum, releaseNum, releaseDate){
        var api = `/api/SCSServices/getTyphoonPrediction.action?typhNum=${typhNum}&releaseNum=${releaseNum}&releaseDate=${releaseDate}`;
        this.$axios.get(api).then((response) => {
          let typhoonSelectData = response.data
          if (typhoonSelectData.hasOwnProperty("typhNum")){
            this.typhoonNum = typhoonSelectData.typhNum;
            this.typhoonSelectedNum = this.typhoonNum[this.typhoonNum.length-1];
          }
          if (typhoonSelectData.hasOwnProperty("releaseNum")){
            this.typhoonReleaseNum = typhoonSelectData.releaseNum;
            this.typhoonSelectedReleaseNum = this.typhoonReleaseNum[this.typhoonReleaseNum.length-1];
          }
          if (typhoonSelectData.hasOwnProperty("releaseDate")){
            this.typhoonReleaseDate = typhoonSelectData.releaseDate;
            this.typhoonSelectedReleaseDate = this.typhoonReleaseDate[this.typhoonReleaseDate.length-1];
          }
          if (typhoonSelectData.hasOwnProperty("fileName")){
            this.typhoonPaperFileName = {'fileName': typhoonSelectData.fileName[0],'id': new Date() };
          }
        })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },
      /**  台风预报单  **/


      /**  执法预报单  **/
      lawAreaLoadFile(){
        this.getLawAreaForecastConditon(this.lawAreaSelectedYear,this.lawAreaSelectedMonth,this.lawAreaSelectedDay,this.lawAreaSelectedHour);
      },
      lawAreaYearChange(val){
        this.getLawAreaForecastConditon(val,"","","");
      },
      lawAreaMonthChange(val){
        this.getLawAreaForecastConditon(this.lawAreaSelectedYear,val,"","");
      },
      lawAreaDayChange(val){
        this.getLawAreaForecastConditon(this.lawAreaSelectedYear,this.lawAreaSelectedMonth,val,"");
      },
      getLawAreaForecastConditon(year,month,day, hour){
        var api = `/api/SCSServices/getLawAreaPrediction.action?year=${year}&month=${month}&day=${day}&hour=${hour}`;
        this.$axios.get(api).then((response) => {
          let lawAreaSelectData = response.data
          if (lawAreaSelectData.hasOwnProperty("year")){
            this.lawAreaYear = lawAreaSelectData.year;
            this.lawAreaSelectedYear = this.lawAreaYear[this.lawAreaYear.length-1];
          }
          if (lawAreaSelectData.hasOwnProperty("month")){
            this.lawAreaMonth = lawAreaSelectData.month;
            this.lawAreaSelectedMonth = this.lawAreaMonth[this.lawAreaMonth.length-1];
          }
          if (lawAreaSelectData.hasOwnProperty("day")){
            this.lawAreaDay = lawAreaSelectData.day;
            this.lawAreaSelectedDay = this.lawAreaDay[this.lawAreaDay.length-1];
          }
          if (lawAreaSelectData.hasOwnProperty("hour")){
            this.lawAreaHour = lawAreaSelectData.hour;
            this.lawAreaSelectedHour = this.lawAreaHour[this.lawAreaHour.length-1];
          }
          if (lawAreaSelectData.hasOwnProperty("fileName")){
            this.lawAreaPaperFileName = {'fileName': lawAreaSelectData.fileName[0],'id': new Date() };
          }
        })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },
      /**  执法预报单  **/

      /** 海区预报单 **/
      seaAreaLoadFile(){
        this.getSeaAreaForecastConditon(this.seaAreaSelectedYear,this.seaAreaSelectedMonth,this.seaAreaSelectedDay);
      },
      seaAreaYearChange(val){
        this.getSeaAreaForecastConditon(val,"","");
      },
      seaAreaMonthChange(val){
        this.getSeaAreaForecastConditon(this.seaAreaSelectedYear,val,"");
      },
      getSeaAreaForecastConditon(year,month,day){
        var api = `/api/SCSServices/getSeaAreaPrediction.action?year=${year}&month=${month}&day=${day}`;
        this.$axios.get(api).then((response) => {
          let seaAreaSelectData = response.data
          if (seaAreaSelectData.hasOwnProperty("year")){
            this.seaAreaYear = seaAreaSelectData.year;
            this.seaAreaSelectedYear = this.seaAreaYear[this.seaAreaYear.length-1];
          }
          if (seaAreaSelectData.hasOwnProperty("month")){
            this.seaAreaMonth = seaAreaSelectData.month;
            this.seaAreaSelectedMonth = this.seaAreaMonth[this.seaAreaMonth.length-1];
          }
          if (seaAreaSelectData.hasOwnProperty("day")){
            this.seaAreaDay = seaAreaSelectData.day;
            this.seaAreaSelectedDay = this.seaAreaDay[this.seaAreaDay.length-1];
          }
          if (seaAreaSelectData.hasOwnProperty("fileName")){
            this.seaAreaPaperFileName = {'fileName': seaAreaSelectData.fileName[0],'id': new Date() };
          }

        })
          .catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          })
      },
      /**海区预报单**/

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

    },
    ////////end
  }
</script>

<style>

  #pdfDialog .el-dialog__body{
    padding: 10px;
  }

  .forecastPaperSel {
    width: 70%;
  }

  .predictionContent_class {
    height: calc(60vh);
    overflow-y: scroll;
  }

  .predictDivBtn_class {
    width: 20%;
    float: right;
    margin: 2%;
    margin-right: 10%;
    cursor: pointer;
    font-size: 16px;
    line-height: 1.6;
    font-weight: bold;
  }
  .predictDivBtn_class:hover {
    background-color: #99b3cc;
  }

  .prediction_title {
    width: 46%;
    margin: 2%;
    float: left;
    font-size: 16px;
    line-height: 1.6;
    font-weight: bold;
  }

  .predictionLeftSel {
    width: 46%;
    margin: 2%;
    float: left;
  }

  .predictionRightSel {
    width: 46%;
    margin: 2%;
    float: left;
  }

  .seaAreaPrediction {
    width: 96%;
    border: 1px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
    display: inline-block;
  }

  .predictPaper_title {
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

  #rightBtn .el-button {
    font-size: 30px;
  }

  .predictBtn_class {
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
  }

  .predictPaper_class {
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
    border-radius: 8px;
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
