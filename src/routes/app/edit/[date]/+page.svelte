<script lang="ts">
	let { form, data } = $props()

	let entry = $derived(data.entry)

	let confirm_deletion = $state(false)

	function handle_confirm_click() {
		confirm_deletion = true
	}
</script>

<h1>Edit entry for {entry.date}</h1>

<form method="POST" action="?/update">
	<div class="form-group">
		<label for="title">Title</label>
		<input type="text" name="title" id="title" value={entry.title} />
	</div>

	<div class="form-group">
		<label for="content">What's on your mind?</label>
		<textarea name="content" id="content">{entry.content}</textarea>
	</div>

	<div class="form-group">
		<label for="thanks">What are 5 things you are grateful for?</label>
		<textarea name="thanks" id="thanks">{entry.thanks}</textarea>
	</div>

	<div class="form-actions">
		<button>Update</button>

		{#if confirm_deletion}
			<button class="danger" formaction="?/delete">Yes. Delete</button>
		{:else}
			<button class="danger" type="button" onclick={handle_confirm_click}>Delete</button>
		{/if}
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if confirm_deletion}
	<p class="message">Are you sure to delete this entry?</p>
{:else if form?.message}
	<p class="message">{form.message}</p>
{/if}

<style>
	.form-actions {
		flex-direction: row-reverse;
	}

	#content {
		height: 10lh;
	}

	#thanks {
		height: 6lh;
	}
</style>
