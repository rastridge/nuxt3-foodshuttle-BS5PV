<template>
	<div>
		<b-card>
			<Button class="p-button-rounded p-button-raised">Button</Button>
			<button size="sm" variant="danger">Button</button>
			<b-button
				class="p-button-rounded p-button-raised"
				size="sm"
				variant="success"
				>Button</b-button
			>
			<b-button size="sm" variant="outline-primary">Button</b-button>
		</b-card>
		<Button class="p-button-rounded p-button-raised" @click="modal = !modal">
			Toggle modal
		</Button>

		<b-modal v-model="modal"> Foo bar </b-modal>
	</div>
</template>

<script setup lang="ts">
	const modal = ref(false)
</script>
