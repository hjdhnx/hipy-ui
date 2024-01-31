<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="参数名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入参数名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数键" prop="key">
        <el-input
          v-model="queryParams.key"
          placeholder="请输入参数键"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择菜单状态" clearable size="small"
                   @change="handleQuery">
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
        >初始化配置列表
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['vod:configs:post']"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          v-hasPermi="['vod:configs:put']"
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
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          v-hasRole="['admin','opts']"
          @click="handleClean"
        >清空数据
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">i
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id" width="55"/>
      <el-table-column label="参数名称" align="center" prop="name" width="200" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.value_type==='file'">
            <el-link type="primary" @click="()=>handleLink(scope.row)">
              <span>{{ scope.row.name }}</span>
            </el-link>

            <el-link type="primary" @click="()=>handleEdit(scope.row)">
              <i class="el-icon-edit-outline"/>
            </el-link>
          </span>
          <span v-else-if="scope.row.value_type==='url'">
            <el-link type="primary" :href="scope.row.value" target="_blank">
              <span>{{ scope.row.name }}</span>
            </el-link>
          </span>
          <span v-else>
            {{ scope.row.name }}
          </span>

        </template>
      </el-table-column>


      <el-table-column label="参数键" align="center" prop="key" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="参数值" align="center" prop="value" width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="值类型" align="center" prop="value_type" :formatter="valueTypeFormat"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="排序" align="center" prop="order_num" :show-overflow-tooltip="true" width="55"/>
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="创建时间" align="center" prop="created_ts">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_ts) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="更新时间" align="center" prop="modified_ts">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.modified_ts) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['vod:configs:put']"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入参数名称"/>
        </el-form-item>
        <el-form-item label="参数键" prop="key">
          <el-input v-model="form.key" placeholder="请输入参数键"/>
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input v-model="form.value" placeholder="请输入常数值"/>
        </el-form-item>
        <!--        <el-form-item label="值类型" prop="value_type">-->
        <!--          <el-input v-model="form.value_type" placeholder="请输入值类型"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="值类型" prop="value_type">
          <el-select v-model="form.value_type" placeholder="值类型" clearable size="small" style="width: 200px">
            <el-option v-for="dict in valueTypeOptions" :key="dict.id" :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order_num">
              <el-input-number v-model="form.order_num" controls-position="right" :min="0" style="width: 100%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
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
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
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
  list,
} from "@/api/vod/rules";


import {
  getConfigsByKey,
  listConfigs,
  getConfigsById,
  getConfigsMaxOrderNum,
  addConfigs,
  setConfigs,
  delConfigs,
  refreshConfigs,
  clearRecord,
} from "@/api/vod/configs";

export default {
  name: 'VodConfigs',
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
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 20,
        dict_name: undefined,
        dict_type: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {required: true, message: '参数名称不能为空', trigger: 'blur'}
        ],
        key: [
          {required: true, message: '参数键不能为空', trigger: 'blur'}
        ],
        value: [
          {required: true, message: '参数值不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    this.getList()
    getDicts("vod_rule_status").then(response => {
      this.statusOptions = response.data.details;
    });
    getDicts("vod_configs_value_type").then(response => {
      this.valueTypeOptions = response.data.details;
    });
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = true
      if (!this.queryParams.status && typeof (this.queryParams.status) === 'string') {
        this.queryParams.status = undefined;
      }
      listConfigs(this.queryParams).then(response => {
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
    valueTypeFormat(row, column) {
      return this.selectDictLabel(this.valueTypeOptions, row.value_type);
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
        page_size: 20,
        dict_name: undefined,
        dict_type: undefined
      }
      this.handleQuery()
    },
    handleLink(row) {
      let file_url = new URL(process.env.VUE_APP_BASE_API).origin + "/files/" + row.value;
      open(file_url);
    },
    handleEdit(row) {
      let url = row.value;
      let lastOf = url.lastIndexOf('/') // '/'所在的最后位置
      let str = url.substr(lastOf + 1); //截取文件名称和后缀
      let group_label = url.substr(0, lastOf); // 截取分组的标签
      let name = str.substring(0, str.lastIndexOf(".")); // 获取不带后缀的文件名
      let file_type = url.substring(url.lastIndexOf(".")); //获取带.的后缀名
      // let file_type = url.substring(url.lastIndexOf(".")+1);
      // console.log(group_label,name,file_type);
      getDicts("vod_rule_group").then(response => {
        let groupOptions = response.data.details;
        let group_value = groupOptions.find(x => x.label === group_label).value;
        list({
          name: name,
          group: group_value,
          file_type: file_type,
        }).then(response => {
          let ret = response.data.results;
          let total = response.data.total;
          if (total > 0) {
            this.$router.push('/vod/rules_edit/' + ret[0].id);
          }
        });
      });

    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加系统参数'
      getConfigsMaxOrderNum().then(response => {
        this.form.order_num = response.data.max_order_num + 1
      })
      this.statusOptions.forEach(item => {
        if (item.is_default) this.form.status = item.value
      })
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
      getConfigsById(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改参数'
      })
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            setConfigs(this.form.id, this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功")
                this.open = false
                this.getList()
              } else {
                this.msgError("修改失败," + response.msg)
              }
            })
          } else {
            addConfigs(this.form).then(response => {
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
    /** 刷新源列表按钮操作 */
    handleRefresh(row) {
      this.$modal.confirm('是否确认初始化hipy配置？').then(function () {
        return refreshConfigs();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("初始化成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal.confirm('是否确认清空所有配置？').then(function () {
        return clearRecord();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("清空成功");
      }).catch(() => {
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除参数编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delConfigs(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function () {
      })
    }
  }
}
</script>

