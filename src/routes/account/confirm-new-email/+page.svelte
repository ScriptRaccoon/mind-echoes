<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	let { form } = $props()

	const new_email = decodeURIComponent(page.url.searchParams.get('new_email') ?? '')
</script>

<header>
	<h1>Confirm new email address</h1>
</header>

<p>We have sent a code to your new email address ({new_email}). Enter it below.</p>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="code">Code</label>
		<input type="number" name="code" id="code" required />
	</div>

	<div>
		<button class="button">Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
