/* export function createYears(last, t) {
	const years = []
	const thisyear = parseInt(t.$moment().format('YYYY'))
	for (let year = thisyear; year >= last; year--) {
		years.push(year)
	}
	t.years = years
}

export function sendNowLater(t) {
	t.$modal.show('dialog', {
		title: 'Do you want to send now or later',
		text: '',
		buttons: [
			{
				title: 'Save and Send Now',
				handler: () => {
					t.addNewsletter('sendNow')
				},
			},
			{
				title: 'Save and Send Later',
				default: true, // Will be triggered by default if 'Enter' pressed.
				handler: () => {
					t.addNewsletter('sendLater')
				}, // Button click handler
			},
			{
				title: 'Cancel',
				handler: () => {
					t.submitStatus = ''
					t.$modal.hide('dialog')
				},
			},
		],
	})
}
 */
export function getPerms(t) {
	const user = JSON.parse(sessionStorage.getItem('auth'))
	const temp = user.perms
	const perms = temp.find((u) => u.admin_app_name === t.app)
	if (perms.admin_perm === 3) {
		// all access
		t.editable = true
		t.addable = true
		t.deleteable = true
		t.statusable = true
		t.viewable = true
	} else if (perms.admin_perm === 2) {
		// create
		t.editable = false
		t.addable = true
		t.deleteable = false
		t.statusable = false
		t.viewable = true
	} else if (perms.admin_perm === 1) {
		// view
		t.editable = false
		t.addable = false
		t.deleteable = false
		t.statusable = false
		t.viewable = true
	} else {
		t.$router.push('/admin') // no access
	}
}
/* 
export function handleSuccess(response) {
	return response.data
}

export function handleError(error) {
	if (error.response) {
		// When response status code is out of 2xxx range
		// eslint-disable-next-line no-console
		console.log('error.response.data= ', error.response.data)
		// eslint-disable-next-line no-console
		console.log('error.response.status= ', error.response.status)
		// eslint-disable-next-line no-console
		console.log('error.response.headers=', error.response.headers)
	} else if (error.request) {
		// When no response was received after request was made
		// eslint-disable-next-line no-console
		console.log('error.request= ', error.request)
	} else {
		// Error
		// eslint-disable-next-line no-console
		console.log('error.message= ', error.message)
	}
	error =
		(error.response.data && error.response.data.message) ||
		error.response.statusText
	return Promise.reject(error) // assigned to alert / error
}
 */
