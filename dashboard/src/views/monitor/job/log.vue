<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="任务代号" prop="job_id">
        <el-input
          v-model="queryParams.job_id"
          placeholder="请输入任务代号"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="任务名称" prop="job_name">
        <el-input
          v-model="queryParams.job_name"
          placeholder="请输入任务名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="job_group">
        <el-select
          v-model="queryParams.job_group"
          placeholder="请选择任务组名"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in groupOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行状态" prop="run_status">
        <el-select
          v-model="queryParams.run_status"
          placeholder="请选择执行状态"
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
      <el-form-item label="执行时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['monitor:job:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['monitor:job:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
        >清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['monitor:job:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="jobLogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="日志编号" width="80" align="center" prop="id"/>
      <el-table-column label="任务代号" align="center" prop="job_id" :show-overflow-tooltip="true"/>
      <el-table-column label="任务名称" align="center" prop="job_name" :show-overflow-tooltip="true"/>
      <el-table-column label="任务组名" align="center" prop="job_group" :show-overflow-tooltip="true"
                       :formatter="groupFormat"/>
      <el-table-column label="调用目标字符串" align="center" prop="func_name" :show-overflow-tooltip="true"/>
      <el-table-column label="传入位置参数" align="center" prop="func_args" :show-overflow-tooltip="true"/>
      <el-table-column label="传入字典参数" align="center" prop="func_kwargs" :show-overflow-tooltip="true"/>
      <el-table-column label="日志信息" align="center" prop="run_info" :show-overflow-tooltip="true"/>
      <el-table-column label="执行状态" align="center" prop="run_status" :formatter="statusFormat"/>
      <el-table-column label="创建时间" align="center" prop="created_ts" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_ts) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" prop="run_time" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['monitor:job:query']"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >详细
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

    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志代号：">{{ form.job_id }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.job_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务组名：">{{ form.job_group }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.run_time }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.func_name }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.run_info }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.run_status == 1">正常</div>
              <div v-else-if="form.run_status == 0">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.run_status == 0" label="异常信息：">{{ form.run_except_info }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getJob} from '@/api/monitor/job'
import {listJobLog, delJobLog, cleanJobLog} from '@/api/monitor/jobLog'
import {getDicts} from '@/api/system/dict/data'
import {parseTime} from "@/utils";

export default {
  name: 'JobLog',
  dicts: ['sys_common_status', 'sys_job_group'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 调度日志表格数据
      jobLogList: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 状态数据字典
      statusOptions: [],
      // 分组状态字典
      groupOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        job_id: undefined,
        job_name: undefined,
        job_group: undefined,
        run_status: undefined
      }
    }
  },
  created() {
    const jobId = this.$route.params && this.$route.params.id
    if (jobId !== undefined && jobId != 0) {
      getJob(jobId).then(response => {
        this.queryParams.job_id = response.data.job_id
        this.queryParams.job_name = response.data.job_name
        this.queryParams.job_group = response.data.job_group
        this.getList()
      })
    } else {
      this.getList()
    }
  },
  methods: {
    /** 查询调度日志列表 */
    getList() {
      this.loading = true
      listJobLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.jobLogList = response.data.results
          this.total = response.data.total
          this.loading = false
        }
      )

      getDicts('sys_job_run_status').then(response => {
        this.statusOptions = response.data.details
      })

      this.getDicts('sys_job_group').then(response => {
        this.groupOptions = response.data.details
      })
    },
    // 返回按钮
    handleClose() {
      const obj = {path: '/monitor/job'}
      this.$tab.closeOpenPage(obj)
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.run_status);
    },
    // 分组状态字典翻译
    groupFormat(row, column) {
      return this.selectDictLabel(this.groupOptions, row.job_group);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true
      this.form = row
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds = this.ids
      this.$modal.confirm('是否确认删除调度日志编号为"' + jobLogIds + '"的数据项？').then(function () {
        return delJobLog(jobLogIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal.confirm('是否确认清空所有调度日志数据项？').then(function () {
        return cleanJobLog()
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('清空成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('monitor_job_log', {
        ...this.queryParams, ...{template: '0'}
      }, `定时任务调度日志_${parseTime(new Date().getTime())}.xlsx`)
    }

  }
}
</script>
