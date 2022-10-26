<style>
.el-textarea__inner {
  border-radius: 0px!important;
}
</style>
<template>
  <el-dialog
    :append-to-body='true'
    :visible='visible'
    class='c-LotteryConfig'
    fullscreen
    @close="$emit('update:visible', false)"
  >
    <div slot='title' class='c-LotteryConfigtitle'>
      <el-tabs v-model='activeName'>
        <el-tab-pane label='首页设置' name='setHeader'>
          <div>
            <el-button size='mini' style='margin-bottom:5px; ' type='primary' @click='saveTitle'
            >保存配置
            </el-button>

            <el-form>
              <el-form-item
                :label="'主题'"
              >
                <el-input
                  v-model='title.name'
                  type='text'
                />
              </el-form-item>

              <el-form-item
                :label="'口号'"
              >
                <el-input
                  v-model='title.slogan'
                  type='text'
                />
              </el-form-item>
            </el-form>

          </div>

        </el-tab-pane>
        <el-tab-pane label='抽奖人' name='setPeople'>

          <div>
            <el-button size='mini' style='margin-bottom:5px; ' type='primary' @click='transformList'
            >保存配置
            </el-button>

            <el-input
              v-model='listStr'
              :rows='10'
              placeholder='请输入抽奖人名单一行一个名字 如：
张三
李四
王五'
              type='textarea'
            ></el-input>
          </div>
        </el-tab-pane>

        <el-tab-pane label='抽奖规则' name='setRules' :disabled='listStr.length==0'>

          <el-button size='mini' @click='addLottery'>增加奖项</el-button>
          <el-button size='mini' type='primary' @click='onSubmit'
          >保存配置
          </el-button
          >

          <div class='container'>
            <el-form ref='form' :inline='true' :model='form' size='mini'>

              <el-form-item v-for='newitem in storeNewLottery' :key='newitem.key' style='display: flex;'>
                <div>
                  <b>
                    {{ newitem.name }}
                  </b>
                </div>
                <el-form-item
                  :label="'中奖人数'"
                >
                  <el-input
                    v-model='form[newitem.key]'
                    :min='0'
                    :step='1'
                    type='number'
                  />
                </el-form-item>

                <el-form-item
                  :label="'每次中奖的人数'"
                >
                  <el-input
                    v-model='form[newitem.key1]'
                    :min='0'
                    :step='1'
                    type='number'
                  ></el-input>
                </el-form-item>

                <el-form-item
                  :label="'抽奖顺序'"
                >
                  <el-input
                    v-model='form[newitem.key2]'
                    :min='0'
                    :step='1'
                    type='number'
                    @change='
              val => {
                form[newitem.key2] = Number(val);
              }
            '
                  ></el-input>
                </el-form-item>
              </el-form-item>


            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label='抽奖结果' name='setResult'>
          <Result />
        </el-tab-pane>
      </el-tabs>


    </div>


    <el-dialog
      :append-to-body='true'
      :visible.sync='showAddLottery'
      class='dialog-showAddLottery'
      width='300px'
    >
      <div slot='title' class='add-title'>增加奖项</div>
      <el-form ref='newLottery' :model='newLottery' size='mini'>
        <el-form-item label='奖项名称'>
          <el-input v-model='newLottery.name'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='addHandler'>增加奖项</el-button>
          <el-button @click='showAddLottery = false'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-dialog>
</template>
<script>
import { configField, setData } from '@/helper/index';
import { randomNum } from '@/helper/algorithm';
import Vue from 'vue';
import Result from './Result';

export default {
  name: 'LotteryConfig',
  components: { Result },
  props: {
    visible: Boolean
  },
  computed: {
    form: {
      get() {
        return this.$store.state.config;
      },
      set(val) {
        // this.$store.commit('setConfig', val);
        return val;
      }
    },

    storeNewLottery() {
      return this.$store.state.newLottery;
    }
  },
  data() {
    return {
      listStr: '',
      activeName: 'setHeader',
      showAddLottery: false,
      newLottery: { name: '' },
      title: {
        name: '',
        slogan: ''
      }
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let listStr = this.$store.state.list;
      for (let i in listStr) {
        if (i < listStr.length - 1) {
          this.listStr += listStr[i].name + '\n';
        } else {
          this.listStr += listStr[i].name;
        }
      }
      //  init title
      Vue.set(this.title, 'name', this.$store.state.config.name);
      Vue.set(this.title, 'slogan', this.$store.state.config.slogan);
      console.log('==>' + this.$store.state.config.slogan);
    },


    saveTitle() {
      this.$store.commit('setTitle', this.title);
      this.$message.success('保存成功');
    },
    transformList() {
      const { listStr } = this;
      if (!listStr) {
        this.$message.error('没有数据');
      }
      const list = [];
      let rows = listStr.split('\n');

      rows = rows.filter((item) => {
        return item.trim() !== '';
      });

      if (rows && rows.length > 0) {
        rows.forEach((item, index) => {
          // const rowList = item.split(/\t|\s/);
          const key = index + 1;
          const name = item.trim();
          list.push({
            key,
            name
          });
        });
      } else {
        list.length = 0;
      }
      this.$store.commit('setList', list);
      this.$store.commit('setTotalPeople', list.length);

      this.$message({
        message: '保存成功',
        type: 'success'
      });
      this.showImport = false;
      this.$nextTick(() => {
        this.$emit('resetConfig');
      });
    },
    onSubmit() {
      setData(configField, this.form);
      let titleNumber = 0;
      for (let item of this.storeNewLottery) {
        titleNumber += Number(this.form[item.key]);

        if (Number(this.form[item.key]) < Number(this.form[item.key1])) {
          this.$message.warning(item.name + '每次抽奖人数不能大于该奖项总数！');
          return false;
        }

      }

      if (titleNumber > this.form.number) {
        this.$message.warning('获奖人数大于公司总人数！');
        return false;
      }
      this.$store.commit('setConfig', this.form);
      this.$emit('update:visible', false);

      this.$message({
        message: '保存成功',
        type: 'success'
      });

      this.$nextTick(() => {
        this.$emit('resetconfig');
      });
    },
    addLottery() {
      this.showAddLottery = true;
    },
    randomField() {
      const str = 'abcdefghijklmnopqrstuvwxyz';
      let fieldStr = '';
      for (let index = 0; index < 10; index++) {
        fieldStr += str.split('')[randomNum(1, 27) - 1];
      }
      return `${fieldStr}${Date.now()}`;
    },
    addHandler() {
      const field = this.randomField();
      const data = {
        key: field,
        name: this.newLottery.name,
        key1: field + 'Number',
        key2: field + 'Queue'
      };
      this.$store.commit('setNewLottery', data);

      this.showAddLottery = false;
    }
  }
};
</script>
<style lang='scss'>

//.c-LotteryConfig {
//  .el-dialog__body {
//    height: 340px;
//
//    .container {
//      //height: 100%;
//      overflow-y: auto;
//      padding: 0 10px;
//    }
//  }
//}

.dialog-showAddLottery {
  .el-dialog {
    height: 186px;
  }
}
</style>
