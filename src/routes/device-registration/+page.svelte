<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'

	let { data, form } = $props()
</script>

<header>
	<h1>Device registration</h1>
</header>

<p>This is the first time you log in from this device. You need to first register it.</p>

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="device_label">Name this new device</label>
			<input
				class="input"
				type="text"
				name="device_label"
				id="device_label"
				required
				value={form?.device_label ?? data.device_label}
			/>
		</div>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Submit</button>
	{/snippet}
</FormWrapper>
