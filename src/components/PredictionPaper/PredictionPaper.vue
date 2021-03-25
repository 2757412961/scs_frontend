<template>
  <!--预报单modal-->
  <modal width="800" :mask-closable="false"
         v-model="predictionModal"
         title="海区环境预报单" @on-ok="predictionModal=false"
         @on-cancel="loading=true">

    <div class="predictionContent_class">

      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">海区预报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="seaAreaSelectedYear" style="width:80px" @change="seaAreaYearChange">
            <el-option
              v-for="(item,index) in seaAreaYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="seaAreaSelectedMonth" style="width:60px;"  @change="seaAreaMonthChange">
            <el-option
              v-for="(item,index)  in seaAreaMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="seaAreaSelectedDay" style="width:60px" @change="">
            <el-option
              v-for="(item,index)  in seaAreaDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时" style="margin-left: 10px;">
          <el-select v-model="seaAreaHourDefault" style="width:60px">
            <el-option
              label="20"
              :value="20">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="seaAreaLoadFile">查询</el-button>
        </el-form-item>
      </el-form>


      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">执法预报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="lawAreaSelectedYear" style="width:80px" @change="lawAreaYearChange">
            <el-option
              v-for="(item,index) in lawAreaYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="lawAreaSelectedMonth" style="width:60px"  @change="lawAreaMonthChange">
            <el-option
              v-for="(item,index) in lawAreaMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="lawAreaSelectedDay" style="width:60px" @change="lawAreaDayChange">
            <el-option
              v-for="(item,index) in lawAreaDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时" style="margin-left: 10px;">
          <el-select v-model="lawAreaSelectedHour" style="width:60px">
            <el-option
              v-for="(item,index) in lawAreaHour"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="lawAreaLoadFile">查询</el-button>
        </el-form-item>
      </el-form>


      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">台风预报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="编号">
          <el-select v-model="typhoonSelectedNum" style="width:95px" @change="typhoonNumChange">
            <el-option
              v-for="(item,index)  in typhoonNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预报时次" style="margin-left: 10px;">
          <el-select v-model="typhoonSelectedReleaseNum" style="width:60px"  @change="typhoonReleaseNumChange">
            <el-option
              v-for="(item,index)  in typhoonReleaseNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" style="margin-left: 10px;">
          <el-select v-model="typhoonSelectedReleaseDate" style="width:120px" @change="lawAreaDayChange">
            <el-option
              v-for="(item,index)  in typhoonReleaseDate"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="typhoonLoadFile">查询</el-button>
        </el-form-item>
      </el-form>


      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">热带低压消息</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="编号">
          <el-select v-model="tropicsSelectedNum" style="width:95px" @change="tropicsNumChange">
            <el-option
              v-for="(item,index)  in tropicsNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预报时次" style="margin-left: 10px;">
          <el-select v-model="tropicsSelectedReleaseNum" style="width:65px"  @change="tropicsReleaseNumChange">
            <el-option
              v-for="(item,index)  in tropicsReleaseNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" style="margin-left: 10px;">
          <el-select v-model="tropicsSelectedReleaseDate" style="width:120px">
            <el-option
              v-for="(item,index)  in tropicsReleaseDate"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="tropicsLoadFile">查询</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">未来十天预报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="nextTenDaysSelectedYear" style="width:80px" @change="nextTenDaysYearChange">
            <el-option
              v-for="(item,index) in nextTenDaysYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="nextTenDaysSelectedMonth" style="width:60px"  @change="nextTenDaysMonthChange">
            <el-option
              v-for="(item,index)  in nextTenDaysMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="nextTenDaysSelectedDay" style="width:60px">
            <el-option
              v-for="(item,index)  in nextTenDaysDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="nextTenDaysLoadFile">查询</el-button>
        </el-form-item>
      </el-form>

      <!--<el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">海冰预报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="seaIceSelectedYear" style="width:80px" @change="seaIceYearChange">
            <el-option
              v-for="(item,index) in seaIceYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号" style="margin-left: 10px;">
          <el-select v-model="seaIceSelectedNum" style="width:60px"  @change="seaIceNumChange">
            <el-option
              v-for="(item,index)  in seaIceNum"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期" style="margin-left: 10px;">
          <el-select v-model="seaIceSelectedCycle" style="width:90px">
            <el-option
              v-for="(item,index)  in seaIceCycle"
              :key="index"
              :label="seaIceCycleName(item)"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="seaIceLoadFile">查询</el-button>
        </el-form-item>
      </el-form>-->

      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">未来四周预报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="next4WeeksSelectedYear" style="width:80px" @change="next4WeeksYearChange">
            <el-option
              v-for="(item,index) in next4WeeksYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="next4WeeksSelectedMonth" style="width:60px"  @change="next4WeeksMonthChange">
            <el-option
              v-for="(item,index)  in next4WeeksMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="next4WeeksSelectedDay" style="width:60px" >
            <el-option
              v-for="(item,index)  in next4WeeksDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="next4WeeksLoadFile">查询</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">海浪警报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="nextTenDaysSelectedYear" style="width:80px" @change="nextTenDaysYearChange">
            <el-option
              v-for="(item,index) in nextTenDaysYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="nextTenDaysSelectedMonth" style="width:60px"  @change="nextTenDaysMonthChange">
            <el-option
              v-for="(item,index)  in nextTenDaysMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="nextTenDaysSelectedDay" style="width:60px" @change="lawAreaDayChange">
            <el-option
              v-for="(item,index)  in nextTenDaysDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="nextTenDaysLoadFile">查询</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">风暴潮警报单</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="nextTenDaysSelectedYear" style="width:80px" @change="nextTenDaysYearChange">
            <el-option
              v-for="(item,index) in nextTenDaysYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="nextTenDaysSelectedMonth" style="width:60px"  @change="nextTenDaysMonthChange">
            <el-option
              v-for="(item,index)  in nextTenDaysMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="nextTenDaysSelectedDay" style="width:60px" @change="lawAreaDayChange">
            <el-option
              v-for="(item,index)  in nextTenDaysDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="nextTenDaysLoadFile">查询</el-button>
        </el-form-item>
      </el-form>

      <el-divider content-position="left" >
        <span style="font-size: 16px; line-height: 1.6; font-weight: bold;">台风决策服务信息</span>
      </el-divider>
      <el-form :inline="true" class="prediction-form-inline" size="mini">
        <el-form-item label="年">
          <el-select v-model="jcfwxxSelectedYear" style="width:80px" @change="jcfwxxYearChange">
            <el-option
              v-for="(item,index) in jcfwxxYear"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="月" style="margin-left: 10px;">
          <el-select v-model="jcfwxxSelectedMonth" style="width:60px"  @change="jcfwxxMonthChange">
            <el-option
              v-for="(item,index)  in jcfwxxMonth"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日" style="margin-left: 10px;">
          <el-select v-model="jcfwxxSelectedDay" style="width:60px">
            <el-option
              v-for="(item,index)  in jcfwxxDay"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 10px;">
          <el-button type="primary" @click="jcfwxxLoadFile">查询</el-button>
        </el-form-item>
      </el-form>

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
        seaAreaHourDefault: '20',
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

        // 未来四周预报单下拉栏
        next4WeeksYear: {},
        next4WeeksMonth: {},
        next4WeeksDay: {},
        next4WeeksSelectedYear: '',
        next4WeeksSelectedMonth: '',
        next4WeeksSelectedDay: '',
        next4WeeksPaperFileName: {}, //预报单名称

        // 未来四周预报单下拉栏
        jcfwxxYear: {},
        jcfwxxMonth: {},
        jcfwxxDay: {},
        jcfwxxSelectedYear: '',
        jcfwxxSelectedMonth: '',
        jcfwxxSelectedDay: '',
        jcfwxxPaperFileName: {}, //预报单名称

        // 海冰预报单下拉栏
        /*seaIceYear: {},
        seaIceNum: {},
        seaIceCycle: {},
        seaIceSelectedYear: '',
        seaIceSelectedNum: '',
        seaIceSelectedCycle: '',
        seaIcePaperFileName: {}, //预报单名称*/
      }

    },
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

      // 未来四周预报pdf
      next4WeeksPaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/zcqyb/" + val.fileName,'_blank');
      },

      // 决策服务信息预报pdf
      jcfwxxPaperFileName(val){
        window.open("http://" + this.$store.state.serverIP + "/jcfwxx/" + val.fileName,'_blank');
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
        this.getnext4WeeksForecastConditon("","","",)
        this.getjcfwxxForecastConditon("","","",)

        // this.getSeaIceForecastConditon("","","");
      },

      /**  海冰预报单  **/
      /*seaIceCycleName(val){
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
      },*/

      /**  海冰预报单  **/

      /**  决策服务信息预报单  **/

      jcfwxxLoadFile(){
        this.getjcfwxxForecastConditon(this.jcfwxxSelectedYear,this.jcfwxxSelectedMonth,this.jcfwxxSelectedDay);
      },
      jcfwxxYearChange(val){
        this.getjcfwxxForecastConditon(val,"","");
      },
      jcfwxxMonthChange(val){
        this.getjcfwxxForecastConditon(this.jcfwxxSelectedYear,val,"");
      },
      getjcfwxxForecastConditon(year,month,day){
        var api = `/api/SCSServices/getJCFWXXPrediction.action?year=${year}&month=${month}&day=${day}`;
        this.$axios.get(api).then((response) => {
          let jcfwxxSelectData = response.data
          if (jcfwxxSelectData.hasOwnProperty("year")){
            this.jcfwxxYear = jcfwxxSelectData.year;
            this.jcfwxxSelectedYear = this.jcfwxxYear[this.jcfwxxYear.length-1];
          }
          if (jcfwxxSelectData.hasOwnProperty("month")){
            this.jcfwxxMonth = jcfwxxSelectData.month;
            this.jcfwxxSelectedMonth = this.jcfwxxMonth[this.jcfwxxMonth.length-1];
          }
          if (jcfwxxSelectData.hasOwnProperty("day")){
            this.jcfwxxDay = jcfwxxSelectData.day;
            this.jcfwxxSelectedDay = this.jcfwxxDay[this.jcfwxxDay.length-1];
          }
          if (jcfwxxSelectData.hasOwnProperty("fileName")){
            this.jcfwxxPaperFileName = {'fileName': jcfwxxSelectData.fileName[0],'id': new Date() };
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

      /**  决策服务信息预报单  **/

      /**  未来四周预报单  **/

      next4WeeksLoadFile(){
        this.getnext4WeeksForecastConditon(this.next4WeeksSelectedYear,this.next4WeeksSelectedMonth,this.next4WeeksSelectedDay);
      },
      next4WeeksYearChange(val){
        this.getnext4WeeksForecastConditon(val,"","");
      },
      next4WeeksMonthChange(val){
        this.getnext4WeeksForecastConditon(this.next4WeeksSelectedYear,val,"");
      },
      getnext4WeeksForecastConditon(year,month,day){
        var api = `/api/SCSServices/getNext4WeeksPrediction.action?year=${year}&month=${month}&day=${day}`;
        this.$axios.get(api).then((response) => {
          let next4WeeksSelectData = response.data
          if (next4WeeksSelectData.hasOwnProperty("year")){
            this.next4WeeksYear = next4WeeksSelectData.year;
            this.next4WeeksSelectedYear = this.next4WeeksYear[this.next4WeeksYear.length-1];
          }
          if (next4WeeksSelectData.hasOwnProperty("month")){
            this.next4WeeksMonth = next4WeeksSelectData.month;
            this.next4WeeksSelectedMonth = this.next4WeeksMonth[this.next4WeeksMonth.length-1];
          }
          if (next4WeeksSelectData.hasOwnProperty("day")){
            this.next4WeeksDay = next4WeeksSelectData.day;
            this.next4WeeksSelectedDay = this.next4WeeksDay[this.next4WeeksDay.length-1];
          }
          if (next4WeeksSelectData.hasOwnProperty("fileName")){
            this.next4WeeksPaperFileName = {'fileName': next4WeeksSelectData.fileName[0],'id': new Date() };
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

      /**  未来四周预报单  **/

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

<style scoped>
  .prediction-form-inline{
    margin-left:3%;
  }
</style>

<style>

  #pdfDialog .el-dialog__body{
    padding: 10px;
  }

  .predictionContent_class {
    height: calc(60vh);
    overflow-y: scroll;
  }


  #rightBtn .el-button {
    font-size: 30px;
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

  .predictionContent_class::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .predictionContent_class::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
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
  .predictionContent_class::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
  }
</style>
