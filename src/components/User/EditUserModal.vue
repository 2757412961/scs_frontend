<template>
  <modal width="400"
         v-model="editUser_modal"
         @on-ok="editUser"
         title="编辑用户">
    <el-row  style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">用户名：</label>
      <label style="float:right;width: 75%;" >{{userName}}</label>
    </el-row>
    <el-row style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">密码：</label>
      <el-input style="float:right;width: 75%;" size="small" v-model="password"
                placeholder=""
                clearable>
      </el-input>
    </el-row>
    <el-row style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">权限：</label>
      <el-select
        style="float:right;width: 75%;"
        v-model="category" placeholder="请选择数据类型" size="small">
        <el-option
          v-for="item in categorys"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-row>
  </modal>
</template>

<script>
    export default {
        name: "edit-user-modal",
      data() {
        return {
          editUser_modal: false,

          categorys: [{
            value: 1,
            label: '管理员'
          }, {
            value: 0,
            label: '普通用户'
          }],
          password:"",
          userName: "",
          category: ""
        }
      },
      methods:{
        openEditUserModal(username,password,category){
          this.userName=username;
          this.password=password;
          this.category=category;
          this.editUser_modal=true;
        },
        editUser(){
          var api=`/api/SCSServices/updateUser.action?username=${this.userName}&password=${this.password}&category=${this.category}`;
          this.$axios.get(api)
            .then((response)=> {
              console.log(response.data);//成功回调
              if(response.data==1){
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                });
                this.$emit('refreshUser');
              }else{
                this.$confirm('修改失败！', '提示', {
                  confirmButtonText: '确定',
                  type: 'warning'
                });
              }
            })
            .catch((response)=>{
              //失败回调
              this.$confirm('服务器失联！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
            })
        }
      }
    }
</script>

<style scoped>

</style>
