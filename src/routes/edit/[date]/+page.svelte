<script lang="ts">
	import { enhance } from '$app/forms'
	import { resize_textarea } from '$lib/utils'

	let { form, data } = $props()

	let entry = $derived(data.entry)

	let confirm_deletion = $state(false)

	function handle_confirm_click() {
		confirm_deletion = true
	}
</script>

<h1 class="date">{entry.date}</h1>

<form method="POST" action="?/update" use:enhance>
	<div class="form-group">
		<label for="title">Title</label>
		<input class="title" type="text" name="title" id="title" value={entry.title} />
	</div>

	<div class="form-group">
		<label for="content">What's on your mind?</label>
		<textarea name="content" id="content" {@attach resize_textarea}
			>{entry.content}
		</textarea>
	</div>

	<div class="form-group">
		<label for="thanks">What are 5 things you are grateful for?</label>
		<textarea name="thanks" id="thanks" {@attach resize_textarea}
			>{entry.thanks}
		</textarea>
	</div>

	<div class="form-actions">
		<button>Update</button>

		{#if confirm_deletion}
			<button class="danger" formaction="?/delete"> Yes, delete </button>
		{:else}
			<button class="danger" type="button" onclick={handle_confirm_click}>
				Delete
			</button>
		{/if}
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if confirm_deletion}
	<p>Are you sure you want to delete this entry?</p>
{:else if form?.message}
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
