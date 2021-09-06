<template>
	<div class="task_table_wrap">
		<el-table
	      	:data="tableData"
			:cell-class-name="setCellClassName"
			max-height="700px"
	      	>
		    <el-table-column width="40" v-if="showSelect">
		    	<template slot="header" slot-scope="scope">
		    		<label class="el-checkbox" @click="selectAllData">
				        <span class="el-checkbox__input"  :class="selectAllFlag ? 'is-checked' : ''">
							<span class="el-checkbox__inner"></span>
						</span>
					</label>
			    </template>
			    <template slot-scope="scope">
			    	<label class="el-checkbox" @click="selectData(scope)">
				        <span class="el-checkbox__input"  :class="[scope.row.selected ? 'is-checked' : '', scope.row.disabled ? 'is-disabled' : '']">
							<span class="el-checkbox__inner"></span>
						</span>
					</label>
			    </template>
		    </el-table-column>
	      	<template v-for="(item, idx) in tableHeader">
	      		<el-table-column v-if="item.slot"
	      			:key="idx"
			        :prop="item.prop"
			        :label="item.label"
			        :align="item.center ? 'center' : ''"
			        :class-name="item.clas ? 'task_' + item.clas : ''"
					:width="item.width ? item.width : ''"
					:fixed="item.fixed ? item.fixed : false"
			    	>
			    	<template slot-scope="scope">
			    		<template v-for="(slotItem) in item.slotArr">
			    			<span v-if="['icon', 'iconBool'].includes(slotItem.type)" class="table_icon">{{ scope.row[item.prop] }}</span>
			    			<i v-if="slotItem.type==='icon'" :class="slotItem.class" @click="handleClick(scope, slotItem)"></i>

			    			<i v-if="slotItem.type==='iconBool' && scope.row[slotItem.prop]" :class="slotItem.class ? slotItem.class : 'el-icon-edit'" @click="handleClick(scope, slotItem)"></i>
			    			<template v-if="slotItem.type === 'img' && scope.row[slotItem.prop]">
			    				<el-image class="table_img"
								    :src="scope.row[slotItem.prop]" 
								    :preview-src-list="!slotItem.preview ? [] : [scope.row[slotItem.prop]]">
								</el-image>
			    				<span style="margin-right: 10px">{{ scope.row[item.prop] }}</span>
			    			</template>
		    				

			    			<el-button v-else-if="slotItem.type==='btn'" 
			    				size="mini" 
			    				:type="slotItem.btnType!=undefined?slotItem.btnType:'primary'"
					          	@click="handleClick(scope, slotItem)"
					          	plain
					        	>
					          	{{slotItem.btnText ? slotItem.btnText : scope.row[item.prop]}}
					        </el-button>

					        <el-button v-else-if="slotItem.type==='btnBool' && scope.row[slotItem.prop]" 
			    				size="mini" 
			    				:type="slotItem.btnType!=undefined?slotItem.btnType:'primary'"
					          	@click="handleClick(scope, slotItem)"
					          	plain
					        	>
					          	{{slotItem.btnText ? slotItem.btnText : scope.row[item.prop]}}
					        </el-button>

					        <el-popover v-else-if="slotItem.type==='hover'" 
					        	trigger="hover" placement="top"
					        	>
					          	<p v-for="(hoverItem, idh) in slotItem.list"> 
									{{hoverItem.title}}： {{scope.row[hoverItem.prop]}}
					          	</p>
					          	<div slot="reference" class="hover_wrapper">
					            	{{ scope.row[item.prop] }}
					          	</div>
					        </el-popover>
			    		</template>
				    </template>
	      		</el-table-column>
	      		<el-table-column v-else-if="item.visible != undefined ? item.visible : true"
					:key="idx"
			        :prop="item.prop"
			        :label="item.label"
			        :align="item.center?'center':''"
			        :class-name="item.clas?'task_'+item.clas:''"
			        :width="item.width?item.width:''"
					:fixed="item.fixed?item.fixed:false"
			    >
		      	</el-table-column>
	      	</template>
	    </el-table>
	    <el-pagination :hide-on-single-page="true"
	    	v-if="tableData.length"
		  	background
		  	layout="prev, pager, next"
		  	:total="total"
		  	:current-page="page"
		  	:page-size="pageSize"
		  	@current-change="currentChange">
		</el-pagination>
	</div>
</template>
<script>
	export default {
		props: {
			hideCheckbox: Boolean,
			tableHeader: Array,
			tableData: Array,
			total: Number,
			fixedSelect: Number,
			page: Number,
			pageSize: {
				type: Number,
				default: 10,
			},
			cellClassIndex: String,//是否设置cell-class-name
			showSelect: {
				type: Boolean,
				default: true,
			}
		},
		created() {
		},
		computed: {
			selectAllFlag() { //全选
				if (this.tableData.length === 0) {
					return false;
				}
				let tableData = this.tableData;
				tableData = tableData.filter(item => !item.disabled);
				return tableData.length && tableData.every(item => item.selected === true);
			}
		},
		methods: {
			handleClick(scope, item) {
				let action = item.action;
				if (this.$parent[action]) {
					this.$parent[action](scope.row);
				} else if (this.$parent.$parent[action]) {
					this.$parent.$parent[action](scope.row);
				}
			},
			currentChange(page) {
				if (this.$listeners['initData']) {
					this.$emit('initData', page);
				} else {
					this.$parent.initData(page);
				}
			},
			setCellClassName({row, column, rowIndex, columnIndex}) {
				let cellClassIndex = this.cellClassIndex ? this.cellClassIndex.split(',') : undefined;
				if(cellClassIndex && cellClassIndex.indexOf(columnIndex + '') != -1) {
					if(this.$parent.setCellClassName) {
						return this.$parent.setCellClassName(row, column);
					} else if (this.$parent.$parent.setCellClassName) {
						return this.$parent.$parent.setCellClassName(row, column);
					}
					
				}
			},
			selectAllData() { //全选
				let tableData = this.tableData;
				tableData = tableData.filter(item => !item.disabled);
				let selected = tableData.every((item) => item.selected === true);
				this.$emit('selectAllData', selected ? false : true);
			},
			selectData(scope) { //选择复选框
				if (scope.row.disabled) {
					return;
				}
				scope.row.selected = !scope.row.selected;
			}
		}
	}
</script>
<style lang="less" scoped>
	.el-pagination {
		margin-top: 10px;
		float: right;
	}
	.hover_wrapper {
		cursor: pointer;
		text-align: center;
	}
	.task_table_wrap {
		margin-bottom: 50px;
		.el-table {
			width: 100%;
			max-height: 700px;
		}
	}
	.table_img {
		float: left;
		margin-right: 5px;
		width: 60px;
		height: 60px;
	}
	.table_icon {
		margin-right: 10px;
	}
</style>