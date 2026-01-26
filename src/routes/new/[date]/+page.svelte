<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { resize_textarea } from '$lib/utils'

	let { form } = $props()

	let date = $derived(page.params.date!)
</script>

<h1 class="date">New &ndash; {date}</h1>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="title">Title</label>
		<input class="title" type="text" name="title" id="title" required />
	</div>

	<div class="form-group">
		<label for="content">What's on your mind?</label>
		<textarea name="content" id="content" {@attach resize_textarea}></textarea>
	</div>

	<div class="form-group">
		<label for="thanks">What are 5 things you are grateful for?</label>
		<textarea name="thanks" id="thanks" {@attach resize_textarea}></textarea>
	</div>

	<div>
		<button class="button">Create</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}
</style>
