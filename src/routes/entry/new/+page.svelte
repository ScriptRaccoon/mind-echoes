<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

	let { form } = $props()

	const today = new Date().toLocaleDateString('en-CA')
</script>

<svelte:head>
	<title>{APP_TITLE} - New Echo</title>
</svelte:head>

<header>
	<h1>New Echo</h1>
</header>

<FormWrapper {form}>
	{#snippet content()}
		<TextInput name="date" label="Choose a date" type="date" value={today} />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Continue</button>
	{/snippet}
</FormWrapper>
