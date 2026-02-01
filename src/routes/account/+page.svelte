<script lang="ts">
	import { page } from '$app/state'
	import BlockError from '$lib/components/BlockError.svelte'
	import BlockMessage from '$lib/components/BlockMessage.svelte'
	import DeviceTable from '$lib/components/DeviceTable.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'

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

{#if !form && data.message}
	<BlockMessage content={data.message} />
{/if}

<section>
	<h2>Change username</h2>

	<FormWrapper form={form?.type === 'username' ? form : null} action="?/username">
		{#snippet content()}
			<div class="form-group">
				<label class="label" for="username">New username</label>
				<input
					class="input"
					type="text"
					name="username"
					id="username"
					value={page.data.user?.username ?? ''}
					defaultValue={page.data.user?.username ?? ''}
					required
				/>
			</div>
		{/snippet}

		{#snippet buttons()}
			<button class="button">Submit</button>
		{/snippet}
	</FormWrapper>
</section>

<section>
	<h2>Change email address</h2>

	<FormWrapper form={form?.type === 'email' ? form : null} action="?/email">
		{#snippet content()}
			<div class="form-group">
				<label class="label" for="email">New email</label>
				<input
					class="input"
					type="email"
					name="email"
					id="email"
					required
					value={page.data.user?.email}
					defaultValue={page.data.user?.email}
				/>
			</div>
		{/snippet}

		{#snippet buttons()}
			<button class="button">Submit</button>
		{/snippet}
	</FormWrapper>
</section>

<section>
	<h2>Change password</h2>

	<FormWrapper form={form?.type === 'password' ? form : null} action="?/password">
		{#snippet content()}
			<div class="form-group">
				<label class="label" for="current_password">Current password</label>
				<input
					class="input"
					type="password"
					name="current_password"
					id="current_password"
					required
				/>
			</div>

			<div class="form-group">
				<label class="label" for="new_password">New password</label>
				<input
					class="input"
					type="password"
					name="new_password"
					id="new_password"
					required
				/>
			</div>
		{/snippet}

		{#snippet buttons()}
			<button class="button">Submit</button>
		{/snippet}
	</FormWrapper>
</section>

<section>
	<h2>Manage Devices</h2>

	<DeviceTable
		devices={data.devices}
		current_device_id={data.current_device_id}
		remove_device={open_remove_device_dialog}
	/>

	{#if form?.type === 'device'}
		{#if form.error}
			<BlockError content={form.error} />
		{/if}

		{#if form.message}
			<BlockMessage content={form.message} />
		{/if}
	{/if}
</section>

<section>
	<h2>Delete account</h2>
	<button class="button danger" onclick={open_delete_account_dialog}>Delete</button>

	{#if form?.type === 'delete_account' && form.error}
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
