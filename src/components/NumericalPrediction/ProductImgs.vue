<template>
  <Modal
    v-model="ProductImgsModal"
    :title="productTitle"
    draggable
    footer-hide
    width="850">

    <el-container style="padding: 0px">

      <el-header>
        <span>&#12288;&#12288;日期：</span>
        <el-date-picker
          v-model="productDate"
          size="small"
          style="width: 175px"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="timestamp">
        </el-date-picker>

        <span>&#12288;&#12288;时次：</span>
        <el-select v-model="productTime" placeholder="请选择" size="small" style="width: 100px">
          <el-option v-for="time in productTimes" :key="time" :value="time"></el-option>
        </el-select>

        <span>&#12288;&#12288;预报时效：</span>
        <el-select v-model="productybsx" placeholder="请选择" size="small" style="width: 100px">
          <el-option v-for="ybsx in productybsxs" :key="ybsx" :value="ybsx"></el-option>
        </el-select>

        <span>&#12288;&#12288;&#12288;</span>
        <el-button type="primary" round @click="openDownloadDialog" size="large">保存图片</el-button>
      </el-header>


      <el-main>
        <el-image :src="productImageUrl" fit="contain" v-loading="loading" style="height: 500px"></el-image>
      </el-main>

    </el-container>

  </Modal>
</template>

<script>

    export default {
        name: "ProductImgsModal",
        data: function () {
            return {
                ProductImgsModal: false,
                productType: "", // xbt 西北太, gza 港珠澳
                productTitle: "天气现象",
                productDate: 1180800000,
                productTimes: [0, 12],
                productTime: 0,
                productybsxs: [6, 12],
                productybsx: 6,
                productImageUrl: "http://202.108.199.48/img/figure/Figure_Ph/2020070500/Ph_6.png",
                loading: true,
            }
        },
        methods: {
            openProductImgsModal(weatherType) {
                this.ProductImgsModal = true;
                this.productType = weatherType;
                this.productTitle = "天气现象——" + (this.productType === "xbt" ? "西北太" : "南海中北部");
                this.getLastestDate();
            },
            getLastestDate() {
                this.$axios
                    .get(`/api/SCSServices/getProductImgsLatestDate.action`)
                    .then((res) => {
                        this.productDate = res.data[0].filedate;
                    })
                    .catch((res) => {
                        this.$confirm('服务器失联！getLatestDate ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                    });
            },
            updateProductybsxs(names) {
                this.productybsxs = [];
                for (let i = 0; i < names.length; i++) {
                    this.productybsxs.push(names[i].time);
                }
                if (names.length <= 0) {
                    this.productybsx = "";
                } else {
                    if (this.productybsx == "") this.productybsx = this.productybsxs[0];
                }
            },
            updateImageUrl() {
                this.loading = true;
                this.$axios
                    .get(`/api/SCSServices/getProductImgs.action`, {
                        params: {
                            timestamp: this.productDate,
                            time: this.productTime,
                            type: this.productType
                        }
                    })
                    .then((res) => {
                        console.log(res);
                        if (res.data.length <= 0) {
                            this.$confirm('数据不存在', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            });
                            return;
                        }

                        let data = res.data[0];
                        let path = data.path;
                        let names = JSON.parse(data.names);
                        this.updateProductybsxs(names);

                        this.productImageUrl = `http://${this.$store.state.serverIP}/img${path}Ph_${this.productybsx}.png`;
                        this.productImageUrl = this.productImageUrl.replace(/\\/g, '/')
                    })
                    .catch((error) => {
                        this.$confirm('服务器失联！updateImageUrl ', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                        console.log(error);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            },
            openDownloadDialog() {
                // input 不能结合a标签，因为不能指定路径下载
                // var input = document.createElement('input');
                // input.type = "file";
                // input.click();
                // let filePath = input.value;

                // iframe 不行，跨域的貌似不行
                // var iframe = document.createElement("iframe");
                // iframe.src = this.productImageUrl;
                // iframe.style.display = "none";
                // iframe.onload = function () {
                //     console.debug('start downloading...');
                //     document.body.removeAttribute(iframe);
                // }
                // document.body.appendChild(iframe);

                let imgUrl = this.productImageUrl;
                var fileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1);
                this.saveImg2local(imgUrl, fileName);
            },
            saveImg2local(imgUrl, fileName) {
                if (imgUrl.length > 0) {
                    fetch(imgUrl).then(res => res.blob().then(blob => {
                        let a = document.createElement('a');
                        let url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = fileName || 'blank.png'; // 文件名，下载位置和浏览器设置有关
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }))
                }
            }


        },
        watch: {
            productDate: function () {
                this.updateImageUrl();
            },
            productTime: function () {
                this.updateImageUrl();
            },
            productybsx: function () {
                this.updateImageUrl();
            },

        },
        created() {
            console.log("ProductImgs is created");
        },
        mounted() {
            console.log("ProductImgs is created");
        }
    }
</script>

<style scoped>
  .ProductImgsClass {
    width: 900px;
    height: 600px;
  }

  span {
    font-size: 15px;
  }


  /deep/ .ivu-modal-body {
    padding: 15px 0 0 0;
  }

  /deep/ .el-header {
    padding: 0;
  }

  /deep/ .el-main {
    padding: 0 0 3px 0;
  }
</style>
