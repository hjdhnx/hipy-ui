<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规则名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="代码" prop="value">
        <el-input
          v-model="queryParams.value"
          placeholder="请输入规则代码"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网址" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入规则网址"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input
          v-model="queryParams.author"
          placeholder="请输入规则作者"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="开发者" prop="dev_id">
        <el-input
          v-model="queryParams.dev_id"
          placeholder="请输入规则开发者"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-has-permi="['hiker:rule:post']"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          v-has-permi="['hiker:rule:put']"
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
          type="warning"
          icon="el-icon-download"
          size="mini"
          v-has-permi="['report:excel_generate:export']"
          :disabled="multiple"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">i
      <el-table-column fixed="left" type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" width="55"/>
      <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="作者" align="center" prop="author" :show-overflow-tooltip="true"/>
      <el-table-column label="类型" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/hiker/rule_type/' + scope.row.type_id" class="link-type">
            <span>{{ scope.row.type_name }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="开发者" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <router-link :to="'/hiker/developer/' + scope.row.dev_id" class="link-type">
            <span>{{ scope.row.dev_name }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="代码" align="center" prop="value" :show-overflow-tooltip="true"/>
      <el-table-column label="链接" align="center" prop="url" :show-overflow-tooltip="true"/>
      <el-table-column label="状态" align="center" prop="state" :show-overflow-tooltip="true"/>
      <el-table-column label="验证" align="center" prop="auth" :show-overflow-tooltip="true"/>
      <el-table-column label="验证过期时间" align="center" prop="auth_date_time" :show-overflow-tooltip="true"/>
      <el-table-column label="过期" align="center" prop="time_over" :show-overflow-tooltip="true"/>
      <el-table-column label="base值" align="center" prop="b64_value" :show-overflow-tooltip="true"/>
      <el-table-column label="主页链接" align="center" prop="home_url" :show-overflow-tooltip="true"/>
      <el-table-column label="图片链接" align="center" prop="pic_url" :show-overflow-tooltip="true"/>
      <el-table-column label="是json" align="center" prop="is_json" :show-overflow-tooltip="true"/>
      <el-table-column label="是重定向" align="center" prop="is_redirect" :show-overflow-tooltip="true"/>
      <el-table-column label="是否为仓库跳转规则" align="center" prop="is_tap" :show-overflow-tooltip="true"/>
      <el-table-column label="是否可以互动" align="center" prop="can_discuss" :show-overflow-tooltip="true"/>
      <el-table-column label="是否json列表" align="center" prop="is_json_list" :show-overflow-tooltip="true"/>
      <el-table-column label="数据类型" align="center" prop="data_type" :show-overflow-tooltip="true"/>
      <el-table-column label="版本号" align="center" prop="version" :show-overflow-tooltip="true"/>
      <el-table-column label="说明" align="center" prop="note" :show-overflow-tooltip="true"/>
      <el-table-column label="点赞数" align="center" prop="good_num" :show-overflow-tooltip="true"/>
      <el-table-column label="踩数" align="center" prop="bad_num" :show-overflow-tooltip="true"/>
      <el-table-column label="回复数" align="center" prop="reply_num" :show-overflow-tooltip="true"/>
      <el-table-column label="是否安全" align="center" prop="is_safe" :show-overflow-tooltip="true"/>
      <el-table-column label="是否优质" align="center" prop="is_good" :show-overflow-tooltip="true"/>
      <el-table-column label="是否白名单" align="center" prop="is_white" :show-overflow-tooltip="true"/>
      <el-table-column label="风险描述" align="center" prop="not_safe_note" :show-overflow-tooltip="true"/>
      <el-table-column label="开发者上次提交时间" align="center" prop="last_active" :show-overflow-tooltip="true"/>


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
            v-has-permi="['hiker:rule:put']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="100%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入规则名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" placeholder="请输入规则作者"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="类型" prop="type_id">
              <el-input-number v-model="form.type_id" controls-position="right" :min="0" style="width: 100%"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="开发者" prop="dev_id">
              <el-input-number v-model="form.dev_id" controls-position="right" :min="0" style="width: 100%"/>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-input v-model="form.state" placeholder="请输入..."/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="数据类型" prop="data_type">
              <el-select v-model="form.data_type" filterable placeholder="请选择">
                <el-option
                  v-for="item in dataTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>

              <!--              <drag-select :value="['规则','主题','静态文件']"></drag-select>-->
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="是json" prop="is_json">
              <el-switch v-model="form.is_json"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否json列表" prop="is_json_list" label-width="150px">
              <el-switch v-model="form.is_json_list"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是重定向" prop="is_redirect">
              <el-switch v-model="form.is_redirect"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否为仓库跳转规则" prop="is_tap" label-width="150px">
              <el-switch v-model="form.is_tap"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="过期" prop="time_over">
              <el-switch v-model="form.time_over"></el-switch>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="请输入..."/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="点赞数" prop="good_num">
              <el-input-number v-model="form.good_num" controls-position="right" :min="0" style="width: 100%"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="踩数" prop="bad_num">
              <el-input-number v-model="form.bad_num" controls-position="right" :min="0" style="width: 100%"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="回复数" prop="reply_num">
              <el-input-number v-model="form.reply_num" controls-position="right" :min="0" style="width: 100%"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否安全" prop="is_safe">
              <el-switch v-model="form.is_safe"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否优质" prop="is_good">
              <el-switch v-model="form.is_good"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否白名单" prop="is_white" label-width="150px">
              <el-switch v-model="form.is_white"></el-switch>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否可以互动" prop="can_discuss" label-width="150px">
              <el-switch v-model="form.can_discuss"></el-switch>
            </el-form-item>
          </el-col>

        </el-row>


        <el-form-item label="base值" prop="b64_value">
          <el-input v-model="form.b64_value" placeholder="请输入..."/>
        </el-form-item>

        <el-form-item label="主页链接" prop="home_url">
          <el-input v-model="form.home_url" placeholder="请输入..."/>
        </el-form-item>

        <el-form-item label="图片链接" prop="pic_url">
          <el-input v-model="form.pic_url" placeholder="请输入..."/>
        </el-form-item>

        <el-form-item label="说明" prop="note">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            v-model="form.note">
          </el-input>

          <!--          <markdown-editor v-model="form.note" :value="form.note"></markdown-editor>-->
        </el-form-item>

        <el-form-item label="代码" prop="value">
          <json-editor :value="json_value" v-model="form.value"></json-editor>
        </el-form-item>

        <el-form-item label="链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入..."/>
        </el-form-item>

        <el-form-item label="验证" prop="auth">
          <el-input v-model="form.auth" placeholder="请输入..."/>
        </el-form-item>

        <el-form-item label="开发者上次提交时间" prop="last_active" label-width="150px">
          <div class="block">
            <el-date-picker
              v-model="form.last_active"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="验证过期时间" prop="auth_date_time" label-width="150px">
          <div class="block">
            <el-date-picker
              v-model="form.auth_date_time"
              type="datetime"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>

        </el-form-item>

        <el-form-item label="风险描述" prop="not_safe_note">
          <el-input v-model="form.not_safe_note" placeholder="请输入..." type="textarea" :rows="4"/>
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
import {searchRecords, getRecord, addRecord, setRecord, delRecord} from '@/api/hiker/rule'
import JsonEditor from '@/components/JsonEditor'
import MarkdownEditor from '@/components/MarkdownEditor'
import MDinput from '@/components/MDinput'
import DragSelect from '@/components/DragSelect'

export default {
  name: 'HikerRule',
  components: {JsonEditor, MarkdownEditor, MDinput, DragSelect},
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
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 20,
        name: undefined,
        url: undefined,
        value: undefined,
        author: undefined,
        dev_id: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {required: true, message: '规则名称不能为空', trigger: 'blur'}
        ],
      },
      pickerOptions: {
        shortcuts: [{
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
      dataTypeOptions: [],

    }
  },
  created() {
    this.getList();
    getDicts("hiker_rule_data_type").then(response => {
      this.dataTypeOptions = response.data.details;
    })
  },
  computed: {
    json_value() {
      if(this.form.value){
        try {
          return JSON.parse(this.form.value)
        }catch (e) {
          return this.form.value
        }
      }
      return {}
    }
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
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
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
        name: undefined,
      }
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.active = true;
      this.open = true
      this.title = '添加规则'
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改规则'
      })
    },
    /** 改变是否超管 */
    handleChangIsManager(row) {
      changeIsManager(row.id, row.is_manager).then(response => {
        if (response.code === 0) {
          this.msgSuccess("修改成功")
        }
        this.getList();
      })
    },
    handleChangActive(row) {
      changeActive(row.id, row.active).then(response => {
        if (response.code === 0) {
          this.msgSuccess("修改成功")
        }
        this.getList();
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
      this.$confirm('是否确认删除规则ID为"' + ids + '"的数据项?', '警告', {
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

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所选中的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportConfig(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  }
}
</script>
