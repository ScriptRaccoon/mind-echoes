<script lang="ts">
	import { enhance } from '$app/forms'
	import DateHeader from '$lib/components/DateHeader.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'

	let { form, data } = $props()

	let entry = $derived(data.entry)

	function open_delete_dialog() {
		open_dialog({
			question: 'Do you want to delete this echo?',
			action: '?/delete',
		})
	}
</script>

<DateHeader title="Edit Echo" date={entry.date} />

<form method="POST" action="?/update" use:enhance>
	<EntryInputs {entry} />

	<div class="actions">
		<button class="button">Save</button>
		<button class="button danger" type="button" onclick={open_delete_dialog}>
			Delete
		</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.actions {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}
</style>
