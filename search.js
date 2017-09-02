$(document).ready(function(){

 $('#master').click(function(){
     $('.checkall').prop('checked', $(this).prop('checked'));
 });
 
 function display_bio(name,college,mobile){
     $('#result-clg').html(college);
     $('#result-num').html(mobile);
     $('#result-name').html(name);
     $('#temp-name').hide();
 }
 

 
$('#search-button').click(function(){
    $('#result-bio').html("");
    $('#result-name').html("");
    $('#result-event').html("");
    const root=firebase.database().ref('/tathva17/users');
    const search_email=$('#search').val();
  
    root.orderByChild('email').equalTo(search_email).once('child_added',function(snap){
           var name=snap.child('bio/name').val();
           var mobile=snap.child('bio/mobile').val();
           var college=snap.child('bio/college').val();
           
           snap.child('events').forEach(function(eid){
                 console.log("event id:"+eid.key+",status:"+eid.val());
                var eventcontent=firebase.database().ref('/tathva17/events/'+eid.key);
                eventcontent.once('value',function(snapevent){
                   var venue=snapevent.child('venue').val();
                   var time=snapevent.child('time').val();
                   var amount=snapevent.child('amount').val();
                   var name=snapevent.child('name').val();
                   console.log("Venue:"+venue+"name:"+name);
                  
                 // $('#result-event').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+eid.key+"' name='check' checked /><label for='"+eid.key+"'></label></div></td><td class='mdl-data-table__cell--non-numeric'>"+name+"</td><td class='mdl-data-table__cell--non-numeric'>"+venue+"</td><td class='mdl-data-table__cell--non-numeric'>"+time+"</td><td>"+amount+"</td></tr>");
                $('#result-event').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+eid.key+"' name='check' checked /><label for='"+eid.key+"'></label></div></td><td>"+name+"</td><td>"+venue+"</td><td>"+time+"</td><td>"+amount+"</td></tr>");
                });     
              });
             //console.log(eventnames);  
           display_bio(name,college,mobile);  
    } ,function(error){
        console.log("Wrong entry"+error);
    });
  
});

});