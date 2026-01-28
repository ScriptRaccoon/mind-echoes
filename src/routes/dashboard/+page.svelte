<script lang="ts">
	import { page } from '$app/state'
	import EntryList from '$lib/components/EntryList.svelte'

	let { data } = $props()

	const today = new Date().toLocaleDateString('en-CA')
	const entry_today_exists = $derived(data.entries.some((entry) => entry.date === today))
</script>

<h1>Diary for {page.data.user?.username}</h1>

{#if !entry_today_exists}
	<p>
		<a href="/entry/new/{today}">Add today's entry</a>
	</p>
{/if}

<EntryList entries={data.entries} />
