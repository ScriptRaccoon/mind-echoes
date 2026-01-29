<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import DeviceTable from '$lib/components/DeviceTable.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'

	let { data, form } = $props()

	function open_delete_account_dialog() {
		open_dialog({
			question: 'Do you want to delete your account? All data will be permanently lost.',
			action: '?/delete_account',
		})
	}

	function open_remove_device_dialog(device_id: number) {
		open_dialog({
			question: 'Do you want to remove this device?',
			action: '?/remove_device',
			id: device_id,
		})
	}
</script>

<header>
	<h1>Account</h1>
	<a href="/logout" class="button">Logout</a>
</header>

{#if data.message}
	<p class="message">
		{data.message}
	</p>
{/if}

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

<section>
	<h2>Devices</h2>

	<DeviceTable
		devices={data.devices}
		current_device_id={data.current_device_id}
		remove_device={open_remove_device_dialog}
	/>

	{#if form?.error && form.type === 'device'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.type === 'device'}
		<p class="message">{form.message}</p>
	{/if}
</section>

<section>
	<h2>Delete account</h2>
	<button class="button danger" onclick={open_delete_account_dialog}>Delete</button>

	{#if form?.error && form.type === 'delete_account'}
		<p class="error">{form.error}</p>
	{/if}
</section>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	section + section {
		margin-top: 2rem;
	}
</style>
