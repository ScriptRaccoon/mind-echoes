<script lang="ts">
	import { CircleAlert } from 'lucide-svelte'

	type Props = {
		content: string
	}

	let { content }: Props = $props()
</script>

<p>
	<CircleAlert size={20} />&nbsp; {content}
</p>

<style>
	p {
		color: var(--error-color);
		background-color: var(--error-bg-color);
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-weight: 500;
		box-shadow: 0 0 1rem #0004;
	}
</style>
