<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'

	let { form } = $props()
</script>

<header>
	<h1>Reset password</h1>
</header>

<p>Choose a new, secure password.</p>

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" name="password" id="password" required />
		</div>

		<div class="form-group">
			<label for="repeat_password">Repeat password</label>
			<input type="password" name="repeat_password" id="repeat_password" required />
		</div>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
