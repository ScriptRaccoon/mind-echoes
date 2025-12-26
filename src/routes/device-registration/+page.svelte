<script lang="ts">
	let { form } = $props()
</script>

<h1>Device Registration</h1>

<form method="POST">
	<div class="form-group">
		<label for="device">Device Label</label>
		<input type="text" name="device" id="device" required />
	</div>

	<div class="form-actions">
		<button>Submit</button>
	</div>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{:else if form?.message}
	<p class="message">{form.message}</p>

	<p>
		<a href="/login">Login</a>
	</p>
{/if}
