<script lang="ts">
	import { page } from '$app/state'
</script>

<nav>
	<ul>
		{#if page.data.user}
			<li>
				<a href="/dashboard">Diary</a>
			</li>
			<li>
				<a href="/account">Account</a>
			</li>
			<li>
				<a href="/entry/new">New entry</a>
			</li>
		{:else}
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/login">Login</a>
			</li>
			<li>
				<a href="/register">Register</a>
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
