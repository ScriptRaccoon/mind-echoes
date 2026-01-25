<script lang="ts">
	import EntryList from '$lib/components/EntryList.svelte'
	import { t } from '$lib/translations/main'

	let { data } = $props()

	const today = new Date().toLocaleDateString('en-CA')
	const entry_today_exists = $derived(data.entries.some((entry) => entry.date === today))
</script>

<h1>{t('diary_for')} {data.username}</h1>

{#if !entry_today_exists}
	<p>
		<a href="/new/{today}">
			{t('add_today')}
		</a>
	</p>
{/if}

<EntryList entries={data.entries} />
