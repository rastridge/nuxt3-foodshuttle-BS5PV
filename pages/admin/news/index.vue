<template>
	<div>
		<Head>
			<Title>News Items List</Title>
		</Head>
		<div class="text-center m-5 text-xl">
			<b>News Items List</b>
		</div>
		<div class="text-center m-5">
			<Button
				class="p-button-sm"
				label="Add account"
				@click="navigateTo('/admin/news/add')"
			>
			</Button>
		</div>
		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>
		<select-year :startyear="startyear" @submitted="onSubmit" class="mb-3" />

		<render-list
			:data="filteredData"
			:app="app"
			:statusable="statusable"
			:editable="editable"
			:deleteable="deleteable"
			:addable="addable"
			:viewable="viewable"
			@changeStatus="changeStatus"
			@deleteItem="deleteItem"
		/>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	const { $dayjs } = useNuxtApp()

	definePageMeta({ layout: 'admin' })

	const app = 'news'
	const startyear = ref(2020)
	let year = ref(parseInt($dayjs().format('YYYY')))
	// let year = ref(2021)
	let editable = false
	let addable = false
	let deleteable = false
	let statusable = false
	let viewable = true

	const user = JSON.parse(sessionStorage.getItem('auth'))
	const temp = user.perms
	const perms = temp.find((u) => u.admin_app_name === app)
	if (perms.admin_perm === 3) {
		// all access
		editable = true
		addable = true
		deleteable = true
		statusable = true
		viewable = true
	} else if (perms.admin_perm === 2) {
		// create
		editable = false
		addable = true
		deleteable = false
		statusable = false
		viewable = true
	} else if (perms.admin_perm === 1) {
		// view
		editable = false
		addable = false
		deleteable = false
		statusable = false
		viewable = true
	} else {
		navigateTo('/admin') // no access
	}

	const onSubmit = function (value) {
		// console.log('in onSubmit value = ', value)
		year.value = value
	}

	const {
		data: news,
		pending,
		error,
		refresh,
	} = await useFetch('/news/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})

	const filteredData = computed(() => {
		return news.value.filter((d) => {
			return parseInt($dayjs(d.dt).format('YYYY')) === year.value
		})
	})

	// const checkYear = (dt) => parseInt(dayjs(dt).format('YYYY')) === year.value

	const deleteItem = async (id) => {
		const { pending, error, refresh } = await useFetch(`/news/${id}`, {
			method: 'DELETE',
			headers: {
				authorization: auth.user.token,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/news/status`, {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: { id, status },
		})
	}
</script>
