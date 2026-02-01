<script lang="ts">
	import { page } from '$app/state'
	import DateHeader from '$lib/components/DateHeader.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/config'
	import { format_date } from '$lib/utils'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - New Echo</title>
</svelte:head>

<DateHeader title="New Echo" date={format_date(page.params.date!)} />

<FormWrapper {form}>
	{#snippet content()}
		<EntryInputs />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Create</button>
	{/snippet}
</FormWrapper>
