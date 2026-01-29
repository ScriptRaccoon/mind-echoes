<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<header>
	<h1>Register</h1>
</header>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" value={form?.email ?? ''} required />
	</div>

	<div class="form-group">
		<label for="username">Username</label>
		<input
			type="text"
			name="username"
			id="username"
			value={form?.username ?? ''}
			required
		/>
	</div>

	<div>
		<button class="button">Continue</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
