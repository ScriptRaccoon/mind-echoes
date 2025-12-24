<script lang="ts">
	import { enhance } from '$app/forms'
	import { SUPPORTED_LANGUAGES, t } from '$lib/translations/main'

	let { data, form } = $props()

	let confirm_deletion = $state(false)

	function handle_confirm_click() {
		confirm_deletion = true
	}

	let lang = $derived(data.lang)
</script>

<h1>{t('account.title', lang)}</h1>

<section>
	<h2>{t('change.language', lang)}</h2>

	<form method="POST" action="?/lang" use:enhance>
		<div class="form-group">
			<label for="lang">{t('choose.language', lang)}</label>
			<select name="lang" id="lang">
				{#each SUPPORTED_LANGUAGES as lang_option}
					<option value={lang_option} selected={data.lang === lang_option}>
						{lang_option}
					</option>
				{/each}
			</select>
		</div>

		<div class="form-actions">
			<button>{t('submit', lang)}</button>
		</div>
	</form>
</section>

<section>
	<h2>{t('change.password', lang)}</h2>

	<form method="POST" action="?/password" use:enhance>
		<div class="form-group">
			<label for="current_password">{t('password.current', lang)}</label>
			<input type="password" name="current_password" id="current_password" />
		</div>

		<div class="form-group">
			<label for="new_password">{t('password.new', lang)}</label>
			<input type="password" name="new_password" id="new_password" />
		</div>

		<div class="form-actions">
			<button>{t('submit', lang)}</button>
		</div>
	</form>

	{#if form?.error && form.type === 'password'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'password'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>{t('change.username', lang)}</h2>

	<form method="POST" action="?/username" use:enhance>
		<div class="form-group">
			<label for="username">{t('username.new', lang)}</label>
			<input type="text" name="username" id="username" value={data.username} />
		</div>

		<div class="form-actions">
			<button>{t('submit', lang)}</button>
		</div>
	</form>

	{#if form?.error && form.type === 'username'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'username'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>{t('account.delete', lang)}</h2>

	{#if confirm_deletion}
		<p>{t('account.warning', lang)}</p>

		<form method="POST" action="?/delete" use:enhance>
			<div class="form-group">
				<label for="yes">{t('confirm_yes', lang)}</label>
				<input type="text" name="yes" id="yes" />
			</div>

			<div class="form-actions">
				<button class="danger">{t('delete.data', lang)}</button>
			</div>
		</form>
	{:else}
		<div class="form-actions">
			<button class="danger" onclick={handle_confirm_click}>
				{t('delete.data', lang)}
			</button>
		</div>
	{/if}

	{#if form?.error && form.type === 'delete'}
		<p class="error">{form.error}</p>
	{/if}
</section>

<style>
	section + section {
		margin-top: 2rem;
	}
</style>
