<script lang="ts">
	import FormWrapper from '$lib/components/FormWrapper.svelte'
	import { APP_TITLE } from '$lib/config'

	let { form } = $props()

	const today = new Date().toLocaleDateString('en-CA')

	let selected_date = $derived<string>(form?.date ?? today)
</script>

<svelte:head>
	<title>{APP_TITLE} - New Echo</title>
</svelte:head>

<header>
	<h1>New Echo</h1>
</header>

<FormWrapper {form}>
	{#snippet content()}
		<div class="form-group">
			<label class="label" for="date">Choose a date</label>
			<input
				class="input"
				type="date"
				name="date"
				id="date"
				bind:value={selected_date}
				required
			/>
		</div>
	{/snippet}

	{#snippet buttons()}
		<button class="button">Continue</button>
	{/snippet}
</FormWrapper>
