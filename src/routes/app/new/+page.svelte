<script lang="ts">
	import { t } from '$lib/translations/main'

	let { form } = $props()

	const today = new Date().toLocaleDateString('en-CA')

	let selected_date = $derived<string>(form?.date ?? today)
</script>

<h1>{t('new.title')}</h1>

<form method="POST">
	<div class="form-group">
		<label for="date">{t('choose.date')}</label>
		<input type="date" name="date" id="date" bind:value={selected_date} required />
	</div>

	<div class="form-actions">
		<button>{t('continue')}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
