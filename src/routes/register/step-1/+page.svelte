<script lang="ts">
	import { enhance } from '$app/forms'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'

	let { form } = $props()
</script>

<RegistrationHeader step={1} />

<form method="POST" use:enhance>
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

	<div>
		<button class="button">Continue</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
