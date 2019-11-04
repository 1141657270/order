<template>
  <div>
    <div class="toolbar">
      <el-button
        size="medium"
        type="success"
        @click="showAddDialog"
        plain
        round
        icon="el-icon-plus"
      >添加</el-button>
      <div class="searchinput">
        <el-input
          @keypress.native.13="load"
          v-model="keyword"
          size="medium"
          placeholder="请输入要搜索的内容"
          class="input-with-select"
        >
          <el-button slot="append" icon="el-icon-search" @click="load"></el-button>
        </el-input>
      </div>
      <el-button size="medium" @click="load" type="primary" plain round icon="el-icon-refresh">刷新</el-button>
    </div>
    <div style="padding:10px;">
      <el-table
        :data="list"
        row-key="Id"
        default-expand-all
        :tree-props="{children: 'children'}"
        :row-class-name="rowClass"
      >
        <el-table-column prop="Title" label="名称">
          <template slot-scope="scope">
            <el-image
              style="max-width:80px;height:40px;vertical-align: middle;"
              fit="contain"
              :src="scope.row.Src"
            ></el-image>
            {{scope.row.Name}}
          </template>
        </el-table-column>
        <el-table-column
          prop="Price"
          width="150"
          label="单价"
          :formatter="(row, column, cellValue, index)=> row.Id>0&&'￥'+cellValue"
        ></el-table-column>
        <el-table-column prop="Stock" label="库存" width="100"></el-table-column>
        <el-table-column label="商户信息" width="240">
          <template slot-scope="scope" v-if="scope.row.Id>0">
            <el-popover placement="left" title="店铺信息" width trigger="hover" content>
              <p>电话：{{scope.row.ShopPhone?scope.row.ShopPhone:"未填写"}}</p>
              <p>地址：{{scope.row.ShopAddress?scope.row.ShopAddress:"未填写"}}</p>
              <div style="float:left;" slot="reference">
                <el-tag type="danger" v-if="!scope.row.ShopName" size="small">-未填写-</el-tag>
                <el-tag type="success" v-if="scope.row.ShopName" size="small">{{scope.row.ShopName}}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.Enable?'success':'danger'">{{scope.row.Enable?'启用':"禁用"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="排序号" prop="SortNum" width="100"></el-table-column>
        <el-table-column label="操作" width="180">
          <template v-if="scope.row.Id>0" slot-scope="scope">
            <el-button
              @click="editRow(scope.row)"
              type="warning"
              size="small"
              round
              plain
              icon="el-icon-edit-outline"
            >修改</el-button>
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
    </div>
    <div style="padding:10px;">
      <el-pagination
        @size-change="load"
        @current-change="load"
        :current-page.sync="page"
        :page-sizes="[5,20, 40, 80, 100]"
        :page-size.sync="size"
        layout=" total,sizes, prev, pager, next, jumper,slot"
        :total="total"
        background
      ></el-pagination>
    </div>
    <el-dialog :title="title" :visible.sync="dialogShow" width="1000px">
      {{form}}
      <el-form :model="form" ref="form" label-width="80px" :rules="rulesObj">
        <el-container>
          <el-container>
            <el-header>
              <el-form-item label="门票名" prop="Title">
                <el-input v-model="form.Title" placeholder></el-input>
              </el-form-item>
            </el-header>
            <el-main>
              <el-container>
                <el-aside style="width:50%">
                  <el-form-item label="库存量" prop="Stock">
                    <el-input v-model="form.Stock" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="门票价格" prop="Price">
                    <el-input v-model="form.Price" placeholder></el-input>
                  </el-form-item>
                  <!-- <wangEditor></wangEditor> -->
                  <el-form-item label="门票内容" prop="Content">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      v-model="form.Content"
                      placeholder
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="所属门票组别" prop="CategoryId">
                    <el-input v-model="form.CategoryId" placeholder></el-input>
                  </el-form-item>
                  <el-form-item label="状态" prop="Enable">
                    <el-select v-model="form.Enable" style="width:100%;">
                      <el-option label="启用" :value="1"></el-option>
                      <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="排序号" prop="SortNum">
                    <el-input v-model="form.SortNum" placeholder></el-input>
                  </el-form-item>
                </el-aside>
                <el-container>
                  <el-main style="padding:0;">
                    <el-form-item label="图片" prop="Src">
                      <el-input
                        id="file"
                        type="file"
                        @change="selectFile($event)"
                        style="opacity:0;position:absolute;width:100%;height:40px;z-index:999;"
                      ></el-input>
                      <el-input placeholder="点击选择要上传的图片" v-model="form.Src"></el-input>
                    </el-form-item>
                    <el-form-item label="商户地址">
                      <baiduMap
                        @click="onClick"
                        ref="map"
                        @suggestSelect="onSelect"
                        map-style="width:100%;height:300px;"
                        suggestId="abc"
                      >
                        <el-form-item>
                          <el-input id="abc" v-model="form.ShopAddress"></el-input>
                        </el-form-item>
                      </baiduMap>
                    </el-form-item>
                    <el-form-item label="商户名称">
                      <el-input v-model="form.ShopName" placeholder></el-input>
                    </el-form-item>
                    <el-form-item label="商户电话">
                      <el-input v-model="form.ShopPhone" placeholder></el-input>
                    </el-form-item>
                  </el-main>
                </el-container>
              </el-container>
            </el-main>
          </el-container>
        </el-container>
      </el-form>
      <span slot="footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="save('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import baiduMap from "./baidumap";
// import wangEditor from "./wangeditor";
import "../category.less";
export default {
  data() {
    return {
      // form: {},
      list: [],
      title: "添加",
      dialogShow: false,
      total: 0,
      size: 5,
      page: 1,
      keyword: "",
      form: {
        Title: "",
        Stock: [],
        Price: "",
        Content: "",
        CategoryId: "",
        ShopName: "",
        ShopAddress: "",
        ShopPhone: "",
        Src: "",
        SortNum: "",
        lng: "",
        lat: ""
      },
      rulesObj: {
        Title: [
          { required: true, message: "门票名为必填项" },
          { min: 1, max: 64, message: "门票名长度为1-64位" }
        ],
        Stock: [{ required: true, message: "库存为必填项" }],
        Price: [
          { required: true, message: "门票价格为必填项" },
          { min: 1, max: 10, message: "门票价格长度为1-10位" }
        ],
        Content: [
          { required: true, message: "门票内容为必填项" },
          { string: 5000, message: "门票内容长度为5000字以内" }
        ],
        CategoryId: [{ required: true, message: "门票组别为必填项" }],
        // Enable: [
        //   { required: true, message: "状态为必填项" },
        //   { min: 0, max: 2, message: "状态为0或1" }
        // ],
        Src: [
          { required: true, message: "图片为必填项" },
          { min: 1, max: 64, message: "图片名长度为1-64位" }
        ],
        SortNum: [{ required: true, message: "排序号为必填项" }]
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
    onClick: function(event) {
      var point = event.point;
      this.form.lng = point.lng;
      this.form.lat = point.lat;
      this.$refs.map.clearMarker();
      this.$refs.map.addMarker(point);
    },
    onSelect: function(address, addressObj) {
      this.form.ShopAddress = address;
      this.$refs.map.getSuggessPoint({
        address: address,
        addressObj: addressObj,
        success: point => {
          console.log(point);
          this.form.lng = point.lng;
          this.form.lat = point.lat;
          this.$refs.map.clearMarker();
          point.level = 18;
          this.$refs.map.center(point);
          this.$refs.map.addMarker(point);
        }
      });
    },
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
    rowClass(obj) {
      if (obj.row.Id < 0) {
        return "gray";
      }
    },
    deleteRow: function(row) {
      console.log(row);
      this.axios
        .post("/api/ticket/delete", {
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

    editRow: function(row) {
      console.log(row);
      // var row = this.list[index];
      this.dialogShow = true;
      this.title = "修改";
      this.$nextTick(() => {
        document.getElementById("file").value = "";
      });
      this.form = {
        Id: row.Id,
        Title: row.Title,
        Price: row.Price,
        Stock: row.Stock,
        ShopName: row.ShopName,
        ShopAddress: row.ShopAddress,
        ShopPhone: row.ShopPhone,
        Content: row.Content,
        CategoryId: row.CategoryId,
        Enable: row.Enable,
        SortNum: row.SortNum,
        Src: row.Src,
        lng: row.lng,
        lat: row.lat
      };
    },
    save: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var formData = new FormData();
          formData.append("id", this.form.Id);
          formData.append("title", this.form.Title);
          formData.append("price", this.form.Price);
          formData.append("stock", this.form.Stock);
          formData.append("shopaddress", this.form.ShopAddress);
          formData.append("shopname", this.form.ShopName);
          formData.append("shopPhone", this.form.ShopPhone);
          formData.append("content", this.form.Content);
          formData.append("categoryid", this.form.CategoryId);
          formData.append("enable", this.form.Enable);
          formData.append("sortnum", this.form.SortNum);
          formData.append("lng", this.form.lng);
          formData.append("lat", this.form.lat);
          if (document.getElementById("file").files.length > 0) {
            formData.append("file", document.getElementById("file").files[0]);
          }
          var url = "";
          if (this.form.Id == 0) {
            //添加
            url = "/api/ticket/add";
          } else {
            url = "/api/ticket/edit";
          }
          this.axios.post(url, formData).then(result => {
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showAddDialog: function() {
      this.dialogShow = true;
      this.title = "添加";
      this.form = {};
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogShow = false;
    }
  },
  mounted() {
    this.$root.subTitle = "门票管理";
    this.load();
  },
  watch: {},
  components: {
    baiduMap: baiduMap
  }
};
</script>
<style>
tr.gray td {
  background: #fafafa !important;
}
.tangram-suggestion-main {
  z-index: 99999;
}
</style>