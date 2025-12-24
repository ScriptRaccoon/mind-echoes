<script lang="ts">
	import { page } from '$app/state'

	let { form } = $props()

	let date = $derived(page.params.date)
</script>

<h1>New entry for {date}</h1>

<form method="POST">
	<div class="form-group">
		<label for="title">Title</label>
		<input type="text" name="title" id="title" />
	</div>

	<div class="form-group">
		<label for="content">What's on your mind?</label>
		<textarea name="content" id="content"></textarea>
	</div>

	<div class="form-group">
		<label for="thanks">What are 5 things you are grateful for?</label>
		<textarea name="thanks" id="thanks"></textarea>
	</div>

	<div class="form-actions">
		<button>Create</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	#content {
		height: 10lh;
	}

	#thanks {
		height: 6lh;
	}
</style>
