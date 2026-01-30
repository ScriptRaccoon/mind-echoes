<script lang="ts">
	let { step }: { step: number } = $props()
</script>

<header>
	<h1>Register</h1>
	<span class="step">Step {step}/3</span>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: end;
	}

	.step {
		font-size: 0.875rem;
	}
</style>
