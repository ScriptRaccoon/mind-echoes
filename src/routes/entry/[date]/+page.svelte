<script lang="ts">
	import { page } from '$app/state'
	import DateHeader from '$lib/components/DateHeader.svelte'

	let { data } = $props()

	let entry = $derived(data.entry)
</script>

<DateHeader title={entry.title} date={entry.date} />

{#if entry.content}
	<section>
		<h2>This is on my mind</h2>
		<div class="box">{entry.content}</div>
	</section>
{/if}

{#if entry.thanks}
	<section>
		<h2>I am thankful for</h2>
		<div class="box">{entry.thanks}</div>
	</section>
{/if}

<div class="actions">
	<a href={page.url.href + '/edit'}>Edit entry</a>
</div>

<style>
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
