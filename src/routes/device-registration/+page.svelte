<script lang="ts">
	let { data, form } = $props()
</script>

<header>
	<h1>Device registration</h1>
</header>

<form method="POST">
	<div class="form-group">
		<label for="device_label">Device label</label>
		<input
			type="text"
			name="device_label"
			id="device_label"
			required
			value={form?.device_label ?? data.os}
		/>
	</div>

	<div>
		<button class="button">Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.message}
	<p class="message">{form.message}</p>
{/if}
