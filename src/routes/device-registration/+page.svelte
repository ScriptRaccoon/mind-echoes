<script lang="ts">
	let { form } = $props()
</script>

<h1>Device registration</h1>

<form method="POST">
	<div class="form-group">
		<label for="device_label">Device label</label>
		<input type="text" name="device_label" id="device_label" required />
	</div>

	<div class="form-actions">
		<button>Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
