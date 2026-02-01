<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'
	import { APP_TITLE } from '$lib/client/config'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Register</title>
</svelte:head>

<RegistrationHeader step={2} />

<p>Choose a secure password.</p>

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="password">Password</label>
			<input class="input" type="password" name="password" id="password" required />
		</div>

		<div class="form-group">
			<label class="label" for="repeat_password">Repeat password</label>
			<input
				class="input"
				type="password"
				name="repeat_password"
				id="repeat_password"
				required
			/>
		</div>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Continue</button>
	{/snippet}
</FormWrapper>
