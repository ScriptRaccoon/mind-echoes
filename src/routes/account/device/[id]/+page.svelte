<script lang="ts">
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/client/config'
	import { localize_date } from '$lib/client/utils'
	import { Monitor, MonitorPlay } from 'lucide-svelte'

	let { data, form } = $props()

	function open_remove_device_dialog() {
		open_dialog({
			question: 'Do you want to remove this device?',
			action: '?/remove_device',
			id: data.id,
		})
	}
</script>

<svelte:head>
	<title>{APP_TITLE} - Manage Device</title>
</svelte:head>

<p>
	<a class="back" href="/account">Back to Account Page</a>
</p>

<header>
	<h1>
		{#if data.is_current_device}
			<MonitorPlay />
		{:else}
			<Monitor />
		{/if}
		{data.label}
	</h1>
</header>

{#if data.is_current_device}
	<p class="info">This is your current device.</p>
{/if}

<div class="stats">
	<div>
		<strong>Created:</strong>
		{localize_date(data.created_at)}
	</div>

	{#if data.last_login_at}
		<div>
			<strong>Last Login:</strong>
			{localize_date(data.last_login_at)}
		</div>
	{/if}
</div>

<section>
	<h2>Rename Device</h2>

	<FormWrapper {form} action="?/rename_device">
		{#snippet content()}
			<div class="form-group">
				<label for="label" class="label">Label</label>
				<input
					class="input"
					type="text"
					id="label"
					name="label"
					value={data.label}
					defaultValue={data.label}
				/>
			</div>
		{/snippet}

		{#snippet buttons()}
			<button class="button">Rename</button>
		{/snippet}
	</FormWrapper>
</section>

{#if !data.is_current_device}
	<section>
		<h2>Delete Device</h2>
		<button class="button danger" type="button" onclick={open_remove_device_dialog}>
			Delete
		</button>
	</section>
{/if}

<style>
	h1 {
		word-break: break-all;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.back {
		color: var(--secondary-font-color);
	}

	.stats {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	section {
		margin-top: 1.5rem;
	}
</style>
