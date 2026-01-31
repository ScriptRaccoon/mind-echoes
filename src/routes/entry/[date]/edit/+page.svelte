<script lang="ts">
	import DateHeader from '$lib/components/DateHeader.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
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

<DateHeader title="Edit Echo" date={format_date(entry.date)} />

<FormWrapper {form} action="?/update" buttons_reversed>
	{#snippet content()}
		<EntryInputs {entry} />
	{/snippet}

	{#snippet buttons()}
		<button class="button"> Save </button>
		<button class="button danger" type="button" onclick={open_delete_dialog}>
			Delete
		</button>
	{/snippet}
</FormWrapper>
