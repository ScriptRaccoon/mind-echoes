<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

	let { data, form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Device registration</title>
</svelte:head>

<header>
	<h1>Device registration</h1>
</header>

<p>This is the first time you log in from this device. You need to first register it.</p>

<FormWrapper {form}>
	{#snippet content()}
		<TextInput
			name="device_label"
			label="Name this device"
			value={form?.device_label ?? data.device_label}
		/>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
