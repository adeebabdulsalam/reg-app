$(document).ready(function(){
 const eventnames=[];

 function display_bio(name,college,mobile){
     $('#result-bio').html("Name:"+name+"<br><br>College:"+college+"<br><br>Mobile:"+mobile);
 }
 
 function display_event(eventso){
    var newevents=$.map(array, function(value){
        return('<td>'+value+'</td>');
    });
     $('#result-event').html(newevents.join(""));
 }
 
$('#search-button').click(function(){
    const root=firebase.database().ref('/tathva17/users');
    const search_email=$('#search').val();
  
    root.orderByChild('email').equalTo(search_email).once('child_added',function(snap){
           var name=snap.child('bio/name').val();
           var mobile=snap.child('bio/mobile').val();
           var college=snap.child('bio/college').val();
           
           snap.child('events').forEach(function(eid){
                 console.log("event id:"+eid.key+",status:"+eid.val());
                var eventcontent=firebase.database().ref('/tathva17/events/'+eid.key);
                eventcontent.child('name').once('value',function(name){
                   eventnames.push(name.val());
                  //display_event(ename);  
                  console.log("eventname:"+name.val());  
                });     
              });
             console.log(eventnames); 
            display_event(eventnames);  
           display_bio(name,college,mobile);  
    } ,function(error){
        console.log("Wrong entry"+error);
    });
    
    
});

});