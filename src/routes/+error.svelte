<script lang="ts">
	import { page } from '$app/state'

	function go_back() {
		window.history.back()
	}
</script>

<header>
	<h1>{page.status}</h1>
</header>

<p>
	{page.error?.message}
</p>

<p>
	<button class="button" onclick={go_back}>Go back</button>
</p>
