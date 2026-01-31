<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Snippet } from 'svelte'
	import BlockError from './BlockError.svelte'
	import BlockMessage from './BlockMessage.svelte'

	type Props = {
		action?: string
		form?: { message: string } | { error: string } | null
		content?: Snippet
		buttons: Snippet
		callback?: () => void
		button_alignment?: 'space-between' | 'center'
		buttons_reversed?: boolean
	}

	let {
		action = '',
		form,
		content,
		buttons,
		callback,
		buttons_reversed = false,
		button_alignment = 'space-between',
	}: Props = $props()

	let sending = $state(false)
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		sending = true
		return async ({ update }) => {
			await update()
			sending = false
			callback?.()
		}
	}}
>
	{@render content?.()}

	<fieldset
		class="buttons"
		class:reversed={buttons_reversed}
		style:--button-alignment={button_alignment}
		disabled={sending}
	>
		{@render buttons()}
	</fieldset>
</form>

{#if form}
	{#if 'error' in form}
		<BlockError content={form.error} />
	{:else if 'message' in form}
		<BlockMessage content={form.message} />
	{/if}
{/if}

<style>
	.buttons {
		margin-top: 1.5rem;
		display: flex;
		gap: 0.5rem;
		justify-content: var(--button-alignment);
		align-items: center;
	}

	.buttons.reversed {
		flex-direction: row-reverse;
	}
</style>
