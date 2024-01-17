<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务名称" prop="job_name">
        <el-input
          v-model="queryParams.job_name"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="job_group">
        <el-select v-model="queryParams.job_group" placeholder="请选择任务组名" clearable>
          <el-option
            v-for="dict in groupOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable>
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['monitor:job:post']"
          @click="handleAdd"

        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          v-hasPermi="['monitor:job:put']"
          :disabled="single"
          @click="handleUpdate"

        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          v-has-permi="['report:excel_generate:export','monitor:job:export']"
          @click="handleExport"

        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-s-operation"
          size="mini"
          @click="handleJobLog"

        >日志
        </el-button>
      </el-col>
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>

    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="任务ID" width="100" align="center" prop="id"/>
      <el-table-column label="任务代号" width="100" align="center" prop="job_id"/>
      <el-table-column label="任务名称" align="center" prop="job_name" :show-overflow-tooltip="true"/>
      <el-table-column label="任务组名" align="center" prop="job_group">
        <template slot-scope="scope">
          <dict-tag :options="groupOptions" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="调用目标字符串" align="center" prop="func_name" :show-overflow-tooltip="true"/>
      <el-table-column label="cron执行表达式" align="center" prop="cron_expression" :show-overflow-tooltip="true"/>
      <el-table-column label="下次执行时间" align="center" prop="next_run" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>

      </el-table-column>

      <el-table-column label="使用中" align="center" prop="active" width="60">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.active" @change="handleChangIsActive(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['monitor:job:put']"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasRole="['admin','opts']"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleRun" icon="el-icon-caret-right" v-hasRole="['admin','opts']"
              >执行一次
              </el-dropdown-item>
              <el-dropdown-item command="handleView" icon="el-icon-view"
              >任务详细
              </el-dropdown-item>
              <el-dropdown-item command="handleJobLog" icon="el-icon-s-operation"
              >调度日志
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务代号" prop="job_id">
              <el-input v-model="form.job_id" placeholder="请输入任务代号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务名称" prop="job_name">
              <el-input v-model="form.job_name" placeholder="请输入任务名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="任务分组" prop="job_group">
              <el-select v-model="form.job_group" placeholder="请选择任务分组">
                <el-option
                  v-for="dict in groupOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item prop="func_name">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用示例：tasks.demo_task.demo
                    <br/>Class类调用示例：tasks.demo_task.demo
                    <br/>函数字符串说明：请注意是你app目录下存在的路径和方法名
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.func_name" placeholder="请输入调用目标字符串"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="func_args">
              <span slot="label">
                传入位置参数
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用参数示例：['1']
                    <br/>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                    <br/>后台逻辑待完善
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.func_args" placeholder="请输入函数参数如['1']"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="func_kwargs">
              <span slot="label">
                传入关键参数
                <el-tooltip placement="top">
                  <div slot="content">
                    Bean调用参数示例：{'a':'1'}
                    <br/>参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                    <br/>后台逻辑待完善
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.func_kwargs" placeholder="请输入函数参数如{'a':'1'}"/>
            </el-form-item>
          </el-col>





          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cron_expression">
              <el-input v-model="form.cron_expression" placeholder="请输入cron执行表达式">
                <template slot="append">
                  <el-button type="primary" @click="handleShowCron">
                    生成表达式
                    <i class="el-icon-time el-icon--right"></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.id !== undefined">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略" prop="misfire_policy">
              <el-radio-group v-model="form.misfire_policy" size="small">
                <el-radio-button label="1">立即执行</el-radio-button>
                <el-radio-button label="2">执行一次</el-radio-button>
                <el-radio-button label="3">放弃执行</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发" prop="coalesce">
              <el-radio-group v-model="form.coalesce" size="small">
                <el-radio-button label="0">禁止</el-radio-button>
                <el-radio-button label="1">允许</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="下次执行时间" prop="next_run" label-width="150px">
              <div class="block">
                <el-date-picker
                  v-model="form.next_run"
                  type="datetime"
                  placeholder="选择日期时间"
                  align="right"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="active">
              <el-switch v-model="form.active"></el-switch>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="Cron表达式生成器" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
      <crontab @hide="openCron=false" @fill="crontabFill" :expression="expression"></crontab>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" :visible.sync="openView" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务代号：">{{ form.job_id }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.job_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ job_groupFormat(form) }}</el-form-item>
            <el-form-item label="创建时间：">{{ parseTime(form.created_ts) }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="cron表达式：">{{ form.cron_expression }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次执行时间：">{{ form.next_run }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用目标方法：">{{ form.func_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">暂停</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否并发：">
              <div v-if="form.coalesce == 0">禁止</div>
              <div v-else-if="form.coalesce == 1">允许</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行策略：">
              <div v-if="form.misfire_policy == 0">默认策略</div>
              <div v-else-if="form.misfire_policy == 1">立即执行</div>
              <div v-else-if="form.misfire_policy == 2">执行一次</div>
              <div v-else-if="form.misfire_policy == 3">放弃执行</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openView = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listJob, getJob, delRecord, addJob, setRecord, runJob, changeJobStatus, changeActive} from "@/api/monitor/job";
import Crontab from '@/components/Crontab'
import {parseTime} from "@/utils";

export default {
  components: {Crontab},
  name: "Job",
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 是否显示Cron表达式弹出层
      openCron: false,
      // 传入的表达式
      expression: "",
      // 状态数据字典
      statusOptions: [], defaultStatusValue: undefined,
      // 分组状态字典
      groupOptions: [], defaultGroupValue: undefined,
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        job_name: undefined,
        job_id: undefined,
        job_group: undefined,
        status: undefined
      },
      pickerOptions: {
        shortcuts: [{
          text: '1分钟后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 60 * 1000);
            picker.$emit('pick', date);
          }
        },{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        job_id: [
          {required: true, message: "任务代号不能为空", trigger: "blur"}
        ],
        job_name: [
          {required: true, message: "任务名称不能为空", trigger: "blur"}
        ],
        func_name: [
          {required: true, message: "调用目标字符串不能为空", trigger: "blur"}
        ],
        cron_expression: [
          {required: true, message: "cron执行表达式不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts('sys_job_group').then(response => {
      this.groupOptions = response.data.details
      this.groupOptions.forEach(item => {
        if (item.is_default) this.defaultGroupValue = item.value
      })
    })
    this.getDicts('sys_job_status').then(response => {
      this.statusOptions = response.data.details;
      this.statusOptions.forEach(item => {
        if (item.is_default) this.defaultStatusValue = item.value
      })
    })
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.data.results
        this.total = response.data.total
        this.loading = false;
      });
    },
    // 任务组名字典翻译
    job_groupFormat(row, column) {
      return this.selectDictLabel(this.groupOptions, row.job_group);
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        job_name: undefined,
        job_group: undefined,
        func_name: undefined,
        func_args: undefined,
        func_kwargs: undefined,
        cron_expression: undefined,
        misfire_policy: 1,
        coalesce: 0,
        status: 0
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleRun":
          this.handleRun(row);
          break;
        case "handleView":
          this.handleView(row);
          break;
        case "handleJobLog":
          this.handleJobLog(row);
          break;
        default:
          break;
      }
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
    // 任务状态修改
    handleStatusChange(row) {
      let text = row.status === 0 ? "启用" : "暂停";
      this.$modal.confirm('确认要"' + text + '""' + row.job_name + '"任务吗？').then(function () {
        return changeJobStatus(row.id, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === 0 ? 1 : 0;
      });
    },
    /* 立即执行一次 */
    handleRun(row) {
      this.$modal.confirm('确认要立即执行一次"' + row.job_name + '"任务吗？').then(function () {
        return runJob(row.id);
      }).then(() => {
        this.$modal.msgSuccess("执行成功");
      }).catch(() => {
      });
    },
    /** 任务详细信息 */
    handleView(row) {
      getJob(row.id).then(response => {
        this.form = response.data;
        this.openView = true;
      });
    },
    /** cron表达式按钮操作 */
    handleShowCron() {
      this.expression = this.form.cron_expression;
      this.openCron = true;
    },
    /** 确定后回传值 */
    crontabFill(value) {
      this.form.cron_expression = value;
    },
    /** 任务日志列表查询 */
    handleJobLog(row) {
      const id = row.id || 0;
      this.$router.push('/monitor/job-log/' + id)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getJob(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            setRecord(this.form.id, this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功")
                this.open = false
                this.getList()
              } else {
                this.msgError("修改失败," + response.msg)
              }
            })
          } else {
            addJob(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除定时任务编号为"' + ids + '"的数据项？').then(function () {
        return delRecord(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('monitor_job', {
        ...this.queryParams, ...{template: '0'}
      }, `定时任务_${parseTime(new Date().getTime())}.xlsx`)
    }
  }
};
</script>
