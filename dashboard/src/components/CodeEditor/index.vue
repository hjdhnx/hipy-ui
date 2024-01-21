<template>
  <div class="code-editor">
    <textarea ref="textarea"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/theme/eclipse.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/ambiance-mobile.css'
import 'codemirror/theme/3024-day.css'
import 'codemirror/theme/3024-night.css'
import 'codemirror/theme/erlang-dark.css'
import 'codemirror/theme/monokai.css'

require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python.js'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'CodeEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'mode', 'theme', 'height', 'auto_line'],
  data() {
    return {
      codeEditor: false
    }
  },
  watch: {
    value(value) {
      value = value || '';
      const editorValue = this.codeEditor.getValue()
      if (value !== editorValue) {
        this.codeEditor.setValue(this.value)
      }
    },
    theme(theme) {
      this.codeEditor.setOption("theme", theme);
    },
    auto_line(auto_line) {
      console.log('auto_line', auto_line);
      this.codeEditor.setOption("lineWrapping", auto_line);
    }
  },
  mounted() {
    console.log('this.mode:', this.mode, 'this.theme:', this.theme);
    this.codeEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      lineWrapping: this.auto_line,
      mode: this.mode || 'javascript',
      gutters: ['CodeMirror-lint-markers'],
      theme: this.theme || 'monokai',
      lint: true,
    })

    this.codeEditor.setSize('auto', (this.height || 500) + 'px'); //设置宽度,高度
    this.codeEditor.setValue(this.value)
    this.codeEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.codeEditor.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.code-editor {
  height: 100%;
  position: relative;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}
</style>
