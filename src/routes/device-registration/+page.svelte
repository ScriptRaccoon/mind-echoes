<script lang="ts">
	import { t } from '$lib/translations/main'

	let { form } = $props()
</script>

<h1>{t('device.registration')}</h1>

<form method="POST">
	<div class="form-group">
		<label for="device_label">{t('device.label')}</label>
		<input type="text" name="device_label" id="device_label" required />
	</div>

	<div class="form-actions">
		<button>{t('submit')}</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{:else if form?.message}
	<p class="message">{form.message}</p>

	<!-- <p>
		<a href="/login">{t('login.title')}</a>
	</p> -->
{/if}
