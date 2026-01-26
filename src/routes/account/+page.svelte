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
	<h2>Change email address</h2>

	<form method="POST" action="?/email" use:enhance>
		<div class="form-group">
			<label for="email">New email</label>
			<input
				type="email"
				name="email"
				id="email"
				required
				value={page.data.user?.email}
			/>
		</div>

		<div>
			<button class="button">Submit</button>
		</div>
	</form>

	{#if form?.error && form.type === 'email'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'email'}
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
<!-- 
<section>
	<h2>Devices</h2>
	<div class="device-table">
		<span class="head">Label</span>
		<span class="head">Date</span>
		<span></span>
		{#each data.devices as device (device.id)}
			{@const is_current = device.id === data.current_device_id}
			<span
				>{device.label}
				{#if is_current}
					[this device]
				{/if}
			</span>

			<span>{device.created_at.substring(0, 10)}</span>

			{#if device.approved_at === null}
				<form action="?/approve_device" method="POST" use:enhance>
					<input type="hidden" name="device_id" value={device.id} />
					<button class="button">Approve</button>
				</form>
			{:else}
				<form action="?/remove_device" method="POST" use:enhance>
					<input type="hidden" name="device_id" value={device.id} />
					<button class="button" disabled={is_current}>Remove</button>
				</form>
			{/if}
		{/each}
	</div>

	{#if form?.error && form.type === 'device'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'device'}
		<p class="message">{form.message}</p>
	{/if}
</section> -->

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

	/*
	.device-table {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		align-items: center;
		gap: 0.75rem 0.5rem;

		.head {
			font-weight: bold;
		}
	}
	*/
</style>
