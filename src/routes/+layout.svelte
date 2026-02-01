<script lang="ts">
	import './app.css'
	import Nav from '$lib/components/Nav.svelte'
	import Dialog from '$lib/components/Dialog.svelte'
	import { APP_DESCRIPTION, APP_DOMAIN, APP_TITLE } from '$lib/config'
	import LoadingBar from '$lib/components/LoadingBar.svelte'

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

	<meta property="og:title" content={APP_TITLE} />
	<meta property="og:description" content={APP_DESCRIPTION} />
	<meta name="description" content={APP_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={APP_DOMAIN} />
	<meta property="og:site_name" content={APP_TITLE} />
	<meta property="og:image" content="{APP_DOMAIN}/screenshot.webp" />

	<link
		rel="preload"
		href="/fonts/Nunito/Nunito-VariableFont_wght.ttf"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<Nav />

<div class="container">
	{@render children()}
</div>

<Dialog />

<LoadingBar />

<style>
	.container {
		max-width: 600px;
		margin-inline: auto;
		padding-inline: 1rem;
	}
</style>
