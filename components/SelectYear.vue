<template>
	<div>
		<form>
			<div class="row form-group justify-content-center">
				<div class="col-sm-4">
					<b-form-select
						v-model="year"
						:options="years"
						class="form-control text-center"
						@change="setYear($event)"
					></b-form-select>
				</div>
			</div>
		</form>
	</div>
</template>

<script setup>
	const { $dayjs } = useNuxtApp()

	const props = defineProps({
		startyear: {
			type: Number,
			required: true,
		},
	})
	console.log('startyear= ', props.startyear)

	const year = ref($dayjs().format('YYYY'))

	const years = computed(() => {
		{
			const years = [] // array of numbers
			const thisyear = parseInt($dayjs().format('YYYY'))
			for (let year = props.startyear; year <= thisyear + 1; year++) {
				years.push(year)
			}
			return years
		}
	})
	const emit = defineEmits(['submitted'])

	const setYear = (value) => {
		emit('submitted', value)
		// this.$store.commit('pagination/saveyear', value)
		// this.$store.commit('pagination/savepage', '1')
	}
</script>
