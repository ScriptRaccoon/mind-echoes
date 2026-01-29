<script lang="ts">
	import { PencilLine, User, CirclePlus, House, LogIn, UserPlus } from 'lucide-svelte'
	import { page } from '$app/state'

	let is_echo_page = $derived(
		page.url.pathname == '/dashboard' ||
			(page.url.pathname.startsWith('/entry') &&
				!page.url.pathname.startsWith('/entry/new')),
	)
</script>

<nav>
	<ul>
		{#if page.data.user}
			<li>
				<a href="/dashboard" aria-current={is_echo_page}>
					<PencilLine size={20} /> Echoes
				</a>
			</li>
			<li>
				<a href="/account" aria-current={page.url.pathname == '/account'}>
					<User size={20} /> Account
				</a>
			</li>
			<li>
				<a href="/entry/new" aria-current={page.url.pathname.startsWith('/entry/new')}>
					<CirclePlus size={20} /> New Echo
				</a>
			</li>
		{:else}
			<li>
				<a href="/" aria-current={page.url.pathname == '/'}>
					<House size={20} /> Home
				</a>
			</li>
			<li>
				<a href="/login" aria-current={page.url.pathname == '/login'}>
					<LogIn size={20} /> Login
				</a>
			</li>
			<li>
				<a
					href="/register/step-1"
					aria-current={page.url.pathname.startsWith('/register')}
				>
					<UserPlus size={20} /> Register
				</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		margin-block: 1rem;
	}

	ul {
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	a {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
		text-decoration: none;
		outline: 1px solid var(--dark-outline-color);
		border-radius: 0.5rem;
		padding: 0.4rem 0.6rem;
		background-color: var(--input-bg-color);
		font-size: 0.875rem;
		white-space: nowrap;
	}

	a[aria-current='true'] {
		outline-color: var(--outline-color);
	}
</style>
