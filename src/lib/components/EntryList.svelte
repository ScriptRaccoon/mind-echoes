<script lang="ts">
	import { t } from '$lib/translations/main'
	import type { Entry_Summary } from '$lib/types'
	import { format_date } from '$lib/utils'

	type Props = {
		entries: Entry_Summary[]
	}

	let { entries }: Props = $props()
</script>

<ol>
	{#each entries as entry (entry.id)}
		<li>
			<a href="/edit/{entry.date}">
				<span class="date">{format_date(entry.date)}:</span>
				<strong>
					{entry.title || t('untitled')}
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
