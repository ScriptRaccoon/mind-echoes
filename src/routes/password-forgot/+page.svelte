<script lang="ts">
	let { form } = $props()
</script>

<header>
	<h1>Forgot your password?</h1>
</header>

<p>Enter your email. We will send you a link to reset your password.</p>

<form method="POST">
	<div class="form-group">
		<label for="email">Email</label>
		<input type="email" name="email" id="email" required value={form?.email ?? ''} />
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
