<template>
  <div>
    <div class="toolbar">
      <el-button
        type="success"
        size="medium"
        @click="showAddDialog"
        round
        icon="el-icon-circle-plus-outline"
      >添加</el-button>
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
      <el-button
        size="medium"
        @click="load"
        type="primary"
        plain
        round
        slot="append"
        icon="el-icon-search"
      >刷新</el-button>
    </div>
    <div style="padding:10px;">
      <el-table :data="list" stripe>
        <el-table-column prop="Id" label="编号" width="50px"></el-table-column>
        <el-table-column prop="Name" label="分类">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.Src"
              fit="contain"
              style="width:40px;height:40px;vertical-align:middle;"
            ></el-image>
            {{scope.row.Name}}
          </template>
        </el-table-column>
        <el-table-column prop="SortNum" label="排序号"></el-table-column>
        <el-table-column prop="Enable" label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Enable?'success':'danger'">{{scope.row.Enable?'启用':"禁用"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- {{scope.$index}}
            {{scope.row}}-->
            <el-button
              type="warning"
              @click="editRow(scope.$index)"
              size="samll"
              round
              plain
              icon="el-icon-edit-outline"
            >修改</el-button>
            <el-button
              type="danger"
              @click="deleteRow(scope.$index)"
              size="samll"
              round
              plain
              icon="el-icon-delete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="visiable" width="30%">
      <el-form :model="form" ref="form" label-width="80px" :rules="rulesObj">
        <el-form-item label="分类名" prop="Name">
          <el-input placeholder="请输入分类名" v-model="form.Name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="Src">
          <el-input
            id="file"
            type="file"
            @change="selectFile($event)"
            style="opacity:0;position:absolute;width:100%;height:40px;z-index:999;"
          ></el-input>
          <el-input placeholder="点击选择要上传的图片" v-model="form.Src"></el-input>
        </el-form-item>
        <el-form-item label="排序号">
          <el-input v-model="form.SortNum"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.Enable" style="width:100%;">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="visiable = false;resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="save('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import "../category.less";
export default {
  data() {
    return {
      title: "",
      list: [],
      keyword: "",
      form: {},
      visiable: false,
      rulesObj: {
        Name: [
          { required: true, message: "分类名为必填项" },
          { min: 1, max: 16, message: "分类名长度为1-16位" }
        ],
        Src: [
          { required: true, message: "图片必须添加" },
          { min: 5, max: 64, message: "图片文件长度为5-64位" }
        ]
        // SortNum: [{ pattern: /true/, message: "用户协议必须同意" }]
      }
    };
  },
  methods: {
    selectFile: function(event) {
      if (event) {
        this.form.Src = document.getElementById("file").files[0].name;
      } else {
        this.form.Src = "";
      }
    },
    load: function() {
      this.$loading({
        text: "加载中"
      });
      //.get('url',{配置对象})
      this.axios
        .get("/api/category/get", {
          //通过params指定地址上的查询字符串内容
          params: {
            //如果值为undefined，这不会加入到查询字符串中
            keyword: this.keyword
          }
        })
        .then(result => {
          this.list = result.data.rows;
          setTimeout(() => {
            this.$loading().close();
          }, 200);
        });
    },
    deleteRow: function(index) {
      console.log(index);
      console.log(this.list[index]);
      this.axios
        .post("/api/category/delete", {
          id: this.list[index].Id
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

    editRow: function(index) {
      console.log(index);
      var row = this.list[index];
      this.visiable = true;
      this.title = "修改";
      this.$nextTick(() => {
        document.getElementById("file").value = "";
      });
      this.form = {
        Id: row.Id,
        Name: row.Name,
        SortNum: row.SortNum,
        Enable: row.Enable,
        Src: row.Src
      };
    },
    search: function() {
      this.load();
    },
    save: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          formData.append("id", this.form.Id);
          formData.append("name", this.form.Name);
          formData.append("src", this.form.Src);
          formData.append("enable", this.form.Enable);
          formData.append("sortnum", this.form.SortNum);
          if (document.getElementById("file").files.length > 0) {
            formData.append("file", document.getElementById("file").files[0]);
          }
          var url = "";
          if (this.form.Id == 0) {
            //添加

            url = "/api/category/add";
          } else {
            url = "/api/category/edit";
          }
          this.axios.post(url, formData).then(result => {
            this.load(); //重新加载表格
            this.visiable = false; //关闭对话框
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
    /**打开添加对话框 */
    showAddDialog: function() {
      this.visiable = true;
      this.title = "添加";
      this.$nextTick(() => {
        document.getElementById("file").value = "";
      });
      // this. rulesObj={Name:[{required: true}],Src:[{required: true}]};
      this.form = {
        Id: 0,
        Name: "",
        SortNum: 100,
        Enable: 1,
        Src: ""
      };
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.$parent.subTitle = "门票分类管理";
    this.load();
  }
};
</script>