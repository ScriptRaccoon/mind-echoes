<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()

	const today = new Date().toLocaleDateString('en-CA')

	let selected_date = $derived<string>(form?.date ?? today)
</script>

<h1>New entry</h1>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="date">Choose a date</label>
		<input type="date" name="date" id="date" bind:value={selected_date} required />
	</div>

	<div>
		<button class="button">Continue</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
