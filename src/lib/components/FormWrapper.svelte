<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Snippet } from 'svelte'
	import BlockError from './BlockError.svelte'
	import BlockMessage from './BlockMessage.svelte'
	import LoadingSpinner from './LoadingSpinner.svelte'
	import { fade } from 'svelte/transition'

	type Props = {
		action?: string
		form?: { message: string } | { error: string } | null
		content?: Snippet
		buttons: Snippet<[sending?: boolean]>
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

	let show_spinner = $state(false)

	$effect(() => {
		if (sending) {
			setTimeout(() => {
				if (sending) show_spinner = true
			}, 100)
		} else {
			show_spinner = false
		}
	})
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
		{@render buttons(sending)}
		{#if show_spinner}
			<LoadingSpinner />
		{/if}
	</fieldset>
</form>

{#if !sending && form && 'error' in form}
	<div in:fade={{ duration: 160 }}>
		<BlockError content={form.error} />
	</div>
{/if}

{#if !sending && form && 'message' in form}
	<div in:fade={{ duration: 160 }}>
		<BlockMessage content={form.message} />
	</div>
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
