<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<h1>Register</h1>

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
		<button class="button">Continue</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
