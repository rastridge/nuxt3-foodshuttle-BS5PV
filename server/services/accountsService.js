import mysql from 'mysql2/promise'
const CONFIG = useRuntimeConfig()

async function doDBQuery(sql, inserts) {
	const conn1 = await mysql.createConnection({
		host: CONFIG.DB_HOST,
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DB_DATABASE,
	})
	if (inserts) {
		sql = mysql.format(sql, inserts)
	}

	// console.log('IN dbquery sql = ', sql)
	const [rows, fields] = await conn1.execute(sql)
	await conn1.end()
	return rows
}

export const accountsService = {
	getAll,
	getOne,
	addOne,
	editOne,
	changeStatus,
	deleteOne,
	getMemberTypes,
	getMemberAdminTypes,
}

async function getAll() {
	const sql = `SELECT 
									account_id as id,
									account_id,
									member_type_id,
									member_type2_id,
									member_firstname,
									member_lastname,
									CONCAT(member_firstname," ", member_lastname) as title,
									member_year,
									account_email,
									account_email_opening,
									account_textmsg_opening,
									account_addr_street,
									account_addr_street_ext,
									account_addr_city,
									account_addr_state,
									account_addr_country,
									account_addr_postal,
									account_addr_phone,
									newsletter_recipient,
									mail_recipient,
									sms_recipient,
									modified_dt,
									modified_dt as dt,
									status
							FROM inbrc_accounts
							WHERE deleted = 0
							ORDER BY member_lastname ASC`

	const accounts = await doDBQuery(sql)
	return accounts
}

async function getOne(id) {
	const sql = `SELECT *
							FROM inbrc_accounts
							WHERE account_id = ?`
	const accounts = await doDBQuery(sql, [id])
	const account = accounts[0]
	return account
}

/***************************************** */
/*              addOne                     */
/***************************************** */
async function addOne(info) {
	const conn = await mysql.createConnection({
		host: CONFIG.DB_HOST,
		user: CONFIG.DB_USER,
		password: CONFIG.DB_PASSWORD,
		database: CONFIG.DB_DATABASE,
	})

	try {
		await conn.query('START TRANSACTION')
		// console.log('START TRANSACTION')

		// check for existing username or email
		let sql = `select *
							from inbrc_accounts
							where deleted = 0`
		const [rows, fields] = await conn.execute(sql)
		const accounts = rows
		const lc_account_email = info.account_email.toLowerCase()
		let account = accounts.find((u) => u.account_email === lc_account_email)
		// console.log('START TRANSACTION')

		if (!account) {
			// console.log('2a')

			sql = `INSERT INTO inbrc_accounts
							SET
									account_email = ?,
									member_firstname = ?,
									member_lastname = ?,

									member_year = ?,
									account_addr_street = ?,
									account_addr_street_ext = ?,
									account_addr_city = ?,
									account_addr_state = ?,
									account_addr_country = ?,
									account_addr_postal = ?,
									account_addr_phone = ?,

									member_show_phone = ?,
									member_show_addr = ?,
									newsletter_recipient = ?,
									mail_recipient = ?,
									sms_recipient = ?,

									member_type_id = ?,
									member_type2_id = ?,
									member_admin_type_id = ?,
									member_admin_type2_id = ?,
																	status = 1,

									created_dt = NOW(),
									modified_dt= NOW();`
			const {
				account_email,
				member_firstname,
				member_lastname,

				member_year,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,

				member_show_phone,
				member_show_addr,
				newsletter_recipient,
				mail_recipient,
				sms_recipient,

				member_type_id,
				member_type2_id,
				member_admin_type_id,
				member_admin_type2_id,
			} = info

			let inserts = []
			inserts.push(
				lc_account_email,
				member_firstname,
				member_lastname,

				member_year,
				account_addr_street,
				account_addr_street_ext,
				account_addr_city,
				account_addr_state,
				account_addr_country,
				account_addr_postal,
				account_addr_phone,

				member_show_phone,
				member_show_addr,
				newsletter_recipient,
				mail_recipient,
				sms_recipient,

				member_type_id,
				member_type2_id,
				member_admin_type_id,
				member_admin_type2_id
			)
			sql = mysql.format(sql, inserts)
			const [rows, fields] = await conn.execute(sql)
			account = rows

			const id = account.insertId

			const msg =
				'An account for account ' +
				member_firstname +
				' ' +
				member_lastname +
				'  has been created ' +
				' email = ' +
				account_email

			const email_data = {
				from: CONFIG.FROM,
				fromName: CONFIG.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log('4 emaildata= ', email_data)
			// sendEmail(emaildata)
		} else {
			console.log('2b')
			const msg =
				'An account with email ' + lc_account_email + ' already exists'
			account = { message: msg }

			const email_data = {
				from: CONFIG.FROM,
				fromName: CONFIG.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log('email_data= ', email_data)
			console.log('EXISTS ', msg)

			// sendEmail(emaildata)
		}

		await conn.commit()
		await conn.end()
		console.log('accountsService addOne COMMIT')
		return account
	} catch (e) {
		await conn.query('ROLLBACK')
		await conn.end()
		console.log('accountsService addOne ROLLBACK')
	}

	return accounts
}

/***************************************** */
/*               editOne                   */
/***************************************** */
async function editOne(info) {
	const sql = `UPDATE inbrc_accounts
							SET
									account_email = ?,
									member_firstname = ?,
									member_lastname = ?,

									member_year = ?,
									account_addr_street = ?,
									account_addr_street_ext = ?,
									account_addr_city = ?,
									account_addr_state = ?,
									account_addr_country = ?,
									account_addr_postal = ?,
									account_addr_phone = ?,

									member_show_phone = ?,
									member_show_addr = ?,
									newsletter_recipient = ?,
									mail_recipient = ?,
									sms_recipient = ?,

									member_type_id = ?,
									member_type2_id = ?,
									member_admin_type_id = ?,
									member_admin_type2_id = ?,
									modified_dt= NOW()
								WHERE account_id = ?;`
	const {
		account_email,
		member_firstname,
		member_lastname,

		member_year,
		account_addr_street,
		account_addr_street_ext,
		account_addr_city,
		account_addr_state,
		account_addr_country,
		account_addr_postal,
		account_addr_phone,

		member_show_phone,
		member_show_addr,
		newsletter_recipient,
		mail_recipient,
		sms_recipient,

		member_type_id,
		member_type2_id,
		member_admin_type_id,
		member_admin_type2_id,

		account_id,
	} = info
	const accounts = await doDBQuery(sql, [
		account_email,
		member_firstname,
		member_lastname,

		member_year,
		account_addr_street,
		account_addr_street_ext,
		account_addr_city,
		account_addr_state,
		account_addr_country,
		account_addr_postal,
		account_addr_phone,

		member_show_phone,
		member_show_addr,
		newsletter_recipient,
		mail_recipient,
		sms_recipient,

		member_type_id,
		member_type2_id,
		member_admin_type_id,
		member_admin_type2_id,

		account_id,
	])

	return accounts
}

async function deleteOne(id) {
	const sql = `UPDATE inbrc_accounts
							SET
									deleted = '1',
									deleted_dt= NOW()
								WHERE account_id = ?;`
	let inserts = []
	inserts.push(id)
	const accounts = await doDBQuery(sql, inserts)
	return accounts
}

async function changeStatus({ id, status }) {
	const sql = `UPDATE inbrc_accounts
							SET
									status = ?,
									deleted_dt= NOW()
								WHERE account_id = ?;`
	let inserts = []
	inserts.push(status, id)
	const accounts = await doDBQuery(sql, inserts)
	return accounts
}

async function getMemberTypes() {
	const sql = `SELECT * FROM inbrc_member_types WHERE 1`
	const membertypes = await doDBQuery(sql)
	return membertypes
}
async function getMemberAdminTypes() {
	const sql = `SELECT * FROM inbrc_member_admin_types WHERE 1`
	const memberadmintypes = await doDBQuery(sql)
	return memberadmintypes
}
