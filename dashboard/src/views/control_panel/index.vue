<template>
  <div class="app-container">
    <el-form ref="mainForm" :model="form" :inline="true" label-width="68px">
      <el-form-item>
        <el-button :loading="loading" type="primary" icon="el-icon-upload" size="mini" @click="dialogVisible = true" v-hasRole="['admin','opts']">
          升级数据库
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleRefresh">刷新</el-button>
      </el-form-item>

      <el-col :span="24">
        <el-button
          type="primary"
          icon="el-icon-upload2"
          size="mini"
          v-hasPermi="['monitor:job:post']"
          @click="handleImport"
        >上传定时任务脚本
        </el-button>
      </el-col>
    </el-form>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>确定要升级数据库吗?可以热更新表结构，同步模型中增删过的字段</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleUpdateDatabase">确 定</el-button>
  </span>
    </el-dialog>

    <!-- 定时任务上传对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".py"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport"/>
            是否覆盖已经存在的定时任务脚本文件
          </div>
          <span>仅允许上传py格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {getParameter} from '@/api/system/parameter'
import {setRecord} from '@/api/control_panel/database'
import {getToken} from "@/utils/auth";
import {parseTime} from "@/utils";

export default {
  name: 'ControlPanel',
  data() {
    return {
      // 遮罩层
      loading: false,
      // 询问框
      dialogVisible: false,
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 定时任务上传参数
      upload: {
        // 是否显示弹出层（定时任务上传）
        open: false,
        // 弹出层标题（定时任务上传）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的定时任务数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Token: getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "monitor/job/file/importData"
      },
    }
  },
  created() {
  },
  methods: {
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    updateDatabase() {
      this.loading = true
      getParameter('database_update_auth').then(response => {
        let data = response.data;
        console.log(data);
        if (data.value) {
          const loading2 = this.$loading({
            lock: true,
            text: '数据库升级中，请稍等...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          try {
            setRecord({auth_code: data.value}).then(response => {
              let code = response.code
              loading2.close();
              this.loading = false;
              if (code === 0 && !response.data.error) {
                this.$message({
                  message: '数据库升级成功',
                  type: 'success'
                });
              } else {
                this.$message.error('数据库升级失败:' + response.data.error);
              }
            });
          }catch (e) {
            loading2.close();
            this.loading = false;
          }

        } else {
          this.loading = false
        }
      })
    },
    init() {
      this.loading = false
    },
    /** 升级数据库按钮操作 */
    handleUpdateDatabase() {
      this.dialogVisible = false
      this.updateDatabase()
      // setTimeout(() => {
      //   loading.close();
      //   this.loading = false;
      //   this.$message({
      //     message: '数据库升级完毕',
      //     type: 'success'
      //   });
      // }, 2000);
    },
    /** 刷新按钮操作 */
    handleRefresh() {
      this.init()
      location.reload();
    },
    /** 上传按钮操作 */
    handleImport() {
      this.upload.title = "定时任务脚本上传";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.$message('没写这个功能')
      // this.download('system_user', {
      //   ...this.queryParams, ...{template: '1'}
      // }, `user_template_${parseTime(new Date().getTime())}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "上传结果", {dangerouslyUseHTMLString: true});
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

  }
}
</script>
