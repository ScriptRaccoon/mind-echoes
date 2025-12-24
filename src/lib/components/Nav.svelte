<script lang="ts">
	import { t, type Lang } from '$lib/translations/main'

	type Props = {
		lang: Lang
	}

	let { lang }: Props = $props()
</script>

<nav>
	<ul>
		<li>
			<a href="/app">
				{t('nav.diary', lang)}
			</a>
		</li>
		<li>
			<a href="/app/account">
				{t('nav.account', lang)}
			</a>
		</li>
		<li>
			<a href="/app/new">
				{t('nav.new_entry', lang)}
			</a>
		</li>
		<li>
			<a href="/app/logout" data-sveltekit-preload-data="off">
				{t('nav.logout', lang)}
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
