$(function(){
	let all_tables = [];
	// let sel_state = [-1, [3, [0, 0]]];
	// let sel_state = {"table": -1, "controls": {"columnCount": 0, "rowAndcolumn": [0, -1]}};
	let sel_state = {"table": -1, "controls": {"columnCount": 0, "rowAndcolumn": resetRowAndColumn([0, [-1, []]])}};
	$("div#set-2, div#set-3, div#set-3 div#opt-2, div#set-4").css("display", "none");
	$("div#set-1 input#cash-table-name").val("").focus();
	
	
	$("div#set-1 a").click(function(){
		let tableName = $("div#set-1 input#cash-table-name"), tableList = $("div#set-1 select");
		if(tableName.val() != ""){
			all_tables[all_tables.length] = [tableName.val(), []];
		}
		if(all_tables.length > 0){
			$("div#set-2").css("display", "block");
		}
		tableName.val("").focus();
		
		let struct = "";
		for(let i=0; i<all_tables.length; i++){
			struct += "<option value="+i+">"+all_tables[i][0]+"</option>";
		}
		tableList.html(struct);
		// sel_state.table = $("div#set-1 select").val();
		// sel_state.table = tableList.val();
		
		//if(tableList.val() != null){
		//if(sel_state.table >= 0){
			//tableList.find("option:eq("+tableList.val()+")").prop("selected", true);
			tableList.find("option:eq("+sel_state.table+")").prop("selected", true);
		//}
		
		return false;
	});
	$("div#set-1 input#cash-table-name").keyup(function(e){
		if(e.key == "Enter"){
			let tableList = $("div#set-1 select");
			if($(this).val() != ""){
				all_tables[all_tables.length] = [$(this).val(), []];
			}
			if(all_tables.length > 0){
				$("div#set-2").css("display", "block");
			}
			$(this).val("").focus();
			
			let struct = "";
			for(let i=0; i<all_tables.length; i++){
				struct += "<option value="+i+">"+all_tables[i][0]+"</option>";
			}
			tableList.html(struct);
			sel_state.table = $("div#set-1 select").val();
			
			//if(sel_state.table >= 0){
				tableList.find("option:eq("+sel_state.table+")").prop("selected", true);
			//}
		}
	});
	
	if($("div#set-1 select").val() != null){
		sel_state.table = $("div#set-1 select").val();
	}
	$("div#set-1 select").change(function(){
		sel_state.table = $(this).val();
		// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table], sel_state.controls.columnCount);
		// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table]);
		sel_state = process_table(all_tables[sel_state.table], sel_state);
	});
	
	// ROWS
	$("div#set-2 a").click(function(){
		let row_name = $("div#set-2 input#cash-row-name");
		if(all_tables[sel_state.table][1].length > 0){
			$("div#set-3").css("display", "block");
		}
		
		if(row_name.val() != ""){
			// all_tables[sel_state.table][1][all_tables[sel_state.table][1].length] = [0, 0, row_name.val(), 0];
			all_tables[sel_state.table][1][all_tables[sel_state.table][1].length] = generateRow(row_name.val());
			// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table], sel_state.controls.columnCount);
			// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table]);
		}
		row_name.val("").focus();
		sel_state = process_table(all_tables[sel_state.table], sel_state);
	});
	$("div#set-2 input#cash-row-name").keyup(function(e){
		if(e.key == "Enter"){
			if($(this).val() != ""){
				// all_tables[sel_state.table][1][all_tables[sel_state.table][1].length] = [0, 0, $(this).val(), 0];
				all_tables[sel_state.table][1][all_tables[sel_state.table][1].length] = generateRow($(this).val());
				// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table], sel_state.controls.columnCount);
				// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table]);
			}
			if(all_tables[sel_state.table][1].length > 0){
				$("div#set-3").css("display", "block");
			}
			$(this).val("").focus();
			sel_state = process_table(all_tables[sel_state.table], sel_state);
		}
	});
	
	// COLUMNS
	$("div#set-3 div#opt-1 a#add-column").click(function(){
		sel_state.controls.columnCount += 1;
		$("div#set-4 input#cell-data").val("");
		let column_name = $(this).closest('div').find('input#cash-column-name');
		
		if(sel_state.controls.rowAndcolumn[1][0] >= 0){
			if(column_name.val() != ""){
				/* all_tables[sel_state.table][1].forEach((row, i) => { // Each row
					all_tables[sel_state.table][1][i][4][sel_state.controls.rowAndcolumn[1][0]][0] = column_name.val();
				}); */
				sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]] = column_name.val();
				// $('div#set-3 div#opt-2').css('display', 'none');
			}
		}else{
			sel_state.controls.rowAndcolumn = resetRowAndColumn(sel_state.controls.rowAndcolumn);
			// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table], column_name.val());
			let [sel_table, rowAndcolumn] = column_processor([all_tables[sel_state.table], sel_state.controls.rowAndcolumn], column_name.val());
			all_tables[sel_state.table] = sel_table;
			sel_state.controls.rowAndcolumn = rowAndcolumn;
			column_name.val("");
		}
		
		column_name.focus();
		sel_state = process_table(all_tables[sel_state.table], sel_state);
	});
	$("div#set-3 input#cash-column-name").keyup(function(e){
		if(e.key == "Enter"){
			sel_state.controls.columnCount += 1;
			$("div#set-4 input#cell-data").val("");
			// let getInput = $(this).closest('div').find('input');
			
			if(sel_state.controls.rowAndcolumn[1][0] >= 0){
				if($(this).val() != ""){
					/* all_tables[sel_state.table][1].forEach((row, i) => { // Each row
						// console.log(all_tables[sel_state.table][1][i]);
						all_tables[sel_state.table][1][i][4][sel_state.controls.rowAndcolumn[1][0]][0] = $(this).val();
					}); */
					sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]] = $(this).val();
					// $('div#set-3 div#opt-2').css('display', 'none');
				}
			}else{
				sel_state.controls.rowAndcolumn = resetRowAndColumn(sel_state.controls.rowAndcolumn);
				// all_tables[sel_state.table] = column_processor(all_tables[sel_state.table], $(this).val());
				let [sel_table, rowAndcolumn] = column_processor([all_tables[sel_state.table], sel_state.controls.rowAndcolumn], $(this).val());
				all_tables[sel_state.table] = sel_table;
				sel_state.controls.rowAndcolumn = rowAndcolumn;
				$(this).val("");
			}
			// console.log(all_tables[sel_state.table]);
			
			$(this).focus();
			sel_state = process_table(all_tables[sel_state.table], sel_state);
		}
	});
	$('div#set-3 div#opt-2 a#remove-column').click(function(e){ // Remove selected column
		// e.preventDefault();

		all_tables[sel_state.table][1].forEach((row, i) => { // Each row
			// console.log(all_tables[sel_state.table][1][i]);
			all_tables[sel_state.table][1][i][4].splice(sel_state.controls.rowAndcolumn[1][0], 1); // Remove the selected column
		});
		sel_state.controls.rowAndcolumn[1][1].splice(sel_state.controls.rowAndcolumn[1][0], 1); // Remove the selected column
		
		sel_state.controls.rowAndcolumn[1][0] = -1;
		sel_state = process_table(all_tables[sel_state.table], sel_state);
	});
	
	// UPDATE A CELL
	$("div#set-4 a").click(function(){
		let input_elem = $("div#set-4 input#cell-data");
		if(input_elem.val() !== ""){
			let row = sel_state.controls.rowAndcolumn[0];
			let cell = sel_state.controls.rowAndcolumn[1][0];
			// all_tables[sel_state.table][1][row][cell] = $("div#set-4 input#cell-data").val();
			all_tables[sel_state.table][1][row][4][cell] = input_elem.val();
			
			sel_state.controls.rowAndcolumn[0] = 0;
			sel_state.controls.rowAndcolumn[1][0] = -1;
			// $("div#set-4 input#cell-data").val("").focus();
			input_elem.val("");
			sel_state = process_table(all_tables[sel_state.table], sel_state);
		}
	});
	$("div#set-4 input#cell-data").keyup(function(e){
		if(e.key == "Enter" && $(this).val() !== ""){
			let row = sel_state.controls.rowAndcolumn[0];
			let cell = sel_state.controls.rowAndcolumn[1][0];
			all_tables[sel_state.table][1][row][4][cell] = $(this).val();
			
			sel_state.controls.rowAndcolumn[0] = 0;
			sel_state.controls.rowAndcolumn[1][0] = -1;
			// $(this).val("").focus();
			$(this).val("");
			sel_state = process_table(all_tables[sel_state.table], sel_state);
		}
	});
});

/* function column_processor(sel_table, new_i){
	let allRows = sel_table[1];
	if(allRows.length > 0){
		for(var i=0; i<allRows.length; i++){ // Loop through all rows
			let this_i = new_i - (allRows[i].length-1); // Subtract existing columns from new column count
			// console.log(new_i, this_i);
			for(var j=0; j<this_i; j++){ // Loop through new columns
				sel_table[1][i][sel_table[1][i].length] = 0; // Add new column with 0 value
			}
		}
	}
	return sel_table;
} */
// function column_processor(sel_table, column_name=""){
function column_processor(data, column_name=""){
	// let allRows = sel_table[1];
	let allRows = data[0][1];
	if(allRows.length > 0){
		for(var i=0; i<allRows.length; i++){ // Loop through all rows
			// sel_table[1][i][4].push([column_name, 0]); // Add new column with 0 value. Index 4 is the columns array
			data[0][1][i][4].push(0); // Add new column with 0 value. Index 4 is the columns array
		}
		data[1][1][1].push(column_name);
		
		$('div#set-4').css('display', 'none');
		// if(sel_table[1][0][4].length > 0){
		if(data[0][1][0][4].length > 0){
			$('div#set-4').css('display', 'block');
		}
	}
	// return sel_table;
	return data;
}

function process_table(sel_table, sel_state){
	let stat_struct = "";
	
	let allRows = sel_table[1];
	if(allRows.length > 0){
		let eachColumnsTotal = [0, []]; // Total & other columns
		let firstRow = sel_table[1][0]; // The very first row

		firstRow[4].map(col => eachColumnsTotal[1].push(0)); // Create a base value for the other columns
		sel_table[1].map((row, i) => { // Each row
			sel_table[1][i][3] = 0; // Reset before adding up.
			row[4].map((cell, j) => { // Each item in index 4, which is the columns array
				// let cell_num = Number(cell[1]);
				let cell_num = cell;
				// if(!isNaN(cell_num)){
					eachColumnsTotal[1][j] = sum_1([eachColumnsTotal[1][j], cell_num], 2); // Get the total sum-up of each column.
					sel_table[1][i][3] = sum_1([sel_table[1][i][3], cell_num], 2); // Add up all the numbers into total column
					// console.log("i: "+i, ", j: "+j, ", Cell: ", cell_num, ", Total: "+sel_table[1][i][3]);
				// }
			})
		})
		eachColumnsTotal[1].map(cell => eachColumnsTotal[0] = sum_1([eachColumnsTotal[0], cell], 2));

		// let get_pos = function(allRows, new_data=[[], [], [-1, 0]], n=[[0, 1], [], 0]){
		let get_pos = function(allRows, total, new_data=[[], [], [-1, 0]], n=[[0, 1], [], 0]){
			if(new_data[0].length < allRows.length){
				if(new_data[1].length == 0){ // On the very first call
					for(let i=0; i<allRows.length; i++){
						new_data[1].push(i) // Collect all index of each row
					}
				}
				let this_i_1 = new_data[1][n[0][0]]; // Get a row's index but on the very first call, get the first row
				// let curr_amount = allRows[this_i_1][3]; // Column called total of that row
				let curr_amount = total >= 0 ? allRows[this_i_1][4][total] : allRows[this_i_1][3];
				
				// Compare current & next row's amount
				if(n[2] == 0){
					// n[0][0] & n[0][1] is getting the current & next row's index
					if(new_data[1].length > 1 && n[0][1] < new_data[1].length){ // Proceed if size is larger than the first current & next row
						let this_i_2 = new_data[1][n[0][1]]; // Get the next row's index
						// let nxt_amount = allRows[this_i_2][3]; // Column called total of that row
						let nxt_amount = total >= 0 ? allRows[this_i_2][4][total] : allRows[this_i_2][3];
						
						if(curr_amount >= nxt_amount){ // Greater or Equal
							n[0][1] += 1; // Increment to the next row index
							
							if(n[0][1] >= new_data[1].length){ // When all the rows are done
								n[2] = 1;
							}
						}else{ // Less
							n[0][0] = n[0][1]; // Make next the current row
							n[0][1] = n[0][0]+1; // Increment to the next row
						}
					}else{
						n[2] = 1;
					}
					// Once 1 iteration is successfully done here, switch to the next block.
				}
				
				// Process & apply the position of the row
				if(n[2] == 1){
					// new_data[2] contains an amount & position of the row. Index 0 (amount) is -1 because if it's 0, it'll be equal to index 1.
					if(new_data[2][0] != curr_amount){
						new_data[2][1] += 1; // Increment Position when not equal with previous value
					}
					allRows[this_i_1][1] = new_data[2][1]; // Assign the current row's position to the new position
					new_data[0].push(allRows[this_i_1]) // Get a new row arrangement (of position by amount) according to the column called total 
					new_data[1].splice(n[0][0], 1); // Remove the current row from the list of rows to be processed
					
					new_data[2][0] = curr_amount;
					n[0] = [0, 1]; // Reset the current & next row index to 0 & 1 respectively
					
					n[2] = 0;

					// Once 1 iteration is successfully done here, switch to the previous block.
				}
				
				// return get_pos(allRows, new_data, n);
				return get_pos(allRows, total, new_data, n);
			}else{
				for(let i=0; i<new_data[0].length; i++){
					new_data[0][i][0] = i+1; // Number rows
				}
				
				allRows = new_data[0];
				return allRows;
			}
		}
		// sel_table[1] = get_pos(sel_table[1]);
		sel_table[1] = get_pos(sel_table[1], sel_state.controls.rowAndcolumn[1][0]);

		// # TABLE MAKE-UP
		// Head/Caption row
		stat_struct += "<li class='row grps-head'>"; // Create a head/caption row using the structure of the first row.
			stat_struct += "<div class='column grps-num'>";
				stat_struct += "<strong>S/N</strong>";
			stat_struct += "</div>";
			stat_struct += "<div class='column grps-num'>";
				stat_struct += "<strong>Pos.</strong>";
			stat_struct += "</div>";
			stat_struct += "<div class='column grps-names'>";
				stat_struct += "<strong>Name</strong>";
			stat_struct += "</div>";
			stat_struct += "<div class='column grps-total grps-data'>";
				stat_struct += "<strong>Total</strong>";
			stat_struct += "</div>";
			firstRow[4].map((col, i) => {
				stat_struct += "<div class='column grps-data column-cap";
				stat_struct += sel_state.controls.rowAndcolumn[1][0] == i ? " selected" : "";
				stat_struct += "'>";
					stat_struct += "<strong>";
						// stat_struct += col[0] == "" ? "Cap. "+(i+1) : col[0];
						stat_struct += sel_state.controls.rowAndcolumn[1][1][i] == "" ? "Cap. "+(i+1) : sel_state.controls.rowAndcolumn[1][1][i];
					stat_struct += "</strong>";
				stat_struct += "</div>";
			});
		stat_struct += "</li>";
			
		// Row to hold totals of every column
		stat_struct += "<li class='row grps-head'>"; // Now create a second row to hold the total of every column using the structure of the first row.
			stat_struct += "<div class='column grps-num'></div>";
			stat_struct += "<div class='column grps-num'></div>";
			stat_struct += "<div class='column grps-names'></div>";
			stat_struct += "<div class='column grps-total grps-data'><strong>"+filter_currency(eachColumnsTotal[0])+"</strong></div>";
			firstRow[4].map((col, i) => {
				stat_struct += "<div class='column grps-data";
				stat_struct += sel_state.controls.rowAndcolumn[1][0] == i ? " sel-column" : "";
				stat_struct += "'>";
					// stat_struct += "<strong>"+filter_currency(eachColumnsTotal[col[1]])+"</strong>";
					stat_struct += "<strong>"+filter_currency(eachColumnsTotal[1][i])+"</strong>";
				stat_struct += "</div>";
			});
		stat_struct += "</li>";
		// console.log(stat_struct)

		// Every other row or the tables actual body. Subsequent body rows.
		sel_table[1].map((row, i) => { // Each row
			stat_struct += "<li id='"+i+"' class='row grps-body'>";
				stat_struct += "<div class='column grps-num'>"+row[0]+"</div>";
				stat_struct += "<div class='column grps-num'>"+row[1]+"</div>";
				stat_struct += "<div class='column grps-names'>"+row[2]+"</div>";
				stat_struct += "<div class='column grps-total grps-data'><strong>"+filter_currency(row[3])+"</strong></div>";
				row[4].map((cell, j) => { // Each item in index 4, which is the columns array
					stat_struct += "<div class='column grps-data";
					if(sel_state.controls.rowAndcolumn[1][0] == j){
						if(sel_state.controls.rowAndcolumn[0] < 2){
							stat_struct += " sel-column";
						}else if(sel_state.controls.rowAndcolumn[0] == i+2){
							stat_struct += " selected";
						}else{
							stat_struct += "";
						}
					}
					// stat_struct += sel_state.controls.rowAndcolumn[1][0] == j && sel_state.controls.rowAndcolumn[0] < 2 ? "sel-column" : "";
					stat_struct += "'>";
						// stat_struct += "<span>"+filter_currency(eachColumnsTotal[cell[1]])+"</span>";
						stat_struct += "<span>"+filter_currency(cell)+"</span>";
					stat_struct += "</div>";
				})
			stat_struct += "</li>";
		})
	}else{
		stat_struct += "<li></li>";
	}
	$("ul#set-1").empty().html(stat_struct);
	
	$("ul#set-1 li.grps-body div.grps-data").click(function(){
		// if($(this).attr("id") > 3){
		if($(this).index() > 3){
			if(!$(this).is('.selected')){
				$("ul#set-1 li div.grps-data").removeClass("selected");
				$(this).addClass("selected");
				// let row = $(this).closest("li").attr("id"), cell = $(this).attr("id");
				let row = $(this).closest("li.grps-body").index()-2, cell = $(this).index()-4;
				
				sel_state.controls.rowAndcolumn[0] = row;
				sel_state.controls.rowAndcolumn[1][0] = cell;
				let sel_cell = sel_table[1][row][4][cell];
				$("div#set-4 input#cell-data").val(parseFloat(sel_cell)).focus();
			}else{
				$("ul#set-1 li div.grps-data").removeClass("selected");
				$("div#set-4 input#cell-data").val("");
				sel_state.controls.rowAndcolumn[1][0] = -1;
			}
		}
	});

	$('ul#set-1 li.grps-head div.column-cap').hover(
		function(){
			let col_cap = $(this);
			if(!col_cap.is(".selected")){
				selectedColumn(col_cap, true);
			}
		},
		function(){
			let col_cap = $(this);
			if(!col_cap.is(".selected")){
				selectedColumn(col_cap, false);
			}
		}
	).click(function(){
		if($(this).is(".selected")){ // Remove selected column's class
			$("ul#set-1 li.row div.column").removeClass("sel-column");

			$(this).removeClass("selected");
			selectedColumn($(this), false);
			$('div#set-3 div#opt-2').css('display', 'none');
			
			$("div#set-3 div#opt-1 input#cash-column-name").val("");
			sel_state.controls.rowAndcolumn[1][0] = -1;
			sel_state = process_table(sel_table, sel_state);
		}else{ // Add selected column's class
			$('ul#set-1 li.grps-head div.column-cap').removeClass("selected");
			$("ul#set-1 li.row div.column").removeClass("sel-column");
			
			$(this).addClass("selected");
			selectedColumn($(this), true);
			$('div#set-3 div#opt-2').css('display', 'block');
			sel_state.controls.rowAndcolumn[1][0] = $(this).index()-4; // Get the index of the column cap - 4 because of the first 3 columns (S/N, Pos. & Name)
			
			$("div#set-3 div#opt-1 input#cash-column-name").val("").focus();
			// if(sel_table[1][0][4][sel_state.controls.rowAndcolumn[1][0]][0] !== ""){
			if(sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]] !== ""){
				// $("div#set-3 div#opt-1 input#cash-column-name").val(sel_table[1][0][4][sel_state.controls.rowAndcolumn[1][0]][0]).focus();
				$("div#set-3 div#opt-1 input#cash-column-name").val(sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]]).focus();
			}
			// console.log(sel_state.controls.rowAndcolumn, sel_table[1]);
			sel_state = process_table(sel_table, sel_state);
		}
	});
	
	return sel_state;
}

function sum_1(data, mode){
	if(mode == 2){
		return parseFloat(data[0]) + parseFloat(data[1]);
	}
	if(mode == 1){
		return parseFloat(data[0]) * parseFloat(data[1]);
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

function generateRow(rowName){
	return [0, 0, rowName, 0.00, []]; // Position, Serial Number, Name, Total, numbers array
}

function selectedColumn(col_cap, selStates=true){
	let col_index = col_cap.index();
	// console.log($(this).attr("id"));
	if(selStates){ // Column Cap selected state
		$("ul#set-1 li.row").each(function(){
			let li = $(this);
			$(this).find("div.column").each(function(){
				let cell = $(this).index();
				if(cell == col_index && li.index() > 0){
					$(this).addClass("sel-column");
					// console.log("Cell: "+$(this).index());
				}
			})
		})
	}else{
		$("ul#set-1 li.row").each(function(){
			let li = $(this);
			$(this).find("div.column").each(function(){
				let cell = $(this).index();
				if(cell == col_index && li.index() > 0){
					$(this).removeClass("sel-column");
				}
			})
		})
	}
}

function resetRowAndColumn(rowAndcolumn){
	// return [0, -1];
	return [0, [-1, rowAndcolumn[1][1].length > 0 ? rowAndcolumn[1][1] : []]];
}