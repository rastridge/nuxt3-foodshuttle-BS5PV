const useAccountData = () => {
	const getAccounts = () => {
		const runtimeConfig = useRuntimeConfig()
		const {
			data: accounts,
			pending,
			error,
			refresh,
		} = useFetch('/accounts/getall', {
			method: 'get',
			headers: {
				authorization: runtimeConfig.public.apiSecret,
			},
		})
		return accounts
	}

	const accountsData = useState('accounts', getAccounts)

	/* 	const setAccounts = (account) => {
		accounts.value = account
	}
 */ return {
		getAccounts,
		// setAccounts,
		accountsData,
	}
}
export default useAccountData
