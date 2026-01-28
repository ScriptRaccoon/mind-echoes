<script lang="ts">
	import './app.css'
	import Nav from '$lib/components/Nav.svelte'
	import Dialog from '$lib/components/Dialog.svelte'
	import { APP_TITLE } from '$lib/config'

	let { children } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE}</title>

	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content={APP_TITLE} />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<Nav />

<div class="container">
	{@render children()}
</div>

<Dialog />

<style>
	.container {
		max-width: 600px;
		margin-inline: auto;
		padding-inline: 1rem;
	}
</style>
