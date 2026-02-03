<script lang="ts">
	import BlockMessage from '$lib/components/BlockMessage.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

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
		<TextInput
			name="identifier"
			label="Username or Email"
			value={form?.identifier ?? ''}
		/>
		<TextInput name="password" label="Password" type="password" />
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
