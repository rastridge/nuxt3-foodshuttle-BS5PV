﻿import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
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
	// console.log('in doDBQuery sql = ', sql)
	const [rows, fields] = await conn1.execute(sql)
	await conn1.end()
	return rows
}

export const usersService = {
	authenticate,
	getAll,
	getOne,
	addOne,
	editOne,
	getApps,
	getAppPerms,
	_setPerms,
	resetRequest,
	resetPassword,
	deleteOne,
	changeStatus,
}

/***************************************** */
/*              _setPerms                  */
/*                                         */
/***************************************** */

async function _setPerms(aPerms, id) {
	const sql = `DELETE
            FROM
                inbrc_admin_perms
            WHERE
                admin_user_id = ${id}`

	await doDBQuery(sql)

	// loop through permissions array
	aPerms.forEach(myFunction)

	// add new permission record
	async function myFunction(value, index) {
		const sql = `INSERT
								INTO inbrc_admin_perms
										(
												admin_user_id,
												admin_app_id,
												admin_perm
										) values (
												${value.admin_user_id},
												${value.admin_app_id},
												${value.admin_perm}
										)`
		await doDBQuery(sql)
	}
	return true
}

/***************************************** */
/*              _getPerms                  */
/*                                         */
/***************************************** */

async function _getPerms(id) {
	// need this to include app name in perms
	const sql = `SELECT
								p.admin_perm_id, a.admin_app_id, a.admin_app_name, p.admin_perm, u.admin_user_id
							FROM
								inbrc_admin_perms p, inbrc_admin_apps a, inbrc_admin_users u
							WHERE
								a.admin_app_id = p.admin_app_id
								AND
								u.admin_user_id = p.admin_user_id
								AND
								p.admin_user_id  = ${id}`

	const perms = await doDBQuery(sql)

	return perms
}

async function authenticate({ username, password }) {
	const lc_username = username.toLowerCase()
	const sql = `SELECT *
								FROM inbrc_admin_users
								WHERE deleted = 0`

	const users = await doDBQuery(sql)

	let user = users.find((u) => {
		// console.log(
		// 	bcrypt.compareSync(password, u.admin_user_pass) &&
		// 		u.admin_user_name === lc_username
		// )
		let match = false
		if (
			bcrypt.compareSync(password, u.admin_user_pass) &&
			u.admin_user_name === lc_username
		) {
			match = true
		} else {
			match = false
		}
		return match
	})

	if (user) {
		// add permissions to user
		// const perms = await _getPerms(user.admin_user_id)
		// user.perms = perms
	} else {
		user = {}
	}
	return user
}

async function getAll() {
	const sql = `select
									admin_user_name as title,
									modified_dt as dt,
									admin_user_id as id,
									STATUS as status
								from inbrc_admin_users
								where deleted = 0`
	const users = await doDBQuery(sql)

	return users
}

/***************************************** */
/*              getOne                     */
/*                                         */
/***************************************** */
async function getOne(id) {
	const sql = `SELECT *
								FROM inbrc_admin_users
								WHERE admin_user_id = ${id}`

	const user = await doDBQuery(sql)
	const perms = await _getPerms(id)
	let jsObj2 = perms
	let jsObj = user[0]
	jsObj.perms = jsObj2
	return jsObj
}

async function deleteOne(id) {
	const sql =
		`UPDATE inbrc_admin_users
								SET deleted=1, deleted_dt= NOW()
								WHERE admin_user_id=` + id

	const user = await doDBQuery(sql)

	return user
}

/***************************************** */
/*              addOne                     */
/***************************************** */
async function addOne({ admin_user_name, password, admin_user_email, perms }) {
	const conn = await mysql.createConnection({
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_DATABASE,
	})
	/* 	console.log('IN ADDONE ', {
		admin_user_name,
		password,
		admin_user_email,
		perms,
	}) */
	try {
		await conn.query('START TRANSACTION')
		// console.log('START TRANSACTION')

		// check for existing username
		let sql = `select *
							from inbrc_admin_users
							where deleted = 0`
		const [rows, fields] = await conn.execute(sql)
		const users = rows
		const lc_username = admin_user_name.toLowerCase()
		const lc_admin_user_email = admin_user_email.toLowerCase()
		const user = users.find(
			(u) =>
				u.admin_user_name === lc_username ||
				u.admin_user_email === lc_admin_user_email
		)
		// console.log('START TRANSACTION')

		if (!user) {
			// console.log('2a')

			// no other users with proposed username
			sql = `INSERT INTO
								inbrc_admin_users
							SET
								admin_user_name  = ?,
								admin_user_pass  = ?,
								admin_user_email  = ?,
								status = 1,
								created_dt = NOW(),
								modified_dt = NOW()`

			let inserts = []
			const hashedpassword = await bcrypt.hashSync(password, 10)
			inserts.push(lc_username, hashedpassword, admin_user_email)
			sql = mysql.format(sql, inserts)
			const [rows, fields] = await conn.execute(sql)
			const user = rows
			// initial permissions with view only
			const id = user.insertId
			// console.log('1 id= ', id)

			perms.forEach(async (value, index) => {
				sql = `INSERT INTO inbrc_admin_perms
										SET
											admin_user_id = ?,
											admin_app_id = ?,
											admin_perm = ?`

				inserts = []
				inserts.push(id, value.admin_app_id, value.admin_perm)
				sql = mysql.format(sql, inserts)
				await conn.execute(sql)
				// console.log('3 sql= ', sql)
			})
			const msg =
				'An account for user ' +
				lc_username +
				'  has been created, password = ' +
				password +
				' email = ' +
				admin_user_email
			const emaildata = {
				from: config.FROM,
				fromName: config.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log('4 emaildata= ', emaildata)
			// sendEmail(emaildata)
		} else {
			console.log('2b')
			const msg =
				'A user with username ' +
				lc_username +
				' or email ' +
				lc_admin_user_email +
				' already exists'
			user.error = msg
			const emaildata = {
				from: config.FROM,
				fromName: config.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log('emaildata= ', emaildata)
			// console.log('EXISTS ', msg)

			// sendEmail(emaildata)
		}

		await conn.commit()
		await conn.end()
		console.log('userservice addOne COMMIT')
		return user
	} catch (e) {
		await conn.query('ROLLBACK')
		await conn.end()
		console.log('userservice addOne ROLLBACK')
	}
}

/***************************************** */
/*              editOne                    */
/***************************************** */

async function editOne(info) {
	const {
		admin_user_id,
		admin_user_name,
		admin_user_email,
		admin_user_pass,
		perms,
		password,
	} = info

	const conn = await mysql.createConnection({
		host: config.DB_HOST,
		user: config.DB_USER,
		password: config.DB_PASSWORD,
		database: config.DB_DATABASE,
	})
	try {
		await conn.query('START TRANSACTION')

		// check for existing admin_user_name or admin_user_email
		let sql =
			`SELECT *
							FROM inbrc_admin_users
							WHERE
								deleted = 0 AND admin_user_id <> ` + admin_user_id
		const [rows, fields] = await conn.execute(sql)
		const users = rows
		const lc_username = admin_user_name.toLowerCase()
		const lc_admin_user_email = admin_user_email.toLowerCase()
		let user = users.find((u) => {
			u.admin_user_name === lc_username ||
				u.admin_user_email === lc_admin_user_email
		})

		// if no other users with proposed username or email
		if (!user) {
			sql = `UPDATE inbrc_admin_users
							SET
									admin_user_name = ?,
									admin_user_email = ?,
									admin_user_pass = ?,
									modified_dt= NOW()
							WHERE
									admin_user_id = ?`

			let inserts = []
			if (password.length > 0) {
				const new_admin_user_pass = await bcrypt.hashSync(password, 10)
				inserts.push(
					lc_username,
					admin_user_email,
					new_admin_user_pass,
					admin_user_id
				)
			} else {
				inserts.push(
					lc_username,
					admin_user_email,
					admin_user_pass,
					admin_user_id
				)
			}
			sql = mysql.format(sql, inserts)
			const [rows, fields] = await conn.execute(sql)
			user = rows
			// update user perms by deleting old - creating new
			sql = `DELETE
						FROM
							inbrc_admin_perms
						WHERE
							admin_user_id = ${admin_user_id}`

			await conn.execute(sql)

			// update perms
			// loop through existing perms array
			perms.forEach(newPerms)

			async function newPerms(value, index) {
				sql = `INSERT
							INTO inbrc_admin_perms
								(
									admin_user_id,
									admin_app_id,
									admin_perm
								) values (
									${value.admin_user_id},
									${value.admin_app_id},
									${value.admin_perm}
								)`
				await conn.execute(sql)
			}
			const msg =
				'The account for admin user ' +
				lc_username +
				'  has been modified, password = ' +
				password +
				' email = ' +
				admin_user_email
			const emaildata = {
				from: config.FROM,
				fromName: config.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log(emaildata)
			// sendEmail(emaildata)
		} else {
			const msg =
				'A user with username ' +
				lc_username +
				' or email ' +
				lc_admin_user_email +
				' already exists'
			user.error = msg
			const emaildata = {
				from: config.FROM,
				fromName: config.FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			// console.log(emaildata)

			// sendEmail(emaildata)
		}

		await conn.commit()
		await conn.end()
		console.log('userservice editOne COMMIT ')
		return user
	} catch (e) {
		await conn.query('ROLLBACK')
		await conn.end()
		console.log('userservice editOne ROLLBACK ')
	}
}

/***************************************** */
/*              changeStatus               */
/*                                         */
/***************************************** */

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE inbrc_admin_users SET STATUS = "` +
		status +
		`" WHERE admin_user_id  = ` +
		id
	const user = await doDBQuery(sql)

	return user
}

async function getApps() {
	const sql = `SELECT
                    admin_app_id,
                    admin_app_name
                FROM inbrc_admin_apps
                ORDER BY
                    admin_app_id`
	const apps = await doDBQuery(sql)

	return apps
}

async function getAppPerms() {
	const sql = `SELECT
								admin_perm,
								admin_app_name,
								u.admin_user_id
							FROM
								inbrc_admin_apps as a,
								inbrc_admin_perms as p,
								inbrc_admin_users as u
							WHERE
								a.admin_app_id = p.admin_app_id
								AND
								p.admin_user_id = u.admin_user_id`

	const perms = await doDBQuery(sql)

	return perms
}

async function resetRequest({ username }) {
	const sql = `SELECT
								COUNT(*) as cnt,
								admin_user_email
							FROM
								inbrc_admin_users
							WHERE
								admin_user_name = '${username}'`

	const rows = await doDBQuery(sql)
	const cnt = rows[0].cnt
	const admin_user_email = rows[0].admin_user_email
	if (cnt) {
		const msg =
			'To reset your password ' +
			admin_user_email +
			` go to  <a href="${SITE_URL}/admin/users/resetform/` +
			username +
			'">RESET PASSWORD</a>'
		/* 
		const email = {
			from: FROM,
			fromName: FROM_NAME,
			to: admin_user_email,
			subject: 'BRC Member Account Modification',
			body_text: '',
			body_html: '<h3>' + msg + '</h3>',
		}
		sendEmail(email) */
	}

	return username
}

async function resetPassword({ user, pass }) {
	// update user password
	let sql = `UPDATE inbrc_admin_users
					SET
						admin_user_pass = ?,
						modified_dt= NOW()
					WHERE
						admin_user_name = '${user}'`

	const hashedpassword = await bcrypt.hashSync(admin_user_pass, 10)
	let inserts = []
	inserts.push(hashedpassword)
	const result = await doDBQuery(sql, inserts)
	/* 
	const email = {
		from: FROM,
		fromName: FROM_NAME,
		to: 'ron.astridge@me.com',
		subject: 'BRC Member Account Modification',
		body_text: '',
		body_html: `<h3>The password has been changed for ${user}. The new password is "${pass}"</h3>`,
	}
	sendEmail(email)
 */
	return result
}
