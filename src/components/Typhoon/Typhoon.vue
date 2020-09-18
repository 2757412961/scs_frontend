<template>
      <Sider ref="side_r"  collapsible :collapsed-width="1" v-model="isCollapsed" class="bg"  hide-trigger>
        <router-view></router-view>
        <Row>
          <Col span="4">
            <Icon @click.native="collapsedSider" :class="rotateIcon"  type="ios-arrow-dropleft-circle" size="28" style="color: rgb(200, 200, 200); " ></Icon>
          </Col>
        </Row>


        <List border size="small" style="border-color: #cccccc ; left: 5%; right: 5%; width: 90%">
          <ListItem>
            <ListItemMeta description="台风预警"  />
            <template slot="action">
              <li>
                <a href="" style="color: gray">返回</a>
              </li>
            </template>
          </ListItem>
        </List>

        <List border size="small" style="border-color: #cccccc; left: 5%; right: 5%; width: 90%; top: 1%">
          <ListItem>
            <ListItemMeta description="年份：" style="alignment: left" />
            <template>
              <Select v-model="selectedYear" style="width:60%; alignment: right; " size="small">
                <Option v-for="item in yearList" :value="item.value" :key="item.value">{{ item.value }}</Option>
              </Select>
            </template>
          </ListItem>
        </List>


        <!--         台风预警，返回按钮-->
<!--        v-table-scroll="loading"-->
        <Table border :columns="typhColumns" :data="typhList"
               :show-header="true" :border="false" height="250px"
               @on-row-click="chooseTyph"  highlight-row>
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
        </Table>

        <Table border :columns="routeColumns" :data="routeList"
               :show-header="true" :border="false" height="300px"
               @on-row-click="chooseTyph"  highlight-row>
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
        </Table>

        <Menu  width="auto" :class="menuitemClasses" accordion theme="dark">
        </Menu>
      </Sider>

</template>

<script>
    import { globalBus } from '../globalBus';

    export default {
      name: "Typhoon",
      data () {
        return {
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

          yearList: [],
          selectedYear:'',
          selectedTyph:'',
          typhMonitor: {},
          // 用对象数组可以直接保存后端发送的结果
          typhMonitorList: [{}],
        };
      },
      computed: {
        rotateIcon () {
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
          console.log('TyphoonList1');
          this.$axios.get(api)
            .then((response) => {

              console.log('TyphoonList2');//成功回调
              console.log(response);

              if(response.data!=null){

                for(var i=response.data.length-1; i>=0;i--){

                  // iview的select复选框只支持对象数组
                  var object0 = {"typhNum": response.data[i]['typhNum'],"typhName":response.data[i]['enName']+(response.data[i]['chName']==null?'':(' '+response.data[i]['chName']))};
                  this.typhList.push(object0);
                }
              }else{
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

              console.log('typhoonYear2');//成功回调

              if(response.data!=null){
                // console.log(response);
                // console.log(response.data[0].toString()+"***********");

                for(var i=0; i<response.data.length;i++){

                  // iview的select复选框只支持对象数组
                  var object0 = {"value": response.data[i].toString()};
                  this.yearList.push(object0);
                }

                this.selectedYear = response.data[0].toString();


              }else{
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

              console.log('typhoonOngoing2');//成功回调
              console.log(response);
              // console.log('----'+response.data['modelNum']);
              if(response.data!=null){

                this.selectedTyph = response.data['modelNum'];
                console.log('OK');

              }else{
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
          Date.prototype.format = function (format){
            var  o = {
              "y+": this.getFullYear(),
              "M+": this.getMonth()+1,
              "d+": this.getDate(),
              "h+": this.getHours(),
              "m+": this.getMinutes(),
              "s+": this.getSeconds()

            };

            if(/(y+)/.test(format)){
              format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o){
              if(new RegExp("("+k+")").test(format)){
                format = format.replace(RegExp.$1, o[k].toString().length == 2?o[k] : ("0" + o[k]).substr("" + o[k].length));
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
          // var api = `/api/SCSServices/typhoonRoute.action?typhNum=201306`;
          console.log('typhoonRoute1');
          this.$axios.get(api)
            .then((response) => {

              console.log('typhoonRoute2');//成功回调
              console.log(response);

              if(response.data!=null){

                for(var i=0; i<response.data.length;i++){
                  response.data[i]['routeTime'] = this.transferTime(response.data[i]['routeTime']);
                }

                this.typhMonitorList = response.data;
                // console.log('++++++++++++++');
                // console.log(this.typhMonitorList);

              }else{
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

        collapsedSider() {
          this.$refs.side_r.toggleCollapse();
        },

        // 把台风轨迹信息使用typhMonitor加载到轨迹表格中
        // 每加一条的同时修改typhMonitor，监听并在map中添加轨迹
        addToRouteTable() {

          for(var i=0; i<this.typhMonitorList.length;i++){
            // console.log('+++++++++++++');
            this.typhMonitor = this.typhMonitorList[i];
            // console.log(this.typhMonitor);
            // 显示到轨迹表格
            var object0 = {"time": this.typhMonitorList[i]['routeTime'],"windSpeed":this.typhMonitorList[i]['windSpeed']};

            // 添加到第一条，表格时间倒序，最近的在最上面
            this.routeList.unshift(object0);

          }
        },

        chooseTyph(typhIndex) {
          this.selectedTyph = typhIndex['typhNum'];
        }
      },

      // 挂载到html后执行，发送台风数据查询并渲染
      mounted: function(){
        this.typhoonYear();
        this.typhoonOngoing();
      },

      watch: {
        selectedYear: function(val, oldVal) {
          this.typhoonList(val);
        },
        selectedTyph: function(val, oldVal) {
          this.typhoonRoute(val);
        },
        typhMonitorList: function(val, oldVal) {
          this.addToRouteTable();
          console.log('where');
          globalBus.$emit('addTyphMonitor', val, oldVal);
        },
        typhMonitor: function(val, oldVal) {
          // console.log('where');
          // globalBus.$emit('addTyphMonitor', val, oldVal);

        }
      }
    }
</script>

<style scoped>

  .ivu-layout-header {
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
    position: absolute;bottom:0;top:61px;right:80%;left:0
  }
</style>
