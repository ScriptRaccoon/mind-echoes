<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/config'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Forgot password</title>
</svelte:head>

<header>
	<h1>Forgot your password?</h1>
</header>

<p>Enter your email. We will send you a link to reset your password.</p>

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="email">Email</label>
			<input
				class="input"
				type="email"
				name="email"
				id="email"
				required
				value={form?.email ?? ''}
			/>
		</div>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
