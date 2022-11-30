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
	const {
		data: accounts,
		pending,
		error,
		refresh,
	} = await useFetch('/accounts/getall', {
		method: 'get',
		headers: {
			firebaseapikey: 12345,
		},
	})
	return accounts
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
			firebaseapikey: runtimeConfig.apiSecret,
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
