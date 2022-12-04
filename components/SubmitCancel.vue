<template>
	<div class="submitcancel">
		<b-button-group>
			<b-button
				size="sm"
				variant="primary"
				class="mr-2"
				:disabled="submitstatus === 'PENDING'"
				@click.prevent="dispose('submit')"
			>
				Submit
			</b-button>
			<b-button
				size="sm"
				variant="secondary"
				@click.prevent="dispose('cancel')"
			>
				Cancel
			</b-button>
		</b-button-group>
	</div>
</template>

<script>
export default {
	name: 'SubmitCancel',
	props: {
		submitstatus: { type: String, required: true },
	},
	computed: {
		user() {
			return this.$store.state.authentication.user
		},
		perm() {
			return this.$store.state.authentication.user.admin_user_perm
		},
		routePath() {
			return this.$route.path
		},
	},
	methods: {
		dispose(e) {
			this.$emit('dispose', e)
		},
	},
}
</script>
