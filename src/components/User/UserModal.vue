<template>
  <modal width="800"
         v-model="user_modal"
         draggable
         title="用户管理">

    <div slot="header" style=" margin:0 auto">
      <el-row>
        <el-col :span="4"><span><h1>用户管理</h1></span></el-col>
        <el-col :span="4">
          <el-button size="mini" type="warning" @click="handleAdd()">添加新用户</el-button>
        </el-col>
      </el-row>
    </div>

    <div style="width: 90%; margin:0 auto">
      <el-table :data="tableData" max-height="400" style="width: 100%; margin-top: 5px">
        <el-table-column label="姓名" prop="username" sortable></el-table-column>
        <el-table-column label="密码" prop="password" sortable></el-table-column>
        <el-table-column label="权限" prop="grants" sortable></el-table-column>
        <el-table-column label="编辑" prop="id">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <add-user-modal ref="addUserModal" @refreshUser="refreshUser"></add-user-modal>
    <edit-user-modal ref="editUserModal" @refreshUser="refreshUser"></edit-user-modal>
  </modal>
</template>

<script>
    import AddUserModal from "./AddUserModal";
    import EditUserModal from "./EditUserModal";

    export default {
        name: "user-modal",
        components: {EditUserModal, AddUserModal},
        data() {
            return {
                user_modal: false,
                tableData: [],
            }
        },
        methods: {
            openUserModal(userData) {
                this.tableData = userData;
                this.user_modal = true;
            },
            handleEdit(index, row) {
                this.$refs.editUserModal.openEditUserModal(row.username, row.password, row.grants);
            },
            handleDelete(index, row) {
                console.log(row);
                var api = `/api/SCSServices/deleteUser.action?username=${row.username}`;
                this.$axios.get(api)
                    .then((response) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功！'
                        });
                        this.refreshUser();
                    })
                    .catch((response) => {
                        //失败回调
                        this.$confirm('服务器失联！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                    })
            },
            handleAdd() {
                this.$refs.addUserModal.openAddUserModal()
            },
            refreshUser() {
                var api = `/api/SCSServices/AllUsers.action`;
                this.$axios.get(api)
                    .then((response) => {
                        console.log(response.data); //成功回调
                        this.tableData = response.data;
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
