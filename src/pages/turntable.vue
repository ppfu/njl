<template>
	<div id="turntable">
		
			<!-- <div class="title">
				<img src="../assets/img/bt-zp.png" />
			</div>
			<div class="turn">
				<img class="turn_sp" src="../assets/img/sp.png" />
				<img class="turn_btn" src="../assets/img/btn.png" />
			</div>
			<div class="close" @click="closeDialog">
				<img src="../assets/img/gbt.png" />
			</div> -->
			
			   
			       <div class="lucky-wheel" v-show="lang_dlg">
			           <div class="lucky-title"></div>
			           <div class="wheel-main">
			               <div class="wheel-pointer-box">
			                    <div class="wheel-pointer" @click="rotate_handle()" :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"></div>
			               </div>               
			               <div class="wheel-bg" :style="{transform:rotate_angle,transition:rotate_transition}">                   
			                   <div class="prize-list">
			                       <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
			                           <div class="prize-pic">
			                               <img src="../assets/img/gold.png">
			                           </div>
			                           <div class="prize-count">
			                               {{item.money}}
			                           </div>
			                           <div class="prize-type">
			                               {{item.name}}
			                           </div>
			                       </div>
			                   </div>
			               </div>
			           </div>
					  <div class="closet" @click="closeDialog">
					   	<img src="../assets/img/gbt.png" />
					   </div>
			       </div>
			    <!--   <div class="main">
			           <div class="main-bg"></div>
			           <div class="bg-p"></div>
			           <div class="content">
			               <div class="lottery_ticket">今日免费抽奖次数： {{ lottery_ticket}}</div>
			           </div>
			      
			       </div> -->
			       <div class="toast" v-show="toast_control">
			           <div class="toast-container">
			               <img :src="toast_pictrue" class="toast-picture">
			               <div class="close_to" @click="close_toast()"></div>
			               <div class="toast-title">
			                   {{toast_title}}
			               </div>
			               <div class="toast-btn">
			                   <div class="toast-cancel"  @click="close_toast">关闭</div>
			               </div>
			           </div>
			       </div>
			       <div class="toast-mask" v-show="toast_control"></div>
			   
		
		
	</div>

</template>

<script>
	export default {
		components: {

		},
		 data() {
		  return {
			lang_dlg:true,
		    easejoy_bean: 0, //金豆
		    lottery_ticket: 0, //抽奖次数
		    prize_list: [
		      { 
				id:1,
		        money: 10, // 奖品数量
		      },
		      {
		       id:2,
		       money: 10, // 奖品数量
		      },
		      {
		      id:3,
		      money: 10, // 奖品数量
		      },
		      {
		      id:4,
		      money: 10, // 奖品数量
		      },
		      {
		       id:5,
		       money: 10, // 奖品数量
		      },
		      {
		       id:6,
		       money: 10, // 奖品数量
		      },
		    ], //奖品列表
		    toast_control: false, //抽奖结果弹出框控制器
		    hasPrize: false, //是否中奖
		    start_rotating_degree: 0, //初始旋转角度
		    rotate_angle: 0, //将要旋转的角度
		    start_rotating_degree_pointer: 0, //指针初始旋转角度
		    rotate_angle_pointer: 0, //指针将要旋转的度数
		    rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
		    rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
		    click_flag: true, //是否可以旋转抽奖
		    index: 0 
		  };
		},
		created() {
		  this.init_prize_list();
		},
		computed: {
		  toast_title() {
		    return this.hasPrize
		      ? "恭喜您，获得" +this.prize_list[this.index].money + '金币'
		      : "未中奖";
		  },
		  toast_pictrue() {
		    return this.hasPrize
		      ? require("../assets/img/congratulation.png")
		      : require("../assets/img/sorry.png");
		  }
		},
		
		//数据保存到session
		watch: {


		},
		mounted: function() {
            var that = this;  
			that.turntableInfoFun()
		},
		methods: {
			//关闭确认弹窗
			closeDialog: function() {
				var that = this;
				that.lang_dlg = false;
				window.localStorage.setItem("hasPrize","");
				that.$router.push({
					path: '/homepage'
				})
			},
			 rotate_handle() {
			  //开始游戏
			  let that = this;
			  // that.index = 1 //指定每次旋转到的奖品下标
			  // that.rotating();
				
			  that.confirmGame = false;
			  
			  that.$http
			    .post("Active/turntableAction", {
			      token: sessionStorage.getItem("token")
			    })
			    .then(function(res) {
			      if (res.data.code == 0) {
			        that.index = res.data.data.id - 1; //指定每次旋转到的奖品下标
			        that.rotating();
			        // that.click_flag = false; // 旋转结束前，不允许再次触发
			      } else if (res.data.code == -1) {
			        that.$toast({
			          message: res.data.msg,
			          position: "center",
			          duration: 3000
			        });
			      }
			    });
			},
			 turntableInfoFun() {
			  //获取转盘信息
			  let that = this;			    
			  that.$http
			    .post("Active/turntable", {
			      token: sessionStorage.getItem("token")
			    })
			    .then(function(res) {
			      if (res.data.code == 0) {
					  console.log(res)
					  // console.log(that.prize_list[0].money)
					  // that.prize_list= res.data.data.prize;
			        for (let i = 0; i < that.prize_list.length; i++) {
			          that.prize_list[i].money = res.data.data.prize[i].money;
			          // if (res.data.data.prize[i].id == 5) {
			          //   that.prize_list[i].isPrize = 0;
			          // } else {
			          //   that.prize_list[i].isPrize = 1;
			          // }
			          // that.gameSpend = res.data.data.spend;
			          // that.gameAgain = res.data.data.status;
			        }
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
			  //此方法为处理奖品数据
			init_prize_list(list) {},
			// rotate_handle() {
			//   this.index = 1 //指定每次旋转到的奖品下标
			//   this.rotating();
			// },
			rotating() {
			  if (!this.click_flag) return;
			  var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
			  var during_time = 5; // 默认为1s
			  var random = Math.floor(Math.random() * 5);
			  var result_index = this.index ; // 最终要旋转到哪一块，对应prize_list的下标
			  var result_angle = [343, 297, 235.5, 170.5, 110.5, 50.5]; //最终会旋转到下标的位置所需要的度数
			  // var result_angle = [42.5, 100.5, 160.5, 225.5, 287, 323];
			  var rand_circle = 6; // 附加多转几圈，2-3
			  this.click_flag = false; // 旋转结束前，不允许再次触发
			  if (type == 0) {
			    // 转动盘子·
			    var rotate_angle =
			      this.start_rotating_degree +
			      rand_circle * 360 +
			      result_angle[result_index] -
			      this.start_rotating_degree % 360;
			    this.start_rotating_degree = rotate_angle;
			    this.rotate_angle = "rotate(" + rotate_angle + "deg)";
			    // // //转动指针
			    // this.rotate_angle_pointer = "rotate("+this.start_rotating_degree_pointer + 360*rand_circle+"deg)";
			    // this.start_rotating_degree_pointer =360*rand_circle;
			    var that = this;
			    // 旋转结束后，允许再次触发
			    setTimeout(function() {
			      that.click_flag = true;
			      that.game_over();
			    }, during_time * 1000 + 1500); // 延时，保证转盘转完
			  } else {
			    //
			  }
			},
			game_over() {
				let that =this;
			  that.toast_control = true;
			  that.hasPrize = that.prize_list[that.index].money;
			  window.localStorage.setItem("hasPrize",that.hasPrize);
			 
			},
			//关闭弹窗
			close_toast() {
				let that =this;
			  this.toast_control = false;
				that.$store.commit("addAssets");
				 
				 // console.log(that.$store.commit("addAssets"))
			}
		}
	};
</script>

<style>
	#turntable {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}
	.lucky-wheel .closet img{
		width: 0.4rem;
		position: absolute;
		right: 0;
		bottom: 0.4rem;
	}
   	.lucky-wheel {
   	 position: absolute;
   	 top: 50%;
   	 left: 50%;
   	 margin-left: -1.8rem;
   	 margin-top: -1.7rem;
   	 width: 3.6rem;
   	 height: 3.4rem;
   	 display: flex;
   	 flex-direction: column;
   	 align-items: center;
   	}
   	.lucky-title {
   	  width:1.4rem;
	  height: 0.54rem;
   	  background: url(../assets/img/bt-zp.png) no-repeat center top;
   	  background-size: 100%;
   	}
   	.wheel-main {
   	  display: flex;
   	  align-items: center;
   	  justify-content: center;
   	  position: relative;
   	}
   	.wheel-bg {
   	  width: 2.6rem;
   	  height:2.6rem;
   	  background: url("../assets/img/draw_wheel.png") no-repeat center top;
   	  background-size: 100%;
   	  color: #F6482A;
   	  font-weight: 500;
   	  display: flex;
   	  flex-direction: column;
   	  justify-content: center;
   	  align-content: center;
   	  transition: transform 3s ease;
   	}
   	.wheel-pointer-box {
   	  position: absolute;
   	  top: 50%;
   	  left: 50%;
   	  z-index: 100;
   	  transform: translate(-50%, -60%);
   	 width: 0.66rem;
   	  height:0.66rem;
   	}
   	.wheel-pointer {
   	  width:0.66rem;
   	  height: 0.72rem;
   	  background: url(../assets/img/btn.png) no-repeat center center;
   	  background-size: 100%;
   	  transform-origin: center 60%;
   	}
   	.wheel-bg div {
   	  text-align: center;
   	}
   	.prize-list {
   	  width: 100%;
   	  height: 100%;
   	  position: relative;
	  /* background: #0077AA; */
   	}
   	.prize-list .prize-item {
   	  position: absolute;
   	  top: 0;
   	  left: 0;
   	  z-index: 2;
   	}
   	.prize-list .prize-item:first-child {
   	  top: -0.26rem;
   	  left: 1rem;
   	  transform: rotate(0deg);
   	}
   	.prize-list .prize-item:nth-child(2) {
   	  top: 0.4rem;
   	  left: 2.1rem;
   	  transform: rotate(60deg);
   	}
   	.prize-list .prize-item:nth-child(3) {
   	  top: 1.56rem;
   	  left: 2.1rem;
   	  transform: rotate(-240deg);
   	}
   	.prize-list .prize-item:nth-child(4) {
   	  top: 2.26rem;
   	  left: 1rem;
   	  transform: rotate(-180deg);
   	}
   	.prize-list .prize-item:nth-child(5) {
   	  top: 1.6rem;
   	  left:-0.12rem;
   	  transform: rotate(-120deg);
   	}
   	.prize-list .prize-item:nth-child(6) {
   	  top: 0.4rem;
   	  left:-0.126rem;
   	  transform: rotate(-60deg);
   	}
   	.prize-item {
   	  width: 0.6rem;
   	  height: 0.6rem;
   	}
   	
   	.prize-pic img {
   	  width: 0.42rem;
   	  margin-top: 0.4625rem;
   	}
   	.prize-count {
   	  font-size: 0.12rem;
   	}
   	.prize-type {
   	  font-size: 0.12rem;
   	}
  /* 	.main {
   	  position: relative;
   	  width: 100%;
   	  min-height: 2rem;
   	  background: rgb(243, 109, 86);
   	  padding-bottom: 0.1rem;
   	}
   	.main-bg {
   	  width: 100%;
   	  height: 1rem;
   	  position: absolute;
   	  top: -0.2375rem;
   	  left: 0;
   	} */
   	.bg-p {
   	  width: 100%;
   	  height: 0.4rem;
   /* 	  background: rgb(252, 207, 133); */
   	}
   	.content {
   	  position: absolute;
   /* 	  top: 1.275rem; */
   	  left: 0;
/*   	  background: rgb(243, 109, 86); */
   	  width: 100%;
   	  height: 2.1875rem;
   	  font-size: 0.26rem;
   	  color: #ffeb39;
   	  padding-left: 2.4rem;
   	}
   	.content div {
   	  text-align: left;
   	}
  /* 	.tip {
   	  position: relative;
   	  margin: 1.2rem auto 0;
   	  width: 5rem;
   	  border: 1px solid #fbc27f;
   	}
   	.tip-title {
   	  position: absolute;
   	  top: -0.5rem;
   	  left: 50%;
   	  transform: translate(-50%, 0);
   	  font-size: 0.28rem;
   	  color: #fccc6e;
   	  background: rgb(243, 109, 86);
   	  padding: 0.3125rem 0.425rem;
   	}
   	.tip-content {
   	  padding: 0.4625rem 0.325rem;
   	  font-size: 0.26rem;
   	  color: #fff8c5;
   	  line-height: 1.5;
   	} */
   	.toast-mask {
   	  position: fixed;
   	  top: 0;
   	  left: 0;
   	  background: rgba(0, 0, 0, 0.6);
   	  z-index: 10000;
   	  width: 100%;
   	  height: 100%;
   	}
   	.toast {
   	  position: fixed;
   	  top: 50%;
   	  left: 50%;
   	  z-index: 20000;
   	  transform: translate(-50%, -50%);
   	  width: 3.2rem;
   	  background: url(../assets/img/k-1.png) no-repeat center center;
	  background-size: 100% 100%;
   	  border-radius: 0.1125rem;
   	  padding: 0.2125rem;
   	  /* background-color: rgb(252, 244, 224); */
	  justify-content: center;
	  display: flex;
   	}
   	.toast-container {
	 position: relative;
   	 width: 70%;
   	 margin-left: -0.1rem;
   	 background: url(../assets/img/k-2.png) no-repeat center center;
   	 background-size: 100% 60%;
   	 padding-top: 0.2rem;
   	}
   	.toast-picture {
   	  position: absolute;
   	  top: -0.6rem;
   	  left: -0.48rem;
   	  width: 3.2rem;
   	}
   	.toast-pictrue-change {
   	  position: absolute;
   	  top: -0.5rem;
   	  left: -0.375rem;
   	  width: 17.5rem;
   	  height: 3.125rem;
   	}
   	.toast-title {
   	  padding: 0.4rem 0;
   	  font-size: 0.18rem;
   	  color: #fc7939;
   	  text-align: center;
   	}
   	.toast-btn {
   	  display: flex;
   	  align-items: center;
   	  justify-content: center;
   	  margin-bottom: 0.2rem;
   	}
   	.toast-btn div {
	  background: url(../assets/img/an-2.png) no-repeat center center;
	  background-size: 100%;
   	  width: 1.2rem;
	  height: 0.6rem;
   	  text-align: center;
   	  line-height: 0.44rem;
   	  color: #fff;
   	}
   	.close_to {
   	  position: absolute;
   	  top: -0.2rem;
   	  right: -0.54rem;
   	  width: 0.4rem;
   	  height: 0.4rem;
   	  background: url(../assets/img/close_store.png) no-repeat center top;
   	  background-size: 100%;
   	}
	
</style>
