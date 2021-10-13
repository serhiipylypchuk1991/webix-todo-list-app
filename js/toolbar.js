const toolbar = {
	view:"toolbar",
	css:"webix_dark",
	height:45,
	paddingX:6,
	elements:[
		{ view:"label", width:30, label:"<span class='webix_icon mdi mdi-playlist-check'></span>" },
		{ view:"label", width:130, label:"Webix ToDoList" },
		{ view:"button", id:"create_button", value:"+ Create", css:"webix_primary", tooltip:"Create new task", width:120, click:createNewTaskHandler },
		{ view:"search", id:"search_input", clear:"hover", minWidth:150, maxWidth:500,
			on:{
				onTimedKeyPress:searchHandler
			}
		},
		{},
		{ view:"segmented", id:"segmented", width:240,
			options:[
				{ id:1, value:"Active" },
				{ id:2, value:"Completed" }
			],
			on:{ onChange:toggleHandler }
		}
	]
};

function toggleHandler(id){
	const button = $$("create_button");
	if(id == 2){
		filterToDoList(false);
		button.hide();
	}else{
		filterToDoList(true);
		button.show();
	}
}

function searchHandler(){
	const search_value = $$("search_input").getValue().toLowerCase();
	const segmented_value = $$("segmented").getValue();
	$$("todo_list").filter(function(obj){
		if(segmented_value == 2){
			return !obj.status && obj.task.toLowerCase().indexOf(search_value) !== -1;
		}else{
			return obj.status && obj.task.toLowerCase().indexOf(search_value) !== -1;
		}
	});
}

function createNewTaskHandler(){
	const list = $$("todo_list");
	filterToDoList();
	const item = list.add({ task:"New Task", status:true, star:false });
	filterToDoList(true);
	list.showItem(item);
	list.select(item);
	list.edit(item);
}
