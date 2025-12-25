<script lang="ts">
	import { t, type Lang } from '$lib/translations/main'
	import type { Entry } from '$lib/types'
	import { format_date } from '$lib/utils'

	type Props = {
		lang: Lang
		entries: Entry[]
	}

	let { lang, entries }: Props = $props()
</script>

<ol>
	{#each entries as entry (entry.id)}
		<li>
			<a href="/app/edit/{entry.date}">
				<span class="date">{format_date(entry.date, lang)}:</span>
				<strong>
					{entry.title || t('untitled', lang)}
				</strong>
			</a>
		</li>
	{/each}
</ol>

<style>
	ol {
		list-style-type: none;
	}

	a {
		text-decoration: none;
	}

	li + li {
		margin-top: 0.5rem;
	}

	.date {
		margin-right: 0.25rem;
	}
</style>
