<script lang="ts">
	import type { Entry } from '$lib/types'
	import { resize_textarea } from '$lib/utils'

	type Props = {
		entry?: Entry
	}

	let { entry }: Props = $props()
</script>

<div class="form-group">
	<label for="title">Title</label>
	<input type="text" name="title" id="title" value={entry?.title} />
</div>

<div class="form-group">
	<label for="content">What's on your mind?</label>
	<textarea name="content" id="content" {@attach resize_textarea} value={entry?.content}
	></textarea>
</div>

<div class="form-group">
	<label for="thanks">What are 5 things you are grateful for?</label>
	<textarea name="thanks" id="thanks" {@attach resize_textarea} value={entry?.thanks}
	></textarea>
</div>

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}
</style>
