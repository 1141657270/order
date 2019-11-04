<template>
  <div>
    <el-form label-width="80px" ref="form" :model="form" :rules="relusObj">
      <el-form-item label="file" prop="src">
        <el-input id="file" ref="file" type="file" name="file" v-model="form.Src"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="loginname">
        <el-input name="Loginname" v-model="form.LoginName"></el-input>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input name="Password" v-model="form.Password"></el-input>
      </el-form-item>
      <el-form-item label="现密码" prop="password1">
        <el-input name="Password1" v-model="form.Password1"></el-input>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button type="primary" @click="save('form')" style="margin-left:80px">保存</el-button>
      <el-button type="primary" @click="reset" style="margin-left:20px">重置为初始密码</el-button>
    </span>
  </div>
</template>
<script>
import "../category.less";
export default {
  data() {
    return {
      form: {
        // Loginname: "",
        // Password: "",
        // Password1: "",
        // Src: ""
      },
      relusObj: {
        src: [
          { required: true, message: "头像为必填项" },
          { min: 1, max: 64, message: "头像文件名长度为1-64位" }
        ],
        loginname: [
          { required: true, message: "用户名必填项" },
          { min: 1, max: 18, message: "用户名长度为1-18位" }
        ],
        password: [
          { required: true, message: "原密码为必填项" },
          { min: 1, max: 18, message: "原密码长度为1-18位" }
        ],
        password1: [
          { required: true, message: "新密码为必填项" },
          { min: 1, max: 18, message: "新密码长度为1-18位" }
        ]
      }
    };
  },
  methods: {
    load() {
      this.$loading({
        text: "加载中"
      });
      this.axios
        .get("/api/ticket/get", {
          params: {
            keyword: this.keyword,
            page: this.page,
            size: this.size
          }
        })
        .then(res => {
          setTimeout(() => {
            this.$loading().close();
          }, 100);
          this.list = res.data.rows;
          this.total = res.data.total;
        });
    },
    reset: function() {
      var formData = new FormData();
      formData.append("loginname", this.form.LoginName);
      formData.append("password", this.form.Password);
      this.axios.post("/api/admin/reset", formData).then(result => {
        this.logout();
        if (!result.data.success) {
          //出错报错
          this.$message({
            type: "error",
            message: result.data.message
          });
        } else {
          alert("密码已重置为初始状态，即将为您跳转到登录页面");
          var to = this.$route.query.returnUrl || "/manager/login";
          this.$router.push(to);
          this.logout();
        }
      });
    },
    save: function(formName) {
      //ajax数据提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          //console.log(this.$refs.file.$refs.input.files)
          //   formData.append("id", this.form.Id);

          formData.append("loginname", this.form.LoginName);
          formData.append("password", this.form.Password);
          formData.append("password1", this.form.Password1);
          if (document.getElementById("file").files.length > 0) {
            formData.append("file", document.getElementById("file").files[0]);
          }
          var url = "";
          if (this.form.Id == undefined) {
            //添加

            url = "/api/admin/edit";
          } else {
            url = "/api/admin/add";
          }
          this.axios.post(url, formData).then(result => {
            this.logout();
            if (!result.data.success) {
              //出错报错
              this.$message({
                type: "error",
                message: result.data.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    logout: function() {
      document.cookie =
        "node_auth=;Path=/;Expires=" + new Date(1999, 0, 1).toUTCString();
      location.reload();
    }
  },
  mounted() {
    this.$parent.subTitle = "修改账号";
    this.load();
  }
};
</script>