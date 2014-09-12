/*
 * 
 */

function fillQuotes(userIn) {
	
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