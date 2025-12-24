<nav>
	<ul>
		<li>
			<a href="/app">Diary</a>
		</li>
		<li>
			<a href="/app/account">Account</a>
		</li>
		<li>
			<a href="/app/new">New entry</a>
		</li>
		<li>
			<a href="/app/logout" data-sveltekit-preload-data="off">Logout</a>
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
