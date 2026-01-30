<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'

	let { form, data } = $props()
</script>

<header>
	<h1>Login</h1>
</header>

{#if !form && data.message}
	<p class="message">{data.message}</p>
{/if}

<FormWrapper {form}>
	{#snippet content()}
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
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>

<p class="forgot">
	<a href="/password-forgot">Forgot your password?</a>
</p>

<style>
	.forgot {
		margin-top: 2rem;
		color: var(--secondary-font-color);
	}
</style>
