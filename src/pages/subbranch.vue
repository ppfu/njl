<template>
	<div id="subbranch">
		<div class="sub_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btk.png" />
			<img class="title_text" src="../assets/img/bt-fd.png" />
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 我的分店 -->
			<div class="back_sub">
				<div class="sub_head">
					<div class="sub_left">
						<span>共{{subordinate_count}}家分店</span>
					</div>
					<div class="sub_right">
						<span>总资产:{{all_assets}}</span>
					</div>
				</div>
				<div class="sub_info">
					<div class="sub_title">
						<span>用户名</span>
						<span>等级</span>
						<span>注册时间</span>
            <span>代数</span>
					</div>

					<div class="sub_lists">
						<div class="scroll_div">
							<van-pull-refresh v-model="isLoading" pulling-text="下拉刷新" loosing-text="释放更新" loading-text="正在加载..." @refresh="onRefresh">
								<div class="div" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
								 infinite-scroll-immediate-check="false">
									<div class="sub_list" v-for="(item,index) in subList" :key="item.index">
										<span @click="showSubInfo(item.id)"><a>{{item.username}}</a></span>
										<span>{{item.level}}</span>
										<span>{{item.create_time}}</span>
                    <span>{{item.subordinate}}</span>
									</div>
								</div>
								<load-more v-if="lif" :show-loading="load" tip="正在加载..."></load-more>
								<load-more v-if="nif" :show-loading="none" tip="没有更多数据了"></load-more>
							</van-pull-refresh>
						</div>

					</div>
				</div>
			</div>

		</div>
		<!-- 分店信息-->
		<div v-if="subInfo" class="subInfo_back">
			<div class="subInfo">
				<div class="su_info">
					<p><img :src="submsgList.head"></p>
					<span>{{submsgList.name}}</span>
				</div>
				<h4>经营收益：{{submsgList.money}}</h4>
				<!-- 密码输入框 -->
				<div class="sub_pa">
					<span @click="closeSell">关闭</span>
				</div>

			</div>
		</div>
	</div>

</template>

<script>
	import {
		LoadMore
	} from "vux";
	export default {
		components: {
			LoadMore
		},
		data() {
			return {
				lang_dlg: true,
				subList: [], //分店列表
				pageindex: 1, //默认第一页
				subordinate_count: '', //分店数量
				all_assets: '', //总资产
				subInfo: false, //分店信息
				sub_id: '', //分店id
				submsgList: [],
			 load: true, //加载图标显示
			none: false, //加载图标隐藏
			lif: true, //正在加载中 显示
			nif: false, //没有更多数据了 隐藏
			loading: false, //下拉刷新
			isLoading: false //上拉加载更多
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			let that = this;
			that.getSubordinate();
			// that.onRefresh();

		},
		methods: {
			//关闭确认弹窗
			closeDialog: function() {
				var that = this;
				that.lang_dlg = false;
				that.$router.push({
					path: '/homepage'
				})
			},
			//下拉刷新
			onRefresh() {
				let that = this;
				that.isLoading = true;
				that.loading = false;
				that.nif = false;
				that.pageindex = 1;
				that.subList = [];
				that.getSubordinate(1);
			},
			//上拉加载更多
			loadMore() {
				let that = this;
				that.lif = true;
				that.pageindex++;
				that.getSubordinate(0);
			},
			//获取我的分店
			getSubordinate(i) {
				let that = this;
				if (i) {
					that.lif = true;
				}
				that
					.$http({
						url: "Personal/subordinate",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							p: that.pageindex
						}
					})
					.then(function(res) {
						that.lif = false;
						that.isLoading = false;
						if (res.data.code == 0) {
							if (res.data.data.list != "") {
								that.subList = that.subList.concat(res.data.data.list);
							} else {
								that.nif = true;
								that.loading = true;
							}
                           that.subordinate_count = res.data.data.subordinate_count;
                           that.all_assets = res.data.data.all_assets;
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {
						that.$toast({
							message: "网络连接失败",
							position: "bottom",
							duration: 5000
						});
					});
			},
			//获取分店信息
			getSubordinateMsg() {
				let that = this;
				console.log(that.sub_id)
				that
					.$http({
						url: "Personal/subordinateMsg",
						method: "post",
						data: {
							token: sessionStorage.getItem("token"),
							id: that.sub_id
						}
					})
					.then(function(res) {
						console.log(res)
						if (res.data.code == 0) {
							that.submsgList = res.data.data; //分店信息
						} else {
							//失败
							that.$toast(res.data.msg);
						}
					})
					.catch(function(error) {
						that.$toast({
							message: "网络连接失败",
							position: "bottom",
							duration: 5000
						});
					});
			},
			//取消出售
			closeSell: function() {
				var that = this;
				that.subInfo = false;
			},
			//支付
			showSubInfo: function(id) {
				var that = this;
				that.sub_id = id;
				console.log(id)
				that.subInfo = true;
				that.getSubordinateMsg();
			},
		}
	};
</script>

<style scoped="scoped">
	#subbranch {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}

	.sub_content {
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

	.sub_content img.title {
		position: absolute;
		width: 4.2rem;
		top: 0.02rem;
		left: 0.44rem;
		z-index: 9;
	}

	/* .weui-loadmore_line {
		margin-top: 0.8rem !important;
	} */

	.sub_content img.close {
		position: absolute;
		width: 0.46rem;
		right: 0.14rem;
		top: 0.1rem;
	}

	.sub_content img.title_text {
		position: absolute;
		width: 1.2rem;
		top: 0.28rem;
		left: 2rem;
		z-index: 10;
	}

	.back_sub {
		width: 68%;
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.06rem;
		background-size: 100% 68%;
		padding-top: 0.12rem;
	}

	.back_sub .sub_head {
		margin-top: 0.01rem;
		padding: 0 0.2rem;
		display: flex;
		justify-content: space-between;
	}

	.back_sub .sub_head .sub_left,
	.back_sub .sub_head .sub_right {
		width: 1.4rem;
		height: 0.28rem;
		background: url(../assets/img/jz.png) no-repeat center;
		background-size: 100% 100%;
	}

	.back_sub .sub_head .sub_right {
		background: url(../assets/img/zc.png) no-repeat center;
		background-size: 100% 100%;
	}

	.back_sub .sub_head .sub_left,
	.back_sub .sub_head .sub_right {
		position: relative;
	}

	.back_sub .sub_head .sub_left span,
	.back_sub .sub_head .sub_right span {
		position: absolute;
		left: 0.38rem;
		top: 0;
		font-size: 0.12rem;
		line-height: 0.32rem;
		-webkit-transform-origin-x: 0;
		-webkit-transform: scale(0.8);
		color: #fff;
	}

	.sub_info {
		width: 100%;
		height: 1.46rem;
		overflow-y: scroll;
	}

	.sub_info .sub_title {
		font-weight: normal;
		color: #EE661C;
		padding: 0.06rem 0;
		position: fixed;
		z-index: 8;
    background:#EEDFAF;

	}

 .sub_info /deep/ .van-loading__text {
 	color: #F07923 !important;
	}

	.sub_info /deep/ .weui-loadmore_line .weui-loadmore__tips {
		color: #F07923 !important;
	}

	.sub_info .sub_title span {
		font-size: 0.16rem;
		font-weight: bold;
    display: inline-block;
     text-align: center;
	}
  .sub_info .sub_title span:nth-child(1){
        width: 0.8rem;


  }
   .sub_info .sub_title span:nth-child(2){
         width: 0.66rem;
  }
 .sub_info .sub_title span:nth-child(3){
         width: 1.4rem;
  }
  .sub_info .sub_title span:nth-child(4){
          width: 0.50rem;
   }
	.sub_info .sub_lists {
		padding: 0 0.08rem;
		margin-top: 0.36rem;
		height: 1.66;
	}

	.sub_info .sub_lists .sub_list {
		font-size: 0.12rem;
		color: #F07923;
		display: flex;
		justify-content: space-between;
		align-items: center;
    padding: 0.068rem 0;

	}
  .sub_info .sub_lists .sub_list span{
    padding: 0 0.04rem;
  }
	.scroll_div {
		height: 100%;
	}

	/* .van-pull-refresh {
brushgridIndex		height: 100%;
	} */

	/* .sub_info .sub_lists .sub_list {
		padding: 0.06rem 0;
		display: flex;
		align-items: center;
	} */
  .sub_info .sub_lists .sub_list span:nth-child(1){
   width: 0.66rem;
   text-align: center;
   overflow: hidden;
   text-overflow: ellipsis;
   white-space: nowrap;
   /* border-bottom: 1px solid #E1BE86; */
  }
   .sub_info .sub_lists .sub_list span:nth-child(1) a{
     text-decoration: underline;
   }
  .sub_info .sub_lists .sub_list span:nth-child(2){

  }
  .sub_info .sub_lists .sub_list span:nth-child(4){
    width: 12%;
    }

	.subInfo_back {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 888;
	}

	.subInfo {
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -1.7rem;
		margin-top: -1rem;
		width: 3.4rem;
		height: 2rem;
		background: url(../assets/img/b_sell.png) no-repeat center center;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

	}

	.sub_pa {
		width: 100%;
		text-align: center;
		margin-top: 0.18rem;
		position: absolute;
		bottom: -0.26rem;
	}

	.sub_pa span {
		display: inline-block;
		width: 1.2rem;
		height: 0.68rem;
		background: url(../assets/img/an-2.png) no-repeat center;
		background-size: 100% 100%;
		text-align: center;
		line-height: 0.46rem;
		color: #fcf5de;
		font-size: 0.16rem;
		text-shadow: -0.01rem 0.012rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415, 0.004rem 0.004rem 0.008rem #af3415;
	}

	.subInfo .su_info {
		font-size: 0.16rem;
		font-weight: bold;
		color: #D09049;
		display: flex;
		align-items: center;
		margin-top: 0.4rem;
		margin-bottom: 0.2rem;
	}

	.subInfo h4 {
		font-size: 0.16rem;
		font-weight: normal;
		color: #F07923;
		/* text-shadow: -0.004rem 0.004rem 0.01rem #4e1a0d, 0.004rem 0.004rem 0.008rem #4e1a0d; */
	}

	.subInfo .su_info p {
		width: 0.6rem;
		height: 0.6rem;
		background: #E1BE86;
		border-radius: 50%;
		position: relative;
		margin-right: 0.04rem;
	}

	.subInfo .su_info p img {
		width: 90%;
		position: absolute;
		top: 0.04rem;
	}
</style>
