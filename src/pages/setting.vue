<template>
	<div id="setting">
		<div class="sett_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btkp.png" />
			<div class="sett_text">
			<h2 v-if="setting">设置</h2>
			<h2 v-if="loginpass">修改登录密码</h2>
			<h2 v-if="dealpass">修改交易密码</h2>
			</div>
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 设置 -->
			<div v-if="setting" class="sett_back">
				<!-- 音效开关 -->
				<div class="sett_info sett_open">
					<span>音乐开关：</span>
					<button @click="playAudio">播放</button>
					<button @click="closeAudio">关闭</button>
				</div>
				<div class="sett_info">
					<span>音乐大小：</span>
					<div class="yinyue">
						<!-- <audio id="audio" autoplay="autoplay" controls="controls" preload="auto" class="success" src="../assets/img/music.mp3">
						</audio> -->
						<div class="control">
						<span @click="down" id="down"><img src="../assets/img/jian.png" alt="" /></span>
						<van-progress 
						:percentage="length" 
						 pivot-text=""
						 pivot-color="#F5B038"
						 color="linear-gradient(to right, #F5B038, #F5B038)" />
						<span @click="up" id="up"><img src="../assets/img/jia.png" alt="" /></span>
						</div>
					</div>

				</div>
				
				<div class="sett_info go_sett">
					<span>修改登录密码：</span>
					<button @click="changeLogin">go</button>
				</div>
				<div class="sett_info go_sett">
					<span>修改交易密码：</span>
					<button @click="changeDeal">go</button>
				</div>
				<div class="sub_sett">
					<span @click="logOut">退出登录</span>
				</div>
			</div>

			<!-- 修改登录密码 -->
			<div v-if="loginpass" class="sett_back">
				<div class="sett_info sett_change">
					<span>验证码：</span>
					<input type="text" v-model="code" placeholder="请输入验证码" />
					<button @click="sendCode">{{codeMsg}}</button>
				</div>
				<div class="sett_info sett_change">
					<span>新登录密码：</span>
					<input type="password" v-model="password" placeholder="请输入新密码" />
				</div>
				<div class="sett_info sett_change">
					<span>确认新密码：</span>
					<input type="password" v-model="repassword" placeholder="请再次输入新密码" />
				</div>
				<div class="sub_sett">
					<span @click="EditLoginBtn">确认</span>
				</div>
			</div>
			<!-- 修改交易密码 -->
			<div v-if="dealpass" class="sett_back">
				<div class="sett_info sett_change">
					<span>验证码：</span>
					<input type="text" v-model="code" placeholder="请输入验证码" />
					<button @click="sendCode">{{codeMsg}}</button>
				</div>
				<div class="sett_info sett_change">
					<span>新交易密码：</span>
					<input type="password" v-model="payment_password" placeholder="请输入新密码" />
				</div>
				<div class="sett_info sett_change">
					<span>确认新密码：</span>
					<input type="password" v-model="repayment_password" placeholder="请再次输入新密码" />
				</div>
				<div class="sub_sett sett_change">
					<span @click="EditDealBtn">确认</span>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				lang_dlg: true,
				loginpass: false,
				dealpass: false,
				setting: true,
				isOff: true,
				codeMsg: '获取',
				time: 60,
				code: '', //验证码
				password: '', //登录密码
				repassword: '', //确认登录密码
				payment_password: '', //交易密码
				repayment_password: '', //确认交易密码
				length:0,
				
			};
		},
		created: function() {
             
		},
		//数据保存到session
		watch: {},
		mounted: function() {
			let vol = $('#audio')[0].volume;
			this.length = vol * 100;
		},
		methods: {
			//退出登录
			logOut(){
				let that = this;
				that.$router.push({
					path: '/login'
				})
				localStorage.clear()
				},
			 //播放音乐
			playAudio(){
			    let _this = this;
			    console.log("播放音乐");
			    let musicDom = document.getElementsByTagName('audio')[0];
			    musicDom.load();//因为source标签不能直接更改路径，所以整个audio标签必须重新加载一次
			  },
			   //关闭音乐播放器   
			 closeAudio(){
			     let _this = this;
			     console.log("关闭音乐播放器");
				 let musicDom = document.getElementsByTagName('audio')[0];
				 musicDom.pause();
			     // _this.$refs.warningMusic.pause();
			 },
			//音量减小
			down() {
				let that = this;
				let vol = $('#audio')[0].volume;
				$('#down').click(function() {
					
					vol = vol > 0 ? (vol * 10 - 1) / 10 : 0;
					that.length = vol * 100;
					console.log(that.length)
					$('#audio')[0].volume = vol;
				})

			},
			//音量增加
			up() {
				let that = this;
				let vol = $('#audio')[0].volume;
				$('#up').click(function() {
					console.log(vol)
					vol = vol < 1 ? (vol * 10 + 1) / 10 : 1;
					that.length = vol * 100;
					$('#audio')[0].volume = vol;

				})

			},
			//关闭确认弹窗
			closeDialog: function() {
				var that = this;
				that.lang_dlg = false;
				that.$router.push({
					path: '/homepage'
				})
			},
			//修改登录密码
			changeLogin() {
				var that = this;
				that.loginpass = true;
				that.setting = false;
			},
			// 登录密码提交
			EditLoginBtn() {
				let that = this;
				let code = that.code;
				let password = that.password;
				let repassword = that.repassword;
				if (!code || code == null) {
					that.$toast('验证码不能为空');
				} else if (!password || password == null) {
					that.$toast('密码不能为空');
				} else if (!repassword || repassword == null) {
					that.$toast('重置密码不能为空');
				} else if (password !== repassword) {
					that.$toast('两次输的密码不同');
				} else {
					that.$http.post('Register/editPassword', {
							token: sessionStorage.getItem("token"),
							password: password,
							repassword: repassword,
							code: code,
						})
						.then(function(res) {
							let code = res.data.code;
							if (code == 0) {
								that.$toast('密码修改成功');
								password = "";
								repassword = "";
								code = "";
							} else {
								that.$toast(res.data.msg);
							}
						})
						.catch(function(err) {
							that.$toast({
								message: '网络连接失败',
								position: 'bottom',
								duration: 5000
							});
						});
				}

			},
			// 交易密码提交
			EditDealBtn() {
				let that = this;
				let code = that.code;
				let payment_password = that.payment_password;
				let repayment_password = that.repayment_password;
				if (!code || code == null) {
					that.$toast('验证码不能为空');
				} else if (!payment_password || payment_password == null) {
					that.$toast('密码不能为空');
				} else if (!repayment_password || repayment_password == null) {
					that.$toast('重置密码不能为空');
				} else if (payment_password !== repayment_password) {
					that.$toast('两次输的密码不同');
				} else {
					that.$http.post('Register/editPaymentPassword', {
							token: sessionStorage.getItem("token"),
							payment_password: payment_password,
							repayment_password: repayment_password,
							code: code
						})
						.then(function(res) {
							let code = res.data.code;
							if (code == 0) {
								that.$toast('密码修改成功');
								payment_password = "";
								repayment_password = "";
								code = "";
							} else {
								that.$toast(res.data.msg);
							}
						})
						.catch(function(err) {
							that.$toast({
								message: '网络连接失败',
								position: 'bottom',
								duration: 5000
							});
						});
				}

			},
			//发送验证码
			sendCode() {
				let that = this;
				console.log(123)
				var code = that.code;
				if (that.codeMsg != "获取" && that.codeMsg != '重发') return;
				var time = that.time;
				that.$http.post('Register/passwordCode', {
						token: sessionStorage.getItem("token")
					})
					.then(function(res) {
						var code = res.data.code;
						if (code == 0) {
							that.code = res.data.data;
							that.$toast('验证码发送成功');
							var interval = setInterval(function() {
								time--;
								that.codeMsg = time + 's';
								if (time <= 0) {
									clearInterval(interval)
									that.codeMsg = '重发';
								}
							}, 1000);
						} else {
							that.$toast(msg);
						}
					})
					.catch(function(err) {
						that.$toast({
							message: '网络连接失败',
							position: 'bottom',
							duration: 5000
						});
					});

			},
			//修改交易密码
			changeDeal() {
				var that = this;
				that.dealpass = true;
				that.setting = false;
			},



		}
	};
</script>

<style scoped="scoped">
	#setting {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}

	#audio{
		position: absolute;
		z-index: -999;
	}
	.control{
		display: flex;
		align-items: center;
		margin-left: 0.2rem;
	}
	 #down img,
	 #up img
	{
		width: 0.26rem;
		height: 0.26rem;
	}
  #setting	.van-progress{
  	height: 0.12rem;
  	width: 0.66rem;
  	border-radius: 0.3rem;
  	box-shadow: -0.004rem 0.004rem 0.006rem #C6494B;
	margin: 0 0.08rem;
	margin-top: -0.06rem;
	
  }
 
	.success {
		width: 1rem;
		height: 0.2rem;
		background: #000000;
	}

	.sett_content {
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

	.sett_content img.title {
		position: absolute;
		width: 4.5rem;
		height: 1.08rem;
		top: 0;
		left: 0.32rem;
		z-index: 9;
	}

	.sett_content img.close {
		position: absolute;
		width: 0.46rem;
		right: 0.12rem;
		top: 0.2rem;
	}
    .sett_text{
		position: absolute;
		left: 50%; 
		top: -0.1rem;
		margin-left:-1rem ;		
		width:2rem;
		z-index: 10;
		/* background: #000000; */
		text-align: center;
		line-height: 0.88rem;
	}
	.sett_content .sett_text h2 {
		color: #fff;
		font-size: 0.18rem;
		text-shadow: -0.001rem 0.001rem 0.008rem #B26901, 0.004rem 0.004rem 0.001rem #B26901;

	}

	.sett_back {
		width: 68%;
		margin-top: 0.88rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat;
		background-size: 100% 60%;
		padding-top: 0.2rem;
	}

	.sett_back .sett_info {
		padding: 0 0.04rem;
		font-size: 0.14rem;
		color: #F07923;
		font-weight: bold;
		/* text-shadow: -0.001rem 0.01rem 0.006rem #B26901, 0.01rem 0.001rem 0.008rem #B26901; */
		display: flex;
		justify-content: flex-start;
		margin-bottom: 0.12rem;
		align-items: center;
	}
	.sett_back .sett_info.sett_change{
		margin-bottom: 0.18rem;
	}
	.sett_back .sett_info.go_sett span:nth-child(1){
		width: 36%;
	}

	.sett_back .sett_info span:nth-child(1) {
		width: 36%;
		display: inline-block;
		text-align: right;

	}

	.sett_back .sett_info input {
		width: 58%;
		background: url(../assets/img/sr.png) no-repeat center center;
		background-size: 100% 100%;
		border: none;
		font-weight: normal;
		font-size: 0.12rem;
		padding-left: 0.06rem;
		/* color: #fff; */
		height: 0.28rem;
	}

	input::-webkit-input-placeholder {
		/* placeholder颜色  */
		color: #F7FBED;

	}
    .sett_back .sett_info.sett_open button{
		margin: 0 0.2rem;
	}
	.sett_back .sett_info button {
		width: 0.5rem;
		height: 0.26rem;
		margin-left: 0.6rem;
		line-height: 0.26rem;
		background: none;
		background: url(../assets/img/an.png) no-repeat center;
		background-size: 100% 100%;
		font-size: 0.12rem;
		border: none;
		color: #fffdc9;
		text-shadow: 0.01rem 0.01rem 0.008rem #4e1a0d;
	}

	.sub_sett {
		width: 100%;
		text-align: center;
	}

	.sub_sett span {
		display: inline-block;
		width: 1.2rem;
		height: 0.68rem;
		background: url(../assets/img/an-2.png) no-repeat center;
		background-size: 100% 100%;
		text-align: center;
		line-height: 0.46rem;
		color: #fcf5de;
		font-size: 0.14rem;
		text-shadow: -0.01rem 0.012rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415;
	}
</style>
