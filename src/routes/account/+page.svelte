<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { open_dialog } from '$lib/components/Dialog.svelte'

	let { data, form } = $props()

	function open_delete_dialog() {
		open_dialog({
			question: 'Do you want to delete your account? All data will be permanently lost.',
			action: '?/delete',
		})
	}
</script>

<h1>Account</h1>

<section>
	<h2>Change username</h2>

	<form method="POST" action="?/username" use:enhance>
		<div class="form-group">
			<label for="username">New username</label>
			<input
				type="text"
				name="username"
				id="username"
				value={page.data.user?.username ?? ''}
				required
			/>
		</div>

		<div>
			<button class="button">Submit</button>
		</div>
	</form>

	{#if form?.error && form.type === 'username'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'username'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>Change password</h2>

	<form method="POST" action="?/password" use:enhance>
		<div class="form-group">
			<label for="current_password">Current password</label>
			<input type="password" name="current_password" id="current_password" required />
		</div>

		<div class="form-group">
			<label for="new_password">New password</label>
			<input type="password" name="new_password" id="new_password" required />
		</div>

		<div>
			<button class="button">Submit</button>
		</div>
	</form>

	{#if form?.error && form.type === 'password'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'password'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>Devices</h2>
	<ul class="device-list">
		{#each data.devices as device (device.id)}
			<li>
				<form action="?/remove_device" method="POST" use:enhance class="device-form">
					<span>{device.label}</span>
					<input type="hidden" name="device_id" value={device.id} />
					<div>
						<button class="button">Remove</button>
					</div>
				</form>
			</li>
		{/each}
	</ul>

	{#if form?.error && form.type === 'device'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'device'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>Delete account</h2>
	<button class="button danger" onclick={open_delete_dialog}>Delete</button>

	{#if form?.error && form.type === 'delete'}
		<p class="error">{form.error}</p>
	{/if}
</section>

<style>
	section + section {
		margin-top: 2rem;
	}

	.device-list {
		padding-left: 2rem;
	}

	.device-form {
		margin-bottom: 0.5rem;
		display: flex;
		justify-content: space-between;
	}
</style>
