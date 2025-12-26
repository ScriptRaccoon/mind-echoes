<script lang="ts">
	import { t } from '$lib/translations/main'
</script>

<nav>
	<ul>
		<li>
			<a href="/app">
				{t('nav.diary')}
			</a>
		</li>
		<li>
			<a href="/app/account">
				{t('nav.account')}
			</a>
		</li>
		<li>
			<a href="/app/new">
				{t('nav.new_entry')}
			</a>
		</li>
		<li>
			<a href="/app/logout" data-sveltekit-preload-data="off">
				{t('nav.logout')}
			</a>
		</li>
	</ul>
</nav>

<style>
	nav {
		margin-top: 1rem;
	}

	ul {
		list-style-type: none;
		display: flex;
		gap: 1rem;
	}
</style>
