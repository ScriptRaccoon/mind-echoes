<script lang="ts">
	import { enhance } from '$app/forms'
	import { t } from '$lib/translations/main.js'

	let { data, form } = $props()
</script>

<h1>{t('register.title', data.lang)}</h1>

<p>{t('register.hint', data.lang)}</p>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="username">{t('username', data.lang)}</label>
		<input type="text" name="username" id="username" value={form?.username ?? ''} />
	</div>

	<div class="form-group">
		<label for="password">{t('password', data.lang)}</label>
		<input type="password" name="password" id="password" />
	</div>

	<div class="form-actions">
		<button>{t('submit', data.lang)}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
