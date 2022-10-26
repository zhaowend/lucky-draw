<template>
  <div id='root' style='min-width: 800px;'>
    <div style='height: 100%;'>
      <el-header style='height: 80px;text-align: center'>
        <div class='title-pmzd' style='padding-top:40px;color: #E69B21;font-size: 100px;line-height: 80px;'>
          <span>{{ title }}</span></div>
      </el-header>
      <el-main style='height: 100%;margin-top: 5%;'>
        <div
          style='margin: 0 auto;height: 100%;text-align: center;align-items:center;display: flex; flex-flow: column;justify-content: space-between;'>
          <!--          主页-->

          <div v-if='currentPage===1' style='color: #fff;'>
            <div class='title-pmzd' style='margin-top: 25%;align-items:center;'>
              <div style='font-size: 80px;'><span>{{ slogan }}</span></div>
            </div>

          </div>
          <!--          抽奖-->
          <div v-else-if='currentPage===2' style='color: #fff;'>
            <div class='title-pmzd' style='margin: 50px 0;font-size: 90px;'><span>{{ nowPrice }}</span></div>
            <div v-show='running' class='text-24' style='height: 100px;font-size: 70px;'>
              <span> {{ userName.name }}</span>
            </div>
            <div v-show='!running' class='text-24' style='height: 100px;font-size: 70px;'>
              <span v-for='(item,index)  in resArr' :key=index style='margin-right: 10px;'>{{ item.name }}  </span>
            </div>

          </div>
          <!--获奖名单-->
          <div v-else-if='currentPage===3' style='width: 80%;color: #fff;height: 66vh;overflow-y: auto'>
            <div v-for='(item,index) in prizedList' :key="index+'list'">
              <div class='title-pmzd'>{{ item.name }}</div>
              <div class='text-24' style='margin: 5px 0;'>
                <span v-for='(i, indexs) in item.result' :key="indexs+'item'" style='margin: 0 10px;'>{{ i }}</span>
              </div>

            </div>

          </div>
          <span style='position: absolute;bottom: 5px;font-size: 8px;color: #fff;opacity: 0.88'>
            ©2020 亚信远航（北京）有限公司所有
          </span>
          <div>
          </div>
        </div>
      </el-main>

      <!--      <el-button-->
      <!--        class='audio'-->
      <!--        type='text'-->
      <!--        @click='-->
      <!--        () => { playAudio(!audioPlaying);}-->
      <!--      '-->
      <!--      >-->
      <!--        <i :class="[audioPlaying ? 'iconstop' : 'iconplay1']"-->
      <!--           class='iconfont'-->
      <!--        ></i>-->
      <!--      </el-button>-->

      <el-dialog
        :visible.sync='showMoney'
        width='450px'
      >
        <div>
          <div style='font-size:30px;font-family: PMZD;color: #E69B21 ;text-align: center;'><span>感谢您对杭研年会的赞助</span>
          </div>
          <el-image
            :src='imgUrl'
            style='width: 400px; height: 400px'
          ></el-image>
        </div>
      </el-dialog>

      <!--配置组件-->
      <LotteryConfig :visible.sync='showConfig' />

      <Tool
        :closeRes='closeRes'
        :running='running'
        @getPhoto='getPhoto'
        @home='getTitles'
        @openSize='showMoney = true'
        @prizeList='prizeList'
        @setting='showConfig=true'
        @start='startLottery'
        @toggle='toggle'
        @toggleStart='stopLottery'
      />

      <!--    <Result :visible.sync="showResult"></Result>-->


      <!--          <audio-->
      <!--            id="audiobg"-->
      <!--            preload="auto"-->
      <!--            controls-->
      <!--            autoplay-->
      <!--            loop-->
      <!--            @play="playHandler"-->
      <!--            @pause="pauseHandler"-->
      <!--          >-->
      <!--            <source :src="audioSrc" />-->
      <!--            你的浏览器不支持audio标签-->
      <!--          </audio>-->

    </div>

  </div>
</template>

<script>
import LotteryConfig from '@/components/LotteryConfig';
// import Publicity from '@/components/Publicity';
import Tool from '@/components/Tool';
import bgaudio from '@/assets/bg.mp3';
import { configField, conversionCategoryName, getData, listField, newLotteryField, resultField } from '@/helper/index';
import { luckydrawHandler } from '@/helper/algorithm';
// import Result from '@/components/Result';
import { database, DB_STORE_NAME } from '@/helper/db';

export default {
  name: 'index',

  components: {
    LotteryConfig, Tool
    // Result
  },

  computed: {
    resCardStyle() {
      const style = { fontSize: '30px' };
      const { number } = this.config;
      if (number < 100) {
        style.fontSize = '100px';
      } else if (number < 1000) {
        style.fontSize = '80px';
      } else if (number < 10000) {
        style.fontSize = '60px';
      }
      return style;
    },
    config: {
      get() {
        return this.$store.state.config;
      }
    },
    newLottery: {
      get() {
        return this.$store.state.newLottery;
      }
    },
    result: {
      get() {
        return this.$store.state.result;
      },
      set(val) {
        this.$store.commit('setResult', val);
      }
    },
    list() {
      return this.$store.state.list;
    },
    allresult() {
      let allresult = [];
      for (const key in this.result) {
        if (this.result.hasOwnProperty(key)) {
          const element = this.result[key];
          allresult = allresult.concat(element);
        }
      }
      return allresult;
    },
    datas() {
      const { number } = this.config;
      const nums = number >= 1500 ? 500 : this.config.number;
      const configNum = number > 1500 ? Math.floor(number / 3) : number;
      const randomShowNums = luckydrawHandler(configNum, [], nums);
      const randomShowDatas = randomShowNums.map((item) => {
        const listData = this.list.find((d) => d.key === item);
        const photo = this.photos.find((d) => d.id === item);
        return {
          key: item * (number > 1500 ? 3 : 1),
          name: listData ? listData.name : '',
          photo: photo ? photo.value : ''
        };
      });
      return randomShowDatas;
    },
    categoryName() {
      return conversionCategoryName(this.category);
    },
    photos() {
      return this.$store.state.photos;
    }
  },
  created() {
    this.init();
    this.$store.commit('setList', this.$store.state.list);
  },
  activated() {
    this.init();
  },
  data() {
    return {
      imgUrl: require('../assets/money.png'),
      showMoney: false,
      currentPage: 1, //1home 2toggle 3prizedList
      title: '',
      running: false,
      showRes: false,
      showConfig: false,
      showResult: false,
      resArr: [],
      category: '',
      audioPlaying: false,
      audioSrc: bgaudio,
      userName: '',
      timerLottery: null,
      nowPrice: '',
      toggleParam: { category: null, mode: null, qty: null, remain: null, allin: null },
      timeRange: 100,
      prizedList: [],
      slogan: ''
      //key ,自定义抽取，当前抽取的人数，没有抽取的人数，已经中奖的人是否残余
    };
  },
  watch: {
    photos: {
      deep: true
      // handler() {
      //   this.$nextTick(() => {
      //     this.reloadTagCanvas();
      //   });
      // }
    }
  },
  mounted() {
    this.getTitles();
    // this.startTagCanvas();
    setTimeout(() => {
      this.getPhoto();
    }, 1000);
    window.addEventListener('resize', this.reportWindowSize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.reportWindowSize);
  },
  methods: {
    getTitles() {
      this.currentPage = 1;
      this.title = this.config.name;
      this.slogan = this.config.slogan;
    },

    prizeList() {
      this.currentPage = 3;
      let prizeList = [];
      this.title = '中奖名单';
      for (let i in this.result) {
        // let LQueue = this.config
        let obj = {
          name: '',
          result: [],
          LQueue: null
        };
        for (let j of this.newLottery) {
          if (i === j.key) {
            obj.name = j.name;
            obj.LQueue = this.config[j.key2];
            break;
          }

        }
        for (let o of this.result[i]) {
          for (let z of this.$store.state.list) {
            if (o === z.key) {
              obj.result.push(z.name);
              break;
            }
          }
        }
        prizeList.push(obj);
      }
      this.prizedList = prizeList.sort((a, b) => {
        return Number(b.LQueue) - Number(a.LQueue);
      });

    },
    runLottery(noPrizePeople) {
      let config = this.newLottery;
      let LotteryQueue = [];
      for (let i of config) {
        let obj = {
          keyIndex: i.key,
          key: this.config[i.key],
          key1: this.config[i.key1],
          key2: Number(this.config[i.key2]),
          name: i.name
        };
        LotteryQueue.push(obj);
      }
      let newLotteryQueue = LotteryQueue.sort((a, b) => {
        return Number(a.key2) - Number(b.key2);//-1
      });
      // alert(JSON.stringify(newLotteryQueue))
      // console.log('ac'+JSON.stringify(newLotteryQueue))
      let hasPrize = false;
      for (let item of newLotteryQueue) {
        if (this.result[item.keyIndex] == null || this.result[item.keyIndex].length < item.key) {
          // 没抽的人数
          // alert(JSON.stringify(this.result[item.keyIndex])+'***' + item.keyIndex)
          let noLottery = this.result[item.keyIndex] == null ? Number(item.key) : Number(item.key - Number(this.result[item.keyIndex].length));

          // 这次要抽的
          let LotteryNumber = Number(item.key1) < Number(noLottery) ? item.key1 : noLottery;
          if (Number(noPrizePeople) < Number(LotteryNumber)) {
            LotteryNumber = Number(noPrizePeople);
          }

          this.nowPrice = item.name;
          this.toggleParam = { category: item.keyIndex, mode: 99, qty: Number(LotteryNumber), remain: Number(noLottery), allin: false };
          hasPrize = true;
          break;
        }
      }
      return hasPrize;

    },

    changeName() {
      // let arr = this.datas.filter((item)=>{
      //   for(let i of this.result.firstPrize){
      //     if(i.key === item.key)return true;
      //  }
      //   return false
      // })
      let arr = this.datas;
      console.log('arr' + JSON.stringify(arr));
      if (arr.length > 1) {
        let len = arr.length - 1;
        let randomNumber = Math.round(Math.random() * len);
        this.userName = arr[randomNumber];
      }

    },
    startLottery() {

      let nowPrizedPeople = 0;

      for (let i in this.result) {
        nowPrizedPeople += this.result[i].length;
      }
      let noPrizePeople = this.config.number - nowPrizedPeople;
      if (noPrizePeople <= 0) {
        this.$message.warning('每个小伙伴都有奖了');
        return;
      }


      if (this.runLottery(noPrizePeople)) {
        // alert(JSON.stringify(this.toggleParam))
        console.log('start');
        this.timerLottery = setInterval(() => {
          this.changeName();
        }, this.timeRange);
        this.currentPage = 2;
        this.title = '幸运大抽奖';
        this.running = true;
      } else {
        this.$message.warning('没有奖项了');
      }


    },
    stopLottery() {
      this.running = false;
      console.log('end');
      clearInterval(this.timerLottery);
      let arr = this.toggle();
      let res = [];
      for (let i of arr) {
        for (let j of this.$store.state.list) {
          if (i === j.key) {
            let obj = {
              key: i,
              name: j.name
            };
            res.push(obj);
            break;
          }

        }
      }
      this.title = '本轮中奖结果';
      this.resArr = res;

    },
    init() {
      const data = getData(configField);
      if (data) {
        this.$store.commit('setConfig', Object.assign({}, data));
      }
      const result = getData(resultField);
      if (result) {
        this.$store.commit('setResult', result);
      }

      const newLottery = getData(newLotteryField);

      if (newLottery) {
        const config = this.config;
        newLottery.forEach((item) => {
          this.$store.commit('setNewLottery', item);
          if (!config[item.key]) {
            this.$set(config, item.key, 0);
          }
        });
        this.$store.commit('setConfig', config);
      }

      const list = getData(listField);
      if (list) {
        this.$store.commit('setList', list);
      }
    },
    reportWindowSize() {
      // const AppCanvas = this.$el.querySelector('#canvas');
      // if (AppCanvas.parentElement) {
      //   AppCanvas.parentElement.removeChild(AppCanvas);
      // }

      // this.startTagCanvas();
    },
    // playHandler() {
    //   this.audioPlaying = true;
    // },
    // pauseHandler() {
    //   this.audioPlaying = false;
    // },
    // playAudio(type) {
    //   if (type) {
    //     this.$el.querySelector('#audiobg').play();
    //   } else {
    //     this.$el.querySelector('#audiobg').pause();
    //   }
    // },
    // loadAudio() {
    //   this.$el.querySelector('#audiobg').load();
    //   this.$nextTick(() => {
    //     this.$el.querySelector('#audiobg').play();
    //   });
    // },
    getPhoto() {
      database.getAll(DB_STORE_NAME).then((res) => {
        if (res && res.length > 0) {
          this.$store.commit('setPhotos', res);
        }
      });
    },
    speed() {
      return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    },

    // reloadTagCanvas() {
    //   window.TagCanvas.Reload('rootcanvas');
    // },
    closeRes() {
      this.showRes = false;
    },
    toggle() {
      const { number } = this.config;
      const { category, mode, qty, remain, allin } = this.toggleParam;

      let num = 1;
      if (mode === 1 || mode === 5) {
        num = mode;
      } else if (mode === 0) {
        num = remain;
      } else if (mode === 99) {
        num = qty;
      }
      const resArr = luckydrawHandler(
        number,
        allin ? [] : this.allresult,
        num
      );
      this.resArr = resArr; // 中奖结果

      this.category = category;
      if (!this.result[category]) {
        this.$set(this.result, category, []);
      }
      const oldRes = this.result[category] || [];
      const data = Object.assign({}, this.result, {
        [category]: oldRes.concat(resArr)
      });
      this.result = data;
      return resArr;

    }

  }
};
</script>
<style lang='scss'>
#root {
  height: 100vh;
  position: relative;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;

  .mask {
    -webkit-filter: blur(5px);
    filter: blur(5px);
  }

  header {
    height: 50px;
    line-height: 50px;
    position: relative;

    .el-button {
      position: absolute;
      top: 17px;
      padding: 0;
      z-index: 9999;

      &.con {
        right: 20px;
      }

      &.res {
        right: 100px;
      }
    }
  }

  .audio {
    position: absolute;
    bottom: 50px;
    right: 30px;
    width: 30px;
    height: 30px;

    line-height: 30px;
    padding: 0;
    text-align: center;

    .iconfont {
      position: relative;
      color: #E69B21;
      left: 1px;
    }
  }

  .copy-right {
    position: absolute;
    right: 0;
    bottom: 0;
    color: #ccc;
    font-size: 12px;
  }

  .bounce-enter-active {
    animation: bounce-in 1.5s;
  }

  .bounce-leave-active {
    animation: bounce-in 0s reverse;
  }
}

#main {
  height: 100%;
}

#resbox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1280px;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;

  p {
    color: red;
    font-size: 50px;
    line-height: 120px;
  }

  .container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .itemres {
    background: #fff;
    width: 160px;
    height: 160px;
    border-radius: 4px;
    border: 1px solid #ccc;
    line-height: 160px;
    font-weight: bold;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .cont {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.numberOver::before {
      content: attr(data-id);
      width: 30px;
      height: 22px;
      line-height: 22px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      font-size: 14px;
      // border-radius: 50%;
      z-index: 1;
    }
  }
}
</style>