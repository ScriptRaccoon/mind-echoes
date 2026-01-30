<script lang="ts">
	import { navigating } from '$app/state'
	import { fade } from 'svelte/transition'
</script>

{#if navigating.to}
	<div transition:fade={{ duration: 120 }}></div>
{/if}

<style>
	div {
		position: fixed;
		top: 0;
		left: 0;
		width: 0%;
		height: 2px;
		background-color: var(--accent-color);
		animation: grow 2s cubic-bezier(0.15, 0.4, 0.3, 1) forwards;
	}

	@keyframes grow {
		0% {
			width: 0%;
		}

		100% {
			width: 99.5%;
		}
	}
</style>
