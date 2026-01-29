<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import DateHeader from '$lib/components/DateHeader.svelte'
	import EntryInputs from '$lib/components/EntryInputs.svelte'

	let { form } = $props()

	let date = $derived(page.params.date!)
</script>

<DateHeader title="New Echo" {date} />

<form method="POST" use:enhance>
	<EntryInputs />

	<div>
		<button class="button">Create</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
