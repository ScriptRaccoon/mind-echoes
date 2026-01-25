<script lang="ts">
	import { page } from '$app/state'
	import { t } from '$lib/translations/main'
</script>

<nav>
	<ul>
		{#if page.data.user}
			<li>
				<a href="/dashboard">
					{t('nav.diary')}
				</a>
			</li>
			<li>
				<a href="/account">
					{t('nav.account')}
				</a>
			</li>
			<li>
				<a href="/new">
					{t('nav.new_entry')}
				</a>
			</li>
			<li>
				<a href="/logout" data-sveltekit-preload-data="off">
					{t('nav.logout')}
				</a>
			</li>
		{:else}
			<li>
				<a href="/">{t('nav.home')} </a>
			</li>
			<li>
				<a href="/login">{t('nav.login')}</a>
			</li>
			<li>
				<a href="/register">{t('nav.register')}</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		margin-top: 1rem;
	}

	ul {
		list-style-type: none;
		display: flex;
		justify-content: center;
		gap: 1rem;
	}
</style>
