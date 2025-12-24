<script lang="ts">
	import Nav from '$lib/components/Nav.svelte'

	let { data, children } = $props()
</script>

<Nav lang={data.lang} />

{@render children()}
