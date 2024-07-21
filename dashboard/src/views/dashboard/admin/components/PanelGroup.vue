<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户数量
          </div>
          <count-to :start-val="0" :end-val="count.active_users" :duration="1" class="card-panel-num"/>
          <span class="card-panel-text">/</span>
          <count-to :start-val="0" :end-val="count.total_users" :duration="1" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="list" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            源数量
          </div>
          <count-to :start-val="0" :end-val="count.active_rules" :duration="1" class="card-panel-num"/>
          <span class="card-panel-text">/</span>
          <count-to :start-val="0" :end-val="count.total_rules" :duration="1" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="star" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            订阅数量
          </div>
          <count-to :start-val="0" :end-val="count.active_subs" :duration="1" class="card-panel-num"/>
          <span class="card-panel-text">/</span>
          <count-to :start-val="0" :end-val="count.total_subs" :duration="1" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="question" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            版本号
          </div>
          <el-tag>{{ version }}</el-tag>
          <!--          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>-->
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {getVersion} from '@/api/control_panel/database'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      count: {
        active_users: NaN,
        total_users: NaN,
        active_rules: NaN,
        total_rules: NaN,
        active_subs: NaN,
        total_subs: NaN
      },
      version: "hipy-server 20240722 beta1",
      cost_time: 10.97
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getVersion().then(response => {
          let res = response.data;
          console.log(res);
          this.count = res.count;
          this.version = res.version;
          this.cost_time = res.cost_time;
        }
      );
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
