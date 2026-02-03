<script lang="ts">
	import { page } from '$app/state'
	import BlockError from '$lib/components/BlockError.svelte'
	import BlockMessage from '$lib/components/BlockMessage.svelte'
	import DeviceTable from '$lib/components/DeviceTable.svelte'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import TextInput from '$lib/components/TextInput.svelte'

	let { data, form } = $props()

	function open_delete_account_dialog() {
		open_dialog({
			question: 'Do you want to delete your account? All data will be permanently lost.',
			action: '?/delete_account',
		})
	}
</script>

<svelte:head>
	<title>{APP_TITLE} - Account</title>
</svelte:head>

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
			<TextInput
				name="username"
				label="New username"
				value={page.data.user?.username ?? ''}
				defaultValue={page.data.user?.username ?? ''}
			/>
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
			<TextInput
				name="email"
				type="email"
				label="New email"
				value={page.data.user?.email}
				defaultValue={page.data.user?.email}
			/>
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
			<TextInput name="current_password" label="Current password" type="password" />
			<TextInput name="new_password" label="New password" type="password" />
		{/snippet}

		{#snippet buttons()}
			<button class="button">Submit</button>
		{/snippet}
	</FormWrapper>
</section>

<section>
	<h2>Manage Devices</h2>

	{#if data.devices.length}
		<DeviceTable devices={data.devices} current_device_id={data.current_device_id} />
	{:else}
		<p>No devices</p>
	{/if}
</section>

<section>
	<h2>Delete account</h2>
	<button class="button danger" onclick={open_delete_account_dialog}>Delete</button>

	{#if form?.type === 'delete_account' && form.error}
		<BlockError content={form.error} />
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
