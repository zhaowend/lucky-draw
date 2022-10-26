import Vue from 'vue';
import Vuex from 'vuex';
import { listField, newLotteryField, resultField, setData } from '@/helper/index';
import { configField } from '../helper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: {
      name: 'EMEA 2022 年会',
      slogan: '新梦想，新征程',
      number: 5,
      firstPrize: 1,
      firstLotteryNumber: 1,// 一次抽奖的个数不能大于中将人数
      firstLotteryQueue: 5,//抽奖顺序

      secondPrize: 1,
      secondLotteryNumber: 1,
      secondLotteryQueue: 4,

      thirdPrize: 1,
      thirdLotteryNumber: 1,
      thirdLotteryQueue: 3
    },
    result: {
      firstPrize: []
    },
    newLottery: [{ 'key': 'firstPrize', 'name': '一等奖', 'key1': 'firstLotteryNumber', 'key2': 'firstLotteryQueue' },
      { 'key': 'secondPrize', 'name': '二等奖', 'key1': 'secondLotteryNumber', 'key2': 'secondLotteryQueue' },
      { 'key': 'thirdPrize', 'name': '三等奖', 'key1': 'thirdLotteryNumber', 'key2': 'thirdLotteryQueue' }],
    list: [{ 'key': 1, 'name': '李四' }, { 'key': 2, 'name': '王二' }, { 'key': 3, 'name': '赵云' }, {
      'key': 4,
      'name': '张飞'
    }, { 'key': 5, 'name': '关羽' }],
    photos: []
  },
  mutations: {
    setTitle(state, title) {
      state.config.name = title.name;
      state.config.slogan = title.slogan;
      setData(configField, state.config);
    },
    setTotalPeople(state, num) {
      state.config.number = num;
      setData(configField, state.config);
    },
    setClearConfig(state) {
      state.config = {
        name: 'EMEA 2022 年会',
        slogan: '新梦想，新征程',
        number: 5,
        firstPrize: 5,
        LotteryNumber: 1,// 一次抽奖的个数不能大于中将人数
        lotteryQueue: 5//抽奖顺序
      };

      state.newLottery = [{
        'key': 'firstPrize',
        'name': '一等奖',
        'key1': 'firstLotteryNumber',
        'key2': 'firstLotteryQueue'
      }];
    },
    setClearList(state) {
      state.list = [];
    },
    setClearPhotos(state) {
      state.photos = [];
    },
    setClearResult(state) {
      state.result = {
        firstPrize: []
      };
    },
    setClearStore(state) {
      state.config = {
        name: 'EMEA 2022 年会',
        slogan: '新梦想，新征程',
        number: 5,
        firstPrize: 5,
        LotteryNumber: 1,// 一次抽奖的个数不能大于中将人数
        lotteryQueue: 5//抽奖顺序
      };
      state.result = {
        firstPrize: []
      };
      state.newLottery = [{
        'key': 'firstPrize',
        'name': '一等奖',
        'key1': 'firstLotteryNumber',
        'key2': 'firstLotteryQueue'
      }];
      state.list = [];
      state.photos = [];
    },
    setConfig(state, config) {
      state.config = config;
    },
    setResult(state, result = {}) {
      state.result = result;

      setData(resultField, state.result);
    },
    setNewLottery(state, newLottery) {
      if (state.newLottery.find(item => item.name === newLottery.name)) {
        return;
      }
      state.newLottery.push(newLottery);
      setData(newLotteryField, state.newLottery);
    },
    setList(state, list) {
      state.list = list;
      setData(listField, list);
    },
    setPhotos(state, photos) {
      state.photos = photos;
    }
  },
  actions: {},
  modules: {}
});
