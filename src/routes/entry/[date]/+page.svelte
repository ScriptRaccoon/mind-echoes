<script lang="ts">
	import { page } from '$app/state'
	import { ChevronLeft, ChevronRight } from 'lucide-svelte'

	let { data } = $props()

	let entry = $derived(data.entry)
</script>

<header>
	<h1>{entry.title}</h1>
	<div class="controls">
		{#if data.previous_date}
			<a href="/entry/{data.previous_date}" aria-label="previous Echo">
				<ChevronLeft />
			</a>
		{:else}
			<span class="opaque"><ChevronLeft /></span>
		{/if}

		<span class="date">{entry.date}</span>

		{#if data.next_date}
			<a href="/entry/{data.next_date}" aria-label="next Echo">
				<ChevronRight />
			</a>
		{:else}
			<span class="opaque"><ChevronRight /></span>
		{/if}
	</div>
</header>

{#if entry.content}
	<section>
		<h2>This is on my mind</h2>
		<div>{entry.content}</div>
	</section>
{/if}

{#if entry.thanks}
	<section>
		<h2>I am thankful for</h2>
		<div>{entry.thanks}</div>
	</section>
{/if}

<div class="actions">
	<a class="button" href={page.url.href + '/edit'}>Edit</a>
</div>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.controls {
		display: flex;
	}

	span.opaque {
		opacity: 0.25;
	}

	.date {
		text-align: center;
		width: 10ch;
	}

	section + section {
		margin-block: 1.5rem;
	}

	h2 {
		font-size: 1.25rem;
	}

	.actions {
		margin-top: 1.5rem;
	}
</style>
