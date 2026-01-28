<script module>
	type DialogState = {
		open: boolean
		question: string
		action: string
		id?: number
	}

	export const dialog_state = $state<DialogState>({
		open: false,
		question: '',
		action: '',
	})

	export function open_dialog(data: Omit<DialogState, 'open'>) {
		dialog_state.open = true
		dialog_state.question = data.question
		dialog_state.action = data.action
		if (data.id !== undefined) dialog_state.id = data.id
	}

	export function close_dialog() {
		dialog_state.open = false
		dialog_state.question = ''
		dialog_state.action = ''
		delete dialog_state.id
	}
</script>

<script lang="ts">
	import { enhance } from '$app/forms'

	let dialog_element = $state<HTMLDialogElement | null>(null)

	$effect(() => {
		if (dialog_state.open) {
			dialog_element?.showModal()
		} else {
			dialog_element?.close()
		}
	})
</script>

<dialog bind:this={dialog_element} onclose={close_dialog}>
	<div class="question">{dialog_state.question}</div>

	<form
		class="actions"
		method="POST"
		action={dialog_state.action}
		use:enhance={() => {
			return async ({ update }) => {
				await update()
				close_dialog()
			}
		}}
	>
		{#if dialog_state.id !== undefined}
			<input type="hidden" name="id" value={dialog_state.id} />
		{/if}
		<div class="actions">
			<button class="button" type="button" onclick={close_dialog}>Cancel</button>
			<button class="button danger">Yes</button>
		</div>
	</form>
</dialog>

<style>
	dialog {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(95vw, 40ch);
		background-color: var(--bg-color);
		color: inherit;
		padding: 1rem;
		border-radius: 1rem;
		border: 1px solid var(--outline-color);
	}

	dialog::backdrop {
		background-color: #0005;
	}

	.question {
		font-size: 1.25rem;
		text-align: center;
		margin-bottom: 1rem;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}
</style>
