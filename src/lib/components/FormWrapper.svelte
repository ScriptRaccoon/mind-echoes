<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Snippet } from 'svelte'
	import BlockError from './BlockError.svelte'
	import BlockMessage from './BlockMessage.svelte'
	import LoadingSpinner from './LoadingSpinner.svelte'
	import { fade } from 'svelte/transition'
	import { TRANSITION_DURATION } from '$lib/client/config'

	type Props = {
		action?: string
		form?: { message: string } | { error: string } | null
		content?: Snippet
		buttons: Snippet<[sending?: boolean]>
		callback?: () => void
		button_alignment?: 'space-between' | 'center'
		button_direction?: 'row' | 'row-reverse'
	}

	let {
		action = '',
		form,
		content,
		buttons,
		callback,
		button_alignment = 'space-between',
		button_direction = 'row',
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
		style:--button-alignment={button_alignment}
		style:--button-direction={button_direction}
		disabled={sending}
	>
		{@render buttons(sending)}
		{#if show_spinner}
			<div transition:fade={{ duration: TRANSITION_DURATION }}>
				<LoadingSpinner />
			</div>
		{/if}
	</fieldset>
</form>

{#if !sending && form && 'error' in form}
	<div in:fade={{ duration: TRANSITION_DURATION }}>
		<BlockError content={form.error} />
	</div>
{/if}

{#if !sending && form && 'message' in form}
	<div in:fade={{ duration: TRANSITION_DURATION }}>
		<BlockMessage content={form.message} />
	</div>
{/if}

<style>
	.buttons {
		margin-top: 1.5rem;
		display: flex;
		gap: 0.5rem;
		justify-content: var(--button-alignment);
		flex-direction: var(--button-direction);
		align-items: center;
	}
</style>
