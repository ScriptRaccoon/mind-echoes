<script lang="ts">
	import { enhance } from '$app/forms'

	let { form, data } = $props()
</script>

<header>
	<h1>Login</h1>
</header>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="identifier">Username or Email</label>
		<input
			type="text"
			id="identifier"
			name="identifier"
			required
			value={form?.identifier ?? data.username ?? ''}
		/>
	</div>

	<div class="form-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<div>
		<button class="button">Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{:else if data.message}
	<p class="message">{data.message}</p>
{/if}

<p class="forgot">
	<a href="/password-forgot">Forgot your password?</a>
</p>

<style>
	.forgot {
		margin-top: 2rem;
		color: var(--secondary-font-color);
	}
</style>
