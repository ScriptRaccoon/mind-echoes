<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'
	import { APP_TITLE } from '$lib/client/config'

	let { form } = $props()
</script>

<svelte:head>
	<title>{APP_TITLE} - Register</title>
</svelte:head>

<RegistrationHeader step={1} />

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="email">Email</label>
			<input
				class="input"
				type="email"
				name="email"
				id="email"
				value={form?.email ?? ''}
				required
			/>
		</div>

		<div class="form-group">
			<label class="label" for="username">Username</label>
			<input
				class="input"
				type="text"
				name="username"
				id="username"
				value={form?.username ?? ''}
				required
			/>
		</div>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Continue</button>
	{/snippet}
</FormWrapper>
