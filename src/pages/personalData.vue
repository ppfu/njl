<template>
  <div id="personal">
    <div class="pe_content" v-show="lang_dlg">
      <img class="title" src="../assets/img/btkp.png" />
      <h2>个人资料</h2>
      <img @click="closeDialog" class="close" src="../assets/img/gb.png" />
      <div class="pe_back">
        <div class="pe_info">
          <span>用户名：</span>
          <span>{{info.name}}</span>
        </div>
        <div class="pe_info">
          <span>邀请码：</span>
          <span>{{info.invitation_code}}</span>
        </div>
        <div class="pe_info">
          <span>支付宝账号：</span>
          <input type="text" v-model="info.alipay" placeholder="请输入支付宝账号" />
        </div>
        <div class="pe_info">
          <span>微信收款码：</span>
          <img v-show="imgShow" @click="showUp" class="wx-img" :src="imgSrc" />
          <van-uploader
            v-show="imgShow == false"
            v-model="fileList"
            multiple
            :max-count="1"
            :after-read="afterRead"
          />
        </div>
        <div class="sub_pe">
          <span @click="preservation">保存</span>
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
      fileList: [], //微信照片
      info: "", //个人资料
      imgShow: true, //第一次进入
      imgSrc: "",
      src: ""
    };
  },
  created: function() {},
  //数据保存到session
  watch: {},
  mounted: function() {
    let that = this;
    that.getInfo();
  },
  methods: {
    // 账户资料
    getInfo() {
      let that = this;
      that.$http
        .post("Personal/userMsg", {
          token: sessionStorage.getItem("token")
        })
        .then(function(res) {
          if (res.data.code == 0) {
            that.info = res.data.data;
            that.imgSrc = res.data.data.wechat;
            that.src = res.data.data.wechat_text;
            if (that.src == "") {
              that.imgShow = false;
            }
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
    afterRead(file) {
      let that = this;
      var reader = new FileReader();
      reader.readAsDataURL(file.file); // 读取文件
      reader.onload = function(arg) {
        var formData = new FormData();
        formData.append("file", file.file);
        formData.append("token", sessionStorage.getItem("token"));
        $.ajax({
          url: "http://njl.qilinpz.com/api/Trade/upload",
          type: "POST",
          data: formData,
          dataType: "JSON",
          cache: false,
          processData: false,
          contentType: false
        }).done(function(res) {
          if (res.code == 0) {
            that.$toast(res.msg);
            that.src = res.data;
          } else {
            that.src = "";
            //失败
            that.$toast({
              message: res.msg,
              position: "bottom",
              duration: 5000
            });
          }
        });
      };
    },
    // 显示上传图片
    showUp() {
      this.imgShow = false;
      this.src = "";
    },
    //保存
    preservation() {
      let that = this;
      if (that.info.alipay == "") {
        that.$toast({
          message: "请输入支付宝账号",
          position: "bottom",
          duration: 5000
        });
      } else if (that.src == "") {
        that.$toast({
          message: "请上传微信收款码",
          position: "bottom",
          duration: 5000
        });
      } else {
        that.$http
          .post("Personal/editMsg", {
            token: sessionStorage.getItem("token"),
            alipay: that.info.alipay,
            wechat: that.src
          })
          .then(function(res) {
            if (res.data.code == 0) {
              that.$toast(res.data.msg);
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
      }
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
#personal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 100;
}

.pe_content {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -2rem;
  margin-top: -2.1rem;
  width: 4rem;
  height: 4.2rem;
  background: url(../assets/img/k-1.png) no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
}

.pe_content img.title {
  position: absolute;
  width: 3.2rem;
  top: 0.26rem;
  left: 0.38rem;
}

.pe_content img.close {
  position: absolute;
  width: 0.46rem;
  right: 0.22rem;
  top: 0.2rem;
}

.pe_content h2 {
  position: absolute;
  width: 1.02rem;
  top: 0.46rem;
  left: 1.56rem;
  /* font-family:'FZCY'; */
  /* color: #fff; */
  font-size: 0.18rem;
  /* font-weight: 600; */
 color: #F7FBED;
 text-shadow: -0.001rem 0.001rem 0.002rem #B26901, 0.001rem 0.001rem 0.008rem #B26901;
}

.pe_back {
  width: 62%;
  margin-top: 0.8rem;
  margin-left: -0.064rem;
  background: url(../assets/img/k-2.png) no-repeat 0 0.2rem;
  background-size: 100% 62%;
  padding-top: 0.3rem;
}

.pe_back .pe_info {
  padding-left: 0.1rem;
  font-size: 0.16rem;
  /* font-weight: bold; */
 color: #F07923;
/* text-shadow: -0.001rem 0.004rem 0.002rem #B26901, 0.001rem 0.001rem 0.008rem #B26901; */
 /* text-shadow: -0.001rem 0.001rem 0.002rem #B26901, 0.001rem 0.001rem 0.008rem #B26901,0.001rem 0.001rem 0.008rem #B26901; */
  display: flex;
  margin-bottom: 0.14rem;
}

.pe_back .pe_info span:nth-child(1) {
  width: 42%;
  display: inline-block;
  text-align: right;
}

.pe_back .pe_info input {
  width: 56%;
  background: url(../assets/img/sr.png) no-repeat center center;
  background-size: 100% 100%;
  border: none;
  font-size: 0.14rem;
  padding-left: 0.1rem;
  /* color: #fff; */
  height: 0.32rem;
}

input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: #f7fbed;
}

.pe_info .van-uploader__upload {
  width: 0.8rem;
  height: 0.8rem;
  background: rgba(255, 255, 255, 0.3);
  border: 0.01rem solid #fff;
  border-radius: 0.1rem;
	margin: 0;
}
.pe_info input.van-uploader__input{
	 width: 100%;
	 height: 100%;
}
.van-uploader__upload-icon {
  color: #fff;
}

.sub_pe {
  width: 100%;
  text-align: center;
  margin-top: -0.04rem;
}

.sub_pe span {
  display: inline-block;
  width: 1.04rem;
  height: 0.64rem;
  background: url(../assets/img/an-2.png) no-repeat center;
  background-size: 100% 100%;
  text-align: center;
  line-height: 0.48rem;
  color: #fcf5de;
  font-size: 0.16rem;
  text-shadow: -0.01rem 0.012rem 0.008rem #af3415,
    0.004rem 0.004rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415;
}
#personal .van-uploader {
  width: 0.8rem;
  height: 0.8rem;
}
.wx-img {
  width: 0.8rem;
  height: 0.8rem;
}
</style>
