<template>
  <div>
    <span id="one-box">
      <ul>
        <li class="one-box-one" @click="editRow">注册</li>
        <li class="one-box-one blue" @click="select">登录</li>
      </ul>
    </span>
    <el-dialog :title="title" :visible="visiable" width="30%">
      <el-form label-width="80px" ref="form" :model="form" :rules="rulesObj">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button>取消</el-button>
        </el-form-item>-->
        <el-form-item style="margin-button:0" prop="checked">
          <el-checkbox v-model="form.checked">
            同意
            <a href="#">用户协议</a>
          </el-checkbox>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="primary" @click="visiable=false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import "../login.less";
export default {
  data: function() {
    return {
      title: "",
      visiable: false,
      rulesObj: {
        username: [
          { required: true, message: "用户名为必填项" },
          { min: 5, max: 10, message: "用户名长度为5-10位" }
        ],
        password: [
          { required: true, message: "密码为必填项" },
          { min: 6, max: 16, message: "密码长度为6-16位" }
        ],
        checked: [{ pattern: /true/, message: "用户协议必须同意" }]
      },
      form: {}
    };
  },
  methods: {
    login: function() {
      console.log(this.$refs);
      this.axios
        .post("/api/login", {
          loginname: this.form.username,
          password: this.form.password
        })
        .then(result => {
          console.log(result.data);
          if (result.data.success) {
            var to = this.$route.query.returnUrl || "/manager/user";
            console.log(to);
            this.$router.push(to);
          } else {
            alert(result.data.message);
          }
        });
    },
    select: function() {
      this.visiable = true;
      this.title = "登录";
      this.form = {
        username: "admin",
        password: "123456",
        checked: true,
        show: false
      };
    },
    editRow: function() {
      console.log();
      // var row = this.list[index];
      this.visiable = true;
      this.title = "注册";
      this.form = {
        username: "",
        password: "",
        checked: false,
        show: false
      };
    }
  }
};
</script>