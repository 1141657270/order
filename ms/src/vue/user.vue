<template>
  <div>
    <div class="toolbar">
      <div class="searchinput">
        <el-input
          @keypress.native.13="load"
          v-model="keyword"
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
              :src="scope.row.AvatarUrl"
            ></el-image>
            <el-tooltip class="item" :content="scope.row.AppOpenId" effect="dark">
              <span style="margin-left:10px;">{{scope.row.NickName}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="所在地" width="200">
          <template slot-scope="scope">
            <span
              v-if="scope.row.Country"
            >{{scope.row.Country}} - {{scope.row.Province}} - {{scope.row.City}}</span>
            <el-tag type="info" size="small" v-else>未填</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="平台手机号" width="120" prop="WeChatBindPhone"></el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.Sex==2" size="small">女</el-tag>
            <el-tag type="success" v-if="scope.row.Sex==1" size="small">男</el-tag>
            <el-tag type="info" v-if="scope.row.Sex==0" size="small">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="账户余额" width="200">
          <template slot-scope="scope">￥{{scope.row.Account}}</template>
        </el-table-column>
        <el-table-column label="账户状态" width="80">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              @click="setStatus(scope.row.Id,1)"
              v-if="scope.row.Status==0"
              size="small"
            >禁用</el-tag>
            <el-tag
              type="success"
              @click="setStatus(scope.row.Id,0)"
              v-if="scope.row.Status==1"
              size="small"
            >启用</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="load"
        @current-change="load"
        :current-page.sync="currentPage"
        :page-sizes="[5, 10, 20, 40, 80, 100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import '../category.less'
export default {
  data() {
    return {
      keyword: "",
      list: [],
      currentPage: 1,
      pageSize: 5,
      totalNum: 100
    };
  },
  methods: {
    // setStatus(id, status) {
    //   this.axios.post("/api/customer/edit")
    // },
    load() {
      console.log({
        pageSize: this.pageSize,
        currentPage: this.currentPage
      });
      this.$loading({
        text: "加载中"
      });
      this.axios
        .get("/api/customer/get", {
          params: {
            keyword: this.keyword,
            size: this.pageSize,
            page: this.currentPage
          }
        })
        .then(result => {
          setTimeout(() => {
            this.$loading().close();
          }, 100);
          this.totalNum = result.data.total;
          this.list = result.data.rows;
        });
    },
    search() {
      this.load();
    }
  },
  mounted() {
    this.$root.subTitle = "用户管理";
    this.load();
  }
};
</script>