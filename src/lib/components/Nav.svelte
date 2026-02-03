<script lang="ts">
	import { User, SquarePlus, House, LogIn, UserPlus, BookOpen } from 'lucide-svelte'
	import { page } from '$app/state'

	let is_entry_page = $derived(
		page.url.pathname == '/dashboard' ||
			(page.url.pathname.startsWith('/entry') &&
				!page.url.pathname.startsWith('/entry/new')),
	)
</script>

<nav>
	<ul>
		{#if page.data.user}
			<li>
				<a href="/dashboard" aria-current={is_entry_page}>
					<BookOpen /> <span>Echoes</span>
				</a>
			</li>
			<li>
				<a href="/entry/new" aria-current={page.url.pathname.startsWith('/entry/new')}>
					<SquarePlus /> <span>New Echo</span>
				</a>
			</li>
			<li>
				<a href="/account" aria-current={page.url.pathname.startsWith('/account')}>
					<User /> <span>Account</span>
				</a>
			</li>
		{:else}
			<li>
				<a href="/" aria-current={page.url.pathname == '/'}>
					<House /> <span>Home</span>
				</a>
			</li>
			<li>
				<a href="/login" aria-current={page.url.pathname == '/login'}>
					<LogIn /> <span>Login</span>
				</a>
			</li>
			<li>
				<a
					href="/register/step-1"
					aria-current={page.url.pathname.startsWith('/register')}
				>
					<UserPlus /> <span>Register</span>
				</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		padding-block: 1rem 0.75rem;
		background-color: var(--nav-bg-color);
		border-bottom: 1px solid var(--dark-outline-color);
		position: sticky;
		top: 0;
		box-shadow: 1rem 0rem 2rem #0004;
	}

	ul {
		list-style-type: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: min(95vw, 20rem);
		margin-inline: auto;
	}

	a {
		padding-inline: 0.5rem;
		text-decoration: none;
		display: flex;
		gap: 0.25rem;
		flex-direction: column;
		align-items: center;
		transition: color var(--transition-duration);
		color: var(--secondary-font-color);
	}

	a[aria-current='true'] {
		color: var(--font-color);
	}
</style>
