<template>
	<div id="ranking">
		<div class="ranking_content" v-show="lang_dlg">
			<img class="title" src="../assets/img/btkp.png" />
			<h2>排行榜</h2>
			<img @click="closeDialog" class="close" src="../assets/img/gb.png" />
			<!-- 我的分店 -->
			<div class="back_rank">
				<div class="rank_info">
					<div class="rank_title">
						<span>排行</span>
						<span>上榜农友</span>
						<span>总资产</span>
					</div>
					<div class="scroll_div">
						<van-pull-refresh v-model="isLoading" pulling-text="下拉刷新" loosing-text="释放更新" loading-text="正在加载..." @refresh="onRefresh">
							<div class="div" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10"
							 infinite-scroll-immediate-check="false">
								<div class="rank_lists">
									<div class="rank_list" v-for="(item,index) in rankList" :key="item.index">
										<span>{{item.ranking}}</span>
										<span>{{item.name}}</span>
										<span>{{item.total}}</span>
									</div>
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
				pageindex: 1, //默认为第一页
				pageCount: 1, //总页数，默认为1
				rankList: [], //排行榜
				load: false, //加载图标显示
				none: false, //加载图标隐藏
				lif: true, //正在加载中 显示
				nif: false, //没有更多数据了 隐藏
				loading: true, //下拉刷新
				isLoading: false //上拉加载更多
			};
		},
		created: function() {

		},
		//数据保存到session
		watch: {


		},
		mounted: function() {
			var that = this;
			that.getRanking();
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
				that.rankList = [];
				that.getRanking(1);
			},
			//上拉加载更多
			loadMore() {
				let that = this;
				that.lif = true;
				that.pageindex++;
				that.getRanking(0);
			},
			//经营日志
			getRanking(i) {
				let that = this;
				if (i) {
					that.lif = true;
				}
				that
					.$http({
						url: "Active/ranking",
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
							//成功回调
							if (res.data.data.list != "") {
								that.rankList = that.rankList.concat(res.data.data.list);
							} else {
								that.nif = true;
								that.loading = true;
							}
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
		}
	};
</script>

<style>
	#ranking {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		overflow: hidden;
		z-index: 100;
	}

	.ranking_content {
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

	.ranking_content img.title {
		position: absolute;
		width: 4.2rem;
		top: 0.02rem;
		left: 0.44rem;
		z-index: 9;
	}

	.ranking_content img.close {
		position: absolute;
		width: 0.46rem;
		right: 0.14rem;
		top: 0.1rem;
	}

	.ranking_content h2 {
		position: absolute;
		width: 1.02rem;
		top: 0.32rem;
		left: 2.2rem;
		/* font-family:'FZCY'; */
		color: #fff;
		font-size: 0.18rem;
		/* font-weight: 600; */
		text-shadow: -0.001rem 0.001rem 0.008rem #B26901, 0.004rem 0.004rem 0.001rem #B26901;
		z-index: 10;

	}

	.back_rank {
		width: 68%;
		margin-top: 0.8rem;
		margin-left: -0.1rem;
		background: url(../assets/img/k-2.png) no-repeat 0 0.2rem;
		background-size: 100% 60%;
		padding-top: 0.2rem;
	}

	.scroll_div {
		height: 100%;
	}

	.rank_info {
		width: 100%;
		height: 1.66rem;
		overflow-y: scroll;
	}

	.back_rank .rank_title {
		font-weight: normal;
		color: #EE661C;
		padding: 0.14rem 0;
		position: fixed;
		background-color: #EEDFAF;
		z-index: 8;

	}

	.van-loading__text {
		color: #F07923 !important;
	}

	.weui-loadmore_line .weui-loadmore__tips {
		color: #F07923 !important;
	}

	.back_rank .rank_title span {
		font-size: 0.16rem;
		padding: 0 0.332rem;
		font-weight: bold;
	}

	.back_rank .rank_lists {
		padding: 0 0.28rem;
		margin-top: 0.50rem;
	}

	.back_rank .rank_lists .rank_list {
		font-size: 0.14rem;
		color: #F07923;
		display: flex;
		justify-content: space-between;

	}

	.back_rank .rank_lists .rank_list {
		padding: 0.058rem 0;
	}

	.back_rank .rank_lists .rank_list span:nth-child(2) {
		padding-left: 0.12rem;
	}
</style>
