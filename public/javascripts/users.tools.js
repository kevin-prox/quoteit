/**
 * Users Handler javascript file
 */

/*
 * Register New User
 */ 
function registerUser(event) {

	event.preventDefault();

	// Get a userlist
	$.getJSON('/users/users', function(data) {

		userListData = data;

		// Increase errorCount variable if any fields are blank
		var errorCount = 0;
		var passMiss = false;
		var error = '';

		// Error check routine
		$('#registerBox input').each(function(index, val) {
			if ($(this).val() === '') {
				errorCount++;
			}
		});

		// Check if some field is empty
		if (errorCount !== 0) {

			error = 'Please fill in all fields';

		} else {

			// Set flag if two passwords don't match
			var pass = $('#passwordRegister').val();
			var passConf = $('#passwordRegisterConf').val();

			if (pass !== passConf) {
				passMiss = true;
			}

			// Check if password and confirm password match
			if (passMiss) {

				error = "Passwords don't match";

			} else {
				
				// Obtain email from form
				var email = $('#emailRegister').val();

				// Get Index of object based on id value
				var arrayPosition = userListData.map(function(arrayItem) {
					return arrayItem.email;
				}).indexOf(email);

				var thisUserObject = userListData[arrayPosition];

				// Check if email is already in use
				if (thisUserObject !== undefined) {

					error = 'Email already in use';
				}
				
				// Check if email ends with '@globant.com'
				if (!emailIsCorrectEnding(email)) {
					
					error = 'Email must be a Globant account';
				} else {
					
					//Check First Name + Last Name availability
					var userName = $('#nameRegister').val() + $('#lastNameRegister').val();

					// Get Index of object based on id value
					var arrayIndex = userListData.map(function(arrayItem) {
						return arrayItem.name + arrayItem.last;
					}).indexOf(userName);
	
					var userObject = userListData[arrayIndex];
	
					// Check if email is already in use
					if (userObject !== undefined) {
	
						error = 'User name already in use';
					}
				}
			}
		}

		// Check if some error was found
		if (error === '') {

			var email = '';
			
			var hashCode = generateRandomString(6);

			// If it is, compile all user info into one object
			var newUser = {
				'email' : $('#emailRegister').val(),
				'pass' : $('#passwordRegister').val(),
				'name' : $('#nameRegister').val(),
				'last' : $('#lastNameRegister').val(),
				'code' : hashCode,
				'verif' : 'N'
			};
			
			// Use AJAX to post the object to our adduser service
			$.ajax({
				type : 'POST',
				data : newUser,
				url : '/users/adduser',
				dataType : 'JSON'
			}).done(function(response) {
	
				// Check for successful (blank) response
				if (response.msg === '') {
	
					// Store email for later use
					email = $('#emailRegister').val();
	
					// Clear fields
					$('#problemRegister').text('');
					$('#emailRegister').val('');
					$('#passwordRegister').val('');
					$('#passwordRegisterConf').val('');
					$('#nameRegister').val('');
					$('#lastNameRegister').val('');
					
					sendVerificationMail(email, hashCode);
					
					// Login new user
					alert('User Successfully created, a verification email has been sent to: ' + email);
					
				} else {
	
					// If something goes wrong, alert the error message that our service returned
					alert('Error: ' + response.msg);
	
				}
			});			
		} else {

			// If some error was found then inform
			$('#problemRegister').text(error);
			return false;
		}
	});
};