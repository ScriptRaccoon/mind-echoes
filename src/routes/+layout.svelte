<script lang="ts">
	import './app.css'
	import { type LazyLang, t } from '$lib/translations/main'
	import { setContext } from 'svelte'

	let { data, children } = $props()

	setContext<LazyLang>('lang', () => data.lang)
</script>

<svelte:head>
	<title>{t('title')}</title>

	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Tagebuch" />
	<link rel="manifest" href="/site.webmanifest" />
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
