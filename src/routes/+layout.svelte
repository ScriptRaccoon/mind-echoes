<script lang="ts">
	import './app.css'
	import { t } from '$lib/translations/main'
	import { onMount } from 'svelte'

	let { data, children } = $props()

	onMount(() => {
		document.documentElement.setAttribute('lang', data.lang)
	})
</script>

<svelte:head>
	<title>{t('title', data.lang)}</title>
</svelte:head>

<div class="container">
	{@render children()}
</div>

<style>
	.container {
		max-width: 600px;
		margin-inline: auto;
		padding-inline: 1rem;
	}
</style>
