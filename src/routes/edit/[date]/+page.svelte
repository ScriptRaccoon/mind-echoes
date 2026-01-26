<script lang="ts">
	import { enhance } from '$app/forms'
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

<h1 class="date">{entry.date}</h1>

<form method="POST" action="?/update" use:enhance>
	<div class="form-group">
		<label for="title">Title</label>
		<input class="title" type="text" name="title" id="title" bind:value={entry.title} />
	</div>

	<div class="form-group">
		<label for="content">What's on your mind?</label>
		<textarea
			name="content"
			id="content"
			{@attach resize_textarea}
			bind:value={entry.content}
		></textarea>
	</div>

	<div class="form-group">
		<label for="thanks">What are 5 things you are grateful for?</label>
		<textarea
			name="thanks"
			id="thanks"
			{@attach resize_textarea}
			bind:value={entry.thanks}
		></textarea>
	</div>

	<div class="form-actions">
		<button>Update</button>
		<button class="danger" type="button" onclick={open_delete_dialog}>Delete</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.message}
	<p class="message">{form.message}</p>
{/if}

<style>
	.form-actions {
		flex-direction: row-reverse;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}
</style>
