<script lang="ts">
	import { t } from '$lib/translations/main'
	import { format_date } from '$lib/utils'

	let { form, data } = $props()

	let entry = $derived(data.entry)

	let confirm_deletion = $state(false)

	function handle_confirm_click() {
		confirm_deletion = true
	}
</script>

<h1>{t('entry.edit_title')} {format_date(entry.date)}</h1>

<form method="POST" action="?/update">
	<div class="form-group">
		<label for="title">{t('entry.title')}</label>
		<input type="text" name="title" id="title" value={entry.title} />
	</div>

	<div class="form-group">
		<label for="content">{t('entry.content')}</label>
		<textarea name="content" id="content">{entry.content}</textarea>
	</div>

	<div class="form-group">
		<label for="thanks">{t('entry.thanks')}</label>
		<textarea name="thanks" id="thanks">{entry.thanks}</textarea>
	</div>

	<div class="form-actions">
		<button>{t('update')}</button>

		{#if confirm_deletion}
			<button class="danger" formaction="?/delete">
				{t('delete_yes')}
			</button>
		{:else}
			<button class="danger" type="button" onclick={handle_confirm_click}>
				{t('delete')}
			</button>
		{/if}
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if confirm_deletion}
	<p>{t('delete_sure')}</p>
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
