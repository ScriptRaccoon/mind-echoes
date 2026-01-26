<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<h1>Register</h1>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" value={form?.email ?? ''} />
	</div>

	<div class="form-group">
		<label for="username">Username</label>
		<input type="text" name="username" id="username" value={form?.username ?? ''} />
	</div>

	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" />
	</div>

	<div>
		<button class="button">Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.message}
	<p class="message">{form.message}</p>
{/if}
