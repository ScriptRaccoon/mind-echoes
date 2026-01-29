<script lang="ts">
	import { APP_TITLE } from '$lib/config'
</script>

<h1>Welcome to {APP_TITLE}</h1>

<main>
	<p>
		Capture your thoughts, reflect on your gratitude, and explore your mind, all in one
		secure space.
	</p>

	<ul>
		<li>
			<strong>Express freely: </strong> Write down whatever's on your mind.
		</li>
		<li>
			<strong>Practice gratitude:</strong> Keep track of what you're thankful for.
		</li>
		<li>
			<strong>Seamless navigation:</strong> Browse your entries ("echoes") effortlessly.
		</li>
		<li>
			<strong>Encrypted & private:</strong> Your thoughts stay safe and secure.
		</li>
	</ul>

	<p>
		{APP_TITLE} makes self-reflection simple, safe, and meaningful.
	</p>

	<p>
		To get started, <a href="/login">log in</a> or
		<a href="/register/step-1">create an account</a>.
	</p>
</main>

<style>
	main {
		font-size: 1.25rem;
	}

	ul {
		padding-left: 2rem;
	}

	li {
		margin-block: 0.5rem;
	}

	strong {
		font-weight: 500;
		color: var(--accent-color);
	}
</style>
