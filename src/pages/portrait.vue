<template>
  <div id="portrait">
    <div class="po_content" v-show="lang_dlg">
      <img class="title" src="../assets/img/btkp.png" />
      <h2>头像</h2>
      <img @click="closeDialog" class="close" src="../assets/img/gb.png" />
      <div class="po_back">
        <div class="po_info">
          <p>
            <img :src="myInfo.url" />
          </p>
          <span>当前头像</span>
        </div>
        <div class="header_list">
          <div class="header_img" v-for="(item,index) in pictures" :key="index">
            <img :src="item.url" @click="picturesClick(item)" />
          </div>
        </div>
        <div class="save">
          <span @click="changePic">保存</span>
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
      pictures: [], //头像列表
      myInfo: {
        url: "",
        id: ""
      } //我的头像信息
    };
  },
  created: function() {},
  //数据保存到session
  watch: {},
  mounted: function() {
    let that = this;
    that.getPictures();
  },
  methods: {
    //获取图片列表
    getPictures() {
      let that = this;
      that.$http
        .post("Personal/headPortrait", {
          token: sessionStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.pictures = res.data.data.list;
            that.myInfo.id = res.data.data.user.head_id;
            that.myInfo.url = res.data.data.user.head_portrait;
			
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
    // 点击切换
    picturesClick(item) {
      let that = this;
      that.myInfo = item;
	  window.localStorage.setItem('head',that.myInfo.url);  
    },
    // 更换头像
    changePic() {
      let that = this;
      that.$http
        .post("Personal/headEdit", {
          token: sessionStorage.getItem("token"),
          id: that.myInfo.id
        })
        .then(function(res) {
          if (res.data.code == 0) {
			that.$store.commit("changeHead");
            that.$toast(res.data.msg);
          } else {
            that.$toast({
              message: res.data.msg,
              position: "bottom",
              duration: 3000
            });
            that.$toast(msg);
          }
        })
        .catch(function(err) {
          that.$toast({
            message: "网络连接失败",
            position: "bottom",
            duration: 3000
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
#portrait {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 100;
}

.po_content {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -2.1rem;
  margin-top: -1.9rem;
  width: 4.2rem;
  height: 3.8rem;
  background: url(../assets/img/k-1.png) no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
}

.po_content img.title {
  position: absolute;
  width: 3.2rem;
  top: 0.28rem;
  left: 0.46rem;
}

.po_content img.close {
  position: absolute;
  width: 0.46rem;
  right: 0.22rem;
  top: 0.2rem;
}

.po_content h2 {
  position: absolute;
  text-align: center;
  width: 1.02rem;
  top: 0.46rem;
  left: 1.56rem;
  /* font-family:'FZCY'; */
  font-size: 0.2rem;
  /* font-weight: 600; */
 color: #F7FBED;
 text-shadow: -0.001rem 0.001rem 0.006rem #B26901, 0.001rem 0.001rem 0.008rem #B26901;
}

.po_back {
  width: 62%;
  margin-top: 0.8rem;
  margin-left: -0.064rem;
  background: url(../assets/img/k-2.png) no-repeat 0 0.2rem;
  background-size: 100% 50%;
  padding-top: 0.3rem;
}

.po_back .po_info {
  padding-left: 0.1rem;
  font-size: 0.16rem;
  color: #F07923;
  display: flex;
  margin-bottom: 0.14rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.po_back .po_info p {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #d9b16f;
  text-align: center;
  margin-right: 0.2rem;
}
.po_back .po_info p img {
  width: 80%;
  margin-top: 0.05rem;
}
.header_list {
  width: 94%;
  height: 0.66rem;
  background: url(../assets/img/db.png) no-repeat center;
  background-size: 100% 100%;
  margin-left: 0.08rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.header_list .header_img {
  height: 0.54rem;
  width: 0.54rem;
  background: url(../assets/img/tk.png) no-repeat center;
  background-size: 100% 100%;
}
.header_list .header_img img {
  margin-top: 0.12rem;
  margin-left: 0.08rem;
  width: 66%;
}
.header_list .header_img:nth-child(2) img {
  width: 60%;
}
.header_list .header_img:nth-child(3) img {
  margin-left: 0.14rem;
  width: 50%;
}
.header_list .header_img:nth-child(4) img {
  margin-left: 0.132rem;
  margin-top: 0.148rem;
  width: 52%;
}
.save {
  width: 100%;
  text-align: center;
  margin-top: 0.1rem;
}
.save span {
  display: inline-block;
  width: 1.2rem;
  height: 0.6rem;
  background: url(../assets/img/an-2.png) no-repeat center;
  background-size: 100% 100%;
  text-align: center;
  line-height: 0.42rem;
  color: #fff;
  font-size: 0.16rem;
  text-shadow: 0.004rem 0.004rem 0.006rem #4e1a0d;
}
</style>
