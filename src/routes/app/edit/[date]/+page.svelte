<script lang="ts">
	import { t } from '$lib/translations/main.js'

	let { form, data } = $props()

	let entry = $derived(data.entry)

	let confirm_deletion = $state(false)

	function handle_confirm_click() {
		confirm_deletion = true
	}
</script>

<h1>{t('entry.edit_title', data.lang)} {entry.date}</h1>

<form method="POST" action="?/update">
	<div class="form-group">
		<label for="title">{t('entry.title', data.lang)}</label>
		<input type="text" name="title" id="title" value={entry.title} />
	</div>

	<div class="form-group">
		<label for="content">{t('entry.content', data.lang)}</label>
		<textarea name="content" id="content">{entry.content}</textarea>
	</div>

	<div class="form-group">
		<label for="thanks">{t('entry.thanks', data.lang)}</label>
		<textarea name="thanks" id="thanks">{entry.thanks}</textarea>
	</div>

	<div class="form-actions">
		<button>{t('update', data.lang)}</button>

		{#if confirm_deletion}
			<button class="danger" formaction="?/delete">
				{t('delete_yes', data.lang)}
			</button>
		{:else}
			<button class="danger" type="button" onclick={handle_confirm_click}>
				{t('delete', data.lang)}
			</button>
		{/if}
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if confirm_deletion}
	<p>{t('delete_sure', data.lang)}</p>
{:else if form?.message}
	<p class="message">{form.message}</p>
{/if}

<style>
	.form-actions {
		flex-direction: row-reverse;
	}

	#content {
		height: 10lh;
	}

	#thanks {
		height: 6lh;
	}
</style>
