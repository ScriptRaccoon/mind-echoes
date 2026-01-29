<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<header>
	<h1>Reset password</h1>
</header>

<p>Choose a new, secure password.</p>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
	</div>

	<div class="form-group">
		<label for="repeat_password">Repeat password</label>
		<input type="password" name="repeat_password" id="repeat_password" required />
	</div>

	<div>
		<button class="button">Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
