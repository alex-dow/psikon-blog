<table id="pw-table">
	<thead>
		<tr>
			<th>Project Name</th>
			<th>Build Status</th>
			<th>Statistics</th>
		</tr>
	</thead>
	<tbody id="pw-table-body">
	<?php foreach ($results as $result) { ?>
		<tr id="<?php echo $result['projectId']; ?>-project">
			<td class="pw-project-title"><?php echo $result['projectName']; ?></td>
			<td class="pw-project-build-status" id="<?php echo $result['projectId']; ?>-build-status">
				<img src="/wp-includes/images/spinner.gif">
			</td>
			<td class="pw-project-statistics" id="<?php echo $result['projectId']; ?>-statistics">
				<img src="/wp-includes/images/spinner.gif">
			</td>
		</tr>
	<?php } ?>
	</tbody>
</table>