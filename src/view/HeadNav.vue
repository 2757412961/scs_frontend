<template>

  <el-container style="height:60px;background-color: #545c64;">
    <el-aside width="400px">
      <a href="#">
        <img
          id="img_logo"
          src="~assets/nmefc_new.png"
        >
      </a>
      <h1 id="h_title">
        {{this.$store.state.title}}
      </h1>
    </el-aside>
    <el-main style="padding:0;position: relative;">
      <el-menu
        default-active="typhoon"
        class="el-menu-demo"
        mode="horizontal"
        @select="selectMenu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="typhoon">台风警报</el-menu-item>
        <el-submenu index="fullScreen">
          <template slot="title">滚动预报</template>
          <el-menu-item index="fullScreenSesArea">近海海区</el-menu-item>
          <el-menu-item index="fullScreenLawArea">执法海域</el-menu-item>
        </el-submenu>
        <el-menu-item index="seaArea">近海预报</el-menu-item>
        <!--<el-menu-item index="observation">观测实况</el-menu-item>-->
        <el-menu-item index="lawArea">执法海域</el-menu-item>
        <el-menu-item index="predictionPaper">预报单</el-menu-item>
        <el-submenu index="numericalPrediction">
          <template slot="title">智能网格预报</template>
          <!--<el-menu-item index="regionNumerical">区域模式</el-menu-item>-->
          <el-menu-item index="globalNumerical">海面风浪-全球模式</el-menu-item>
          <el-menu-item index="pnWeather">天气现象-西北太</el-menu-item>
          <el-menu-item index="gzaWeather">天气现象-南海中北部</el-menu-item>
        </el-submenu>
        <!--<el-menu-item index="sateliteImg">卫星产品</el-menu-item>
        <el-menu-item index="weatherAnalys">天气分析</el-menu-item>
        <el-menu-item index="productImg">数值产品</el-menu-item>-->
        <el-menu-item index="userManager">管理员功能</el-menu-item>
      </el-menu>

      <!--<div style="position: absolute;top: 50%;transform: translateY(-50%);right: 0;">-->
      <!--<el-button type="text" style="padding: 5px;" @click="btn_user_click"><font-awesome-icon :icon="['far','user']"/><span style="padding:5px">您好，{{user}}</span></el-button>-->
      <!--<el-button type="text" style="padding: 5px;"><font-awesome-icon :icon="['far','question-circle']"/>帮助</el-button>-->
      <!--<el-button type="text" style="padding: 5px;" @click="signOutAlert"><font-awesome-icon :icon="['fas','sign-out-alt']" />退出</el-button>-->
      <user-modal ref="userModal"></user-modal>
      <roll-modal ref="rollModal"></roll-modal>
      <ProductImgsModal ref="productImgsModal"></ProductImgsModal>
      <predictionPaper-modal ref="predictionPaperModal"></predictionPaper-modal>
      <!--</div>-->
    </el-main>

    <el-row style="width: 300px">
      <el-col :span="18">
        <h2 style="font-family: 'Microsoft YaHei'; color: #e6fdff; float: right;">{{username}} 你好！</h2>
      </el-col>
      <el-col :span="6">
        <Button type="text">
          <Icon type="md-exit" size="40" color="#e6fdff" @click="signOut">登出</Icon>
        </Button>
      </el-col>
    </el-row>

  </el-container>
</template>

<script>
    import UserModal from "../components/User/UserModal";
    import RollModal from "../components/RollForecast/AreaSelectModal"
    import ProductImgsModal from "../components/NumericalPrediction/ProductImgs";
    import PredictionPaperModal from "../components/PredictionPaper/PredictionPaper"

    export default {
        name: "HeadNav",
        components: {UserModal, RollModal, ProductImgsModal, PredictionPaperModal},
        data() {
            return {
                active: 'dataSearch',
            }
        },
        computed: {
            username() {
                return this.$store.state.userName
            }
        },
        methods: {
            selectMenu(key) {
                if (null != key && key != 'predictionPaper' && key != 'userManager') {
                    this.$emit('clearMap', '');
                }
                switch (key) {
                    //如果是右侧sider，跳转router
                    case "typhoon":
                    case "seaArea":
                    case "observation":
                    case "lawArea":
                    case "regionNumerical":
                    case "globalNumerical":
                        this.$router.push({
                            name: key
                        });
                        break;
                    //如果是弹出窗口，则打开对应Modal
                    case "predictionPaper":
                        this.$refs.predictionPaperModal.openPredictionModal();
                        break;
                    case "fullScreenSesArea":  //滚动预报-近海海区 false
                        this.$refs.rollModal.openRollForecastModal(false);
                        break;
                    case "fullScreenLawArea":   //滚动预报-执法海域 true
                        this.$refs.rollModal.openRollForecastModal(true);
                        break;
                    case "pnWeather":
                        this.$refs.productImgsModal.openProductImgsModal('xbt');
                        break;
                    case "gzaWeather":
                        this.$refs.productImgsModal.openProductImgsModal('gza');
                        break;
                    case "sateliteImg":
                        break;
                    case "weatherAnalys":
                        break;
                    case "productImg":
                        break;
                    case "userManager":
                        if (this.$store.state.category == 1) {
                            this.$axios.get(`/api/SCSServices/AllUsers.action`)
                                .then((response) => {
                                    this.$refs.userModal.openUserModal(response.data)
                                })
                                .catch((response) => {
                                    //失败回调
                                    this.$confirm('服务器失联！', '提示', {
                                        confirmButtonText: '确定',
                                        type: 'warning'
                                    });
                                })

                        } else {
                            this.$message({
                                type: 'warning',
                                message: '您不是管理员!'
                            });
                        }
                        break;

                }
            },
            signOut() {
                let that = this;
                this.$confirm('此操作将退出当前账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios(`/api/SCSServices/logout.action`)
                        .then((res) => {
                            if (res.data) {
                                //跳转到登录界面
                                that.$store.commit('setUserName', "");
                                that.$store.commit('setCategory', "");
                                that.$router.push({name: 'login'});
                                this.$message({
                                    type: 'success',
                                    message: '退出登录成功！'
                                });
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '退出登陆失败！'
                                });
                            }
                        })
                        .catch((err) => {
                            this.$message({
                                type: 'error',
                                message: '退出异常！'
                            });
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消退出登录！'
                    });
                });
            }
        }
    }
</script>


<style scoped>
  .el-menu {
    border: 0;
    height: 58px
  }

  #img_logo {
    height: 50px;
    width: 50px;
    position: absolute;
    float: left;
    left: 20px;
    top: 5px;
  }

  #h_title {
    position: absolute;
    left: 100px;
    margin-top: 0px;
    color: white;
  }

  .el-button {
    color: #35495e;
  }

  .el-menu-item {
    padding: 0 15px;
  }

  .el-submenu__title {
    padding: 0 15px;
  }
</style>
