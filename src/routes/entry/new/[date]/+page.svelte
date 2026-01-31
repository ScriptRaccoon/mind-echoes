<script lang="ts">
	import { page } from '$app/state'
	import DateHeader from '$lib/components/DateHeader.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { format_date_short } from '$lib/utils'

	let { form } = $props()
</script>

<DateHeader title="New Echo" date={format_date_short(page.params.date!)} />

<FormWrapper {form}>
	{#snippet content()}
		<EntryInputs />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Create</button>
	{/snippet}
</FormWrapper>
