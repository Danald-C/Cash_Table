$(function(){
	let all_data = [];
	let sel_state = [-1, [3, [0, 0]]];
	$("div#set-2, div#set-3").css("display", "none");
	$("div#set-1 input#cash-subj").val("").focus();
	
	
	$("div#set-1 a").click(function(){
		let get_c_subj = $("div#set-1 input#cash-subj"), sel_c_subj = $("div#set-1 select");
		if(get_c_subj.val() != ""){
			all_data[all_data.length] = [get_c_subj.val(), []];
		}
		if(all_data.length > 0){
			$("div#set-2").css("display", "block");
		}
		get_c_subj.val("").focus();
		
		let struct = "";
		for(let i=0; i<all_data.length; i++){
			struct += "<option value="+i+">"+all_data[i][0]+"</option>";
		}
		sel_c_subj.html(struct);
		sel_state[0] = $("div#set-1 select").val();
		
		//if(sel_c_subj.val() != null){
		//if(sel_state[0] >= 0){
			//sel_c_subj.find("option:eq("+sel_c_subj.val()+")").prop("selected", true);
			sel_c_subj.find("option:eq("+sel_state[0]+")").prop("selected", true);
		//}
		
		return false;
	});
	$("div#set-1 input#cash-subj").keyup(function(e){
		if(e.key == "Enter"){
			let sel_c_subj = $("div#set-1 select");
			if($(this).val() != ""){
				all_data[all_data.length] = [$(this).val(), []];
			}
			if(all_data.length > 0){
				$("div#set-2").css("display", "block");
			}
			$(this).val("").focus();
			
			let struct = "";
			for(let i=0; i<all_data.length; i++){
				struct += "<option value="+i+">"+all_data[i][0]+"</option>";
			}
			sel_c_subj.html(struct);
			sel_state[0] = $("div#set-1 select").val();
			
			//if(sel_state[0] >= 0){
				sel_c_subj.find("option:eq("+sel_state[0]+")").prop("selected", true);
			//}
		}
	});
	
	if($("div#set-1 select").val() != null){
		sel_state[0] = $("div#set-1 select").val();
	}
	$("div#set-1 select").change(function(){
		sel_state[0] = $(this).val();
		all_data[sel_state[0]] = column_processor(all_data[sel_state[0]], sel_state[1][0]);
		sel_state = process_table(all_data[sel_state[0]], sel_state);
	});
	
	$("div#set-2 a").click(function(){
		let get_c_name = $("div#set-2 input#cash-subj-name");
		if(all_data[sel_state[0]][1].length > 0){
			$("div#set-3").css("display", "block");
		}
		
		if(get_c_name.val() != ""){
			all_data[sel_state[0]][1][all_data[sel_state[0]][1].length] = [0, 0, get_c_name.val(), 0];
			all_data[sel_state[0]] = column_processor(all_data[sel_state[0]], sel_state[1][0]);
		}
		get_c_name.val("").focus();
		sel_state = process_table(all_data[sel_state[0]], sel_state);
	});
	$("div#set-2 input#cash-subj-name").keyup(function(e){
		if(e.key == "Enter"){
			if($(this).val() != ""){
				all_data[sel_state[0]][1][all_data[sel_state[0]][1].length] = [0, 0, $(this).val(), 0];
				all_data[sel_state[0]] = column_processor(all_data[sel_state[0]], sel_state[1][0]);
			}
			if(all_data[sel_state[0]][1].length > 0){
				$("div#set-3").css("display", "block");
			}
			$(this).val("").focus();
			sel_state = process_table(all_data[sel_state[0]], sel_state);
		}
	});
	
	$("div#set-3 a").click(function(){
		sel_state[1][0] += 1;
		sel_state[1][1] = [0, 0];
		$("div#set-4 input#cell-data").val("");
		
		all_data[sel_state[0]] = column_processor(all_data[sel_state[0]], sel_state[1][0]);
		sel_state = process_table(all_data[sel_state[0]], sel_state);
	});
	
	$("div#set-4 a").click(function(){
		let row = sel_state[1][1][0];
		let cell = sel_state[1][1][1];
		all_data[sel_state[0]][1][sel_state[1][1][0]][sel_state[1][1][1]] = $("div#set-4 input#cell-data").val();
		sel_state = process_table(all_data[sel_state[0]], sel_state);
		$("div#set-4 input#cell-data").val("").focus();
	});
	$("div#set-4 input#cell-data").keyup(function(e){
		if(e.key == "Enter"){
			let row = sel_state[1][1][0];
			let cell = sel_state[1][1][1];
			all_data[sel_state[0]][1][sel_state[1][1][0]][sel_state[1][1][1]] = $(this).val();
			sel_state = process_table(all_data[sel_state[0]], sel_state);
			$(this).val("").focus();
		}
	});
});

function column_processor(all_data, new_i){
	if(all_data[1].length > 0){
		for(var i=0; i<all_data[1].length; i++){
			let this_i = new_i - (all_data[1][i].length-1);
			for(var j=0; j<this_i; j++){
				all_data[1][i][all_data[1][i].length] = 0;
			}
		}
	}
	return all_data;
}

function process_table(all_data, sel_state){
	let stat_struct = "";
	
	if(all_data[1].length > 0){
		let all_cols = [];
		for(var i=2; i<sel_state[1][0]; i++){
			all_cols[all_cols.length] = 0;
		}
		for(var i=0; i<all_data[1].length; i++){
			let total_sum = 0.00, col_cnt = 0;
			for(let j=4; j<all_data[1][i].length; j++){
				total_sum = sum_1([total_sum, Number(all_data[1][i][j])], 2);
				//all_cols = get_col_data(all_data[1][i], all_cols, j);
			}
			all_data[1][i][3] = total_sum;
			
			for(let j=3; j<all_data[1][i].length; j++){
				all_cols[col_cnt] = sum_1([all_cols[col_cnt], Number(all_data[1][i][j])], 2);
				
				col_cnt++;
			}
		}
		
		let get_pos = function(incoming_data, new_data=[[], [], [-1, 0]], n=[[0, 1], [], 0]){
			if(new_data[0].length < incoming_data.length){
				if(new_data[1].length == 0){ // On the very first call
					for(let i=0; i<incoming_data.length; i++){
						new_data[1][new_data[1].length] = i; // Collect all indexes
					}
				}
				let this_i_1 = new_data[1][n[0][0]];
				
				let curr_amount = incoming_data[this_i_1][3];
				
				if(n[2] == 0){
					if(new_data[1].length > 1 && n[0][1] < new_data[1].length){
						let this_i_2 = new_data[1][n[0][1]];
						
						let nxt_amount = incoming_data[this_i_2][3];
						
						if(curr_amount >= nxt_amount){ // Greater or Equal
							n[0][1] += 1;
							
							if(n[0][1] >= new_data[1].length){
								n[2] = 1;
							}
						}else{ // Less
							n[0][0] = n[0][1];
							n[0][1] = n[0][0]+1;
						}
					}else{
						n[2] = 1;
					}
				}
				
				if(n[2] == 1){
					if(new_data[2][0] != curr_amount){
						new_data[2][1] += 1; // Increment Position when not equal with previous value
					}
					incoming_data[this_i_1][1] = new_data[2][1];
					new_data[0][new_data[0].length] = incoming_data[this_i_1];
					new_data[1].splice(n[0][0], 1);
					
					new_data[2][0] = curr_amount;
					n[0][0] = 0;
					n[0][1] = 1;
					
					n[2] = 0;
				}
				
				return get_pos(incoming_data, new_data, n);
			}else{
				for(let i=0; i<new_data[0].length; i++){
					new_data[0][i][0] = i+1; // Number rows
				}
				
				incoming_data = new_data[0];
				return incoming_data;
			}
		}
		all_data[1] = get_pos(all_data[1]);
		
		// # GROUPS
		stat_struct += "<li class='grps-head'>";
		for(var i=0; i<all_data[1][0].length; i++){ // Head Row
			stat_struct += "<div class='";
			if(i < 2){
				stat_struct += "grps-num ";
			}
			if(i == 3){
				stat_struct += "grps-total ";
			}
			if(i == 2){
				stat_struct += "grps-names ";
			}
			if(i > 2){
				stat_struct += "grps-data ";
			}
			//stat_struct += (sel_r_c[0][1] == i) ? "selected" : "";
			stat_struct += "'>";
			if(i < 3){
				if(i == 0){
					stat_struct += "<strong>S/N</strong>";
				}
				if(i == 1){
					stat_struct += "<strong>Pos.</strong>";
				}
				if(i == 2){
					stat_struct += "<strong>Group Names</strong>";
				}
				if(i > 2){ // Total column
					stat_struct += "<strong>Total</strong>";
				}
			}else{ // Subsequent columns
				stat_struct += "<strong>Cap. "+(i-2)+"</strong>";
			}
			stat_struct += "</div>";
		}
		stat_struct += "</li>";
		
		stat_struct += "<li class='grps-total'>";
		for(var i=0; i<all_data[1][0].length; i++){ // Head Row
			stat_struct += "<div class='";
			if(i < 2){
				stat_struct += "grps-num ";
			}
			if(i == 3){
				stat_struct += "grps-total ";
			}
			if(i == 2){
				stat_struct += "grps-names ";
			}
			if(i > 2){
				stat_struct += "grps-data ";
			}
			//stat_struct += (sel_r_c[0][1] == i) ? "selected" : "";
			stat_struct += "'>";
			if(i > 2){
				stat_struct += "<strong>"+filter_currency(all_cols[i-3])+"</strong>";
			}
			stat_struct += "</div>";
		}
		stat_struct += "</li>";
		
		for(var i=0; i<all_data[1].length; i++){ // Head Row
			stat_struct += "<li id='"+i+"' class='grps-body'>";
			for(var j=0; j<all_data[1][i].length; j++){ // Head Row
				stat_struct += "<div id='"+j+"' class='";
				if(j < 2){
					stat_struct += "grps-num ";
				}
				if(j == 3){
					stat_struct += "grps-total ";
				}
				if(j == 2){
					stat_struct += "grps-names ";
				}
				if(j > 2){
					stat_struct += "grps-data ";
				}
				//stat_struct += (sel_r_c[0][1] == i) ? "selected" : "";
				stat_struct += "'>";
					if(j > 3){
						stat_struct += "<span>";
					}
					if(j == 3){
						stat_struct += "<strong>";
					}
					if(j > 2){
						stat_struct += filter_currency(all_data[1][i][j]);
					}else{
						stat_struct += all_data[1][i][j];
					}
					if(j > 3){
						stat_struct += "</span>";
					}
					if(j == 3){
						stat_struct += "</strong>";
					}
				stat_struct += "</div>";
			}
			stat_struct += "</li>";
		}
	}else{
		stat_struct += "<li></li>";
	}
	$("ul#set-1").empty().html(stat_struct);
	
	$("ul#set-1 li.grps-body div.grps-data").click(function(){
		if($(this).attr("id") > 3){
			$("ul#set-1 li div.grps-data").removeClass("selected");
			$(this).addClass("selected");
			let row = $(this).closest("li").attr("id"), cell = $(this).attr("id");
			
			sel_state[1][1][0] = row;
			sel_state[1][1][1] = cell;
			let sel_cell = all_data[1][row][cell];
			$("div#set-4 input#cell-data").val(sel_cell).focus();
		}
	});
	
	return sel_state;
}

function sum_1(data, mode){
	if(mode == 2){
		return data[0] + data[1];
	}
	if(mode == 1){
		return data[0] * data[1];
	}
}

function filter_currency(num, per, places){
	if(per == undefined){ per = 3; }
	if(places == undefined){ places = 2; }
	
	if(places == 0){ num = Math.round(num); }
	
	var cString = num.toString(), cDot = cString.indexOf("."), cWhole = "", cDec = "";
	if(cDot == -1){
		cWhole = cString;
		cDec = 0;
	}else{
		cWhole = cString.substring(0, cDot);
		cDec = cString.substring(cDot+1);
	}
	
	var aComma = "", count = 0;
	if(cWhole.length > per){
		for(var i=(cWhole.length-1); i>=0; i--){
			aComma = cWhole.charAt(i) + aComma;
			count++;
			if(count == per && i != 0){
				aComma = "," + aComma;
				count = 0;
			}
		}
	}else{
		aComma = cWhole;
	}
	
	if(places == 0){
		cDec = "";
	}else{
		cDec = +("0." + cDec);
		cDec = cDec.toFixed(places).toString().substring(1);
	}
	
	return aComma + cDec;
}