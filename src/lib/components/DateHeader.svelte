<script lang="ts">
	type Props = {
		title: string
		date: string
	}

	let { title, date }: Props = $props()
</script>

<header>
	<h1>{title}</h1>
	<span>{date}</span>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	span {
		color: var(--secondary-font-color);
	}
</style>
