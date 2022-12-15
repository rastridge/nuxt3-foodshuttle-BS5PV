// const runtimeConfig = useRuntimeConfig()

export const accountService = {
	getAll,
	getMemberTypes, // authorization
	/* 	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
	getMemberAdminTypes,
*/
}

async function getAll() {
	const { data, pending, error, refresh } = await useFetch('/accounts/getall', {
		method: 'get',
		headers: {
			authorization: 12345,
		},
	})
	return data
}

async function getMemberTypes() {
	const { data } = await useFetch('/accounts/membertypes', {
		method: 'get',
		headers: {
			authorization: 12345,
		},
	})
	return data
}

/* 
async function getAll() {
	const {
		data: accounts,
		pending,
		error,
		refresh,
	} = await useFetch('/accounts/getall', {
		method: 'get',
		headers: {
			authorization: runtimeConfig.public.apiSecret,
		},
	})
	return {
		accounts,
		pending,
		error,
		refresh,
	}
}
 */
