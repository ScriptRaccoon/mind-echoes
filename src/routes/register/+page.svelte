<script lang="ts">
	import { enhance } from '$app/forms'

	let { data, form } = $props()
</script>

<h1>Register</h1>

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

	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
	</div>

	<div class="form-group">
		<label for="repeat_password">Repeat password</label>
		<input type="password" name="repeat_password" id="repeat_password" required />
	</div>

	<div class="form-group">
		<label for="device_label">Device Label</label>
		<input
			type="text"
			name="device_label"
			id="device_label"
			required
			value={form?.device_label ?? data.os}
		/>
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
