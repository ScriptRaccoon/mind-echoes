<script lang="ts">
	import { page } from '$app/state'
	import { APP_TITLE } from '$lib/client/config'
	import { format_date } from '$lib/client/utils.js'
	import { ChevronLeft, ChevronRight } from 'lucide-svelte'

	let { data } = $props()

	let entry = $derived(data.entry)

	const icon_size = 26
</script>

<svelte:head>
	<title>{APP_TITLE} - {entry.title}</title>
</svelte:head>

<header>
	<h1>{entry.title}</h1>
</header>

<nav>
	{#if data.previous_date}
		<a href="/entry/{data.previous_date}" aria-label="previous Echo" class="nav-button">
			<ChevronLeft size={icon_size} />
		</a>
	{:else}
		<span class="nav-button opaque"><ChevronLeft size={icon_size} /></span>
	{/if}

	<div class="date">{format_date(entry.date)}</div>

	{#if data.next_date}
		<a href="/entry/{data.next_date}" aria-label="next Echo" class="nav-button">
			<ChevronRight size={icon_size} />
		</a>
	{:else}
		<span class="nav-button opaque"><ChevronRight size={icon_size} /></span>
	{/if}
</nav>

{#if entry.content}
	<section>
		<h2>This is on my mind</h2>
		<div class="text">{entry.content}</div>
	</section>
{/if}

{#if entry.thanks}
	<section>
		<h2 class="accent">I am thankful for</h2>
		<div class="text">{entry.thanks}</div>
	</section>
{/if}

<section aria-label="menu">
	<menu>
		<a class="button" href={page.url.href + '/edit'}>Edit Echo</a>
	</menu>
</section>

<style>
	header {
		text-align: center;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.date {
		font-weight: 600;
		font-size: 1.125rem;
		text-align: center;
	}

	.nav-button {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 4.5rem;
		background-color: var(--button-color);
		border-radius: 100vw;
		outline-offset: 2px;
	}

	section {
		margin-top: 2rem;
	}

	menu {
		display: flex;
		justify-content: center;
	}

	.text {
		white-space: pre-wrap;
	}
</style>
