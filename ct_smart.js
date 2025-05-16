$(function(){
	let all_tables = [];
	// let sel_state = {"table": -1, "controls": {"columnCount": 0, "rowAndcolumn": resetRowAndColumn([-1, [-1, []]])}};
	let sel_state = screenDefault();
	
	
	$("div#set-1 a.save-table").click(function(){
		saveToExcel();
	});
	$("div#set-1 a.add").click(function(){
		[all_tables, sel_state] = createTable($("div#set-1 input#cash-table-name"), all_tables, sel_state);
		
		return false;
	});
	$("div#set-1 input#cash-table-name").keyup(function(e){
		if(e.key == "Enter"){
			[all_tables, sel_state] = createTable($(this), all_tables, sel_state);
		}
	});
	
	if($("div#set-1 select").val() != null){
		sel_state.table = $("div#set-1 select").val();
	}
	$("div#set-1 select").change(function(){
		sel_state.table = $(this).val();
		sel_state.controls.rowAndcolumn[1][1] = all_tables[sel_state.table][2];
		sel_state = screenDefault(all_tables, sel_state);
		sel_state = process_table(all_tables[sel_state.table], sel_state);
		$('table#set-1 tr.grps-body').each(function(){
			sel_state = selectColumn($(this), all_tables[sel_state.table], sel_state, 1)
		});
	});
	
	// ROWS
	$("div#set-2 div#opt-1 a.add").click(function(){
		[all_tables, sel_state] = addRow($("div#set-2 input#cash-row-name"), all_tables, sel_state);
	});
	$("div#set-2 input#cash-row-name").keyup(function(e){
		if(e.key == "Enter"){
			[all_tables, sel_state] = addRow($(this), all_tables, sel_state);
		}
	});
	$('div#set-2 div#opt-2 a#remove-row').click(function(e){ // Remove selected row
		all_tables[sel_state.table][1].splice(sel_state.controls.rowAndcolumn[0], 1)
		sel_state.controls.rowAndcolumn[0] = -1;
		if(all_tables[sel_state.table][1].length > 0){
			sel_state = process_table(all_tables[sel_state.table], sel_state);
		}else{
			all_tables[sel_state.table][2] = [];
			sel_state.controls.rowAndcolumn[1][1] = all_tables[sel_state.table][2];
			sel_state = screenDefault(all_tables, sel_state);
		}
	});
	
	// COLUMNS
	$("div#set-3 div#opt-1 a#add-column").click(function(){
		[all_tables, sel_state] = addColum($(this).closest('div').find('input#cash-column-name'), all_tables, sel_state);
	});
	$("div#set-3 input#cash-column-name").keyup(function(e){
		if(e.key == "Enter"){
			[all_tables, sel_state] = addColum($(this), all_tables, sel_state);
		}
	});
	$('div#set-3 div#opt-2 a#remove-column').click(function(e){ // Remove selected column
		// e.preventDefault();

		all_tables[sel_state.table][1].forEach((row, i) => { // Each row
			// console.log(all_tables[sel_state.table][1][i]);
			all_tables[sel_state.table][1][i][4].splice(sel_state.controls.rowAndcolumn[1][0], 1); // Remove the selected column on the body
		});
		all_tables[sel_state.table][2].splice(sel_state.controls.rowAndcolumn[1][0], 1); // Remove the selected column on the caption
		// sel_state.controls.rowAndcolumn[1][1].splice(sel_state.controls.rowAndcolumn[1][0], 1); // Remove the selected column on the caption
		sel_state.controls.rowAndcolumn[1][1] = all_tables[sel_state.table][2];
		
		sel_state.controls.rowAndcolumn[1][0] = -1;
		sel_state = process_table(all_tables[sel_state.table], sel_state);
	});
	
	// UPDATE A CELL
	$("div#set-4 a").click(function(){
		[all_tables, sel_state] = updateCell($("div#set-4 input#cell-data"), all_tables, sel_state);
	});
	$("div#set-4 input#cell-data").keyup(function(e){
		if(e.key == "Enter"){
			[all_tables, sel_state] = updateCell($(this), all_tables, sel_state);
		}
	});
});

function process_table(sel_table, sel_state){
	if(sel_table[1].length > 0){
		$("div#set-3").css("display", "block");
		$("table#set-1, div#set-1 a.save-table").css("display", "inline-block");
	}
	let stat_struct = "";
	
	let allRows = sel_table[1];
	if(allRows.length > 0){
		let eachColumnsTotal = [0, []]; // Total & other columns
		let firstRow = sel_table[1][0]; // The very first row

		firstRow[4].map(col => eachColumnsTotal[1].push(0)); // Create a base value for the other columns
		sel_table[1].map((row, i) => { // Each row
			sel_table[1][i][3] = 0; // Reset before adding up.
			row[4].map((cell, j) => { // Each item in index 4, which is the columns array
				let cell_num = cell;
				eachColumnsTotal[1][j] = sum_1([eachColumnsTotal[1][j], cell_num], 2); // Get the total sum-up of each column.
				sel_table[1][i][3] = sum_1([sel_table[1][i][3], cell_num], 2); // Add up all the numbers into total column
				// console.log("i: "+i, ", j: "+j, ", Cell: ", cell_num, ", Total: "+sel_table[1][i][3]);
			})
		})
		eachColumnsTotal[1].map(cell => eachColumnsTotal[0] = sum_1([eachColumnsTotal[0], cell], 2));

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
		stat_struct += "<thead>"; // Create a head/caption row using the structure of the first row.
			stat_struct += "<tr class='row grps-head'>";
				stat_struct += "<th class='column grps-num'>";
					// stat_struct += "<strong>S/N</strong>";
					stat_struct += "S/N";
				stat_struct += "</th>";
				stat_struct += "<th class='column grps-num'>";
					// stat_struct += "<strong>Pos.</strong>";
					stat_struct += "Pos.";
				stat_struct += "</th>";
				stat_struct += "<th class='column grps-names'>";
					// stat_struct += "<strong>Name</strong>";
					stat_struct += "Name";
				stat_struct += "</th>";
				stat_struct += "<th class='column grps-total grps-data'>";
					// stat_struct += "<strong>Total</strong>";
					stat_struct += "Total";
				stat_struct += "</th>";
		console.log("sel_state.controls.rowAndcolumn[1][1]")
		console.log(sel_state.controls.rowAndcolumn[1][1])
				// firstRow[4].map((col, i) => {
				sel_state.controls.rowAndcolumn[1][1].map((col, i) => {
					stat_struct += "<th class='column grps-data column-cap";
					stat_struct += sel_state.controls.rowAndcolumn[1][0] == i ? " selected" : "";
					stat_struct += "'>";
						// stat_struct += "<strong>";
		// console.log(col)
							// stat_struct += sel_state.controls.rowAndcolumn[1][1][i] == "" ? "Cap. "+(i+1) : sel_state.controls.rowAndcolumn[1][1][i];
							stat_struct += col == "" ? "Cap. "+(i+1) : col;
						// stat_struct += "</strong>";
					stat_struct += "</th>";
				});
			stat_struct += "</tr>";
			
			// Row to hold totals of every column
			stat_struct += "<tr class='row grps-head'>"; // Now create a second row to hold the total of every column using the structure of the first row.
				stat_struct += "<th class='column grps-num'></th>";
				stat_struct += "<th class='column grps-num'></th>";
				stat_struct += "<th class='column grps-names'></th>";
				// stat_struct += "<th class='column grps-total grps-data'><strong>"+filter_currency(eachColumnsTotal[0])+"</strong></th>";
				stat_struct += "<th class='column grps-total grps-data'>"+filter_currency(eachColumnsTotal[0])+"</th>";
				// firstRow[4].map((col, i) => {
				sel_state.controls.rowAndcolumn[1][1].map((col, i) => {
					stat_struct += "<th class='column grps-total grps-data";
					stat_struct += sel_state.controls.rowAndcolumn[1][0] == i ? " sel-column" : "";
					stat_struct += "'>";
						// stat_struct += "<strong>"+filter_currency(eachColumnsTotal[1][i])+"</strong>";
						stat_struct += filter_currency(eachColumnsTotal[1][i]);
					stat_struct += "</th>";
				});
			stat_struct += "</tr>";
		stat_struct += "</thead>";
		
		// Every other row or the tables actual body. Subsequent body rows.
		stat_struct += "</tbody>";
		sel_table[1].map((row, i) => { // Each row
			stat_struct += "<tr id='"+i+"' class='row grps-body";
				stat_struct += sel_state.controls.rowAndcolumn[0] == i ? " sel-row selected" : "";
				stat_struct += "'>";
				stat_struct += "<td class='column grps-num'>"+row[0]+"</td>";
				stat_struct += "<th class='column grps-num'>"+row[1]+"</th>";
				stat_struct += "<td class='column grps-names ta-left'>";
					stat_struct += row[2] == "" ? "Row "+(parseInt(i)+1) : row[2];
				stat_struct += "</td>";
				stat_struct += "<th class='column grps-total grps-data'>"+filter_currency(row[3])+"</th>";
				row[4].map((cell, j) => { // Each item in index 4, which is the columns array
					stat_struct += "<td class='column grps-data";
					if(sel_state.controls.rowAndcolumn[1][0] == j){
						if(sel_state.controls.rowAndcolumn[0] < 2){
							stat_struct += " sel-column";
						}else if(sel_state.controls.rowAndcolumn[0] == i+2){
							stat_struct += " selected";
						}else{
							stat_struct += "";
						}
					}
					stat_struct += "'>";
					stat_struct += "<span>"+filter_currency(cell)+"</span>";
					stat_struct += "</td>";
				})
			stat_struct += "</tr>";
		})
		stat_struct += "</tbody>";
	}else{
		// stat_struct += "<li></li>";
		stat_struct += "<tr></tr>";
	}
	// $("ul#set-1").empty().html(stat_struct);
	$("table#set-1").empty().html(stat_struct);
	
	// $("ul#set-1 li.grps-body div.grps-data").click(function(){
	$("table#set-1 tr.grps-body th.grps-data, table#set-1 tr.grps-body td.grps-data").click(function(){
		if($(this).index() > 3){ // Only cells beyond total
			if(!$(this).is('.selected')){
				// $("ul#set-1 li div.grps-data").removeClass("selected");
				$("table#set-1 tr th.grps-data, table#set-1 tr td.grps-data").removeClass("selected");
				$(this).addClass("selected");
				// let row = $(this).closest("li.grps-body").index()-2, cell = $(this).index()-4;
				let row = $(this).closest("tr.grps-body").index(), cell = $(this).index()-4;
				// console.log(row)
				
				sel_state.controls.rowAndcolumn[0] = row;
				sel_state.controls.rowAndcolumn[1][0] = cell;
				let sel_cell = sel_table[1][row][4][cell];
				$("div#set-4 input#cell-data").val(filter_currency(parseFloat(sel_cell))).focus();
				sel_state = selectColumn($(this).closest("tr.grps-body"), sel_table, sel_state, 1)
				
				// $('div#set-4').css('display', 'none');
				// if(data[0][1][0][4].length > 0){
					$('div#set-4').css('display', 'block');
				// }
			}else{
				// $("ul#set-1 li div.grps-data").removeClass("selected");
				$("table#set-1 tr th.grps-data, table#set-1 tr td.grps-data").removeClass("selected");
				$("div#set-4 input#cell-data").val("");
				sel_state.controls.rowAndcolumn[1][0] = -1;
				sel_state = selectColumn($(this).closest("tr.grps-body"), sel_table, sel_state)
				$('div#set-4').css('display', 'none');
			}
		}
	});

	// $('ul#set-1 li.grps-head div.column-cap').hover(
	$('table#set-1 tr.grps-head th.column-cap, table#set-1 tr.grps-head td.column-cap').hover(
		function(){
			if(!$(this).is(".selected")){
				selectedColumn($(this), true);
			}
		},
		function(){
			if(!$(this).is(".selected")){
				selectedColumn($(this), false);
			}
		}
	).click(function(){
		if($(this).is(".selected")){ // Remove selected column's class
			// $("ul#set-1 li.row div.column").removeClass("sel-column");
			$("table#set-1 tr.row th.column, table#set-1 tr.row td.column").removeClass("sel-column");

			$(this).removeClass("selected");
			selectedColumn($(this), false);
			$('div#set-3 div#opt-2').css('display', 'none');
			
			$("div#set-3 div#opt-1 input#cash-column-name").val("");
			sel_state.controls.rowAndcolumn[1][0] = -1;
			sel_state = process_table(sel_table, sel_state);
		}else{ // Add selected column's class
			// $('ul#set-1 li.grps-head div.column-cap').removeClass("selected");
			$('table#set-1 tr.grps-head th.column-cap').removeClass("selected");
			// $("ul#set-1 li.row div.column").removeClass("sel-column");
			$("table#set-1 tr.row th.column, table#set-1 tr.row td.column").removeClass("sel-column");
			
			$(this).addClass("selected");
			selectedColumn($(this));
			$('div#set-3 div#opt-2').css('display', 'block');
			sel_state.controls.rowAndcolumn[1][0] = $(this).index()-4; // Get the index of the column cap - 4 because of the first 3 columns (S/N, Pos. & Name)
			
			$("div#set-3 div#opt-1 input#cash-column-name").val("").focus();
			if(sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]] !== ""){
				$("div#set-3 div#opt-1 input#cash-column-name").val(sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]]).focus();
			}
			sel_state = process_table(sel_table, sel_state);
		}
	});

	// $('ul#set-1 li.grps-body').hover(
	$('table#set-1 tr.grps-body').hover(
		function(){
			if(!$(this).is(".selected")){
				hoveredRow($(this))
			}
		},
		function(){
			if(!$(this).is(".selected")){
				hoveredRow($(this), false)
			}
		}
	).click(function(){
		if($(this).is(".selected")){
			sel_state = selectColumn($(this), sel_table, sel_state, 1)
		}else{
			sel_state = selectColumn($(this), sel_table, sel_state)
		}
		// console.log(sel_table[1], sel_state.controls.rowAndcolumn);
	})
	
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

function screenDefault(all_tables=[], sel_state={}){
	$("div#set-1 label, div#set-2").css("display", "none");
	$("div#set-1 a.save-table, table#set-1, div#set-2 div#opt-2, div#set-3, div#set-3 div#opt-2, div#set-4").css("display", "none");
	$("div#set-1 input#cash-table-name").val("").focus();
	$('table#set-1').empty();
	if(all_tables.length > 0){
		// table = sel_state.table;
		$("div#set-1 label").css("display", "inline-block");
		$("div#set-2").css("display", "block");
		if(all_tables[sel_state.table][1].length == 0){
			sel_state.rowAndcolumn = resetRowAndColumn();
		}
	}else{
		sel_state = {"table": -1, "controls": {"columnCount": 0, "rowAndcolumn": resetRowAndColumn()}};
	}
	console.log(all_tables)
	
	// return {"table": -1, "controls": {"columnCount": 0, "rowAndcolumn": resetRowAndColumn()}};
	return sel_state;
}

function createTable(tableElem, all_tables, sel_state){
	let tbName = tableElem.val(), tableList = $("div#set-1 select");
	if(tbName != ""){
		sel_state = screenDefault();
		
		// all_tables[all_tables.length] = [tbName, []];
		all_tables = [[tbName, [], []], ...all_tables];
	}
	if(all_tables.length > 0){
		$("div#set-1 label").css("display", "inline-block");
		$("div#set-2").css("display", "block");
	}
	tableElem.val("").focus();
	
	let struct = "";
	for(let i=0; i<all_tables.length; i++){
		struct += "<option value="+i+">"+all_tables[i][0]+"</option>";
	}
	tableList.html(struct);
	sel_state.table = tableList.val();
	
	// tableList.find("option:eq("+sel_state.table+")").prop("selected", true);

	return [all_tables, sel_state];
}

function addRow(rowElem, all_tables, sel_state){
	/* if(rowElem.val() != ""){
		all_tables[sel_state.table][1][all_tables[sel_state.table][1].length] = generateRow(rowElem.val());
		} */
	// let rowName = (rowElem.val() != "") ? rowElem.val() : "Row "+(sel_state.controls.rowAndcolumn[0] >= 0) ? parseInt(sel_state.controls.rowAndcolumn[0])+1 : all_tables[sel_state.table][1].length;
	if(sel_state.controls.rowAndcolumn[0] >= 0){ // Update selected row
		all_tables[sel_state.table][1][sel_state.controls.rowAndcolumn[0]][2] = rowElem.val();
	}else{ // Add new row
		all_tables[sel_state.table][1][all_tables[sel_state.table][1].length] = generateRow(rowElem.val(), [all_tables[sel_state.table], sel_state.controls.rowAndcolumn, []]);
		rowElem.val("");
	}
	rowElem.focus();
	sel_state = process_table(all_tables[sel_state.table], sel_state);
	
	return [all_tables, sel_state];
}

function addColum(colElem, all_tables, sel_state){
	sel_state.controls.columnCount += 1;
	$("div#set-4 input#cell-data").val("");
	
	if(sel_state.controls.rowAndcolumn[1][0] >= 0){
		if(colElem.val() != ""){
			sel_state.controls.rowAndcolumn[1][1][sel_state.controls.rowAndcolumn[1][0]] = colElem.val();
		}
	}else{
		sel_state.controls.rowAndcolumn = resetRowAndColumn(sel_state.controls.rowAndcolumn);
		let [sel_table, rowAndcolumn] = column_processor([all_tables[sel_state.table], sel_state.controls.rowAndcolumn, []], 0, colElem.val());
		all_tables[sel_state.table] = sel_table;
		sel_state.controls.rowAndcolumn = rowAndcolumn;
		colElem.val("");
	}
	
	colElem.focus();
	sel_state = process_table(all_tables[sel_state.table], sel_state);
	
	return [all_tables, sel_state];
}

function updateCell(cellElem, all_tables, sel_state){
	if(cellElem.val() !== "" && !isNaN(cellElem.val())){
		let row = sel_state.controls.rowAndcolumn[0];
		let cell = sel_state.controls.rowAndcolumn[1][0];
		all_tables[sel_state.table][1][row][4][cell] = cellElem.val();
		
		sel_state.controls.rowAndcolumn[0] = 0;
		sel_state.controls.rowAndcolumn[1][0] = -1;
		cellElem.val("");
		sel_state = process_table(all_tables[sel_state.table], sel_state);
	}

	return [all_tables, sel_state];
}

function generateRow(rowName, data){
	return [0, 0, rowName, 0.00, column_processor(data, 1)[2]]; // Position, Serial Number, Name, Total, numbers array
}

function hoveredRow(row, selState=true){
	if(selState){ // Row selected state
		// $('ul#set-1 li.grps-body').each(function(){
		$('table#set-1 tr.grps-body').each(function(){
			if(!$(this).is('.selected')){
				$(this).removeClass('sel-row')
			}
		})
		// $('ul#set-1 li.row').removeClass('sel-row')
		row.addClass('sel-row');
	}else{
		row.removeClass('sel-row');
	}
}
function selectColumn(row, sel_table, sel_state, type=0){
	$("div#set-2 div#opt-2").css("display", "none");
	$('div#set-2 div#opt-1 input').val("").focus();
	if(type == 1){
		row.removeClass("selected");
		hoveredRow(row, false)
		sel_state.controls.rowAndcolumn[0] = -1;
	}else{
		// $('ul#set-1 li.grps-body').removeClass("selected");
		$('table#set-1 tr.grps-body').removeClass("selected");
		row.addClass("selected");
		hoveredRow(row)
		sel_state.controls.rowAndcolumn[0] = row.attr('id');

		$('div#set-2 div#opt-1 input').val(sel_table[1][sel_state.controls.rowAndcolumn[0]][2]);
		if(sel_state.controls.rowAndcolumn[0] > -1){
			$("div#set-2 div#opt-2").css("display", "block");
		}
	}

	return sel_state;
}

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
// function column_processor(data, column_name=""){
function column_processor(data, type=0, column_name=""){
	let allRows = data[0][1];
	if(type == 1){ // To a single row
		data[1][1][1].map(() => {
			data[2].push(0); // Fill-up with all the columns for this new row 
		})
	}else{ // To all rows
		if(allRows.length > 0){
			for(var i=0; i<allRows.length; i++){ // Loop through all rows
				data[0][1][i][4].push(0); // Add new column with 0 value. Index 4 is the columns array
			}
			data[0][2].push(column_name);
			// data[1][1][1].push(column_name);
			data[1][1][1] = data[0][2];
		}
	}
	return data;
}

function selectedColumn(col_cap, selState=true){
	let col_index = col_cap.index();
	// $("ul#set-1 li.row").each(function(){
	$("table#set-1 tr.row").each(function(){
		let li = $(this);
		// $(this).find("div.column").each(function(){
		$(this).find("th.column, td.column").each(function(){
			let cell = $(this).index();
			// if(cell == col_index && li.index() > 0){
			if(cell == col_index){
				if(selState){ // Column Cap selected state
					$(this).addClass("sel-column");
				}else{
					$(this).removeClass("sel-column");
				}
			}
		})
	})
}

function resetRowAndColumn(rowAndcolumn=[-1, [-1, []]]){
	// return [-1, [-1, rowAndcolumn[1][1].length > 0 ? rowAndcolumn[1][1] : []]];
	rowAndcolumn[1][1] = rowAndcolumn[1][1].length > 0 ? rowAndcolumn[1][1] : [];

	return rowAndcolumn;
}

function saveTable(){
	let tableName = $("div#set-1 select").val();
	if(tableName != null){
		let tableData = all_tables[tableName];
		let tableDataString = JSON.stringify(tableData);
		localStorage.setItem("tableData", tableDataString);
	}
}
function loadTable(){
	let tableDataString = localStorage.getItem("tableData");
	if(tableDataString != null){
		all_tables = JSON.parse(tableDataString);
	}
	// console.log(all_tables);
	// let tableName = $("div#set-1 select").val();
	// if(tableName != null){
	// 	let tableData = all_tables[tableName];
	// 	let tableDataString = JSON.stringify(tableData);
	// 	localStorage.setItem("tableData", tableDataString);
	// }
}
function clearTable(){
	all_tables = [];
	$("div#set-1 select").html("");
	$("div#set-1 label, div#set-2, div#set-2 div#opt-2, div#set-3, div#set-3 div#opt-2, div#set-4").css("display", "none");
	$("div#set-1 input#cash-table-name").val("").focus();
}
function saveToExcel(){
	new DataTable('table#set-1', {
		layout: {
			topStart: {
				buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
			}
		}
	});
	/* new DataTable('table#set-1', {
		layout: {
			topStart: {
				buttons: [
					{
						text: 'My button',
						action: function (e, dt, node, config) {
							alert('Button activated');
						}
					}
				]
			}
		}
	}); */

	// let table = new DataTable('table#set-1');
	/* new DataTable.Buttons(table, {
		buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
	});
	
	table
		.buttons(0, null)
		.container()
		.prependTo(table.table().container()); */
}