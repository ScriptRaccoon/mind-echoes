<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Forgot password</title>
</svelte:head>

<header>
	<h1>Forgot your password?</h1>
</header>

<p>Enter your email. We will send you a link to reset your password.</p>

<FormWrapper {form}>
	{#snippet content()}
		<TextInput name="email" type="email" label="Email" value={form?.email ?? ''} />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
