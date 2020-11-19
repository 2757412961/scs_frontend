<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      width="25%">
      <span slot="title">
        <h1>普通用户注册</h1>
      </span>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username">

          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input :type="pwdType" v-model="ruleForm.password">
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="passwordRpt">
          <el-input :type="pwdType" v-model="ruleForm.passwordRpt">
            <i slot="suffix" class="el-icon-view" @click="showPwd"></i>
          </el-input>
        </el-form-item>

        <el-form-item label="用户类型" prop="group">
          <el-select v-model="ruleForm.group" placeholder="请选择" style="width: 100%">
            <el-option label="海警" value="0"></el-option>
            <el-option label="预报中心" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>
  </div>
</template>
<script>
    import qs from 'qs'

    var qs2 = require('querystring');

    export default {
        name: "SignUpForm",
        data() {
            return {
                dialogVisible: false,
                pwdType: 'password',
                ruleForm: {
                    username: '',
                    password: '',
                    passwordRpt: '',
                    group: '',
                    fileList: [],
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                        {
                            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}$/,
                            message: '必须包含字母、数字，8至30位'
                        }
                    ],
                    passwordRpt: [
                        {required: true, validator: this.validatePassRpt, trigger: 'change'}
                    ],
                    group: [
                        {required: true, message: '请选择用户组', trigger: 'change'}
                    ],
                    fileList: [
                        {required: false, message: '请填上传文件', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            showDialog() {
                this.dialogVisible = true;
            },
            showPwd() {
                this.pwdType === 'password' ? this.pwdType = '' : this.pwdType = 'password';
                let eIcons = document.getElementsByClassName('el-icon-view');
                for (let i = 0; i < eIcons.length; i++) {
                    let e = eIcons[i];
                    this.pwdType === '' ? e.setAttribute('style', 'color: #409EFF') : e.setAttribute('style', 'color: #c0c4cc');
                }
            },
            validatePassRpt(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            },
            submitForm(formName) {
                let form = qs.stringify({
                    username: this.ruleForm.username,
                    password: this.ruleForm.password,
                    passwordRpt: this.ruleForm.passwordRpt,
                    group: this.ruleForm.group,
                    grant: 0,
                });

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios
                            .post(`/api/SCSServices/signup.action`, form, {
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                            .then((response) => {
                                if (response.data) {
                                    this.$message({
                                        type: 'success',
                                        message: '注册成功!'
                                    });
                                    // 跳转路由
                                    this.$router.push({name: 'typhoon'})
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: '注册失败!'
                                    });
                                }
                            })
                            .catch((err) => {
                                this.$message({
                                    type: 'error',
                                    message: '未知错误！'
                                });
                            })
                            .finally((f) => {
                                console.log("finally!");
                            })

                    } else {
                        this.$message({
                            type: 'info',
                            message: '请按照要求输入'
                        });
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

        }
    }
</script>

<style>

</style>

