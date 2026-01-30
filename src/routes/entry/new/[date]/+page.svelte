<script lang="ts">
	import { page } from '$app/state'
	import DateHeader from '$lib/components/DateHeader.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'

	let { form } = $props()

	let date = $derived(page.params.date!)
</script>

<DateHeader title="New Echo" {date} />

<FormWrapper {form}>
	{#snippet content()}
		<EntryInputs />
	{/snippet}

	{#snippet buttons()}
		<button class="button">Create</button>
	{/snippet}
</FormWrapper>
