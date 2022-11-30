import mysql from 'mysql2/promise'

const config = useRuntimeConfig()

async function doDBQuery(sql, inserts) {
	const conn1 = await mysql.createConnection({
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_DATABASE,
	})
	if (inserts) {
		sql = mysql.format(sql, inserts)
	}
	const [rows, fields] = await conn1.execute(sql, inserts)
	await conn1.end()
	return rows
}

export const accountsService = {
	getAll,
	getOne,
	addOne,
	editOne,
	deleteOne,
}

async function getAll() {
	const sql = `SELECT *
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

async function addOne(info) {
	const sql = `INSERT INTO inbrc_accounts
							SET
									account_email = ?,
									member_firstname = ?,
									member_lastname = ?,
									comment = ?,
									created_dt = NOW(),
									modified_dt = NOW();`
	const { account_email, member_firstname, member_lastname } = info
	const accounts = await doDBQuery(sql, [
		account_email,
		member_firstname,
		member_lastname,
	])
	console.log('addOne -- ', account_email, member_firstname, member_lastname)
	return accounts
}

async function editOne(info) {
	console.log('editOne --  info = ', info)

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

	const accounts = await doDBQuery(sql, [id])
	return accounts
}
