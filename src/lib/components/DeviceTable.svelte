<script lang="ts">
	import { enhance } from '$app/forms'
	import type { Device } from '$lib/types'
	import { localize_date } from '$lib/utils'
	import { Monitor, MonitorPlay, X } from 'lucide-svelte'

	type Props = {
		devices: Device[]
		current_device_id: number | undefined
		remove_device: (id: number) => void
	}

	let { devices, current_device_id, remove_device }: Props = $props()
</script>

<div class="table">
	<span class="head">Label</span>
	<span class="head">Created</span>
	<span class="head">Last login</span>
	<span></span>
	{#each devices as device (device.id)}
		{@const is_current = device.id === current_device_id}

		<form action="?/rename_device" method="POST" use:enhance>
			{#if is_current}
				<MonitorPlay size={18} />
			{:else}
				<Monitor size={18} />
			{/if}
			<input
				type="text"
				name="label"
				aria-label="device label"
				value={device.label}
				defaultValue={device.label}
				required
			/>
			<input type="hidden" name="id" value={device.id} />
		</form>

		<span class="date">
			{localize_date(device.created_at)}
		</span>
		<span class="date">
			{device.last_login_at ? localize_date(device.last_login_at) : ''}
		</span>

		<button
			class="icon-button"
			disabled={is_current}
			aria-label="Remove device"
			onclick={() => remove_device(device.id)}
		>
			<X size={18} />
		</button>
	{/each}
</div>

<style>
	.table {
		display: grid;
		grid-template-columns: 1fr auto auto auto;
		align-items: center;
		gap: 0.75rem 1rem;
	}

	form {
		display: grid;
		gap: 0.5rem;
		grid-template-columns: auto 1fr;
		align-items: center;
	}

	.head {
		font-weight: bold;
	}

	.date {
		color: var(--secondary-font-color);
	}
</style>
