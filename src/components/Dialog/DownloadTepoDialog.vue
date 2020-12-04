<template>
  <modal width="400"
         v-model="isShowDialod"
         draggable
         :transfer=false
         title="下载TEPO">

    <el-form>
      <el-form-item label="年份选择">
        <el-select v-model="selectYear" placeholder="请选择">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="台风选择">
        <el-select v-model="selectTyphNum" placeholder="请选择">
          <el-option
            v-for="item in typhNumList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="起报时间">
        <el-select v-model="selectTime" placeholder="请选择">
          <el-option
            v-for="item in timeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-button @click="download" type="primary">下载</el-button>

    <div slot="footer"></div>
  </modal>
</template>

<script>
    export default {
        name: "DownloadTepoDialog",
        data: function () {
            return {
                isShowDialod: false,
                selectYear: "",
                yearList: [],
                selectTyphNum: "",
                typhNumList: [],
                selectTime: "",
                timeList: [],
            }
        },
        methods: {
            openDialog() {
                this.isShowDialod = true;
            },
            updateYearList() {
                this.$axios
                    .get(`/api/SCSServices/typhoonYear.action`)
                    .then((res) => {
                        if (res != null && res.data.length > 0) {
                            let data = res.data;

                            this.yearList = [];
                            data.forEach((year) => {
                                this.yearList.push({
                                    value: year,
                                    label: year
                                })
                            });
                            this.selectYear = this.yearList[0].value;
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '数据不存在！'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '访问年份失败！'
                        });
                    })
            },
            updateTyphNumList() {
                this.$axios
                    .get(`/api/SCSServices/typhoonList.action`, {params: {year: parseInt(this.selectYear)}})
                    .then((res) => {
                        if (res != null && res.data.length > 0) {
                            let data = res.data;

                            this.typhNumList = [];
                            data.forEach((item) => {
                                if (item.hasOwnProperty('modelNum')) {
                                    this.typhNumList.push({
                                        value: item.modelNum,
                                        label: item.typhNum + " " + item.enName
                                    });
                                }
                            });
                            this.selectTyphNum = this.typhNumList[0].value;
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '数据不存在！'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '访问数据失败！'
                        });
                    })
            },
            updateTimeList() {
                this.$axios
                    .get(`/api/SCSServices/queryTyphTEPOTimes.action`, {params: {idx: this.selectTyphNum}})
                    .then((res) => {
                        if (res != null && res.data.length > 0) {
                            let data = res.data;

                            this.timeList = [];
                            data.forEach((item) => {
                                this.timeList.push({
                                    value: item,
                                    label: item
                                });
                            });
                            this.selectTime = this.timeList[0].value;
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '数据不存在！'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '访问数据失败！'
                        });
                    })
            },
            download() {
                this.$axios
                    .get(`/api/SCSServices/queryTyphTEPOTable.action`, {
                        params: {
                            idx: this.selectTyphNum,
                            stTime: this.selectTime,
                            predictNum: 1
                        }
                    })
                    .then((res) => {
                        if (res != null && res.data.length > 0) {
                            let data = res.data;

                            let blob = new Blob([JSON.stringify(data)]);
                            let uri = URL.createObjectURL(blob);

                            let link = document.createElement('a');
                            // link.filename = `TEPO.${this.selectTime}`;
                            link.download = `TEPO.${this.selectTime}`;
                            link.href = uri;
                            link.click();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '数据不存在！'
                            });
                        }
                    })
                    .catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '访问数据失败！'
                        });
                    });
            },
            test() {
                let data = {
                    'a': "asda",
                    'b': 132,
                    'c': "dasda"
                };
                let strData = JSON.stringify(data);

                // 如果数据不是File或Blob对象
                const blob222 = new Blob([strData], {type: 'application/json'});
                // 生成BlobURLs
                const BlobURL = URL.createObjectURL(blob222);
                window.open(BlobURL, '_blank'); // 新开窗口下载


                let link = document.createElement('a');
                link.filename = 'hello';
                link.download = "file";
                link.href = URL.createObjectURL(blob222);
                link.click();
            },


        },
        watch: {
            isShowDialod: function (val, oldVal) {
                if (this.isShowDialod != true) return;
                this.updateYearList();
            },
            selectYear: function (val, oldVal) {
                this.updateTyphNumList();
            },
            selectTyphNum: function (val, oldVal) {
                this.updateTimeList();
            }
        },
        created() {

        }

    }
</script>

<style scoped>

</style>
