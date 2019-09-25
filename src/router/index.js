import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store/index'
import Notice from '@/pages/notice' //游戏公告页
import Loader from '@/pages/loader' //加载页
import Login from '@/pages/login' //登录页
import ForgetPass from '@/pages/forgetPass' //忘记密码页
import Homepage from '@/pages/homepage' //游戏主页面
import Property from '@/pages/property' //资产中心
import PersonalData from '@/pages/personalData' //个人资料
import Portrait from '@/pages/portrait' //头像
import Lease from '@/pages/lease' //租赁中心
import Deal from '@/pages/deal' //交易中心
import EntryOrders from '@/pages/entryOrders' //挂单
import Subbranch from '@/pages/subbranch' //我的分店
import Journal from '@/pages/journal' //经营日志
import Inform from '@/pages/Inform' //游戏说明
import GameExplain from '@/pages/gameExplain' //游戏说明
import Setting from '@/pages/setting' //设置
import Turntable from '@/pages/turntable' //转盘
import Invite from '@/pages/invite' //邀请好友
import Ranking from '@/pages/ranking' //排行榜
import Shopping from '@/pages/shopping' //商城
// import music from '@/components/music' //音乐
Vue.use(Router)
export default new Router({
	routes: [
		{
			path: '/',
			name: 'Notice',
			components: {
				main: Notice,
			},
			meta: {
				index: 1,
			}
		},
		{
			path: '/loader',
			name: 'Loader',
			components: {
				main: Loader,
			},
			meta: {
				index: 2,
			}
		},
		{
			path: '/login',
			name: 'Login',
			components: {
				main: Login,
			},
			meta: {
				index: 3,
			}
		},
		{
			path: '/forgetPass',
			name: 'ForgetPass',
			components: {
				main: ForgetPass,
			},
			meta: {
				index: 4,
			}
		},
		// {
		// 	path: '/music',
		// 	name: 'music',
		// 	components: {
		// 		main: music,
		// 	},
		// 	meta: {
		// 		index: 6,
		// 	}
		// },
		{
			path: '/homepage',
			name: 'Homepage',
			components: {
				main: Homepage,
			},
			meta: {
				index: 5,
			},
			children: [{
					path: '/property',
					name: 'Property',
					components: {
						child: Property,
					},
					
				},
				{
					path: '/personalData',
					name: 'PersonalData',
					components: {
						child: PersonalData,
					},
					
				},
				{
					path: '/portrait',
					name: 'Portrait',
					components: {
						child: Portrait,
					},
					
				},
				{
					path: '/lease',
					name: 'Lease',
					components: {
						child: Lease,
					},
					
				},
					{
					path: '/deal',
					name: 'Deal',
					components: {
						child: Deal,
					},
					
				},
				{
					path: '/entryOrders',
					name: 'EntryOrders',
					components: {
						child: EntryOrders,
					},
					
				},
				{
					path: '/subbranch',
					name: 'Subbranch',
					components: {
						child: Subbranch,
					},
					
				},
				{
					path: '/journal',
					name: 'Journal',
					components: {
						child: Journal,
					},
					
				},
				{
					path: '/inform',
					name: 'Inform',
					components: {
						child: Inform,
					},
					
				},
				{
					path: '/gameExplain',
					name: 'GameExplain',
					components: {
						child: GameExplain,
					},
				
				},
				{
					path: '/setting',
					name: 'Setting',
					components: {
						child: Setting,
					},
					
				},
				{
					path: '/turntable',
					name: 'Turntable',
					components: {
						child: Turntable,
					},
					
				},
				{
					path: '/invite',
					name: 'Invite',
					components: {
						child: Invite,
					},
					
				},
				{
					path: '/ranking',
					name: 'Ranking',
					components: {
						child: Ranking,
					},
					
				},
				{
					path: '/shopping',
					name: 'Shopping',
					components: {
						child: Shopping,
					},
					
				}
			],
			
		}
	],

});
