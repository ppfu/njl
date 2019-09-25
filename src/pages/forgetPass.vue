<template>
	<div id="forget">
		<div class="for_bg" :style="{height: bodyHeight + 'px'}">
		<div class="forget-con">
			<img class="logo" src="../assets/img/logo.png" />
			<div class="forget-info">
				<span>手机号:</span>
				<input type="text" v-model="account" placeholder="" />
			</div>
			<div class="forget-code">
				<div class="code_info">
					<span>验证码:</span>
					<input type="text" v-model="code" placeholder="" />
				</div>
				<p @click="sendCode">{{codeMsg}}</p>
			</div>
			<div class="forget-info">
				<span>新密码:</span>
				<input type="password" v-model="password" placeholder="" />
			</div>
			<div class="forget-info">
				<span>确认密码:</span>
				<input type="password" v-model="repassword" placeholder="" />
			</div>
			<div class="btn_forget">
				<img @click="fogetBtn" class="btn" src="../assets/img/anniuf.png" />
				<span @click="backLogin">返回登录</span>
			</div>
		</div>
		</div>
		<!-- <div class="footer" v-show="hidshow">
			11233
		</div> -->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
				code: '',
				password: '',
				repassword: '',
				codeMsg: '获取',
				time: 60,
				bodyHeight: '0', //默认屏幕高度
				
				showHeight: '0', //实时屏幕高度
				
				hidshow: true, //显示或者隐藏footer,
				
				isResize: false //默认屏幕高度是否已获取
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			 this.bodyHeight=document.documentElement.clientHeight
          // window.onresize监听页面高度的变化    
          // window.onresize = () => {
          // 	return (() => {
          // 		if (!this.isResize) {
          // 			//默认屏幕高度                               
          // 			this.docmHeight = document.documentElement.clientHeight
          // 			this.isResize = true
          // 		}
          // 		//实时屏幕高度                       
          // 		this.showHeight = document.body.clientHeight
          // 	})()
          // }
		},
		//监听
		watch: {
			// showHeight: function() {
			// 	if (this.docmHeight >= this.showHeight) {
			// 		this.hidshow = false
			// 	} else {
			// 		this.hidshow = true
			// 	}
			// }
			},
		methods: {
			backLogin(){
				let that = this;
				that.$router.push({
					path: '/login',
				});
			},
			// 密码提交
			fogetBtn() {
				let that = this;
				let account = that.account;
				let password = that.password;
				let repassword = that.repassword;
				let code = that.code;
				if (!account || account == null) {
					that.$toast('请输入手机号码');
				} else if (account.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(account)) {
					that.$toast('手机号格式错误');
				} else if (!password || password == null) {
					that.$toast('密码不能为空');
				} else if (!repassword || repassword == null) {
					that.$toast('重置密码不能为空');
				} else if (password !== repassword) {
					that.$toast('两次输的密码不同');
				} else if (!code || code == null) {
					that.$toast('验证码不能为空');
				} else {
					that.$http.post('Register/forgotPassword', {
							account: account,
							password: password,
							repassword: repassword,
							code: code,
						})
						.then(function(res) {
							let code = res.data.code;
							if (code == 0) {
								that.$toast('密码修改成功');
								that.$router.push({
									path: '/login',
								});

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
				var account = that.account;
				var code = that.code;
				if (!account || account == null) {
					that.$toast('请输入手机号码');
				} else if (account.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(account)) {
					that.$toast('手机号格式错误');
				} else {
					if (that.codeMsg != "获取" && that.codeMsg != '重发') return;
					var time = that.time;
					that.$http.post('Register/code', {
							account: account
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
				}
			},
		}
	};
</script>

<style scoped="scoped">
	#forget {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
  .for_bg{
	width: 100%;
	height: 100%;
	overflow:scroll;
	background: url(../assets/img/bg_l.jpg) no-repeat center top;
	background-size: 100% 100%;
	position: relative;
  }
   .footer{
  	position: fixed;
	left: 0;
  	bottom: 0;
  }
	.forget-con {
		width: 3.34rem;
		height: 4.2rem;
		background: url(../assets/img/kuangf.png) no-repeat right center;
		background-size: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left:-1.67rem ;
		margin-top: -1.88rem;
	}

	.forget-con img.logo {
		width: 2rem;
		margin-bottom: 0.04rem;

	}

	.forget-info,
	.forget-code {
		margin-right: 0.12rem;
		width: 2.34rem;
		height: 0.36rem;
		margin-bottom: 0.12rem;
		background: url(../assets/img/shuru.png) no-repeat center center;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
	}
	.forget-info span,
	.forget-code span {
		display: inline-block;
		padding: 0 0.08rem;
		font-size: 0.12rem;
		color: #BDA576;
	}
	.forget-info input,
	.forget-code input {
		width: 56%;
		height: 100%;
		border: none;
		background: none;
		font-size: 0.14rem;
		color: #BDA576;
	}
	.forget-code,
	.code_info {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.forget-code {
		background: none;
	}
	.forget-code .code_info {
		width: 1.64rem;
		height: 0.36rem;
		background: url(../assets/img/shuru.png) no-repeat center center;
		background-size: 100% 100%;
	}
	.forget-code p {
		/* display: inline; */
		width: 24%;
		height: 100%;
		text-align: center;
		line-height: 0.4rem;
		font-size: 0.14rem;
		color: #fff;
		background: url(../assets/img/huoqu.png) no-repeat center;
		background-size: 100%;
	}

	.btn_forget {
		display: flex;
		flex-direction: column;
		margin-bottom: 0.8rem;
	}

	.forget-con .btn_forget .btn {
		width: 1.2rem;
		/* margin-top: 0.032rem; */
		margin-right: 0.1rem;
	}
	.forget-con .btn_forget span{
		font-size: 0.14rem;
		color: #C29A49;
		margin-left: 0.4rem;
	}
</style>
