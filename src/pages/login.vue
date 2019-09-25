<template>
	<div id="login">
		<div class="login_bg" :style="{height: bodyHeight + 'px'}">
			<div class="log-con">
				<img class="logo" src="../assets/img/logo.png" />
				<div class="login-info">
					<span>用户名:</span>
					<input type="text" v-model="username" placeholder="请输入用户名" />
				</div>
				<div class="login-info">
					<span>登录密码:</span>
					<input type="password" v-model="password" placeholder="请输入登录密码" />
				</div>
				<div class="btn_login">
					<img @click="login" class="btn" src="../assets/img/anniul.png" />
					<span @click="gotoForget">忘记密码?</span>
				</div>
			</div>

		</div>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				username: window.localStorage.getItem("username"),
				password: '',
				bodyHeight: '0', //默认屏幕高度
				showHeight: '0', //实时屏幕高度,
				isResize: false ,//默认屏幕高度是否已获取
				Dialog:true,
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			let that = this;
			 that.bodyHeight=document.documentElement.clientHeight
 
		},
		//监听
		watch: {
			},
			methods: {
				dia(){
				 	let that = this;
				 	 that.$dialog.confirm({
				 	 	message: '弹窗内容'
				 	 }).then(() => {
				 	 	// on confirm
				 	 }).catch(() => {
				 	 	// on cancel
				 	 });
				},
				//登录
				login() {
					let that = this;
					let username = that.username;
					let password = that.password;
					if (!username || username == null) {
						that.$toast('请输入用户名');
					} else if (!password || password == null) {
						that.$toast('密码不能为空');
					} else {
						that.$http.post('Register/userLogin', {
								username: username,
								password: password,
							})
							.then(function(res) {
								console.log(res);
								let code = res.data.code;
								let msg = res.data.msg;
								let data = res.data.data;
								console.log(code)
								if (code == 0) {
									window.sessionStorage.setItem('token', data);
									window.localStorage.setItem('username', username);
									that.$router.push({
										path: '/homepage'
									})
									that.$toast('登录成功');
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
				gotoForget() {
					let that = this;
					that.$router.push({
						path: '/ForgetPass',
					});
				},
				// gotoHome() {
				// 	let that = this;
				// 	that.$router.push({
				// 		path: '/homepage',
				// 	});
				// }
			}
		};
</script>

<style>
	#login {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
   .van-dialog{
	   width: 50%;
   }
	.login_bg {
		width: 100%;
		height: 100%;
		overflow:scroll;
		background: url(../assets/img/bg_l.jpg) no-repeat center top;
		background-size: 100% 100%;
		position: relative;
	}

	.log-con {
		width: 3rem;
		height:4rem;
		background: url(../assets/img/kuang.png) no-repeat right center;
		background-size: 100%;
		display: flex;
		/* justify-content: center; */
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -1.5rem;
		margin-top: -1.6rem;
	}
	.log-con img.logo {
		width: 2.26rem;
	}
 /*   .footer{
		position: fixed;
		left: 0;
		bottom: 0;
	} */
	.login-info {
		width: 2.2rem;
		height: 0.4rem;
		background: url(../assets/img/shuru.png) no-repeat center center;
		background-size: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.08rem;
		margin-right: 0.1rem;
	}

	.login-info span {
		display: inline-block;
		/* width: 28%; */
		font-size: 0.14rem;
		color: #BDA576;
		margin-left: 0.06rem;
	}

	.login-info input {
		flex: 1;
		width: 66%;
		border: none;
		padding-left: 0.04rem;
		background: none;
		font-size: 0.14rem;
		color: #BDA576;
	}

	.btn_login {
		display: flex;
		flex-direction: column;
	}

	.log-con .btn_login .btn {
		width: 1.2rem;
		margin-top: 0.06rem;
		margin-right: 0.1rem;
	}

	.btn_login span {
		font-size: 0.14rem;
		color: #C29A49;
		margin-left: 0.4rem;
		/* margin-bottom: 1rem; */
	}
</style>
