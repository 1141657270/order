<template>
  <div>
    <div class="toolbar">
      <div class="searchinput">
        <el-input
          @keypress.native.13="load"
          size="medium"
          placeholder="请输入要搜索的内容"
          class="input-with-select"
          v-model="keyword"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <el-button size="medium" @click="load" type="primary" plain round icon="el-icon-refresh">刷新</el-button>
    </div>

    <div style="padding:10px;">
      <el-table :data="list" highlight-current-row stripe>
        <el-table-column label="编号" width="120" prop="Id"></el-table-column>
        <el-table-column label="用户名" width="120" prop="LoginName"></el-table-column>
        <el-table-column label="密码"  prop="Password"></el-table-column>
        <el-table-column label="昵称" width="120">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.Src==undefined" size="small">昵称暂无</el-tag>
            <el-tag type="danger" v-else size="small">{{scope.row.Name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="80">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.Src==undefined" size="small">头像暂无</el-tag>
            <el-image
              style="width:40px;height:40px;vertical-align: middle;"
              fit="contain"
              :src="scope.row.Src"
              v-else
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column></el-table-column>
        <el-table-column label="操作" width="200">
          <template v-if="scope.row.Id>0" slot-scope="scope">
            <el-button
              @click="dialogShow = true"
              type="warning"
              size="small"
              round
              plain
              icon="el-icon-edit-outline"
            >添加</el-button>
            <el-button
              @click="deleteRow(scope.row)"
              type="danger"
              size="small"
              round
              plain
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="load"
        @current-change="load"
        :page-sizes="[5, 10, 20, 40, 80, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
      <el-dialog title="登录" :visible.sync="dialogShow" width="30%">
        <el-form label-width="80px" ref="form" :model="form" :rules="rulesObj">
          <el-form-item label="用户名" prop="LoginName">
            <el-input v-model="form.LoginName"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="Name">
            <el-input v-model="form.Name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="Password">
            <el-input v-model="form.Password" show-password></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="Src">
            <el-input
              id="file"
              type="file"
              @change="selectFile($event)"
              style="opacity:0;position:absolute;width:100%;height:40px;z-index:999;"
            ></el-input>
            <el-input placeholder="点击选择要上传的图片" v-model="form.Src"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button type="primary" @click="save;submitForm('form')">确定</el-button>
          <el-button type="primary" @click="dialogShow=false;resetForm('form')">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import "../category.less";
export default {
  data() {
    return {
      keyword: "",
      list: [],
      total: 0,
      dialogShow: false,
      form: {
        LoginName:"",
        Name:"",
        Password:"",
        Src:""
      },
      rulesObj: {
        LoginName: [
          { required: true, message: "用户名为必填项" },
          { min: 1, max: 16, message: "用户名长度为1-16位" }
        ],
        Name: [
          { required: true, message: "昵称必须添加" },
          { min: 5, max: 64, message: "昵称长度为5-64位" }
        ],
      Password: [
          { required: true, message: "密码为必填项" },
          { min: 1, max: 16, message: "密码长度为1-16位" }
        ],
        Src: [
          { required: true, message: "图片必须添加" },
          { min: 5, max: 64, message: "图片文件长度为5-64位" }
        ],
      },
    };
  },
  methods: {
    // setStatus(id, status){},
    selectFile: function(event) {
      if (event) {
        this.form.Src = document.getElementById("file").files[0].name;
      } else {
        this.form.Src = "";
      }
    },
    deleteRow: function(row) {
      console.log(row);
      this.axios
        .post("/api/admin2/delete", {
          id: row.Id
        })
        .then(result => {
          if (!result.data.success) {
            this.$message({
              type: "error",
              message: result.data.message
            });
          }
          this.load();
        });
    },
    save: function() {
      var formData = new FormData();
      formData.append("id", this.form.Id);
      formData.append("loginname", this.form.LoginName);
      formData.append("password", this.form.Password);
      formData.append("src", this.form.Src);
      formData.append("name", this.form.Name);
      if (document.getElementById("file").files.length > 0) {
        formData.append("file", document.getElementById("file").files[0]);
      }

      this.axios.post("/api/admin2/add", formData).then(result => {
        this.load(); //重新加载表格
        this.dialogShow = false; //关闭对话框
        if (!result.data.success) {
          //出错报错
          this.$message({
            type: "error",
            message: result.data.message
          });
        }
      });
    },
    load() {
      console.log({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      });
      this.$loading({
        text: "加载中"
      });
      this.axios
        .get("/api/admin2/get", {
          params: {
            keyword: this.keyword3
          }
        })
        .then(result => {
          setTimeout(() => {
            this.$loading().close();
          }, 100);
          this.list = result.data.rows;
        });
    },
    search() {
      this.load();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("添加成功");
          this.save();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.$root.subTitle = "所有用户";
    this.load();
  }
};
</script>