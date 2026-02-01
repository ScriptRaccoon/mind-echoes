<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'
	import { APP_TITLE } from '$lib/config'

	let { form } = $props()

	function send_mail_again() {
		window.location.reload()
	}
</script>

<svelte:head>
	<title>{APP_TITLE} - Register</title>
</svelte:head>

<RegistrationHeader step={3} />

<p>
	To verify your email address, we have sent you a registration code. Enter it below to
	complete the registration.
</p>

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="code">Registration Code</label>
			<input class="input" type="number" name="code" id="code" required />
		</div>
	{/snippet}

	{#snippet buttons()}
		<button type="button" class="button" onclick={send_mail_again}>
			Send email again
		</button>

		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
