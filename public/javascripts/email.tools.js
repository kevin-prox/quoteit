/**
 * Mail handler tool js
 */

var emailSuffix = '@globant.com';
var emailKey = process.env.MAIL_KEY;

/*
 * Send a mail to a new registered user to verify his/her email
 */
function sendVerificationMail(email, hashCode) {

	var prefix = 'quote-it.herokuapp.com/conf/newuser/';
	var link = prefix + email + '//' + hashCode;
	var mailBody = 'To verify your account, please access the following link: ' + link + '<br>' 
		+ 'If you didn´t create an account in Quote It! please disgregard this mail';
	var subject = 'Quote It! - Verify your account';

	// Get email prepared based on data
	var emailData = prepareEmailData(email, mailBody, subject);

	// Send email with POST method
	postEmail(emailData);
};

/*
 * Checks if the email is ending with the correct domain
 */
function emailIsCorrectEnding(email) {

	return email.indexOf(emailSuffix, email.length - emailSuffix.length) !== -1;
};

/*
 * Sends a mail to notify a user that has been quoted
 */
function sendNotificationEmail(email, userName, text) {

	var mailBody = userName + ' quoted you! - ' + text;
	var subject = 'Quote It! - You´ve been quoted!';

	// Get email prepared based on data
	var emailData = prepareEmailData(email, mailBody, subject);

	// Send email with POST method
	postEmail(emailData);
};

/*
 * Sends the password to the user's mail account
 */
function sendPassReminder(email, pass) {

	var mailBody = 'Your password is: ' + pass;
	var subject = 'Quote It! - Password reminder';

	// Get email prepared based on data
	var emailData = prepareEmailData(email, mailBody, subject);

	// Send email with POST method
	postEmail(emailData);
}

/*
 * Prepares the email to be sent
 */
function prepareEmailData(email, text, subject) {

	var emailData = {
		'key' : emailKey,
		'message' : {
			'from_email' : 'quote.it@globant.com',
			'to' : [{
				'email' : email,
				'type' : 'to'
			}],
			'autotext' : 'true',
			'subject' : subject,
			'html' : text
		}
	};

	return emailData;
}

/*
 * Calls AJAX to send mail
 */
function postEmail(emailData) {

	$.ajax({
		type : 'POST',
		url : "https://mandrillapp.com/api/1.0/messages/send.json",
		data : emailData,
	});
}
