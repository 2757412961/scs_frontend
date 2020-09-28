<template>
  <div>
    <div class="globalNumBtn_class" :style="this.rightIsHide?'margin-left:95%':'margin-left:74%'">
      <el-row>
        <el-button id="globalNumRightBtn" style="font-size: 30px;" :icon="this.btnIconData" circle
                   @click="rightBarHide"></el-button>
      </el-row>
    </div>

    <el-collapse id="predictPaper_panel" class="globalNumCollapse_class" v-model="activeNames" @change="rightBarHide">
      <el-collapse-item id="globalNumRightBar" name="rightSide"
                        :class="[this.rightIsHide?'seaAreRightInner-container-right':'seaAreRightInner-container-left']">
        <div class="predictPaper_title">
          预报单
        </div>
        <div style="height: 400px">

        </div>

      </el-collapse-item>

    </el-collapse>
  </div>
</template>

<script>
    export default {
        name: "GlobalNumerical",
      data() {
        return {
          rightIsHide: false,
          btnIconData: 'el-icon-d-arrow-right',//按钮图标
          activeNames: ['rightSide'],
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

      },
    }
</script>

<style>

  .predictPaper_title {
    width: 96%;
    font-size: 20px;
    line-height: 1.7;
    font-weight: bold;
    border: 2px solid #3681aa;
    margin: 2%;
    border-radius: 7px;
  }




  /** 右侧边栏**/
  #globalNumRightBtn .el-button {
    font-size: 30px;
  }

  .globalNumBtn_class {
    margin-left: 74%;
    margin-top: 15%;
    position: fixed;
  }

  .globalNumCollapse_class {
    margin-left: 78%;
    margin-top: 1%;
    width: 21%;
    position: fixed;
    border: 0;
  }

  #globalNumRightBar .el-collapse-item__header {
    font-size: 0px;
    height: 0px;
    border: 0;
  }

  #globalNumRightBar .el-collapse-item__content {
    padding-bottom: 15px;
  }

  #globalNumRightBar .el-collapse-item__wrap {
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
  /** 右侧边栏**/
</style>
