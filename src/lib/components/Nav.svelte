<script lang="ts">
	import { PencilLine, User, CirclePlus, House, LogIn, UserPlus } from 'lucide-svelte'
	import { page } from '$app/state'
</script>

<nav>
	<ul>
		{#if page.data.user}
			<li>
				<a href="/dashboard"><PencilLine size={20} /> Diary</a>
			</li>
			<li>
				<a href="/account">
					<User size={20} />
					Account</a
				>
			</li>
			<li>
				<a href="/entry/new"><CirclePlus size={20} /> New entry</a>
			</li>
		{:else}
			<li>
				<a href="/"><House size={20} /> Home</a>
			</li>
			<li>
				<a href="/login"><LogIn size={20} /> Login</a>
			</li>
			<li>
				<a href="/register"><UserPlus size={20} /> Register</a>
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

	a {
		display: inline-flex;
		gap: 0.4rem;
		align-items: center;
		text-decoration: none;
		outline: 1px solid var(--dark-outline-color);
		border-radius: 0.5rem;
		padding: 0.25rem 0.6rem;
		background-color: var(--input-bg-color);
	}
</style>
