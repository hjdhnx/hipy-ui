<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="代码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入订阅代码"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入订阅名称"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="正则" prop="reg">
        <el-input
          v-model="queryParams.reg"
          placeholder="请输入正则字符串"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订阅状态" clearable size="small"
                   @change="handleQuery"
                   style="width: 80px">
          <el-option
            :key="undefined"
            :label="'全部'"
            :value="undefined"
          />
          <el-option
            v-for="dict in statusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="匹配模式" prop="mode">
        <el-select v-model="queryParams.mode" placeholder="请选择匹配模式" clearable size="small" @change="handleQuery"
                   style="width: 80px">
          <el-option
            :key="undefined"
            :label="'全部'"
            :value="undefined"
          />
          <el-option
            v-for="dict in matchOptions"
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
          icon="el-icon-plus"
          size="mini"
          v-has-permi="['vod:subs:post']"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          v-has-permi="['vod:subs:put']"
          :disabled="single"
          @click="handleUpdate"
        >修改
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
          type="success"
          icon="el-icon-edit"
          size="mini"
          v-hasRole="['admin','opts']"
          :disabled="multiple"
          @click="handleEnable"
        >设为启用
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-edit"
          size="mini"
          v-hasRole="['admin','opts']"
          :disabled="multiple"
          @click="handleDisable"
        >设为禁用
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          v-has-permi="['report:excel_generate:export','vod:subs:export']"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" :default-sort="defaultSort" @selection-change="handleSelectionChange">i
      <el-table-column fixed="left" type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" width="55"/>
      <el-table-column label="订阅名称" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="订阅代码" align="center" prop="code" :show-overflow-tooltip="true"/>
      <el-table-column label="订阅正则" align="center" prop="reg" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="匹配模式" align="center" prop="mode" :formatter="matchesFormat"/>
      <!--      <el-table-column label="过期时间" align="center" prop="due_time" :show-overflow-tooltip="true"/>-->
      <el-table-column label="过期时间" align="center" prop="due_time" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.due_time) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="created_ts" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_ts) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="modified_ts">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modified_ts) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-has-permi="['vod:subs:put']"
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
              <el-dropdown-item command="handleT3" icon="el-icon-link" v-hasRole="['admin','opts']"
              >T3配置
              </el-dropdown-item>
              <el-dropdown-item command="handleT4" icon="el-icon-link" v-hasRole="['admin','opts']"
              >T4配置
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
      :page-sizes="[10,15,20,40,60,80,100,150,200,300,500,1000]"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入订阅名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码" prop="code">
              <el-input v-model="form.code" placeholder="请输入订阅代码"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="正则" prop="reg">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入正则表达式文本"
            v-model="form.reg">
          </el-input>
        </el-form-item>

        <el-form-item label="过期时间" prop="due_time" label-width="150px">
          <div class="block">
            <el-date-picker
              v-model="form.due_time"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择订阅过期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="(dict, index) in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>

          </el-radio-group>
          <!--          <el-select v-model="form.status">-->
          <!--            <el-option-->
          <!--              v-for="dict in statusOptions"-->
          <!--              :key="dict.value"-->
          <!--              :label="dict.label"-->
          <!--              :value="dict.value"-->
          <!--            />-->
          <!--          </el-select>-->
        </el-form-item>

        <el-form-item label="匹配模式" prop="mode">
          <el-radio-group v-model="form.mode">
            <el-radio
              v-for="(dict, index) in matchOptions"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
          <!--          <el-select v-model="form.mode">-->
          <!--            <el-option-->
          <!--              v-for="dict in matchOptions"-->
          <!--              :key="dict.value"-->
          <!--              :label="dict.label"-->
          <!--              :value="dict.value"-->
          <!--            />-->
          <!--          </el-select>-->
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getDicts} from '@/api/system/dict/data'
import {
  searchRecords,
  getRecord,
  addRecord,
  setRecord,
  delRecord,
  enableRecords,
  disableRecords,
} from '@/api/vod/subs'
import {parseTime} from "@/utils";
import {generateRandomDigit, generateRandomString} from '@/utils/random'

export default {
  name: 'VodSubs',
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
      // 默认排序
      defaultSort: {prop: 'id', order: 'ascending'},
      statusOptions: [],
      matchOptions: [{label: '正向匹配', value: 0}, {label: '逆向排除', value: 1}],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 20,
        code: undefined,
        name: undefined,
        reg: undefined,
        status: undefined,
        mode: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {required: true, message: '订阅名称不能为空', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '订阅代码不能为空', trigger: 'blur'},
          {min: 6, message: "最小长度为6位字符", trigger: "blur"}
        ],
        reg: [
          {required: true, message: '正则表达式字符串不能为空', trigger: 'blur'}
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        },
          {
            text: '一月',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          },
          {
            text: '半年',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 6);
              picker.$emit('pick', date);
            }
          },
          {
            text: '一年',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
              picker.$emit('pick', date);
            }
          },
          {
            text: '永久',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365 * 99);
              picker.$emit('pick', date);
            }
          }
        ]
      },
    }
  },
  created() {
    this.getList();
    getDicts("vod_rule_status").then(response => {
      this.statusOptions = response.data.details;
    })
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true
      searchRecords(this.queryParams).then(response => {
        this.list = response.data.results
        this.total = response.data.total
        this.loading = false
      })
    },
    // 字典状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 匹配模式翻译
    matchesFormat(row, column) {
      return this.selectDictLabel(this.matchOptions, row.mode);
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
        code: undefined,
        name: undefined,
        reg: undefined,
        status: undefined,
        mode: undefined,
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
        page_size: 20,
        code: undefined,
        name: undefined,
        reg: undefined,
        status: undefined,
        mode: undefined,
      }
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      let default_value = {
        code: generateRandomString(6),
        status: 1,
        mode: 0,
        reg: '.*'
      };
      Object.assign(this.form, default_value);
      this.open = true;
      this.title = '添加订阅';
      // this.statusOptions.forEach(item => {
      //   if (item.is_default) this.form.status = item.value
      // });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleT3":
          this.handleConfig(row, 1);
          break;
        case "handleT4":
          this.handleConfig(row, 0);
          break;
        default:
          break;
      }
    },
    handleConfig(row, mode) {
      let code = row.code;
      let file_url = new URL(process.env.VUE_APP_BASE_API).origin + `/config/${mode}?sub=${code}`;
      open(file_url);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改订阅信息'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
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
            addRecord(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("添加成功")
                this.open = false
                this.getList()
              } else {
                this.msgError("添加失败," + response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除订阅ID为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delRecord(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function () {
      })
    },

    handelSetStatus(row, status) {
      const ids = row.id || this.ids;
      let desc = status === 1 ? '启用' : '禁用';
      this.$confirm(`是否确认${desc}订阅ID为"` + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        if (status === 1) {
          return enableRecords(ids)
        } else {
          return disableRecords(ids)
        }
      }).then(() => {
        this.getList()
        this.msgSuccess('操作成功')
      }).catch(function () {
      })
    },

    /** 设为启用按钮操作 */
    handleEnable(row) {
      this.handelSetStatus(row, 1);
    },
    /** 设为禁用按钮操作 */
    handleDisable(row) {
      this.handelSetStatus(row, 0);
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('vod_subs', {
        ...this.queryParams, ...{template: '0'}
      }, `源订阅信息_${parseTime(new Date().getTime())}.xlsx`)
    },
  }
}
</script>
