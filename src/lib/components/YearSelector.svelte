<script lang="ts">
	import { page } from '$app/state'

	type Props = {
		min_year: number
		max_year: number
		this_year: number
	}

	let { min_year, max_year, this_year }: Props = $props()
</script>

<nav>
	<ol class="years">
		{#each { length: max_year - min_year + 1 } as _, i}
			{@const year = min_year + i}
			<li>
				<a
					class="year"
					href="{page.url.pathname}?year={year}"
					aria-current={this_year === year}
				>
					{year}
				</a>
			</li>
		{/each}
	</ol>
</nav>

<style>
	.years {
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.2rem 0.5rem;
		margin-bottom: 1.5rem;
	}

	.year {
		display: inline-block;
		text-decoration: none;
		border: 1px solid var(--dark-outline-color);
		padding: 0.2rem 1rem;
		border-radius: 100vw;
		font-size: 0.75rem;
		color: var(--secondary-font-color);
	}

	.year[aria-current='true'] {
		color: var(--font-color);
		background-color: var(--input-bg-color);
		border-color: var(--outline-color);
	}
</style>
