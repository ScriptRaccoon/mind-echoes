<script lang="ts">
	import DateHeader from '$lib/components/DateHeader.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/config'
	import { format_date } from '$lib/utils'

	let { form, data } = $props()

	let entry = $derived(data.entry)

	function open_delete_dialog() {
		open_dialog({
			question: 'Do you want to delete this echo?',
			action: '?/delete',
		})
	}
</script>

<svelte:head>
	<title>{APP_TITLE} - {entry.title}</title>
</svelte:head>

<DateHeader title="Edit Echo" date={format_date(entry.date)} />

<FormWrapper {form} action="?/update" buttons_reversed>
	{#snippet content()}
		<EntryInputs {entry} />
	{/snippet}

	{#snippet buttons(sending)}
		<button class="button">Save</button>
		{#if !sending}
			<button class="button danger" type="button" onclick={open_delete_dialog}>
				Delete
			</button>
		{/if}
	{/snippet}
</FormWrapper>
