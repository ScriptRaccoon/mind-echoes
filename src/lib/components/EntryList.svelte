<script lang="ts">
	import type { Entry_Summary } from '$lib/client/types'
	import { format_date_short } from '$lib/client/utils'
	import { ChevronRight } from 'lucide-svelte'

	type Props = {
		entries: Entry_Summary[]
	}

	let { entries }: Props = $props()
</script>

<ol>
	{#each entries as entry (entry.id)}
		<li>
			<a href="/entry/{entry.date}">
				<span class="date">{format_date_short(entry.date)}</span>
				<strong>{entry.title}</strong>
				<div class="icon"><ChevronRight size={20} /></div>
			</a>
		</li>
	{/each}
</ol>

<style>
	ol {
		margin-top: 1.5rem;
		list-style-type: none;
	}

	li + li {
		margin-top: 0.5rem;
	}

	a {
		display: grid;
		grid-template-columns: auto auto 1fr;
		gap: 1rem;
		text-decoration: none;
		outline: 1px solid var(--dark-outline-color);
		background-color: var(--input-bg-color);
		border-radius: 100vw;
		padding: 0.5rem 1rem;
	}

	.date {
		color: var(--secondary-font-color);
	}

	.icon {
		justify-self: end;
	}
</style>
