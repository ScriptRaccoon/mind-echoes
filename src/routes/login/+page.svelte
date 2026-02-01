<script lang="ts">
	import BlockMessage from '$lib/components/BlockMessage.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'

	let { form, data } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Login</title>
</svelte:head>

<header>
	<h1>Login</h1>
</header>

{#if !form && data.message}
	<BlockMessage content={data.message} />
{/if}

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="identifier">Username or Email</label>
			<input
				class="input"
				type="text"
				id="identifier"
				name="identifier"
				required
				value={form?.identifier ?? ''}
			/>
		</div>

		<div class="form-group">
			<label class="label" for="password">Password</label>
			<input class="input" type="password" id="password" name="password" required />
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
