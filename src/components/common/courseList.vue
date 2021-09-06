<template>
	<div class="course_content clearfix"
		:id="elemId">
		<p v-show="courList.length" class="course_title">{{courTitle}}</p>
		<p v-show="courList.length" class="course_desc">{{courDesc}}</p>
		<div v-show="courList.length" class="course_filter">
			<div class="course_filter_btn">
				<span>{{$t('course.filter')}}</span>
				<ul class="course_filter_items">
					<li v-for="type in typeList" class="course_filter_item" @click="selectFilter(type)"
					 	>
						{{zh ? type.typeNmCn : type.typeNmEn}}
					</li>
				</ul>
			</div>
			<span v-show="courList.length > lineNums" @click="viewMore" class="course_filter_more button">View More {{moreFlag ? '-' : '+'}}</span>
		</div>

		<ul v-show="courList.length" class="course_filtered_types clearfix">
			<li v-for="(filt, idx) in filteredList">
				{{zh ? filt.typeNmCn : filt.typeNmEn}}<span class="course_filtered_types_close" @click="deleteFilter(filt.typeNo)"></span>
			</li>
		</ul>

		<ul class="course_list clearfix">
			<li v-for="item in list" class="course_item"
				@click="toCouseDetail(item)">
				<div class="course_item_top" :class="item.type ? item.type : ''">
					<p class="course_item_title">{{zh ? item.courseNmCn : item.courseNmEn}}</p>
					<p class="course_item_type_time">
						<span v-show="item.courseType.typeNo">{{zh ? item.courseType.typeNmCn : item.courseType.typeNmEn}}</span>
						<span>{{zh ? item.durationCn : item.durationEn}}</span>
					</p>
				</div>
				<div class="course_item_intro">
					<p>
						<span>{{$t('common.teamSize')}}:</span>
						<b>{{zh ? item.teamSizeCn : item.teamSizeEn}}</b>
					</p>
					<p>
						<span>{{$t('common.targetAgeGroup')}}:</span>
						<b>{{zh ? item.gradesCn : item.gradesEn}}</b>
					</p>
					<p>
						<span>{{$t('common.courseCapacity')}}:</span>
						<b>{{zh ? item.capacityCn : item.capacityEn}}</b>
					</p>
				</div>
			</li>
		</ul>
	</div>
</template>
<script>
	import {Request} from '@/api/request';
    import {getCourseTypeShort, joinNum,} from '@/assets/js/public';
	export default {
		props: {
			courTitle: String,
			courDesc: String,
			typeList: Array,
			// filterArr: Array,
			// courList: Array,
			elemId: String,
			level: String,
		},
		data() {
			return {
				courList: [],
				filterNoList: [],
				moreFlag: false,
				lineNums: 4,
			}
		},
		created() {
			this.initData();
		},
		methods: {
			initData() {
				Request({
					url: 'course/query',
					params: {
						courseLevel: this.level,
						typeNo: this.filterNoList.join(','),
						courseSt: 1
					}
				}).then(res => {
					if (res.code == 200) {
						let list = res.courses ? res.courses : [];
						list = this.formatCourseList(list);
						this.courList = list;
					}
				});
			},
            formatCourseList(list) {
                list = list.map(item => {
                    if (item.courseType && item.courseType.typeNmEn) {
                        item.type = getCourseTypeShort(item.courseType.typeNmEn);
                        let grades = joinNum(item.targetAgeGroupMin, item.targetAgeGroupMax);
                        item.gradesCn = grades ? grades + ' 年级' : '-';
                        item.gradesEn = grades ? 'Grades ' + grades  : '-';

                        let teamSize = joinNum(item.teamSizeMin, item.teamSizeMax);
                        item.teamSizeCn = teamSize ? teamSize + ' 人' : '-';
                        item.teamSizeEn = teamSize ? teamSize + ' students' : '-';
                        if(teamSize == 1) {
                        	item.teamSizeCn = '个人项目';
                        	item.teamSizeEn = 'Individual';
                        } else if (item.type == 'Tutoring') {
                        	item.teamSizeCn = '一对一';
                        	item.teamSizeEn = '1 on 1';
                        }

                        let capacity = joinNum(item.courseCapacityMin, item.courseCapacityMax)
                        item.capacityCn = capacity ? capacity + ' 人' : '-';
                        item.capacityEn = capacity ? capacity + ' students' : '-';
                        let duration = joinNum(item.courseDurationMin, item.courseDurationMax);
                        item.durationCn = duration ? duration + ' 周' : '-';
                        item.durationEn = duration ? duration + ' Weeks' : '-';
                        return item;
                    }
                });
                return list;
            },

            selectFilter(type) {
            	let index = this.filterNoList.indexOf(type.typeNo);
                if (index == -1) {
                    this.filterNoList.push(type.typeNo);
                } else {
                	this.filterNoList.splice(index, 1);
                }
                this.initData();
            },
            deleteFilter(typeNo) {
                let filterNoList = this.filterNoList;
                let index = filterNoList.indexOf(typeNo);
                if (index != -1) {
                    filterNoList.splice(index, 1);
                }
                this.filterNoList = filterNoList;
                this.initData();
            },

            toCouseDetail(course) {
                this.$router.push({
                    path: '/detail',
                    query: {
                    	cno: course.courseNo,
                    }
                });
            },
            viewMore() {
            	this.moreFlag = !this.moreFlag;
            },
		},
		computed: {
			zh() {
				return this.$i18n.locale == 'zh';
			},
			list() {
				return this.moreFlag ? this.courList : this.courList.filter((item, idx) => {
					return idx < this.lineNums;
				});
			},
			filteredList() {
				let list = [];
				let typeList = this.typeList;
				let filterNoList = this.filterNoList;
				return typeList.filter(item => {
					return filterNoList.indexOf(item.typeNo) != -1
				});
			}
		}
	}
</script>
<style lang="less" scoped >
	@defaultWidth: 1000px;
	.zh {
		.course_content {
			.course_list {
				.course_item {
					.course_item_intro {
						p {
						}
					}
				}
			}
		}
	}
	.course_content {
		margin: 50px auto 20px;
		width: @defaultWidth;
		.course_title {
			width: 100%;
			height: 64px;
			line-height: 64px;
			font-size: 24px;
			color: #000;
		}
		.course_desc {
			width: 400px;
			line-height: 20px;
			font-size: 12px;
			color: #000;
		}
		.course_filter {
			margin-top: 10px;
			width: 100%;
			height: 30px;
			span {
				float: left;
				height: 30px;
				line-height: 30px;
				font-size: 14px;
			}
			.course_filter_btn {
				position: relative;
				float: left;
				width: 90px;
				height: 40px;
				border-radius: 5px;
				border-bottom: 10px solid transparent;
				span {
					position: relative;
					padding-right: 20px;
					width: 90px;
					color: #fff;
					border-radius: 5px;
					text-align: center;
					cursor: pointer;
					background: #000;
					&:after {
						display: block;
						position: absolute;
						right: 10px;
						top: 0;
						content: '+';
						width: 30px;
						height: 30px;
						font-size: 16px;
						line-height: 30px;
						font-weight: bold;
						color: #fff;
					}
				}
				&:hover span:after {
					content: '-';
				}
				&:hover .course_filter_items {
					display: block;
				}
			}
			.course_filter_more {
				float: right;
				margin-right: 40px;
				font-weight: bold;
				color: #000;
				cursor: pointer;
			}
			.course_filter_items {
				display: none;
				position: absolute;
				left: 0;
				top: 40px;
				padding: 5px 10px;
				width: 300px;
				text-align: left;
				background: #fff;
				border: 1px solid #ccc;
				border-radius: 5px;
				z-index: 10;
				transition: all .3s ease;
				.course_filter_item {
					width: 100%;
					height: 20px;
					line-height: 20px;
					font-size: 12px;
					color: #000;
					cursor: pointer;
					&:hover {
						text-decoration: underline;
					}
				}
			}
		}
		.course_filtered_types {
			margin-top: 10px;
			margin-bottom: 10px;
			width: 100%;
			li {
				position: relative;
				float: left;
				margin-right: 15px;
				padding-left: 10px;
				padding-right: 10px;
				height: 30px;
				line-height: 30px;
				border: 1px solid #ccc;
				border-radius: 5px;
				.course_filtered_types_close {
					display: inline-block;
					margin-left: 10px;
					width: 10px;
					height: 10px;
					background: url('../../assets/images/icon_close.png') no-repeat center;
					background-size: 10px 10px;
					cursor: pointer;
				}
			}
		}
		.course_list {
			margin-top: 20px;
			width: 100%;
			.course_item {
				float: left;
				margin-right: 30px;
				margin-bottom: 20px;
				width: 220px;
				height: 200px;
				border-radius: 4px;
				cursor: pointer;
        transition: box-shadow .3s;
				&:hover {
          box-shadow: 0 0 25px rgba(33,33,33,.2);
          .course_item_top {
						filter: opacity(1);
					}
				}
				.course_item_top {
					position: relative;
					padding: 15px 5px;
					width: 100%;
					height: 130px;
					background: #9b856e;
					border-radius: 4px 4px 0 0;
					filter: opacity(0.5);
          			-webkit-filter: grayscale(40%);
					&.Math, &.Science {
						background: linear-gradient(228deg, #E5A641, #FF4141);
					}
					&.Comp {
						background: linear-gradient(228deg, #EAD536, #1EAF99);
					}
					&.Visual {
						background: linear-gradient(228deg, #570CCE, #72F76D);
					}
					&.Business {
						background: linear-gradient(228deg, #24ABFF, #BC7EDD);
					}
					&.Research {
						background: linear-gradient(228deg, #FF4E24, #FFFF00);
					}
					&.Tutoring {
						background: linear-gradient(228deg, #E50000, #FA8AED);
					}
					&.English {
						background: linear-gradient(228deg, #FD8B37, #E8DB3A);
					}
					.course_item_title {
						display: -webkit-box;
						margin-bottom: 20px;
						width: 100%;
						height: 40px;
						line-height: 20px;
						font-size: 14px;
						font-weight: bold;
						color: #fff;
						overflow: hidden;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						text-overflow: ellipsis;
						-webkit-box-orient: vertical;
					}
					.course_item_type_time {
						width: 100%;
						height: 20px;
						span {
							padding: 0 5px;
							margin-top: 5px;
							margin-right: 10px;
							float: left;
							max-width: 210px;
							height: 20px;
							line-height: 20px;
							font-size: 12px;
							border-radius: 5px;
							background-color: #fff;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
						}
					}
				}
				.course_item_intro {
					padding: 5px 5px;
					width: 100%;
					height: 70px;
					border: 1px solid #ccc;
					border-top: 0;
					border-radius: 0 0 4px 4px;
					p {
						width: 100%;
						height: 20px;
						line-height: 20px;
						font-size: 12px;
						color: #000;
					}
					span {
						float: left;
					}
					b {
						float: right;
					}
				}
			}
		}
	}
</style>
