<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { t } from '$lib/translations/main'
	import { format_date } from '$lib/utils'

	let { form } = $props()

	let date = $derived(page.params.date!)
</script>

<h1 class="date">{t('entry.new')} &ndash; {format_date(date)}</h1>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="title">{t('entry.title')}</label>
		<input class="title" type="text" name="title" id="title" />
	</div>

	<div class="form-group">
		<label for="content">{t('entry.content')}</label>
		<textarea name="content" id="content"></textarea>
	</div>

	<div class="form-group">
		<label for="thanks">{t('entry.thanks')}</label>
		<textarea name="thanks" id="thanks"></textarea>
	</div>

	<div class="form-actions">
		<button>{t('create')}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.form-group {
		margin-bottom: 1.5rem;
	}

	#content {
		height: 10lh;
	}

	#thanks {
		height: 6lh;
	}
</style>
