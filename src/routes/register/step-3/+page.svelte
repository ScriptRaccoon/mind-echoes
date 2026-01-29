<script lang="ts">
	import { enhance } from '$app/forms'
	import RegistrationHeader from '$lib/components/RegistrationHeader.svelte'

	let { data, form } = $props()
</script>

<RegistrationHeader step={3} />

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="device_label">Device Label</label>
		<input
			type="text"
			name="device_label"
			id="device_label"
			required
			value={form?.device_label ?? data.os}
		/>
	</div>

	<div>
		<button class="button">Continue</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
