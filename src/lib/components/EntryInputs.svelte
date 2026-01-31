<script lang="ts">
	import type { Entry } from '$lib/types'
	import { resize_textarea } from '$lib/utils'

	type Props = {
		entry?: Entry
	}

	let { entry }: Props = $props()
</script>

<section>
	<h2 id="title">Title</h2>

	<input
		aria-labelledby="title"
		type="text"
		name="title"
		id="title"
		value={entry?.title}
		class="text"
	/>
</section>

<section>
	<h2 id="content">This is on my mind</h2>

	<textarea
		class="text"
		aria-labelledby="content"
		name="content"
		id="content"
		{@attach resize_textarea}
		value={entry?.content}
	></textarea>
</section>

<section>
	<h2 id="thanks">I am thankful for</h2>

	<textarea
		aria-labelledby="thanks"
		class="text"
		name="thanks"
		id="thanks"
		{@attach resize_textarea}
		value={entry?.thanks}
	></textarea>
</section>

<style>
	section + section {
		margin-top: 2rem;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.2rem 0.5rem;
		border-radius: 0.5rem;
		outline: 1px solid var(--dark-outline-color);
	}
</style>
