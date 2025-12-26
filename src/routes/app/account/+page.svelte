<script lang="ts">
	import { enhance } from '$app/forms'
	import { SUPPORTED_LANGUAGES, t } from '$lib/translations/main'

	let { data, form } = $props()

	let confirm_deletion = $state(false)

	function handle_confirm_click() {
		confirm_deletion = true
	}
</script>

<h1>{t('account.title')}</h1>

<section>
	<h2>{t('change.language')}</h2>

	<form method="POST" action="?/lang" use:enhance>
		<div class="form-group">
			<label for="lang">{t('choose.language')}</label>
			<select name="lang" id="lang">
				{#each SUPPORTED_LANGUAGES as lang_option}
					<option value={lang_option} selected={data.lang === lang_option}>
						{lang_option}
					</option>
				{/each}
			</select>
		</div>

		<div class="form-actions">
			<button>{t('submit')}</button>
		</div>
	</form>
</section>

<section>
	<h2>{t('change.password')}</h2>

	<form method="POST" action="?/password" use:enhance>
		<div class="form-group">
			<label for="current_password">{t('password.current')}</label>
			<input type="password" name="current_password" id="current_password" />
		</div>

		<div class="form-group">
			<label for="new_password">{t('password.new')}</label>
			<input type="password" name="new_password" id="new_password" />
		</div>

		<div class="form-actions">
			<button>{t('submit')}</button>
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
	<h2>{t('change.username')}</h2>

	<form method="POST" action="?/username" use:enhance>
		<div class="form-group">
			<label for="username">{t('username.new')}</label>
			<input type="text" name="username" id="username" value={data.username} />
		</div>

		<div class="form-actions">
			<button>{t('submit')}</button>
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
	<h2>{t('backup.create')}</h2>

	<form method="GET" action="/app/api/backup">
		<div class="form-actions">
			<button>{t('backup.download')}</button>
		</div>
	</form>
</section>

<section>
	<h2>{t('backup.restore')}</h2>

	<p>{t('backup.warning')}</p>

	<form method="POST" action="?/backup" enctype="multipart/form-data" use:enhance>
		<div class="form-group">
			<input
				type="file"
				name="file"
				id="file"
				required
				accept="application/json"
				class="sr-only"
			/>
			<label for="file">{t('choose.file')}</label>
		</div>

		<div class="form-actions">
			<button>{t('backup.upload')}</button>
		</div>
	</form>

	{#if form?.error && form.type === 'backup'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'backup'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>{t('account.delete')}</h2>

	{#if confirm_deletion}
		<p>{t('account.warning')}</p>

		<form method="POST" action="?/delete" use:enhance>
			<div class="form-group">
				<label for="yes">{t('confirm_yes')}</label>
				<input type="text" name="yes" id="yes" />
			</div>

			<div class="form-actions">
				<button class="danger">{t('delete.data')}</button>
			</div>
		</form>
	{:else}
		<div class="form-actions">
			<button class="danger" onclick={handle_confirm_click}>
				{t('delete.data')}
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
