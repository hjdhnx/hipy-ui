<template>
  <div class="json-editor">
    <textarea ref="textarea"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'

require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value', 'auto_line', 'height'],
  data() {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        try {
          value = JSON.stringify(JSON.parse(this.value||'{}'), null, 2)
        }catch (e) {}
        this.jsonEditor.setValue(value)
      }
    },
    auto_line(auto_line) {
      console.log('auto_line', auto_line);
      this.jsonEditor.setOption("lineWrapping", auto_line);
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      lineWrapping: this.auto_line,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'rubyblue',
      lint: true
    })
    this.jsonEditor.setSize('auto', (this.height || 300) + 'px'); //设置宽度,高度
    let value = this.value;
    try {
      value = JSON.stringify(JSON.parse(this.value||'{}'), null, 2)
    }catch (e) {}
    this.jsonEditor.setValue(value)
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.json-editor {
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
