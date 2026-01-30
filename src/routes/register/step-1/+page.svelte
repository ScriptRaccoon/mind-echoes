<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'

	let { form } = $props()
</script>

<RegistrationHeader step={1} />

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" name="email" id="email" value={form?.email ?? ''} required />
		</div>

		<div class="form-group">
			<label for="username">Username</label>
			<input
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
