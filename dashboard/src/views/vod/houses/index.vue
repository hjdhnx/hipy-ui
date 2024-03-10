<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="源名称" prop="name">
        <el-input
          v-model="queryParams.rule"
          placeholder="请输入源名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安装状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="已安装/未安装"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-refresh"
          size="mini"
          v-hasRole="['admin','opts']"
          @click="handleRefresh"
        >获取仓库数据
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          v-hasRole="['admin','opts']"
          :disabled="multiple"
          @click="handleImport"
        >导入源
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">i
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id" width="55"/>
      <el-table-column label="源名" align="center" prop="rule" width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="文件名" align="center" prop="name" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="体积" align="center" prop="size" width="100" :show-overflow-tooltip="true"/>
      <el-table-column label="链接" align="center" prop="url" width="400" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>
              <el-link type="primary" :href="scope.row.url" target="_blank">
                <span>{{ scope.row.url }}</span>
              </el-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center" prop="from" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="安装状态" align="center" prop="status" width="80">
        <template slot-scope="scope">
          <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            v-hasPermi="['vod:configs:put']"
            @click="handleImport(scope.row)"
          >导入源
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.page_size"
      :page-sizes="[10,20,30,50,100,150,200,500,1000]"
      @pagination="getList"
    />

  </div>
</template>

<script>
import {getDicts} from '@/api/system/dict/data'
import {addHouses, listHouses, refreshHouses} from "@/api/vod/houses";

export default {
  name: 'VodHouses',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典表格数据
      list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      statusOptions: [],
      valueTypeOptions: [],
      host: '',
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        dict_name: undefined,
        dict_type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
    getDicts("vod_rule_status").then(response => {
      this.statusOptions = response.data.details;
    });
    this.host = new URL(process.env.VUE_APP_BASE_API).origin;
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true
      if (!this.queryParams.status && typeof (this.queryParams.status) === 'string') {
        this.queryParams.status = undefined;
      }
      listHouses(this.queryParams).then(response => {
          this.list = response.data.data
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        dict_type: undefined,
        dict_name: undefined,
        remark: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        page_size: 10,
        dict_name: undefined,
        dict_type: undefined
      }
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 刷新源列表按钮操作 */
    handleRefresh(row) {
      let self = this;
      this.$modal.confirm('从源仓库获取一些drpy源的更新信息？').then(function () {
        self.$modal.loading("数据获取中，请稍候...");
        return refreshHouses();
      }).then(() => {
        self.$modal.closeLoading();
        this.getList();
        this.$modal.msgSuccess("初始化成功");
      }).catch(() => {
        self.$modal.closeLoading();
      });
    },
    /** 导入按钮操作 */
    handleImport(row) {
      const ids = row.id || this.ids
      let self = this;
      this.$confirm('是否确认安装编号为"' + ids + '"等' + (ids.length || 1) + '个源?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        self.$modal.loading("数据获取中，请稍候...");
        return addHouses(ids)
      }).then((resp) => {
        self.$modal.closeLoading();
        this.getList()
        this.msgSuccess(resp.data)
      }).catch(function () {
        self.$modal.closeLoading();
      })
    }
  }
}
</script>
