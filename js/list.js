webix.message.position = "bottom";

webix.protoUI({
	name:"editlist"
}, webix.EditAbility, webix.ui.list);

const list_template = function(obj){
	if(obj.status){//active
		return `
		<span class='drag_icon webix_icon mdi mdi-drag' webix_tooltip='Drag to reorder the task'></span>`+ obj.task +`
		<span class='delete_icon webix_icon mdi mdi-delete' webix_tooltip='Remove the task'></span>
		<span class='complete_icon webix_icon mdi mdi-check-circle' webix_tooltip='Complete the task'></span>
		<span class='star_icon webix_icon mdi mdi-`+(obj.star ? "star" : "star-outline")+`'
		webix_tooltip='`+(obj.star ? "Unselect the task" : "Select the task")+`'></span>`;
	}else{//completed
		return `
		<span class='done'>Done</span>`+ obj.task +`
		<span class='undo_icon webix_icon mdi mdi-undo-variant' webix_tooltip='Return the task'></span>`;
	}
}

const list = {
	view:"editlist",
	id:"todo_list",
	tooltip:function(obj){
		return (obj.status ? "Double click to edit the task" : "You cannot edit completed tasks");
	},
	type:{
		height:45,
		css:"custom_item",
		template:list_template
	},
	select:true,
	drag:"inner",
	editable:true,
	editor:"text",
	editValue:"task",
	editaction:"dblclick",
	rules:{
		task:webix.rules.isNotEmpty
	},
	onClick:{
		delete_icon:function(e, id){
			webix.confirm({
				title:"Task would be deleted",
				text:"Do you still want to continue?",
				type:"confirm-warning"
			}).then(() => {
				webix.message({
					text:"Task was deleted",
					expire:1000
				});
				this.remove(id);
				return false;
			},
			function(){
				webix.message("Rejected");
			}
		);
	},
	complete_icon:function(e, id){
		this.updateItem(id, { status:false, star:false });
		this.moveTop(id);
		filterToDoList(true);
	},
	undo_icon:function(e, id){
		this.updateItem(id, { status:true });
		this.moveBottom(id);
		filterToDoList(false);
	},
	star_icon:function(e, id){
		const obj = this.getItem(id);
		this.updateItem(id, { star:!obj.star });
		if(obj.star){
			this.moveTop(id);
			this.showItem(id);
			this.select(id);
		}else{
			this.moveBottom(id);
		}
	}
},
	on:{
		onBeforeDrag:function(id, e){
			return (e.target||e.srcElement).className == "drag_icon webix_icon mdi mdi-drag";
		},
		onBeforeEditStart:function(id, e){
			const obj = $$("todo_list").getItem(id);
			return obj.status;
		}
	},
	ready:function(){
		filterToDoList(true);
		sortToDoList();
	},
	url:"./data/list_data.json"
};

function filterToDoList(status){
	const list = $$("todo_list");
	if (status === undefined){
		list.filter();
	} else {
		list.filter(function(obj){
			return obj.status === status;
		});
	}
}

function sortToDoList(){
	$$("todo_list").sort("#star#", "desc", "string");
}
