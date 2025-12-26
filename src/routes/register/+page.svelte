<script lang="ts">
	import { enhance } from '$app/forms'
	import { t } from '$lib/translations/main'

	let { form } = $props()
</script>

<h1>{t('register.title')}</h1>

<p>{t('register.hint')}</p>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="username">{t('username')}</label>
		<input type="text" name="username" id="username" value={form?.username ?? ''} />
	</div>

	<div class="form-group">
		<label for="password">{t('password')}</label>
		<input type="password" name="password" id="password" />
	</div>

	<div class="form-actions">
		<button>{t('submit')}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
