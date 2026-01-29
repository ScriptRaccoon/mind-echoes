<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<h1>Register</h1>

<p>
	To verify your email address, we have sent you a registration code. Enter it below to
	complete the registration.
</p>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="code">Registration Code</label>
		<input type="number" name="code" id="code" required />
	</div>

	<div>
		<button class="button">Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
