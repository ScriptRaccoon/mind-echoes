<script lang="ts">
	import { t } from '$lib/translations/main'
</script>

<nav>
	<ul>
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
