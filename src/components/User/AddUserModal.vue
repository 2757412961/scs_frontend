<template>
  <modal width="400"
         v-model="addUser_modal"
         @on-ok="addUser"
         draggable
         :transfer=false
         title="添加用户">
    <el-row style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">用户名：</label>
      <el-input style="float:right;width: 75%;" size="small" v-model="userName_add"
                placeholder=""
                clearable>
      </el-input>
    </el-row>
    <el-row style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">密码：</label>
      <el-input style="float:right;width: 75%;" size="small" v-model="password_add"
                placeholder=""
                clearable>
      </el-input>
    </el-row>
    <el-row style="margin-top:10px">
      <label style="font-size: 14px;float:left;line-height:2;font-weight:bold">权限：</label>
      <el-select
        style="float:right;width: 75%;"
        v-model="grants" placeholder="请选择数据类型" size="small">
        <el-option
          v-for="item in categories"
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
        name: "add-user-modal",
        data() {
            return {
                addUser_modal: false,
                categories: [{
                    value: 1,
                    label: '管理员'
                }, {
                    value: 0,
                    label: '普通用户'
                }],
                userName_add: "",
                password_add: "",
                grants: ""

            }
        },
        methods: {
            openAddUserModal() {
                this.userName_add = "";
                this.password_add = "";
                this.grants = "";
                this.addUser_modal = true
            },
            addUser() {
                var api = `/api/SCSServices/addUser.action?username=${this.userName_add}&password=${this.password_add}&grants=${this.grants}`;
                this.$axios.get(api)
                    .then((response) => {
                        console.log(response.data);//成功回调
                        if (response.data == 1) {
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            });
                            // this.$parent.refreshUser();
                            this.$emit('refreshUser');
                        } else {
                            this.$confirm('已存在该用户！', '提示', {
                                confirmButtonText: '确定',
                                type: 'warning'
                            });
                        }
                    })
                    .catch((response) => {
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
