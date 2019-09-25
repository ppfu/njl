<template>
  <div id="property">
    <div class="prope_content" v-show="lang_dlg">
      <img class="title" src="../assets/img/btk.png" />
      <img class="title_text" src="../assets/img/bt-zc.png" />
      <img @click="closeDialog" class="close" src="../assets/img/gb.png" />
      <div class="back_g">
        <h5>当前资产：{{money}}</h5>
        <div class="pro_content">
          <div class="con_list" v-for="(item,index) in fileList" :key="index">
            <img v-if="item.name == '一级建筑'" src="../assets/img/dj-1.png" />
            <img v-if="item.name == '二级建筑'" src="../assets/img/dj-2.png" />
            <img v-if="item.name == '三级建筑'" src="../assets/img/dj-3.png" />
            <img v-if="item.name == '四级建筑'" src="../assets/img/dj-4.png" />
            <span>{{item.name}}</span>
            <a>X{{item.count}}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      lang_dlg: true,
      fileList: [], //建筑列表
      money: "0.00" //资金
    };
  },
  created: function() {},
  //数据保存到session
  watch: {},
  mounted: function() {
    let that = this;
    that.getAccount();
  },
  methods: {
    // 获取资产
    getAccount() {
      let that = this;
      that.$http
        .post("Personal/userAssets", {
          token: sessionStorage.getItem("token")
        })
        .then(function(res) {
			console.log(res)
          if (res.data.code == 0) {
            that.fileList = res.data.data.product;
            that.money = res.data.data.product_assets;
          } else {
            that.$toast(msg);
          }
        })
        .catch(function(err) {
          that.$toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 5000
          });
        });
    },
    //关闭确认弹窗
    closeDialog: function() {
      var that = this;
      that.lang_dlg = false;
      that.$router.push({
        path: "/homepage"
      });
    }
  }
};
</script>

<style>
#property {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 100;
}
.prope_content {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -2.6rem;
  margin-top: -1.8rem;
  width: 5.2rem;
  height: 3.68rem;
  background: url(../assets/img/k-1.png) no-repeat center center;
  background-size: 110% 100%;
  display: flex;
  justify-content: center;
}
.back_g {
  width: 68%;
  margin-top: 0.8rem;
  margin-left: -0.1rem;
  background: url(../assets/img/k-2.png) no-repeat;
  background-size: 100% 66%;
}
.prope_content img.title {
  position: absolute;
 width: 4.2rem;
 top: 0.02rem;
 left: 0.44rem;
 z-index: 9;
}
.prope_content img.close {
  position: absolute;
  width: 0.46rem;
  right: 0.14rem;
  top: 0.1rem;
}
.prope_content img.title_text {
  position: absolute;
 width: 1.2rem;
 top: 0.28rem;
 left: 2rem;
 z-index: 10;
}
.pro_content {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.back_g h5 {
  padding-top: 0.28rem;
  padding-left: 0.2rem;
  font-size: 0.16rem;
  font-weight: normal;
  color: #F07923;
 /* text-shadow: 0.004rem 0.004rem 0.006rem #4e1a0d,
    0.004rem 0.004rem 0.01rem #4e1a0d; */
}
.con_list {
  position: relative;
  margin-top: 0.1rem;
}
.con_list img {
  width: 1.3rem;
  height: 0.44rem;
}
.con_list:nth-child(3) img {
  height: 0.48rem;
}
.con_list:nth-child(3) span {
  top: 0.16rem;
}
.con_list:nth-child(3) a {
  top: 0.16rem;
}
.con_list span {
  font-size: 0.1rem;
  position: absolute;
  left: 0.5rem;
  top: 0.12rem;
  color: #c09308;
  -webkit-transform-origin-x: 0;
  -webkit-transform: scale(0.9);
}
.con_list a {
  position: absolute;
  right: 0.022rem;
  top: 0.12rem;
  color: #c09308;
  font-size: 0.1rem;
  -webkit-transform-origin-x: 0;
  -webkit-transform: scale(0.9);
}
</style>
