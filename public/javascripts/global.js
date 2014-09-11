// Userlist data array for filling the select inputs
var userListData = [];
var thisUser = '';
var userCompleteName = '';
var userName = '';
var userIn = false;

// DOM Ready =============================================================
$(document).ready(function() {
	
	// Populate the quote table in initial page load
	loadPage();

	// Register User button click
	$('#register').on('click', registerUser);

	// Login button click
	$('#login').on('click', login);

	// Add quote click
	$('#sendNewQuote').on('click', sendNewQuote);
	
	// Logo click
	$('#logoImg').on('click', showHome);
	
	//Forgot password click
	$('#forgotPass').on('click', rememberPass);
	
	// Other Quotes click
	$('#otherQuotesTitle').on('click', showOtherQuotes);
	
	// Add some animation
	$('#otherQuotesTitle').mouseover(function() {

		$('#otherQuotesTitle').css('color', 'aquamarine');
	}); 
	
	$('#otherQuotesTitle').mouseout(function() {

		$('#otherQuotesTitle').css('color', 'transparent');
	});
	
	$('.topQuotesTitle').textillate(
		{ 
			in : {
	            effect: 'flash',
	            delay: 100
	        },
	        out : {
	            effect: 'fadeIn',
	            delay: 100
	        },
	        loop: true
	    }
	);
});

// Functions =============================================================

// Fill page with data
function loadPage() {
	
	$('#newQuoteContainer').hide();
	$('#userWrapper').hide();
	$('#otherQuotesBody').hide();

	fillQuotes();
};

function fillQuotes() {
	
	$.getJSON('/quotes/quotelist', function(data) {

		// Clear data
		document.getElementById('topQuotesWrapper').innerHTML='';
		document.getElementById('otherQuotesBody').innerHTML='';

		// Stick our quote data array into a quotelist variable in the global object
		quoteListData = data;
		var idx = 1;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function() {
			
			text = this.quote;
			author = this.user;
			votes = this.votes;
			id = this._id;

			// Fill the first three
			if (idx <= 3) {
	
				// Create Top Quotes HTML elements
				$('#topQuotesWrapper').append('<fieldset><a id="V' + id + '" class="votes" href="#" rel=' + id + '>✩ ' + votes + ' ✩</a>' + 
					'<label id="T' + id + '" class="topQuoteText" rel=' + id + '>' + text +'</label><br><span id="A' + id + '" class="author" rel="' + author + '" href="#">' + 
					author + '</label></fieldset>');
				
				idx++;
			} else {
				
				// Create Top Quotes HTML elements
				$('#otherQuotesBody').append('<fieldset><a id="V' + id + '" class="votes" href="#" rel=' + id + '>✩ ' + votes + ' ✩</a>' + 
					'<label id="T' + id + '" class="topQuoteText" rel=' + id + '>' + text +'</label><br><span id="A' + id + '" class="author" rel="' + author +'" href="#">' + 
					author + '</label></fieldset>');
			}
			
			if (userIn) {
				
				// If there's a user, then add tooltip text
				$('#T' + id).attr('title', 'Delete?');
			}			
		});
		
		// Add click events and some decoration
		$('#topQuotesWrapper span').on('click', showUserPage);
		$('#otherQuotesBody span').on('click', showUserPage);
		
		if (userIn) {
			
			$('#topQuotesWrapper a').on('click', voteUp);
			$('#otherQuotesBody a').on('click', voteUp);
	
			$('#topQuotesWrapper a').mouseover(function() {
	
				$(this).css('color', 'yellow');
			}); 
			$('#topQuotesWrapper a').mouseout(function() {
		
				$(this).css('color', '#D6C033');
			});
			$('#otherQuotesBody a').mouseover(function() {
		
				$(this).css('color', 'yellow');
			}); 
			$('#otherQuotesBody a').mouseout(function() {
		
				$(this).css('color', '#D6C033');
			});
			
			$('#topQuotesWrapper label').on('click', deleteQuote);
			$('#otherQuotesBody label').on('click', deleteQuote);
		}
		
		$('#topQuotesWrapper span').mouseover(function() {

			$(this).css('color', 'aquamarine');
		}); 
		$('#topQuotesWrapper span').mouseout(function() {
	
			$(this).css('color', '#6699CC');
		});
		$('#otherQuotesBody span').mouseover(function() {
	
			$(this).css('color', 'aquamarine');
		}); 
		$('#otherQuotesBody span').mouseout(function() {
	
			$(this).css('color', '#6699CC');
		});
	});
};

// Login Form
$(function() {
	var buttonLogin = $('#loginButton');
	var boxLogin = $('#loginBox');
	var formLogin = $('#loginForm');
	buttonLogin.mouseup(function(login) {
		boxLogin.toggle();
		buttonLogin.toggleClass('active');
	});
	formLogin.mouseup(function() {
		return false;
	});
	$(this).mouseup(function(login) {
		if (!($(login.target).parent('#loginButton').length > 0)) {
			buttonLogin.removeClass('active');
			boxLogin.hide();
		}
	});
});

// Register Form
$(function() {
	var buttonRegister = $('#registerButton');
	var boxRegister = $('#registerBox');
	var formRegister = $('#registerForm');
	buttonRegister.mouseup(function(register) {
		boxRegister.toggle();
		buttonRegister.toggleClass('active');
	});
	formRegister.mouseup(function() {
		return false;
	});
	$(this).mouseup(function(register) {
		if (!($(register.target).parent('#registerButton').length > 0)) {
			buttonRegister.removeClass('active');
			boxRegister.hide();
		}
	});
});

// Register New User
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

// Show User Info
function login(event) {

	event.preventDefault();

	$.getJSON('/users/users', function(data) {
		
		// Stick our quote data array into a quotelist variable in the global object
		userListData = data;

		// Retrieve mail from form
		var email = $('#emailLogin').val();
		var pass = $('#passwordLogin').val();

		// Error check routine
		var error = '';

		if (email === '') {

			error = 'Please fill in all fields';
		} else if (pass === '') {

			error = 'Please fill in all fields';
		} else {

			// Get Index of object based on id value
			var arrayPosition = userListData.map(function(arrayItem) {
				return arrayItem.email;
			}).indexOf(email);

			// Get our User Object
			thisUser = userListData[arrayPosition];

			// Check if user matches
			if (thisUser === undefined) {

				error = 'User not found';
			} else {

				var userPass = thisUser.pass;

				// Check if password matches
				if (userPass !== pass) {

					error = 'Incorrect password';
				} else if (thisUser.verif !== 'Y') {
					
					error = 'Account has not been verified';
				}
			}
		}

		if (error === '') {

			userIn = true;
			updatePageLogin(thisUser, userListData);	
		}
		else {

			// If some error was found then inform
			$('#problemLogin').text(error);
			return false;
		}
	});
};

function updatePageLogin(thisUser, userListData) {
	
	// Update quotes as a "refresh" before logging in
	fillQuotes();
	
	userCompleteName = thisUser.name + ' ' + thisUser.last;
	
	// Remove Login & Register buttons and put user name & log out
	document.getElementById('registerContainer').innerHTML = 
		'<a id="userName" href="#" class="userName" rel="' + userCompleteName + '" >' + userCompleteName + '</a>';
	document.getElementById('loginContainer').innerHTML = 
		'<input type="button" class="logoutButton" onclick="location.reload();" value="Log Out" />';
		
	// Add some decoration
	$('#userName').mouseover(function() {
	
		$(this).css('color', 'aquamarine');
	}); 
	$('#userName').mouseout(function() {

		$(this).css('color', '#348BFF');
	});
	
	$('#userName').on('click', showUserPage);	
	
	// Populate list of users
	$.each(userListData, function() {
		
		$('#newQuoteAuthor').append(
				'<option value="' + this.email + '">' + this.name + ' ' + this.last + '</option>');
	});
	
	// Clear just in case
	$('#newQuoteText').val('');
	
	// Make form visible
	$('#newQuoteContainer').show();
};

function sendNewQuote(event) {
	
	event.preventDefault();

	// Validate if some text was found
	if ($('#newQuoteText').val()) {

		// If there is, compile all quote info into one object
		var newQuote = {
			'quote' : $('#newQuoteText').val(),
			'user' : $('#newQuoteAuthor option:selected').text(),
			'votes' : 0
		};

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type : 'POST',
			data : newQuote,
			url : '/quotes/addquote',
			dataType : 'JSON'
		}).done(function(response) {

			// Check for successful (blank) response
			if (response.msg === '') {

				// Send notification email to user quoted
				sendEmail();
				
				// Clear the form inputs
				$('#newQuoteText').val('');

				// Update quote list
				fillQuotes();

			} else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);

			}
		});
	} else {
		
		// If no text was found, then inform
		alert('Please add some text');
		return false;
	}
};

function sendEmail() {

	var emailData = {
		'key' : 'P1R6fnbRFA-JPACrFa9L9A',
		'message' : {
			'from_email' : 'quote.it@globant.com',
			'to' : [{
				'email' : $('#newQuoteAuthor').val(),
				'name' : $('#newQuoteAuthor option:selected').text(),
				'type' : 'to'
			}],
			'autotext' : 'true',
			'subject' : 'You´ve been quoted!',
			'html' : $('#userName').text() + ' quoted you! - ' + $('#newQuoteText').val()
		}
	};

	// Use AJAX to send the email
	$.ajax({
		type : 'POST',
		url : "https://mandrillapp.com/api/1.0/messages/send.json",
		data: emailData,
	});
};

function showUserPage(event) {
	
	userName = $(this).attr('rel');
	
	showUserPageByName(userName);
};

function showUserPageByName(name) {
	
	userName = name;
	
	document.getElementById('userQuotesWrapper').innerHTML = '';
	
	$.getJSON('/quotes/userquotes/' + userName, function(data) {
		
		// Clear data
		document.getElementById('userQuotesWrapper').innerHTML='';
		
		$.each(data, function() {
		
			votes = this.votes;
			text = this.quote;
			author = this.user;
			id = this._id;

			// Inject the content data into our existing HTML elements			
			$('#userQuotesWrapper').append('<fieldset><a id="V' + id + '" class="votes" href="#" rel=' + id + '>✩ ' + votes + ' ✩</a>' + 
					'<label id="T' + id + '" class="topQuoteText" rel=' + id + '>' + text +'</label><br><span id="V' + id + '" class="author" rel="' + author +'" href="#">' + 
					author + '</label></fieldset>');
			
			if (userIn) {
				
				// If there's a user, then add tooltip text
				$('#T' + id).attr('title', 'Delete?');
			}
		});
		
		alert('userIn: ' + userIn + ', userName: ' + $('#userName').text());
		
		if (userName === $('#userName').text()) {
			
			$('#userQuotesTitle').text('✩ MY QUOTES ✩');
		} else {
			
			$('#userQuotesTitle').text('✩ ' + userName + '´s QUOTES ✩');
		}
		
		// Add OnClick event and some decoration
		if (userIn) {
			
			$('#userQuotesWrapper a').on('click', voteUp);
	
			$('#userQuotesWrapper a').mouseover(function() {
	
				$(this).css('color', 'yellow');
			}); 
			$('#userQuotesWrapper a').mouseout(function() {
		
				$(this).css('color', '#D6C033');
			});
			
			$('#userQuotesWrapper label').on('click', deleteQuote);
		}
		
		$('#userQuotesWrapper span').mouseover(function() {

			$(this).css('color', 'aquamarine');
		}); 
		$('#userQuotesWrapper span').mouseout(function() {
	
			$(this).css('color', '#6699CC');
		});
		
		$('#mainWrapper').hide();
		$('#userWrapper').show();
	});
}

function showHome() {
		
	fillQuotes();
		
	$('#mainWrapper').show();
	$('#userWrapper').hide();
};

function voteUp(event) {
	
	quoteId = $(this).attr('rel');
	
	// Flag to see if user has already voted
	var userVoted = false;
	
	// Obtain user name
	var userName = $('#userName').text();
	
	$.getJSON('/votes/votelist/' + userName, function(data) {
		
		$.each(data, function() {
		
			if (this.quote === quoteId) {
				
				userVoted = true;
			}
		});
		
		// Check if user has already voted this quote
		if (!userVoted) {
			
			var idToVote = {
				'id' : quoteId
			};
			
			// Use AJAX to post the object to our adduser service
			$.ajax({
				type : 'POST',
				data : idToVote,
				url : '/quotes/vote',
				dataType : 'JSON'
			}).done(function(response) {
				// Check for successful (blank) response
				if (response.msg === '') {
		
					// Store vote in DB
					var vote = {'user' : $('#userName').text(),
								'quote' : quoteId};
					
					$.ajax({
						type : 'POST',
						data : vote,
						url : '/votes/addvote',
						dataType : 'JSON'
					}).done(function(response) {
						// Check for successful (blank) response
						if (response.msg !== '') {
							
							// If something goes wrong, alert the error message that our service returned
							alert('Error: ' + response.msg);
						}
					});
		
					// Update quote list
					updateCurrentPage();
		
				} else {
					
					// If something goes wrong, alert the error message that our service returned
					alert('Error: ' + response.msg);
				}
			});
		} else {
			
			// If user already voted this quote, inform
			alert('You cannot vote a quote twice!');
		}
	});
};

function updateCurrentPage() {
	
	if ($('#mainWrapper').is(":visible")) {
		
		fillQuotes();
	} else {
		
		showUserPageByName(userName);
	}
};

function showOtherQuotes() {
	
	if ($("#otherQuotesBody").is(":visible")) {
		
		$("#otherQuotesBody").hide();
	} else {
		
		$("#otherQuotesBody").show();
	}
};

function emailIsCorrectEnding(email) {
	
    return email.indexOf('@globant.com', email.length - '@globant.com'.length) !== -1;
};

function generateRandomString(L) {
	
    var s= '';
    
    var randomChar=function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    };
    
    while(L--) s+= randomChar();
    
    return s;
};

function sendVerificationMail(email, hashCode) {
	
	var prefix = 'quote-it.herokuapp.com/conf/newuser/';
	
	var link = prefix + email + '//' + hashCode;
	
	var emailData = {
		'key' : 'P1R6fnbRFA-JPACrFa9L9A',
		'message' : {
			'from_email' : 'quote.it@globant.com',
			'to' : [{
				'email' : email,
				'type' : 'to'
			}],
			'autotext' : 'true',
			'subject' : 'Quote It! - Verify your account',
			'html' : 'To verify your account, please access the following link: ' + link +'<br>' + 
				'If you didn´t create an account in Quote It! please disgregard this mail'
		}
	};

	// Use AJAX to send the email
	$.ajax({
		type : 'POST',
		url : "https://mandrillapp.com/api/1.0/messages/send.json",
		data: emailData,
	});
};

// Delete quote
function deleteQuote(event) {

    event.preventDefault();

	var id = $(this).attr('rel');
	var userName = $('#userName').text();

	$.getJSON('/quotes/quote/' + id, function(data) {
		
		if (data.user === userName) {
		
		    // Pop up a confirmation dialog
		    var confirmation = confirm('Are you sure you want to delete this quote?');
		
		    // Check and make sure the user confirmed
		    if (confirmation) {
		
		        // If they did, do our delete
		        $.ajax({
		            type: 'DELETE',
		            url: '/quotes/deletequote/' + id
		        }).done(function( response ) {
		
		            // Check for a successful (blank) response
		            if (response.msg === '') {
		            }
		            else {
		                alert('Error: ' + response.msg);
		            }
		
					// Animate the deletion					
					$('#V' + id).textillate({
						loop : false,
						in : {
							effect : 'hinge',
							shuffle : true
						}
					});
					$('#A' + id).textillate({
						loop : false,
						in : {
							effect : 'hinge',
							shuffle : true
						}
					});
					$('#T' + id).textillate({
						loop : false,
						in : {
							delayScale: 0.5,
							effect : 'hinge',
							shuffle : true
						}
					});
		        });
		
		    }
		    else {
		
		        // If they said no to the confirm, do nothing
		        return false;
		    }
	    } else {
	    	
	    	alert('You can only delete your own quotes!');
	    }
	});
};

function rememberPass() {
	
	var email = $('#emailLogin').val();
	
	if (email !== '') {
		
		$.getJSON('/users/user/' + email, function(data) {
		
			if (data !== null) {
					
				var pass = data.pass;
			
				var emailData = {
					'key' : 'P1R6fnbRFA-JPACrFa9L9A',
					'message' : {
						'from_email' : 'quote.it@globant.com',
						'to' : [{
							'email' : email,
							'type' : 'to'
						}],
						'autotext' : 'true',
						'subject' : 'Quote It! - Password reminder',
						'html' : 'Your password is: ' + pass
					}
				};
			
				// Use AJAX to send the email
				$.ajax({
					type : 'POST',
					url : "https://mandrillapp.com/api/1.0/messages/send.json",
					data: emailData,
				});
				
				alert('An email has been sent to ' + email + ' with a password reminder');
			} else {
				
				$('#problemLogin').text('Email not found');
			}
		});
	} else {
		
		$('#problemLogin').text('Email is empty');
	}
};
