<template>
  <div>
    <div id="total">
      <el-scrollbar style="height:100%;">
        <el-menu
          :default-active="defaultIndex"
          :collapse="isCollapse"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span slot="title">后台账号管理</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1" @click="admin">修改密码</el-menu-item>
              <el-menu-item index="1-2" @click="admin2">所有用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2" @click="ads">
            <i class="el-icon-document"></i>
            <span slot="title">轮播图管理</span>
          </el-menu-item>
          <el-menu-item index="3" @click="user">
            <i class="el-icon-document"></i>
            <span slot="title">客户信息</span>
          </el-menu-item>
          <el-menu-item index="4" @click="category">
            <i class="el-icon-document"></i>
            <span slot="title">门票分类管理</span>
          </el-menu-item>
          <el-menu-item index="5" @click="ticket">
            <i class="el-icon-document"></i>
            <span slot="title">门票管理</span>
          </el-menu-item>
          <el-menu-item index="6" @click="order">
            <i class="el-icon-document"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>
    <div id="box-one">
      <div id="one-box-one">
        <el-breadcrumb class="one-box-one-one">
          <el-breadcrumb-item :to="{ path: '/manager/user' }" @click="user">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{subTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-menu
          :default-active="activeIndex"
          class="one-box-one-two"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-submenu v-model="keyword3" index="7">
            <template slot="title">
              <el-avatar></el-avatar>我的工作台
            </template>
            <el-menu-item index="7-1" @click="login;visiable=true;">切换登录</el-menu-item>
            <el-menu-item index="7-2" @click="logout">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <router-view></router-view>
    </div>
    <div>
      <el-dialog title="登录" :visible="visiable" width="30%">
        <el-form label-width="80px" ref="form" :model="form" :rules="rulesObj">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password></el-input>
          </el-form-item>
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
  </div>
</template>
<script>
import "../layout.less";
export default {
  data() {
    return {
      index:"",
      isCollapse: false,
      keyword3: "",
      activeIndex: "1",
      subTitle: "客户信息",
      defaultIndex: "",
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
      form: {
        username: "admin",
        password: "123456",
        checked: true,
        show: false
      }
    };
  },
  mounted() {
    //   console.log("mounted");
    //   window.addEventListener("resize", () => {
    //     this.$refs.scrollbar.updata();
    //   });
  },
  methods: {
    load: function() {
      this.$loading({
        text: "加载中"
      });
      //.get('url',{配置对象})
      this.axios
        .get("/api/category/get3", {
          //通过params指定地址上的查询字符串内容
          params: {
            //如果值为undefined，这不会加入到查询字符串中
            keyword3: this.keyword3
          }
        })
        .then(result => {
          this.list = result.data.rows;
          setTimeout(() => {
            this.$loading().close();
          }, 200);
        });
    },
    logout: function() {
      document.cookie =
        "node_auth=;Path=/;Expires=" + new Date(1999, 0, 1).toUTCString();
      location.reload();
    },
    login: function() {
      console.log(this.$refs);
      document.cookie =
        "node_auth=;Path=/;Expires=" + new Date(1999, 0, 1).toUTCString();
      location.reload();
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
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    user: function() {
      this.$router.push("/manager/user");
    },
    order: function() {
      this.$router.push("/manager/order");
    },
    category: function() {
      this.$router.push("/manager/category");
    },
    customer: function() {
      this.$router.push("/manager/customer");
    },
    ads: function() {
      this.$router.push("/manager/ads");
    },
    ticket: function() {
      this.$router.push("/manager/ticket");
    },
    admin: function() {
      this.$router.push("/manager/admin");
    },
    admin2: function() {
      this.$router.push("/manager/admin2");
    }
  }
};
</script>
