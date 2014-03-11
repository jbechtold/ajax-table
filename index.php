<?php 

//include "data.php"; 

include "../libraries/utils.php";
include "../libraries/draft.php";

$data = GetDraftTable();
print_r($data);
exit();
?>
<!DOCTYPE html>
<html>
<head>
	<title>Ajax Table</title>
	<link rel='stylesheet' type='text/css' href='css/table.css' />
	<script src='//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js' ></script>
	<script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js' ></script>
	<script src='js/main.js' ></script>
</head>
<body>
	<div id='ajax-table' class='ajax-table' >

		<div class='ajax-table-header' >

			<div class='ajax-table-header-field ajax-table-header-title' >
				<span>Title</span>
			</div>

			<div class='ajax-table-header-field ajax-table-header-created' >
				<span>Created</span>
			</div>

			<div class='ajax-table-header-field ajax-table-header-submissions' >
				<span>Submissions</span>
			</div>

			<div class='ajax-table-header-field ajax-table-header-published' >
				<span>Published <select><option value=''>All</option><option value='no'>No</option><option value='yes'>Yes</option></select></span>
			</div>

		</div>

		<div class='ajax-table-content' >

		<?php foreach( $data as $item ) : ?>

			<div data-id='<?php echo $item["id"];?>' class='ajax-table-row <?php if( count( $item["submissions"] ) > 0 ) echo "ajax-table-row-expandable"; ?>' >

				<div class='ajax-table-row-content' >

					<div class='ajax-table-field ajax-table-field-title' >
						<span><span><?php echo $item["title"]; ?></span></span>
					</div>

					<div class='ajax-table-field ajax-table-field-created' >
						<span><?php echo $item["created"]; ?></span>
					</div>

					<div class='ajax-table-field ajax-table-field-submissions' >
						<span><?php echo count( $item["submissions"] ); ?></span>
					</div>

					<div class='ajax-table-field ajax-table-field-published' >
						<span><?php echo  $item["published"]; ?></span>
					</div>

					<div class='ajax-table-field ajax-table-field-actions' >
						<a href='#' >edit</a> | <a href='#' >add submission</a>
					</div>

				</div>

				<?php if( count( $item["submissions"] ) > 0 ) : ?>

				<div class='ajax-table-expanding-content' >

					<table cellspacing='0' cellpadding='0' >

						<tr>
							<td class='ajax-table-expanding-content-info' width='135'>
								Drag and drop to change submission order<br/><br/>Total price: <span class='ajax-table-price' >$7.98</span>
							</td>
							<td>

								<div class='ajax-sub-table' >

									<div class='ajax-sub-table-header' >

										<div class='ajax-sub-table-header-field ajax-sub-table-header-publisher' >
											<span>Publisher</span>
										</div>

										<div class='ajax-sub-table-header-field ajax-sub-table-header-status' >
											<span>Status</span>
										</div>

										<div class='ajax-sub-table-header-field ajax-sub-table-header-order' >
											<span>Submit in order</span>
										</div>

										<div class='ajax-sub-table-header-field ajax-sub-table-header-price' >
											<span>Price</span>
										</div>

									</div>

									<div class='ajax-sub-table-content' >

									<?php 

										$sortable_rows_html = "";
										$not_sortable_rows_html = "";
										$start_queue_displayed = false;
										foreach( $item["submissions"] as $submission ) : 

											ob_start();

										?>

										<div data-id='<?php echo $submission["id"];?>' class='ajax-sub-table-row' data-simsub='<?php echo $submission["sim_sub"]?"yes":"no"; ?>' >

											<div class='ajax-sub-table-field ajax-sub-table-field-publisher' >
												<span><?php echo $submission["publisher"]; ?></span>
											</div>

											<div class='ajax-sub-table-field ajax-sub-table-field-status' >
												<span><?php echo $submission["status"]; ?></span>
											</div>

											<div class='ajax-sub-table-field ajax-sub-table-field-order' >
												<span><?php echo $submission["order"]>0?$submission["order"]:""; ?><?php echo $submission["sim_sub"]?"(sim_sub)":""; ?></span>
											</div>

											<div class='ajax-sub-table-field ajax-sub-table-field-price' >
												<span>$<?php echo $submission["price"]; ?></span>
											</div>

											<div class='ajax-sub-table-field ajax-sub-table-field-action' >
												<?php if( $submission["order"] === 0  ){ ?>
												<a href='#' >Withdraw</a>
												<?php } else if( $submission["order"] === 1 && !$start_queue_displayed ){ 
													$start_queue_displayed = true;
												?>
												<a href='#' >Edit</a>
												<input type='button' class='ajax-table-start-queue' value='Start queue' />
												<?php } else { ?> 
												<a href='#' >Edit</a>
												<?php } ?>
											</div>

										</div>


										<?php

											if( $submission["order"] === 0  ){

												$not_sortable_rows_html.=ob_get_contents();
											}
											else {
												$sortable_rows_html.=ob_get_contents();
											}

											ob_end_clean();
										?>

										<?php endforeach; ?>

										<div class='ajax-sub-table-not-sortable-rows' ><?php echo $not_sortable_rows_html; ?></div>

										<div class='ajax-sub-table-sortable-rows' ><?php echo $sortable_rows_html; ?></div>

									</div>

							</td>

						</tr>

					</table>

					</div>

					<div class='clear' ></div>

				</div>

				<?php endif; ?>

			</div>

			<?php endforeach; ?>

		</div>

	</div>
</body>	
</html>
