<script lang="ts">
	import type { Device } from '$lib/types'
	import { localize_date } from '$lib/utils'
	import { Monitor, MonitorPlay, Settings } from 'lucide-svelte'

	type Props = {
		devices: Device[]
		current_device_id: string | undefined
	}

	let { devices, current_device_id }: Props = $props()
</script>

<div class="table">
	<span class="head">Label</span>
	<span class="head">Created</span>
	<span class="head">Last login</span>
	<span></span>

	{#each devices as device (device.id)}
		<span class="name">
			{#if device.id === current_device_id}
				<MonitorPlay size={20} />
			{:else}
				<Monitor size={20} />
			{/if}
			&nbsp;{device.label}
		</span>

		<span class="date">
			{localize_date(device.created_at)}
		</span>

		<span class="date">
			{device.last_login_at ? localize_date(device.last_login_at) : ''}
		</span>

		<a aria-label="Manage device" href="/account/device/{device.id}">
			<Settings size={20} />
		</a>
	{/each}
</div>

<style>
	.table {
		display: grid;
		grid-template-columns: 1fr auto auto auto;
		align-items: center;
		gap: 1rem;
	}

	.name {
		word-break: break-all;
	}

	.head {
		font-weight: bold;
	}

	.date {
		color: var(--secondary-font-color);
	}
</style>
