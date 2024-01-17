<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="源名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入源名称"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="源分组" prop="group">
        <el-input
          v-model="queryParams.group"
          placeholder="请输入源分组"
          clearable
          style="width: 240px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="源状态"
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
        >刷新源列表
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          v-hasRole="['admin','opts']"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          v-hasRole="['admin','opts']"
          @click="handleClean"
        >清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          v-has-permi="['report:excel_generate:export','vod:rules:export']"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange"
              :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id"/>
      <el-table-column label="源名称" align="center" prop="name" :show-overflow-tooltip="true" sortable="custom"
                       :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="源分组" align="center" prop="group" width="130" :show-overflow-tooltip="true"/>
      <el-table-column label="文件路径" align="center" prop="path" :show-overflow-tooltip="true"/>
      <el-table-column label="是否存在" align="center" prop="is_exist" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_exist"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="显示排序" align="center" prop="order_num"/>
      <el-table-column label="文件类型" align="center" prop="file_type"/>
      <el-table-column label="源状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="statusOptions" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="ext扩展" align="center" prop="ext" :show-overflow-tooltip="true"/>
      <el-table-column label="是否显示" align="center" prop="active" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" @change="handleChangIsActive(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="更新日期" align="center" prop="modified_ts" sortable="custom"
                       :sort-orders="['descending', 'ascending']" width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasRole="['admin','opts']"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.page_size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {list, clearRecord, delRecord, refreshRules} from "@/api/vod/rules";
import {getDicts} from "@/api/system/dict/data";
import {parseTime} from "@/utils";
import {changeActive} from "@/api/monitor/job";

export default {
  name: "VodRules",
  // dicts: ['sys_common_status'],
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
      // 选择用户名
      selectName: "",
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: {prop: 'loginTime', order: 'descending'},
      statusOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        name: undefined,
        group: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      list().then(response => {
          this.list = response.data.results
          this.total = response.data.total
          this.loading = false;
        }
      );
      getDicts("com_default_status").then(response => {
        this.statusOptions = response.data.details;
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.page = 1;
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
      this.selectName = selection.map(item => item.user_name);
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.order_by = column.prop;
      this.queryParams.is_desc = column.order === 'descending';
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除ID为"' + ids + '"的数据项？').then(function () {
        return delRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 刷新源列表按钮操作 */
    handleRefresh(row){
      this.$modal.confirm('是否确认刷新本地所有源？').then(function () {
        return refreshRules();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("刷新成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal.confirm('是否确认清空所有源？').then(function () {
        return clearRecord();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("清空成功");
      }).catch(() => {
      });
    },
    /** 改变活跃状态 */
    handleChangIsActive(row) {
      changeActive(row.id, row.active).then(response => {
        if (response.code === 0) {
          this.msgSuccess("修改成功")
        }
        this.getList();
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('monitor_vod_rules', {
        ...this.queryParams, ...{template: '0'}
      }, `源列表_${parseTime(new Date().getTime())}.xlsx`)
    },
  }
};
</script>
