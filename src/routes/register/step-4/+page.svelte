<script lang="ts">
	import { enhance } from '$app/forms'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'

	let { form } = $props()

	function send_mail_again() {
		window.location.reload()
	}
</script>

<RegistrationHeader step={4} />

<p>
	To verify your email address, we have sent you a registration code. Enter it below to
	complete the registration.
</p>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="code">Registration Code</label>
		<input type="number" name="code" id="code" required />
	</div>

	<div class="actions">
		<button class="button">Submit</button>
		<button type="button" class="button" onclick={send_mail_again}
			>Send email again</button
		>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.actions {
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
		align-items: center;
	}
</style>
