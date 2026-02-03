<script lang="ts">
	type Props = {
		name: string
		label: string
		type?: 'text' | 'password' | 'email' | 'date'
		value?: string
		defaultValue?: string
		required?: boolean
	}

	let {
		name,
		label,
		type = 'text',
		value = '',
		defaultValue = '',
		required = true,
	}: Props = $props()
</script>

<div>
	<label class="label" for={name}>{label}</label>
	<input class="input" {type} {name} id={name} {value} {defaultValue} {required} />
</div>

<style>
	div {
		margin-bottom: 1rem;
	}
</style>
