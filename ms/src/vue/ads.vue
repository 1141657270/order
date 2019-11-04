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
          v-model="ketword"
          size="medium"
          placeholder="请输入要搜索的内容"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <el-button size="medium" @click="load" type="primary" plain round icon="el-icon-refresh">刷新</el-button>
    </div>

    <div style="padding:10px;">
      <el-table :data="list" highlight-current-row stripe>
        <el-table-column label="编号" width="120" prop="Id"></el-table-column>
        <el-table-column label="昵称">
          <template slot-scope="scope">
            <el-image
              style="width:40px;height:40px;vertical-align: middle;"
              fit="contain"
              :src="scope.row.Src"
            ></el-image>
            <el-tooltip class="item" :content="scope.row.AppOpenId" effect="dark">
              <span style="margin-left:10px;">{{scope.row.NickName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
<el-table-column label="排序号" width="120" prop="SortNum"></el-table-column>
        <el-table-column label="当前状态" width="200">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              @click="setStatus(scope.row.Id,1)"
              v-if="scope.row.Enable==0"
              size="small"
            >禁用</el-tag>
            <el-tag
              type="success"
              @click="setStatus(scope.row.Id,0)"
              v-if="scope.row.Enable==1"
              size="small"
            >启用</el-tag>
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
      <el-pagination
        @size-change="load"
        @current-change="load"
        :page-sizes="[1, 10, 20, 40, 80, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="visiable" width="30%">
      <el-form :model="form" ref="form" label-width="80px" :rules="rulesObj">
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
import '../category.less'
export default {
  data() {
    return {
      title: "",
      ketword: "",
      list: [],
      total: 0,
      form: {},
      visiable: false,
      rulesObj: {
        Src: [
          { required: true, message: "图片必须添加" },
          { min: 5, max: 64, message: "图片文件长度为5-64位" }
        ]
        // SortNum: [{ pattern: /true/, message: "用户协议必须同意" }]
      }
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
    load() {
      console.log({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      });
      this.$loading({
        text: "加载中"
      });
      this.axios
        .get("/api/ads/get", {
          params: {
            ketword: this.ketword
          }
        })
        .then(result => {
          setTimeout(() => {
            this.$loading().close();
          }, 100);
          this.list = result.data.rows;
          this.total = result.data.total;
        });
    },
    save: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          formData.append("id", this.form.Id);
          formData.append("src", this.form.Src);
          formData.append("enable", this.form.Enable);
          formData.append("sortnum", this.form.SortNum);
          if (document.getElementById("file").files.length > 0) {
            formData.append("file", document.getElementById("file").files[0]);
          }
          var url = "";
          if (this.form.Id == 0) {
            //添加

            url = "/api/ads/add";
          } else {
            url = "/api/ads/edit";
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
    search() {
      this.load();
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
        SortNum: row.SortNum,
        Enable: row.Enable,
        Src: row.Src
      };
    },
    deleteRow: function(index) {
      console.log(index);
      console.log(this.list[index]);
      this.axios
        .post("/api/ads/delete", {
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
    this.$root.subTitle = "用户管理";
    this.load();
  }
};
</script>