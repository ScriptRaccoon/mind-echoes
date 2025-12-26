<script lang="ts">
	import { enhance } from '$app/forms'
	import { t } from '$lib/translations/main'

	let { form, data } = $props()
</script>

<h1>{t('login.title')}</h1>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="password">{t('password')}</label>
		<input type="password" id="password" name="password" />
	</div>

	<div class="form-actions">
		<button>{t('submit')}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{:else if data.message}
	<p class="message">{data.message}</p>
{/if}
