<script lang="ts">
	import { enhance } from '$app/forms'
	import DateHeader from '$lib/components/DateHeader.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import { resize_textarea } from '$lib/utils'

	let { form, data } = $props()

	let entry = $derived(data.entry)

	function open_delete_dialog() {
		open_dialog({
			question: 'Do you want to delete this entry?',
			action: '?/delete',
		})
	}
</script>

<DateHeader title="Edit entry" date={entry.date} />

<form method="POST" action="?/update" use:enhance>
	<div class="form-group">
		<label for="title">Title</label>
		<input type="text" name="title" id="title" value={entry.title} />
	</div>

	<div class="form-group">
		<label for="content">What's on your mind?</label>
		<textarea name="content" id="content" {@attach resize_textarea} value={entry.content}
		></textarea>
	</div>

	<div class="form-group">
		<label for="thanks">What are 5 things you are grateful for?</label>
		<textarea name="thanks" id="thanks" {@attach resize_textarea} value={entry.thanks}
		></textarea>
	</div>

	<div class="actions">
		<button class="button">Save</button>
		<button class="button danger" type="button" onclick={open_delete_dialog}>
			Delete
		</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}

	.actions {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}
</style>
