<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Reset password</title>
</svelte:head>

<header>
	<h1>Reset password</h1>
</header>

<p>Choose a new, secure password.</p>

<FormWrapper {form}>
	{#snippet content()}
		<TextInput name="password" label="Password" type="password" />
		<TextInput name="repeat_password" label="Repeat password" type="password" />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
