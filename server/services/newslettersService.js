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
	const [rows, fields] = await conn1.execute(sql)
	await conn1.end()
	return rows
}
export const newslettersService = {
	getAll,
	getYear,
	sendNewsletter,
	trackNewsletter,
	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
	getRecipientTypes,
}
async function getAll() {
	console.log('got here')
	const sql = `SELECT
								newsletter_id,
								newsletter_id as id,
								newsletter_recipient_type_id,
								admin_user_id,
								newsletter_subject,
								newsletter_subject as title,
								newsletter_sent as sent_dt,
								status,
								deleted,
								deleted_dt,
								created_dt,
								modified_dt,
								modified_dt as dt
							FROM
								inbrc_newsletters
							WHERE
								deleted = 0
							ORDER BY dt DESC`

	const newsletter = await doDBQuery(sql)

	return newsletter
}

async function getYear(year) {
	sql = `SELECT
					newsletter_id,
					newsletter_id as id,
					newsletter_recipient_type_id,
					admin_user_id,
					newsletter_subject,
					newsletter_subject as title,
					newsletter_sent as sent_dt,
					status,
					deleted,
					deleted_dt,
					created_dt,
					modified_dt,
					modified_dt as dt
				FROM
					inbrc_newsletters
				WHERE
					deleted = 0
					AND
					YEAR(created_dt) = ${year}
				ORDER BY
          dt DESC`

	const newsletters = await doDBQuery(sql)
	return newsletters
}

async function sendNewsletter({
	id,
	newsletter_body_html,
	newsletter_subject,
	newsletter_recipient_type_id,
}) {
	const sql = `SELECT
						a.account_id as id,
						a.account_id,
						member_type_id,
						member_type2_id,
						member_firstname,
						member_lastname,
						CONCAT(member_firstname," ", member_lastname) as title,
						member_prev_club,
						member_year,
						member_position,
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
						(
						SELECT
							COUNT(*)
						FROM
							inbrc_contributions c
						WHERE
							c.account_id = a.account_id
						) as donated,

						a.modified_dt,
						a.modified_dt as dt,
						a.status
					FROM inbrc_accounts a
					WHERE deleted = 0
					ORDER BY account_email ASC`

	const accounts = await doDBQuery(sql)

	function setNewsletterRecipients(accounts, recipient_type_id) {
		function newsletterTypeMemberMatch(recipient_type_id, el) {
			recipient_type_id = parseInt(recipient_type_id)
			const member_type_id = parseInt(el.member_type_id)
			const member_type2_id = parseInt(el.member_type2_id)
			let include = false
			switch (recipient_type_id) {
				// All
				case 1:
					if (
						member_type_id === 2 ||
						member_type_id === 3 ||
						member_type_id === 5 ||
						member_type_id === 6
					)
						include = true
					break
				// active
				case 2:
					if (member_type_id === 2) include = true
					break
				// alumni
				case 3:
					if (member_type_id === 3) include = true
					break
				// sponsor - might also be active player !
				case 4:
					if (member_type_id === 4 || member_type2_id === 4) include = true
					break
				// special
				case 5:
					if (member_type_id === 5) include = true
					break
				// development
				case 6:
					if (member_type_id === 6) include = true
					break
				// local alumni
				case 7:
					if (
						member_type_id === 3 &&
						el.account_addr_postal.indexOf('14') === 0
					)
						include = true
					break
				// pending
				case 9:
					if (member_type_id === 9) include = true
					break
				// other
				case 10:
					if (member_type_id === 10) include = true
					break
				// flag
				case 11:
					if (member_type_id === 11) include = true
					break
				// testing
				case 13:
					if (member_type_id === 13) include = true
					break
				// marked for mail/calendar no donations
				case 14:
					if (
						member_type_id === 3 && // alumni
						el.mail_recipient === 1 && // marked for mail/calendar
						el.donated == 0 // no donations
					)
						include = true
					break
			}
			return el.status && !el.deleted && el.newsletter_recipient && include
		}

		return accounts.filter(function (el) {
			return newsletterTypeMemberMatch(recipient_type_id, el)
		})
	}
	const BEGIN_HTML = `<!DOCTYPE html>
											<html>
											<head>
											<meta charset='UTF-8'>
											<meta name='viewport' content='width=device-width, initial-scale=1.0' />
											<style>
											html {
															font-size: 12px;
															@media screen and (min-width: 576px) {
																font-size: 14px;
															}
															@media screen and (min-width: 768px) {
																font-size: 16px;
															}
															@media screen and (min-width: 1200px) {
																font-size: 18px;
															}
														}
												.nl-container {	background-color: #FFF;
																				width: 100%;
																				padding-top: 2rem;
																				padding-bottom: 2rem;
																			}
												.nl-banner { width: 100%;
																			padding-top: 0.5rem;
																			padding-bottom: 0.5rem;
																			color: #FFF;
																			background-color: #00D;
																			font-family: Verdana, Geneva, sans-serif;
																			font-weight: bold;
																			font-size: 1rem;
																			text-align: center;
																			@media screen and (min-width: 576px) {
																					padding-top: 1rem;
																					padding-bottom: 1rem;
																					font-size: 2rem;
																			}
																		}
												.nl-content {
																			width: 80%;
																			padding: 1rem;
																			font-size: 1.5rem;
																		}
												.nl-footer { font-size: 1rem;
																			padding: 1rem;
																		}
												@media screen and (min-width: 576px) {
													.nl-banner {
														padding-top: 1rem;
														padding-bottom: 1rem;
														font-size: 2rem;
												}
												.ql-align-center {	text-align: center;	}
												.ql-align-justify {	text-align: justify;}
												.ql-align-right {	text-align: right;}
											</style>
											</head>
											<body>
												<div class='nl-container'>
													<div class='nl-banner'>
														<h1>Buffalo Rugby News</h1>
													</div>`

	const UNSUB_MSG = `<hr>
										<div class='nl-footer'>
											Make it a habit to give the Buffalo Rugby Club website a look every week this season. The site will be updated constantly with the lastest <a href='https://buffalorugby.org/news' target='_blank'>News</a> ,<a href='https://buffalorugby.org/schedule-and-results' target='_blank'>Schedule, Results and Match reports</a>, including who played and who scored and <a href='https://buffalorugby.org/photos' target='_blank'>Photos</a> of recent events and games.<HR style='width:25%;height:2px;'>The Buffalo Rugby Club will not sell, rent, barter, give, or use in any way, shape or form, email addresses that we maintain, to anyone, for any reason.
										</div>`

	const NEWSLETTER_END_STYLES = `</div> <!-- container -->
																</body>
																</html>`

	// filter by recipient type
	const recipientss = setNewsletterRecipients(
		accounts,
		newsletter_recipient_type_id
	)

	const rec_cnt = recipientss.length

	function composeEmail(
		recipient,
		newsletter_body_html,
		newsletter_subject,
		id
	) {
		const trackingpixel = `<img src="${API_URL}/newsletters/track?account_id=${recipient.account_id}&newsletter_id=${id}" height="1" width="1" alt="" />`
		const accountinfo = `<br><hr><h4>This is Your Current Contact Info. Please <a href="https://buffalorugby.org/register/men/${recipient.account_id}" target="_blank"> click here update your info if necessary</a></h4><table><tbody><tr><td>${recipient.member_firstname} ${recipient.member_lastname}</td></tr><tr><td>${recipient.account_addr_street}</td></tr>
			<tr><td>${recipient.account_addr_street_ext}</td></tr>
			<tr><td>${recipient.account_addr_city}, ${recipient.account_addr_state} ${recipient.account_addr_postal}</td></tr>
			<tr><td>${recipient.account_addr_country}</td></tr><tr><td>${recipient.account_addr_phone}</td></tr>
			<tr><td>Year Joined the BRC ${recipient.member_year}</td></tr>
			<tr><td>Previous teams ${recipient.member_prev_club}</td></tr></tbody></table><br>`
		const email = {
			from: FROM,
			fromName: FROM_NAME,
			to: recipient.account_email,
			subject: newsletter_subject,
			body_text: '',
			body_html:
				BEGIN_HTML +
				trackingpixel +
				newsletter_body_html +
				accountinfo +
				UNSUB_MSG +
				NEWSLETTER_END_STYLES,
		}
		return email
	}
	/*
	activityLog("newsletters", "enter sendNewsletter recipientss = ", rec_cnt);
	*/
	//
	// self invoking function, passing the number of iterations as an argument
	// very cute - https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop
	;(function myLoop(i) {
		// Using recursion
		// Send emails to Elasticemail slowly
		setTimeout(function () {
			const email = composeEmail(
				recipientss[i - 1],
				newsletter_body_html,
				newsletter_subject,
				id
			)
			//
			sendEmail(email)
			if (--i) myLoop(i) //  decrement i and call myLoop again if i > 0
		}, 500) // delay 500ms
	})(rec_cnt)

	const sql2 = `UPDATE inbrc_newsletters
								SET
								newsletter_sent = NOW(),
								newsletter_send = NOW(),
								newsletter_send_complete = NOW(),
								newsletter_send_status = 3,
								newsletter_opened_cnt = 0,
								newsletter_recp_cnt = ${rec_cnt}
								WHERE newsletter_id = ${id}`
	const newsletters = await doDBQuery(sql2)
	return newsletters
}

async function getOne(id) {
	console.log('get one id= ', id)

	const sql = `select * from inbrc_newsletters where newsletter_id = ` + id
	const newsletter = await doDBQuery(sql)
	console.log(newsletter[0])
	return newsletter[0]
}

async function trackNewsletter(params) {
	const conn = await mysql.createConnection({
		host: DB.DB_HOST,
		user: DB.DB_USER,
		password: DB.DB_PASSWORD,
		database: DB.DB_DATABASE,
	})

	try {
		await conn.query('START TRANSACTION')

		// update member last email opened date
		let sql = `UPDATE inbrc_accounts
					SET
						account_email_opening = NOW()
					WHERE
						account_id = ?`

		let inserts = []
		inserts.push(params.account_id)
		sql = mysql.format(sql, inserts)
		await conn.execute(sql)

		// Check if Newsletter already logged for this account in _newsletter_openings ?
		sql = `SELECT
							count(*) as cnt
						FROM
							inbrc_newsletter_openings
						WHERE
							newsletter_id = ? AND account_id = ?`

		inserts = []
		inserts.push(params.newsletter_id, params.account_id)
		sql = mysql.format(sql, inserts)
		let [rows, fields] = await conn.execute(sql)
		let cnt = rows[0].cnt

		// IF not already counted as opened
		if (!cnt) {
			sql = `INSERT INTO inbrc_newsletter_openings
							SET
								newsletter_id = ?,
								account_id = ?,
								newsletter_opened_date = NOW()`

			inserts = []
			inserts.push(params.newsletter_id, params.account_id)
			sql = mysql.format(sql, inserts)
			await conn.execute(sql)
		}
		sql = `UPDATE inbrc_newsletters
					SET
						newsletter_opened_cnt = newsletter_opened_cnt + 1
					WHERE
						newsletter_id = ?`

		inserts = []
		inserts.push(params.newsletter_id)
		sql = mysql.format(sql, inserts)
		await conn.execute(sql)

		console.log('COMMIT')
		await conn.commit()
		await conn.end()
	} catch (e) {
		console.log('ROLLBACK')
		await conn.query('ROLLBACK')
		await conn.end()
		return 'error in sql'
	}

	return `header('Location: ./trackingpixel.gif')`
}

async function addOne({
	newsletter_recipient_type_id,
	admin_user_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
	newsletter_send_complete,
	newsletter_send_status,
}) {
	var sql = `INSERT INTO inbrc_newsletters SET
								newsletter_recipient_type_id = ?,
                admin_user_id = ?,
                newsletter_subject = ?,
                newsletter_body_text = ?,
                newsletter_body_html = ?,
                newsletter_sent = ?,
                newsletter_send_complete = ?,
                newsletter_send_status = ?,
                created_dt = NOW(),
                modified_dt= NOW()`

	var inserts = []
	inserts.push(
		newsletter_recipient_type_id,
		admin_user_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent,
		newsletter_send_complete,
		newsletter_send_status
	)
	const newsletter = await doDBQuery(sql, inserts)
	return newsletter
}

async function editOne({
	id,
	newsletter_recipient_type_id,
	admin_user_id,
	newsletter_subject,
	newsletter_body_text,
	newsletter_body_html,
	newsletter_sent,
	newsletter_send_complete,
	newsletter_send_status,
}) {
	var sql = `UPDATE inbrc_newsletters SET
							newsletter_recipient_type_id = ?,
							admin_user_id = ?,
							newsletter_subject = ?,
							newsletter_body_text = ?,
							newsletter_body_html = ?,
							newsletter_sent = ?,
							newsletter_send_complete = ?,
							newsletter_send_status = ?,
							modified_dt= NOW()
						WHERE newsletter_id = ?`
	var inserts = []
	inserts.push(
		newsletter_recipient_type_id,
		admin_user_id,
		newsletter_subject,
		newsletter_body_text,
		newsletter_body_html,
		newsletter_sent,
		newsletter_send_complete,
		newsletter_send_status,
		id
	)
	const newsletter = await doDBQuery(sql, inserts)

	return newsletter
}

async function deleteOne(id) {
	const sql =
		`UPDATE inbrc_newsletters SET deleted=1, deleted_dt= NOW() WHERE newsletter_id = ` +
		id
	const newsletter = await doDBQuery(sql)

	return newsletter
}

async function changeStatus({ id, status }) {
	const sql =
		`UPDATE inbrc_newsletters SET status = "` +
		status +
		`" WHERE newsletter_id = ` +
		id
	const newsletter = await doDBQuery(sql)

	return newsletter
}

async function getRecipientTypes() {
	const sql = `SELECT * FROM inbrc_newsletter_recipient_types WHERE 1`
	const recipienttypes = await doDBQuery(sql)
	return recipienttypes
}
