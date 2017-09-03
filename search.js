$(document).ready(function(){
  $('#confirm-button').show();
  $('#undo-button').hide();
  
 $('#master').click(function(){
     $('.checkall').prop('checked', $(this).prop('checked'));
 });
 
 function display_bio(name,college,mobile){
     $('#result-clg').html(college);
     $('#result-num').html(mobile);
     $('#result-name').html(name);
     $('#temp-name').hide();
 }
 
$('#undo-button').click(function(){
    const rootchange=firebase.database().ref('/tathva17/users/'+uid);
    rootchange.child('events').once('value',function(snapevents){
   // console.log(uid+'2');
    snapevents.forEach(function(eid){
        var key=eid.key;
       // console.log('uid:'+uid+'eid:'+key);
       
        
           var eventset=firebase.database().ref('/tathva17/events_participants/'+key+'/'+uid);
           eventset.update({ status:'registered' });
    
           var eventset2=firebase.database().ref('/tathva17/users/'+uid+'/events/'+key);
           eventset2.update({ status:'registered' });
              
    });
  });
  var data={
            message: 'confirmation changed',
            timeout: 4000
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
});
 /*Search button triggered event start*/
 
$('#search-button').click(function(){
    $('#result-bio').html("");
    $('#result-name').html("");
    $('#result-event').html("");
    $('#undo-button').hide();
    $('#confirm-button').show();
    
    const root=firebase.database().ref('/tathva17/users');
    const search_email=$('#search').val();
  
    root.orderByChild('email').equalTo(search_email).once('child_added',function(snap){
           var name=snap.child('bio/name').val();
           var mobile=snap.child('bio/mobile').val();
           var college=snap.child('bio/college').val();
           uid=snap.key;
           snap.child('events').forEach(function(eid){
                 //console.log("event id:"+eid.key+",status:"+eid.val());
                if('confirmed'==eid.child('status').val()){ 
                   $('#confirm-button').hide();
                   $('#undo-button').show();
                 }
                 
                var eventcontent=firebase.database().ref('/tathva17/events/'+eid.key);
                eventcontent.once('value',function(snapevent){
                   var venue=snapevent.child('venue').val();
                   var time=snapevent.child('time').val();
                   var amount=snapevent.child('amount').val();
                   var name=snapevent.child('name').val();
                   //console.log("Venue:"+venue+"name:"+name);
                  
                 // $('#result-event').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+eid.key+"' name='check' checked /><label for='"+eid.key+"'></label></div></td><td class='mdl-data-table__cell--non-numeric'>"+name+"</td><td class='mdl-data-table__cell--non-numeric'>"+venue+"</td><td class='mdl-data-table__cell--non-numeric'>"+time+"</td><td>"+amount+"</td></tr>");
                $('#result-event').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+eid.key+"' name='check' checked /><label for='"+eid.key+"'></label></div></td><td>"+name+"</td><td>"+venue+"</td><td>"+time+"</td><td>"+amount+"</td><td>"+eid.child('status').val()+"</td></tr>");
                });
               
                
              });
             //console.log(eventnames);  
           display_bio(name,college,mobile);  
    } ,function(error){
        console.log("Wrong entry"+error);
    });
  
});

/*Search button triggered event end*/

/*Confirm button triggered event start*/

$('#confirm-button').click(function(){
    
    const rootset=firebase.database().ref('/tathva17/users/'+uid);
    
var undo=function(){
   rootset.child('events').once('value',function(snapevents){
   // console.log(uid+'2');
    snapevents.forEach(function(eid){
        var key=eid.key;
       // console.log('uid:'+uid+'eid:'+key);
       
        
           var eventset=firebase.database().ref('/tathva17/events_participants/'+key+'/'+uid);
           eventset.update({ status:'registered' });
    
           var eventset2=firebase.database().ref('/tathva17/users/'+uid+'/events/'+key);
           eventset2.update({ status:'registered' });
              
    });
  });
};
    

//console.log(uid+'1');
rootset.child('events').once('value',function(snapevents){
   // console.log(uid+'2');
    snapevents.forEach(function(eid){
        var key=eid.key;
        //console.log('uid:'+uid+'eid:'+key);
       
        if($('#'+key).prop('checked')){
           var eventset=firebase.database().ref('/tathva17/events_participants/'+key+'/'+uid);
           eventset.update({ status:'confirmed' });
    
           var eventset2=firebase.database().ref('/tathva17/users/'+uid+'/events/'+key);
           eventset2.update({ status:'confirmed' });
        }
        else{
            var eventset=firebase.database().ref('/tathva17/events_participants/'+key+'/'+uid);
            eventset.set({status:'cancelled'});
            var eventset2=firebase.database().ref('/tathva17/users/'+uid+'/events/'+key);
            eventset2.set({status:'cancelled'});
        }
        
    });
      var data={
            message: 'Registration successfull',
            timeout: 4000,
            actionHandler: undo,
            actionText: 'Undo'
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
    
},function(error){
    console.log(error);
     var data={
            message: 'Registration failed',
            timeout: 2000  
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);    
  });
 
});
/*Confirm button triggered event end*/

});