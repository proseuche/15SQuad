$(document).ready(function() {
    let config = {
        apiKey: "AIzaSyAJYY0Az45sH0Sw6jAz3JvR4yjJBIMtbzU",
        authDomain: "squad-67b43.firebaseapp.com",
        databaseURL: "https://squad-67b43.firebaseio.com/",
    };
    firebase.initializeApp(config);
    let database = firebase.database();


    function show_nth_page(n){ /* n is active page number(0,1,...) */
    	
    	/* loader */
        // let new_loader = document.createElement('div');
        // new_loader.className = "ui active inverted dimmer";
        // new_loader.setAttribute('id', 'loader');

        // let new_loader_inline = document.createElement('div');
        // new_loader_inline.className = "ui active centered inline loader";
        // new_loader.appendChild(new_loader_inline);
        // $("#table_header").after(new_loader);

    	return database.ref("/Negotiations/").once("value", function(snapshot) {

	    	var value = snapshot.val();
			if(value == null){
				return;
			}
			
			var keys = Object.keys(value);
			var my_offer_keys = new Array();
			var j=0;
			for(var i=0; i<keys.length; i++){
				var entry = value[keys[i]];
				if(((entry.madeBy === "Me") || (entry.to === "Me"))
					&& entry.status != null){
					my_offer_keys[j++]=keys[i];
				}
			}
			//console.log(my_offer_keys.length);

	    	var bottom = my_offer_keys.length-5-(4*n);
	    	if(bottom < -1){
	    		bottom = -1;
	    	}

	    	let entries_div = document.createElement('div');
	    	entries_div.className = "entries";
	    	$("#table_header").after(entries_div);

	    	hover_index = 1;
	    	for(var i=(my_offer_keys.length-1-(4*n)); i>bottom; i--){
				var entry = value[my_offer_keys[i]];
				//console.log(entry);
			
				let new_container = document.createElement('div');
				new_container.className = "ui container segment nego";
				new_container.setAttribute('id', my_offer_keys[i]);
				entries_div.appendChild(new_container);

				let new_col_grid = document.createElement('div');
				new_col_grid.className = "ui five column stackable center aligned grid";
				new_container.appendChild(new_col_grid);

				let new_middle_row = document.createElement('div');
				new_middle_row.className = "middle aligned row";
				new_col_grid.appendChild(new_middle_row);

				// 1. Arrow icon
				let arrow_icon = document.createElement('div');
				arrow_icon.className = "column";
				if (entry.from === "Me")
					arrow_icon.innerHTML = "<h2><i class=\"icon sign-out\"></i></h2>";
				else
					arrow_icon.innerHTML = "<h2><i class=\"icon sign-in\"></i></h2>";
				new_middle_row.appendChild(arrow_icon);

				// 2. Status
				let status = document.createElement('div');
				status.className = "column";
				if (entry.madeBy === "Me" && entry.status === "Negotiation Received"){
					status.innerHTML = "<h2>Negotiation Sent</h2>";
				}
				else{
					status.innerHTML = "<h2>" + entry.status + "</h2>";
				}
				new_middle_row.appendChild(status);

				// 3. Other Store
				let other = document.createElement('div');
				other.className = "column";
				if (entry.from === "Me")
					other.innerHTML = "<h2>" + entry.to + "</h2>";
				else
					other.innerHTML = "<h2>" + entry.from + "</h2>";
				new_middle_row.appendChild(other);

				// 4. Period
				let period= document.createElement('div');
				period.className = "column";

				let start_date = entry.start.split('-');
				let start = document.createElement('h2');
				start.innerHTML = start_date[0] + ". " + start_date[1] + ". " + start_date[2];
				start.className = "elem";
				period.appendChild(start);

				let end_date = entry.end.split('-');
				let end = document.createElement('h2');
    			end.innerHTML = " ~ " + end_date[0] + ". " + end_date[1] + ". " + end_date[2];
    			end.className = "elem";
    			period.appendChild(end);

    			new_middle_row.appendChild(period);

	    		// 5. Day and time
				let day_and_time = document.createElement('div');
				day_and_time.className = "column";

				snapshot.child(my_offer_keys[i]).child('time').forEach(function(data){
					let new_time = document.createElement('h2');
	        		new_time.innerHTML = data.val().day+"."+data.val().start+"~"+data.val().end;
	        		new_time.className = "elem";
	        		day_and_time.appendChild(new_time);
				});
				new_middle_row.appendChild(day_and_time);

				/* hovering */
		        $(".ui.container:eq("+hover_index+")").hover(
		    		function(){
		    			this.className += " hover";
		    		},function(){
		    			this.className = "ui container segment nego";
		    		});
		        hover_index++;	
				
			}

			/* Implementing Paging */
			let center_div = document.createElement('div');
			center_div.className = "center-div";
			entries_div.appendChild(center_div);

			let pagination = document.createElement('div');
			pagination.className = "ui pagination menu";
			center_div.appendChild(pagination);
				

			for(var i=0; i<(my_offer_keys.length/4); i++){
				//console.log(i+"th page button is made");
				if(i==n)
					$(".ui.pagination.menu").append("<a id='page"+i+"' class='active item'>"+(i+1)+"</a>");
				else
					$(".ui.pagination.menu").append("<a id='page"+i+"' class='item'>"+(i+1)+"</a>");
				$("#page"+i).on("click",function(){
					if(this.getAttribute("class")!="active item"){
						//console.log("clicked not-active item");
						/* removing all entries */
						$(".entries").remove();
						//console.log(this.getAttribute("id")[4]);
						show_nth_page(this.getAttribute("id")[4]);
					}	
				});	
			}

		}).then(function (){
			if(document.getElementById('loader')!=null){
				document.getElementById('loader').remove();
			}
		});

	}

	show_nth_page(0);

	$(document).on('click', '.nego', function(){
		let negoid = this.getAttribute('id');
		sessionStorage.setItem('detailtype', 'Negotiations');
		sessionStorage.setItem('detailid', negoid);
		location.href = '/detail.html';
	});

});