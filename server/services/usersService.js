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
	sql = `DELETE
            FROM
                inbrc_admin_perms
            WHERE
                admin_user_id = ${id}`

	await doDBQuery(sql)

	// loop through permissions array
	aPerms.forEach(myFunction)

	// add new permission record
	async function myFunction(value, index) {
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
	sql = `SELECT
								p.admin_perm_id, a.admin_app_id, a.admin_app_name, p.admin_perm, u.admin_user_id
							FROM
								inbrc_admin_perms p, inbrc_admin_apps a, inbrc_admin_users u
							WHERE
								a.admin_app_id = p.admin_app_id
								AND
								u.admin_user_id = p.admin_user_id
								AND
								p.admin_user_id  = ${id}`

	perms = await doDBQuery(sql)

	return perms
}

async function authenticate({ username, password }) {
	let lc_username = username.toLowerCase()

	const sql = `SELECT *
								FROM inbrc_admin_users
								WHERE deleted = 0`

	users = await doDBQuery(sql)

	const hashedpassword = md5(password).substring(3, 11)
	let user = users.find(
		(u) =>
			u.admin_user_name === lc_username && u.admin_user_pass === hashedpassword
	)
	if (user) {
		// add permissions to user
		const perms = await _getPerms(user.admin_user_id)
		user.perms = perms
		//	create token here, expires In: '60 m'
		const token = jwt.sign(
			{
				sub: user.admin_user_id,
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
			},
			JWT_SECRET
		)

		const { admin_user_pass, admin_user_remind, ...userWithoutPassword } = user
		loginLog(user)
		return {
			...userWithoutPassword,
			token,
		}
	}
	return null
}

async function getAll() {
	const sql = `select
									admin_user_name as title,
									modified_dt as dt,
									admin_user_id as id,
									admin_user_remind,
									admin_user_pass,
									STATUS as status
								from inbrc_admin_users
								where deleted = 0`
	const users = await doDBQuery(sql)

	return users.map((u) => {
		//strips key value pair from all objects in the array with key=
		const { admin_user_remind, admin_user_pass, ...userWithoutPassword } = u
		return userWithoutPassword
	})
}

/***************************************** */
/*              getOne                     */
/*                                         */
/***************************************** */
async function getOne(id) {
	const sql = `SELECT *
								FROM inbrc_admin_users
								WHERE admin_user_id = ${id}`

	user = await doDBQuery(sql)
	perms = await _getPerms(id)
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

	user = await doDBQuery(sql)

	return user
}

async function addOne({ username, password, email }) {
	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE,
	})

	try {
		await conn.query('START TRANSACTION')
		// check for existing username
		let sql = `select *
							from inbrc_admin_users
							where deleted = 0`

		const [rows, fields] = await conn.execute(sql)
		const users = rows
		let lc_username = username.toLowerCase()
		let user = users.find((u) => u.admin_user_name === lc_username)

		if (!user) {
			// no other users with proposed username
			sql = `INSERT INTO
								inbrc_admin_users
							SET
								admin_user_name  = ?,
								admin_user_pass  = ?,
								admin_user_remind  = ?,
								admin_user_email  = ?,
								status = 1,
								created_dt = NOW(),
								modified_dt = NOW()`

			const hashedpassword = md5(password).substring(3, 11)
			let inserts = []
			inserts.push(lc_username, hashedpassword, password, email)
			sql = mysql.format(sql, inserts)
			const [rows, fields] = await conn.execute(sql)
			user = rows
			// initial permissions with view only
			const id = user.insertId
			const apps = await getApps()
			apps.forEach(myFunction)
			async function myFunction(value, index) {
				sql = `INSERT
								INTO inbrc_admin_perms
										(
												admin_user_id,
												admin_app_id,
												admin_perm
										) values (
												${id},
												${value.admin_app_id},
												1
										)`
				await conn.execute(sql)
			}
			const msg =
				'An account for user ' +
				username +
				'  has been created, password = ' +
				password +
				' email = ' +
				email
			const emaildata = {
				from: FROM,
				fromName: FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			sendEmail(emaildata)
		} else {
			const msg = 'A user with username ' + username + ' already exists'
			const emaildata = {
				from: FROM,
				fromName: FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			sendEmail(emaildata)
		}

		await conn.commit()
		await conn.end()
		return user
	} catch (e) {
		await conn.query('ROLLBACK')
		await conn.end()
	}
}

/***************************************** */
/*              editOne                    */
/*                                         */
/***************************************** */
async function editOne({ id, username, password, email, perms }) {
	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE,
	})
	try {
		await conn.query('START TRANSACTION')

		// check for existing username
		let sql =
			`SELECT *
							FROM inbrc_admin_users
							WHERE
								deleted = 0 AND admin_user_id <> ` + id

		const [rows, fields] = await conn.execute(sql)
		const users = rows
		let lc_username = username.toLowerCase()
		let user = users.find((u) => u.admin_user_name === lc_username)
		// if no other users with proposed username
		if (!user) {
			// update user info
			sql = `UPDATE inbrc_admin_users
							SET
									admin_user_name = ?,
									admin_user_email = ?,
									admin_user_remind = ?,
									admin_user_pass = ?,
									modified_dt= NOW()
							WHERE
									admin_user_id = ?`

			const hashedpassword = md5(password).substring(3, 11)
			let inserts = []
			inserts.push(lc_username, email, password, hashedpassword, id)
			sql = mysql.format(sql, inserts)
			const [rows, fields] = await conn.execute(sql)
			user = rows

			// update user perms by deleting old - creating new
			sql = `DELETE
						FROM
							inbrc_admin_perms
						WHERE
							admin_user_id = ${id}`

			await conn.execute(sql)

			// create new perms
			// loop through permissions array
			perms.forEach(myFunction)
			async function myFunction(value, index) {
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
				'The account for admin user ' + lc_username + '  has been modified '
			const emaildata = {
				from: FROM,
				fromName: FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			sendEmail(emaildata)
		} else {
			const msg = 'A user with username ' + lc_username + ' already exists'
			user.error = msg
			const emaildata = {
				from: FROM,
				fromName: FROM_NAME,
				to: 'ron.astridge@me.com',
				subject: 'BRC Member Account Modification',
				body_text: '',
				body_html: '<h3>' + msg + '</h3>',
			}
			sendEmail(emaildata)
		}

		await conn.commit()
		await conn.end()
		// activityLog('userservice', 'COMMIT ', '')

		return user
	} catch (e) {
		await conn.query('ROLLBACK')
		await conn.end()
		// activityLog('userservice', 'ROLLBACK ', '')
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
	user = await doDBQuery(sql)

	return user
}

async function getApps() {
	const sql = `SELECT
                    admin_app_id,
                    admin_app_name
                FROM inbrc_admin_apps
                ORDER BY
                    admin_app_id`
	apps = await doDBQuery(sql)

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

	perms = await doDBQuery(sql)

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

		const email = {
			from: FROM,
			fromName: FROM_NAME,
			to: admin_user_email,
			subject: 'BRC Member Account Modification',
			body_text: '',
			body_html: '<h3>' + msg + '</h3>',
		}
		sendEmail(email)
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

	const hashedpassword = md5(pass).substring(3, 11)
	let inserts = []
	inserts.push(hashedpassword)
	const result = await doDBQuery(sql, inserts)

	const email = {
		from: FROM,
		fromName: FROM_NAME,
		to: 'ron.astridge@me.com',
		subject: 'BRC Member Account Modification',
		body_text: '',
		body_html: `<h3>The password has been changed for ${user}. The new password is "${pass}"</h3>`,
	}
	sendEmail(email)

	return result
}
