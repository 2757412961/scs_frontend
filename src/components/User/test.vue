<template>
  <div class="from_box">
    <el-dialog
      :visible.sync="dialogVisible">
      <form action="">
        <input type="text" placeholder="请输入昵称" v-model="formMess.account">
        <input type="password" placeholder="请输入密码" v-model="formMess.act_pwd">
        <input type="text" placeholder="请输入手机号" v-model="formMess.phone">
      </form>
      <span class="but" @click="onSubmit()">提交</span>
    </el-dialog>
  </div>
</template>

<script>
    import axios from 'axios';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    export default {
        name: "from",
        data() {
            return {
                dialogVisible: true,
                formMess: {
                    "account": "",
                    "act_pwd": "",
                    "phone": ""
                }
            };
        },
        methods: {
            show2() {
                this.dialogVisible = true
            },
            onSubmit() {
                /* json格式提交： */
                // let formData = JSON.stringify(this.formMess);

                /* formData格式提交： */
                let formData = new FormData();
                for (var key in this.formMess) {
                    formData.append(key, this.formMess[key]);
                }

                axios({
                    method: "post",
                    url: "/api/SCSServices/signup.action",
                    // headers: {
                    //     "Content-Type": "multipart/form-data"
                    // },
                    withCredentials: true,
                    data: formData
                }).then((res) => {
                    console.log(res);
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!--<style scoped lang="less">-->
<!--  .from_box{-->
<!--    form{-->
<!--      width:90%;-->
<!--      margin: auto;-->
<!--      border:.01rem solid gray;-->
<!--      display: flex;-->
<!--      flex-wrap: wrap;-->
<!--      input{-->
<!--        width:80%;-->
<!--        height:.5rem;-->
<!--        margin-bottom: .2rem;-->
<!--        border:.01rem solid black;-->
<!--        height:.5rem;-->
<!--      }-->
<!--    }-->
<!--    .but{-->
<!--      font-size: .14rem;-->
<!--      margin-left:5%;-->
<!--    }-->
<!--  }-->
<!--</style>-->
