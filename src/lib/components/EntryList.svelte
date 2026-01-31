<script lang="ts">
	import type { Entry_Summary } from '$lib/types'
	import { localize_date } from '$lib/utils'

	type Props = {
		entries: Entry_Summary[]
	}

	let { entries }: Props = $props()
</script>

<ol>
	{#each entries as entry (entry.id)}
		<li>
			<a href="/entry/{entry.date}">
				<span class="date">{localize_date(entry.date)}</span>
				&ndash;
				<strong>
					{entry.title || 'Untitled'}
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
		color: var(--secondary-font-color);
	}
</style>
