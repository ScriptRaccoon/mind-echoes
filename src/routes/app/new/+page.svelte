<script lang="ts">
	import { t } from '$lib/translations/main.js'

	let { data, form } = $props()

	const today = new Date().toLocaleDateString('en-CA')

	let selected_date = $derived<string>(form?.date ?? today)
</script>

<h1>{t('new.title', data.lang)}</h1>

<form method="POST">
	<div class="form-group">
		<label for="date">{t('choose.date', data.lang)}</label>
		<input type="date" name="date" id="date" bind:value={selected_date} required />
	</div>

	<div class="form-actions">
		<button>{t('continue', data.lang)}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
