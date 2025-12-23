<script lang="ts">
	import './app.css'

	let { children } = $props()
</script>

<svelte:head>
	<title>Diary</title>
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
