jQuery(document).ready(function($){

	var AJAX_ORDER_URL = "test.php";
	var AJAX_QUEUE_URL = "test.php";

	$(".ajax-table").each(function(){

		var $table = $(this),
			$all_rows = $(".ajax-table-row",$table),
			$publish_dropdown = $(".ajax-table-header-published select",$table),
			$expandable_rows = $(".ajax-table-row-expandable",$table),
			$sortable_rows = $(".ajax-sub-table-content .ajax-sub-table-sortable-rows",$table),
			orderby = null,
			$order_handles = $(".ajax-table-header-title,.ajax-table-header-created,.ajax-table-header-submissions",$table),
			$order_title = $order_handles.filter(".ajax-table-header-title"),
			$order_created = $order_handles.filter(".ajax-table-header-created"),
			$order_submissions = $order_handles.filter(".ajax-table-header-submissions"),
			order = "desc";

		$order_title.bind("click",function(e){

			e.preventDefault();

			if( orderby == "title" ){
				if( order == "asc" ){
					order = "desc";
				}
				else {
					order = "asc";
				}
			}
			else {
				order = "asc";
				orderby = "title";
			}

			$order_handles.removeClass("ajax-table-sorted-asc ajax-table-sorted-desc");

			$order_title.addClass("ajax-table-sorted-"+order);

			$all_rows.sort(function(a, b){
		        var keyA = $('.ajax-table-field-title > span > span',a).text().toLowerCase();
		        var keyB = $('.ajax-table-field-title > span > span',b).text().toLowerCase();
		         if( keyA === keyB ){
		        	return 0;
		        }
		        else if(order == "asc" ){
		            return (keyA > keyB) ? 1 : -1;
		        } else {
		            return (keyA < keyB) ? 1 : -1;
		        }
		    });

		    $.each( $all_rows , function(index, row){
		      $table.append(row);
		    });

			return false;

		})

		$order_created.bind("click",function(e){

			e.preventDefault();

			if( orderby == "created" ){
				if( order == "asc" ){
					order = "desc";
				}
				else {
					order = "asc";
				}
			}
			else {
				order = "asc";
				orderby = "created";
			}

			$order_handles.removeClass("ajax-table-sorted-asc ajax-table-sorted-desc");

			$order_created.addClass("ajax-table-sorted-"+order);

			$all_rows.sort(function(a, b){
		        var keyA = $('.ajax-table-field-created  > span',a).text().toLowerCase();
		        var keyB = $('.ajax-table-field-created  > span',b).text().toLowerCase();
		        if( keyA === keyB ){
		        	return 0;
		        }
		        else if(order == "asc" ){
		            return (keyA > keyB) ? 1 : -1;
		        } else {
		            return (keyA < keyB) ? 1 : -1;
		        }
		    });

		    $.each( $all_rows , function(index, row){
		      $table.append(row);
		    });

			return false;

		})

		$order_submissions.bind("click",function(e){

			e.preventDefault();

			if( orderby == "submissions" ){
				if( order == "asc" ){
					order = "desc";
				}
				else {
					order = "asc";
				}
			}
			else {
				order = "asc";
				orderby = "submissions";
			}

			$order_handles.removeClass("ajax-table-sorted-asc ajax-table-sorted-desc");

			$order_submissions.addClass("ajax-table-sorted-"+order);

			$all_rows.sort(function(a, b){
		        var keyA = Number( $('.ajax-table-field-submissions  > span',a).text() );
		        var keyB =  Number( $('.ajax-table-field-submissions  > span',b).text().toLowerCase() );
		         if( keyA === keyB ){
		        	return 0;
		        }
		        else if(order == "asc" ){
		            return (keyA > keyB) ? 1 : -1;
		        } else {
		            return (keyA < keyB) ? 1 : -1;
		        }
		    });

		    $.each( $all_rows , function(index, row){
		      $table.append(row);
		    });

			return false;

		})

		$publish_dropdown.change(function(){

			var value = $(this).val();

			$all_rows.each(function(){

				var $row = $(this),
					this_value = $(".ajax-table-field-published > span",$row).text();

				if( value == "" || this_value == value ){

					$(this).show();
				}
				else {

					$(this).hide();
				}

			})
		});

		$sortable_rows.each(function(){

			var $sortable_table = $(this),
				$not_sortable_table = $sortable_table.prev(),
				draft_id = $sortable_table.parents(".ajax-table-row").attr("data-id"),
				$start_queue = $sortable_table.find(".ajax-table-start-queue");

			$start_queue.bind("click",function(){

				var $item = $start_queue.parents(".ajax-sub-table-row"),
					draft_id = $item.attr("data-id"),
					order = $item.find(".ajax-sub-table-field-order > span").text(),
					project_id = $item.attr("data-id"),
					current_order = 0,
					prev_sub_sim = false,
					start_queue_not_placed = true,
					status_fields = new Array();

				$start_queue.detach();

				$sortable_table.children().each(function(){

					var $row = $(this),
						$action = $row.find(".ajax-sub-table-field-action"),
						$status = $row.find(".ajax-sub-table-field-status"),
						$order = $row.find(".ajax-sub-table-field-order > span"),
						row_order = $order.text();

					if( row_order == order ){

						$row.appendTo( $not_sortable_table );

						$order.empty();

						status_fields.push( $status );

						$status.text("..saving..")

						$action.empty().append("<a href='#' >Withdraw</a>");
					}

				});

				ajax_start_queue( project_id , draft_id , status_fields );

				$sortable_table.children().each(function(){

					var $row = $(this),
						$order_field = $row.find(".ajax-sub-table-field-order > span"),
						$action_field = $row.find(".ajax-sub-table-field-action"),
						sub_sim = $row.attr("data-simsub") == "yes" ? true : false;

					if( !prev_sub_sim || !sub_sim ){
						current_order++;
					}

					if( current_order === 1 && start_queue_not_placed ){

						$action_field.append( $start_queue );
						start_queue_not_placed = false;
					}

					$order_field.text( current_order + ( sub_sim ? "(sim_sub)" : "" ) );

					prev_sub_sim = sub_sim;

				});



			});

			$sortable_table.sortable({
				containment : $(this),
				tolerance : "pointer",
				start : function( event, ui ){

					$start_queue.detach();
				},
				stop : function( event , ui ){

					var $item = ui.item,
						project_id = $item.attr("data-id"),
						current_order = 0,
						prev_sub_sim = false,
						start_queue_not_placed = true;

					$sortable_table.children().each(function(){

						var $row = $(this),
							$order_field = $row.find(".ajax-sub-table-field-order > span"),
							$action_field = $row.find(".ajax-sub-table-field-action"),
							sub_sim = $row.attr("data-simsub") == "yes" ? true : false;

						if( !prev_sub_sim || !sub_sim ){
							current_order++;
						}

						if( current_order === 1 && start_queue_not_placed ){

							$action_field.append( $start_queue );
							start_queue_not_placed = false;
						}

						$order_field.text( current_order + ( sub_sim ? "(sim_sub)" : "" ) );

						prev_sub_sim = sub_sim;

					});

					var prev_project_id = $item.prev().attr("data-id") == undefined ? 0 : $item.prev().attr("data-id");

					ajax_order( draft_id , project_id , prev_project_id );

				}

			});

		});

		$expandable_rows.each(function(){

			var $row = $(this),
				$handle = $(".ajax-table-field-title > span",$row);

			$handle.click(function(e){

				e.preventDefault();

				if( $row.hasClass("ajax-table-row-expanded") ){

					$row.removeClass("ajax-table-row-expanded");
				}
				else {

					$expandable_rows.removeClass("ajax-table-row-expanded");

					$row.addClass("ajax-table-row-expanded");
				}

				return false;

			})

		});


	});

	var ajax_start_queue = function( project_id , draft_id , status_fields){

		$.post( AJAX_QUEUE_URL , {
			"draft_id" : draft_id,
			"project_id" : project_id
		},function( response ){

			$.each( status_fields, function(i , status_field){

				status_fields.text( response );
			});
		});
	}

	var ajax_order = function( draft_id , project_id , prev_project_id ){

		$.post( AJAX_ORDER_URL , {
			"draft_id" : draft_id,
			"project_id" : project_id,
			"prev_project_id" : prev_project_id
		});
	}

});