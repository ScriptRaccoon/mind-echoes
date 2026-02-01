<script lang="ts">
	import { Check } from 'lucide-svelte'

	type Props = {
		content: string
	}

	let { content }: Props = $props()
</script>

<p>
	<Check size={20} />&nbsp; {content}
</p>

<style>
	p {
		color: var(--message-color);
		background-color: var(--message-bg-color);
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-weight: 500;
		box-shadow: 0 0 1rem #0004;
	}
</style>
