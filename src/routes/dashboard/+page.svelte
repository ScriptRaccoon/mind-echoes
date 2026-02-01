<script lang="ts">
	import { page } from '$app/state'
	import EntryList from '$lib/components/EntryList.svelte'
	import { APP_TITLE } from '$lib/config'

	let { data } = $props()

	const today = new Date().toLocaleDateString('en-CA')
	const entry_today_exists = $derived(data.entries.some((entry) => entry.date === today))
</script>

<svelte:head>
	<title>{APP_TITLE} - Echoes</title>
</svelte:head>

<header>
	<h1>Echoes of {page.data.user?.username}</h1>
</header>

{#if !entry_today_exists}
	<p>
		<a href="/entry/new/{today}" class="button">Add today's Echo</a>
	</p>
{/if}

<EntryList entries={data.entries} />
