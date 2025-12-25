<script lang="ts">
	import { page } from '$app/state'
	import { t } from '$lib/translations/main.js'
	import { format_date } from '$lib/utils.js'

	let { data, form } = $props()

	let date = $derived(page.params.date!)
</script>

<h1>{t('entry.new_title', data.lang)} {format_date(date, data.lang)}</h1>

<form method="POST">
	<div class="form-group">
		<label for="title">{t('entry.title', data.lang)}</label>
		<input type="text" name="title" id="title" />
	</div>

	<div class="form-group">
		<label for="content">{t('entry.content', data.lang)}</label>
		<textarea name="content" id="content"></textarea>
	</div>

	<div class="form-group">
		<label for="thanks">{t('entry.thanks', data.lang)}</label>
		<textarea name="thanks" id="thanks"></textarea>
	</div>

	<div class="form-actions">
		<button>{t('create', data.lang)}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	#content {
		height: 10lh;
	}

	#thanks {
		height: 6lh;
	}
</style>
