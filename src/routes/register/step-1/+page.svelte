<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Register</title>
</svelte:head>

<RegistrationHeader step={1} />

<FormWrapper {form}>
	{#snippet content()}
		<TextInput name="email" type="email" label="Email" value={form?.email ?? ''} />
		<TextInput name="username" label="Username" value={form?.username ?? ''} />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Continue</button>
	{/snippet}
</FormWrapper>
