$(document).ready(function(){
  $('#confirm-button').hide();
  $('#undo-button').hide();
  $('#result-table').hide();
  $('#master').click(function(){
     $('.checkall').prop('checked', $(this).prop('checked'));
 });
 
 function display_bio(name,college,mobile,gender){
     $('#result-clg').html(college);
     $('#result-num').html(mobile);
     $('#result-name').html(name);
     $('#result-gender').html(gender);
     $('#temp-name').hide();
 }
 
 
 
 /*Search button triggered event start*/
 
$('#search-button').click(function(){
    $('#result-group-name').html("");
    $('#result-members').html("");
    $('#result-events').html("");
    $('#undo-button').hide();
    $('#result-table').show();
    
    const teamref=firebase.database().ref('/tathva17/teams');
    const leaderemail=$('#search').val();
    tid='';
    var total=0;
    teamref.orderByChild('leader').equalTo(leaderemail).once('child_added',function(tid){
        var teamname=tid.child('name').val();
        $('#result-group-name').html(teamname);
        $('#temp-name').hide();
        window.tid=tid.key;
        
        tid.child('members').forEach(function(uid){
          
           const userref=firebase.database().ref('/tathva17/users/'+uid.key);
           userref.child('bio').once('value',function(snapuser){
               
               var name=snapuser.child('name').val();
               var number=snapuser.child('mobile').val();
               var gender=snapuser.child('gender').val();
               var email=uid.val();
               $('#result-members').append("<tr><td>"+name+"</td><td>"+email+"</td><td>"+number+"</td><td>"+gender+"</td></tr>");
               
           });
       });
       
       tid.child('groupevents').forEach(function(gid){
              if(gid.child('status').val()=='registered'){
                  $('#confirm-button').show();
                  $('#undo-button').hide();
              }
              else if(gid.child('status').val()=='confirmed'){
                  $('#confirm-button').hide();
                  $('#undo-button').show();
              }
              const groupeventref=firebase.database().ref('/tathva17/groupevents/'+gid.key);
              groupeventref.once('value',function(event){
                  var status=gid.child('status').val();
                  var eventname=event.child('name').val();
                  var time=event.child('time').val();
                  var venue=event.child('venue').val();
                  var amount=event.child('amount').val();
                  if(gid.child('status').val()!=='cancelled'){
                  total=amount+total;
                  }
                  $('#result-events').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+gid.key+"' name='check' checked /><label for='"+gid.key+"'></label></div></td><td>"+eventname+"</td><td>"+venue+"</td><td>"+time+"</td><td>"+amount+"</td><td>"+status+"</td></tr>");
                  
                  $('#total-amt').html(total);
              });
          
       });
       
    });
   
       
   
 
});

/*###############################*/

/*confirm button triggered event start*/

$('#confirm-button').click(function(){
   const teamref=firebase.database().ref('/tathva17/teams/'+tid);
   teamref.child('groupevents').once('value',function(events){
       console.log(events);
       events.forEach(function(gid){
       console.log(gid.key);
       if($('#'+gid.key).prop('checked')){
           const updateteam=firebase.database().ref('/tathva17/teams/'+tid+'/groupevents/'+gid.key);
           updateteam.update({status:'confirmed'});
       }
       else{
          const updateteam=firebase.database().ref('/tathva17/teams/'+tid+'/groupevents/'+gid.key);
           updateteam.update({status:'cancelled'}); 
       }
       const updateevent=firebase.database().ref('/tathva17/group_participants/'+gid.key+'/'+tid);
       updateevent.update({status:'confirmed'});
       });
       var data={
            message: 'Successfull',
            timeout: 2000,
            
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
     });
   
  });

/*################################*/

/*undo button triggered event start*/

$('#undo-button').click(function(){
  const teamref=firebase.database().ref('/tathva17/teams/'+tid);
   teamref.child('groupevents').once('value',function(events){
       console.log(events);
       events.forEach(function(gid){
       console.log(gid.key);
       
           const updateteam=firebase.database().ref('/tathva17/teams/'+tid+'/groupevents/'+gid.key);
           updateteam.update({status:'registered'});
       
       const updateevent=firebase.database().ref('/tathva17/group_participants/'+gid.key+'/'+tid);
       updateevent.update({status:'registered'});
       });
       var data={
            message: 'Confirmation cancelled',
            timeout: 2000,
            
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
     });
});
/*##############################*/

});