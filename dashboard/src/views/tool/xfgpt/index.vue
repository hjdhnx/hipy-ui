<template>
  <div style="margin-top:30px;padding-left:10px;padding-right:10px">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-input
          style="margin-left:20px"
          type="textarea"
          placeholder="请输入内容"
          v-model="userInput"
          maxlength="500"
          show-word-limit
          :autosize="{ minRows: 2}"
          resize="none"
        />
      </el-col>
      <el-col :span="8">
        <el-button @click="start" type="primary" style="margin-left:10px;width:50%" :loading="loading">
          {{ loading ? 'ai在拼命思考啦' : '提问' }}
        </el-button>
      </el-col>
    </el-row>
    <div>
      <div v-for="chatConten in finalChat">
        <p style="color:green">我:{{ chatConten.user }}</p>
        <p style="color:red">chatGPT:{{ chatConten.ai }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: "XfGpt",
  data() {
    return {
      appId: '6fafca91',
      status: 'init',
      ttsWS: null,
      totalRes: '',
      userInput: '',
      aiContentRequest: '',
      finalChat: [],
      loading: false,
      test_msg:'{"header":{"app_id":"6fafca91","uid":"12345"},"parameter":{"chat":{"domain":"general","temperature":0.5,"max_tokens":1024}},"payload":{"message":{"text":[{"role":"user","content":"你是谁"},{"role":"assistant","content":"....."},{"role":"user","content":"你会做什么"}]}}}',
      // test_url:'wss://spark-openapi.cn-huabei-1.xf-yun.com/v1/assistants/vicrmmy973oy_v1', //force机器人
      test_url:'wss://spark-openapi.cn-huabei-1.xf-yun.com/v1/assistants/c2zsj6y3ulrl_v1', //成语机器人
    };
  },
  methods: {
    getWebsocketUrl() {
      const self = this
      return new Promise((resolve, reject) => {
        const apiKey = '3bd86468db9c5087a2131908bb2005f1';
        const apiSecret = 'Mjc3MDhmOTZjZWNiNGJiMDZiZjIwM2Vk';
        // const url = 'wss://spark-api.xf-yun.com/v1.1/chat'; //这里使用的是星火大模型1.x版本
        // const url = 'wss://spark-api.xf-yun.com/v3.1/chat'; //这里使用的是星火大模型3.x版本
        const url = self.test_url
        const host = window.location.host;
        const date = new Date().toGMTString();
        const algorithm = 'hmac-sha256';
        const headers = 'host date request-line';
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`;
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        const authorization = window.btoa(authorizationOrigin);
        const finalUrl = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
        console.log(finalUrl)
        resolve(finalUrl);
      });
    },
    setStatus(status) {
      this.status = status;
    },
    connectWebSocket() {
      this.setStatus('ttsing');
      this.getWebsocketUrl().then((url) => {
        let ttsWS;
        if ('WebSocket' in window) {
          ttsWS = new WebSocket(url);
        } else if ('MozWebSocket' in window) {
          ttsWS = new MozWebSocket(url);
        } else {
          alert('浏览器不支持WebSocket');
          return;
        }
        this.ttsWS = ttsWS;
        ttsWS.onopen = (e) => {
          this.webSocketSend();
        };
        ttsWS.onmessage = (e) => {
          this.result(e.data);
        };
        ttsWS.onerror = (e) => {
          clearTimeout(this.playTimeout);
          this.setStatus('error');
          alert('WebSocket报错，请f12查看详情');
          console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`);
        };
        ttsWS.onclose = (e) => {
          console.log(e);
        };
      });
    },
    webSocketSend() {
      let that = this
      const params = {
        header: {
          app_id: this.appId,
          uid: '随意',
        },
        parameter: {
          chat: {
            // domain: 'general',//如果是chat2这里也需要进行相应修改
            domain: 'generalv3',//如果是chat2这里也需要进行相应修改
            temperature: 0.5,
            max_tokens: 1024,
          },
        },
        payload: {
          message: {
            text: [
              {"role": "user", "content": that.userInput}
            ]
          },
        },
      };
      console.log(JSON.stringify(params));
      this.ttsWS.send(JSON.stringify(params));
    },
    start() {
      this.loading = true
      this.totalRes = '';
      this.aiContentRequest = ''
      this.connectWebSocket();
    },
    requestHandle(requestData) {//处理request
      this.aiContentRequest = this.aiContentRequest + requestData.payload.choices.text[0].content
    },
    result(resultData) {
      let jsonData = JSON.parse(resultData);
      // console.log(jsonData)
      this.totalRes += resultData;
      //this.$refs.outputText.value = this.totalRes;
      //加入到ai回答中
      if (jsonData.header.status !== 2) {//不为结束就进行添加
        this.requestHandle(jsonData)
      } else {
        this.requestHandle(jsonData) // 结束还是添加
        let contentSomething = {
          ai: this.aiContentRequest,
          user: this.userInput
        }
        this.finalChat.push(contentSomething)
        this.userInput = ''
        this.loading = false
      }
      if (jsonData.header.code !== 0) {
        alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`);
        console.error(`${jsonData.header.code}:${jsonData.header.message}`);
        return;
      }
      if (jsonData.header.code === 0 && jsonData.header.status === 2) {
        this.ttsWS.close();
        this.setStatus('init');
      }
    },
  },
};
</script>
