<template>
  <div class="app-container">
    <el-form ref="mainForm" :model="form" label-width="68px">
      <el-form-item label="文件直链" prop="rule_url">
        <el-col :span="18">
          <el-input v-model="form.rule_url" :disabled="false" type="textarea" :rows="1"/>
        </el-col>
        <el-col :span="4">
          <!--          <el-button type="primary" icon="el-icon-copy-document" circle @click="handleCopy">复制</el-button>-->
          <el-button class="copy-btn-main" size="mini" icon="el-icon-document-copy" type="primary">
            复制
          </el-button>
        </el-col>
      </el-form-item>

      <el-form-item label="主题" prop="theme">
        <el-col :span="12">
          <el-select v-model="editor.theme" @change="handleThemeChange" placeholder="请选择编辑器皮肤" clearable size="small">
            <el-option
              v-for="dict in themeOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-switch
            active-text="自动换行"
            v-model="editor.auto_line"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-col>
      </el-form-item>

      <el-form-item label="在线编辑" prop="rule_code" label-width="80" label-position="top">

        <el-col :span="24">
          <!--          <el-input v-model="form.rule_code" placeholder="请输入..." type="textarea"-->
          <!--                    :autosize="{ minRows: 15, maxRows: 26}" :disabled="!form.rule_editable"/>-->

          <code-editor :value="form.rule_code" :theme="editor.theme" :auto_line="editor.auto_line"
                       :height="editor.height" :mode="editor.mode" v-model="form.rule_code"
                       v-if="editor.mode"></code-editor>
        </el-col>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-folder-checked" size="mini" @click="handleSave"
                   :disabled="!form.rule_editable">保存
        </el-button>
        <el-button type="info" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="danger" icon="el-icon-folder-delete" size="mini" @click="handleClear"
                   :disabled="!form.rule_editable">清空
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getRawContent, getRuleRaw, saveRecordContent} from "@/api/vod/rules";
import ClipboardJS from "clipboard";
import CodeEditor from '@/components/CodeEditor'

export default {
  name: 'VodRulesEdit',
  components: {CodeEditor},
  data() {
    return {
      clipboard: undefined,
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
      themeOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 20,
      },
      _id: undefined,
      editor: {
        mode: undefined,
        theme: 'monokai',
        auto_line: true,
        height: window.screen.availHeight - 500,
      },
      // 表单参数
      form: {
        rule_code: '',
        rule_url: undefined,
        rule_editable: true,
      },
      // 表单校验
      rules: {
        rule_code: [
          {required: true, message: '源内容不能为空', trigger: 'blur'}
        ],
      }
    }
  },
  created() {
    const _id = this.$route.params && this.$route.params.id
    if (_id) {
      console.log('rule_id:', _id);
      this._id = _id;
    }
    this.themeOptions = ['default', 'idea', 'eclipse', 'rubyblue', 'ambiance-mobile', '3024-day', '3024-night', 'erlang-dark', 'monokai'].map(it => {
      return {label: it, value: it}
    });
    this.getList();
  },
  mounted() {
    if (!this.clipboard) {
      this.clipboard = new ClipboardJS('.copy-btn-main', {
        text: trigger => {
          const codeStr = this.form.rule_url;
          // this.$notify({
          //   title: '复制成功',
          //   message: '链接地址已复制到剪切板,可粘贴。\n'+this.form.rule_url,
          //   type: 'success'
          // })
          this.$message({
            message: '已复制到剪切板\n' + codeStr,
            type: 'success'
          });
          return codeStr
        }
      })
      this.clipboard.on('error', e => {
        this.$message.error('链接地址复制失败')
      })
    }

  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      if (this._id) {
        this.loading = true
        getRuleRaw(this._id).then(response => {
          let data = response.data;
          if (data.url && data.url.startsWith('http')) {
            this.form.rule_url = data.url;
            if (data.url.endsWith('.py')) {
              this.editor.mode = 'python';
            } else if (data.url.endsWith('.json') || data.url.endsWith('.js')) {
              this.editor.mode = 'javascript';
            } else {
              this.editor.mode = 'txt';
            }
            this.form.rule_editable = data.editable;

            if (data.editable) {
              getRawContent(data.url).then(response => {
                this.form.rule_code = response;
              });
            } else {
              this.form.rule_code = '二进制文件无法显示文本内容'
            }
          }
          this.loading = false
        });
      }
    },
    handleClear() {
      this.form.rule_code = '';
    },
    handleThemeChange(val) {
      console.log('handleThemeChange:', val)
    },
    handleSave() {
      let self = this;
      this.$confirm('确认保存文件?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return saveRecordContent(self._id, self.form.rule_code.replaceAll('\r', ''));
      }).then((response) => {
        this.getList();
        this.msgSuccess(response.msg || "修改成功");
      }).catch(function (e) {
        console.log('发生了错误:', e);
      })

      // saveRecordContent(this._id, this.form.rule_code).then(response => {
      //   this.msgSuccess(response.msg || "修改成功");
      //   this.getList();
      // });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    handleCopy() {
      // console.log(this.form.rule_url);
      this.$message({
        message: '已复制到剪切板\n' + this.form.rule_url,
        type: 'success'
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        page_size: 20,
      }
      this.handleQuery()
    },
  }
}
</script>
