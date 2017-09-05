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
 
$('#undo-button').click(function(){
    if(uid){
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
  
   rootchange.child('workshops').once('value',function(snapworkshops){
    snapworkshops.forEach(function(wid){
        
            var workshopset=firebase.database().ref('/tathva17/workshops_participants/'+wid.key+'/'+uid);
            workshopset.update({status:'registered'});
            
            var workshopset=firebase.database().ref('/tathva17/users/'+uid+'/workshops/'+wid.key);
            workshopset.update({status:'registered'});
        
    });
    
});
  var data={
            message: 'confirmation changed',
            timeout: 2000
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
  }         
});
 /*Search button triggered event start*/
 
$('#search-button').click(function(){
    $('#result-bio').html("");
    $('#result-name').html("");
    $('#result-event').html("");
    $('#result-gender').html("");
    $('#undo-button').hide();
    $('#confirm-button').show();
    $('#result-table').show();
    
    const root=firebase.database().ref('/tathva17/users');
    const search_email=$('#search').val();
    
    root.orderByChild('email').equalTo(search_email).once('child_added',function(snap){
           var name=snap.child('bio/name').val();
           var mobile=snap.child('bio/mobile').val();
           var college=snap.child('bio/college').val();
           var gender=snap.child('bio/gender').val();
           uid=snap.key;
           total=0;
           
           
           
            snap.child('workshops').forEach(function(wid){
                if('confirmed'==wid.child('status').val()){
                    $('#confirm-button').hide();
                    $('#undo-button').show();
                }
                var workshopdetails=firebase.database().ref('/tathva17/workshops/'+wid.key);
                workshopdetails.once('value',function(snapworkshop){
                    var venue=snapworkshop.child('venue').val();
                    var time=snapworkshop.child('time').val();
                    var amount=snapworkshop.child('amount').val();
                    var name=snapworkshop.child('name').val();
                    if('cancelled'!=wid.child('status').val()){
                        total=total+amount;
                        $('#total-amt').html(total);
                    }
                   $('#result-event').prepend("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+wid.key+"' name='check' checked /><label for='"+wid.key+"'></label></div></td><td>"+name+"</td><td>"+venue+"</td><td>"+time+"</td><td>"+amount+"</td><td>"+wid.child('status').val()+"</td></tr>"); 
                });
                
            });
           
            /*selecting Event of each user*/
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
                  if('cancelled'!=eid.child('status').val()){ 
                  total=total+amount;
                  $('#total-amt').html(total);
                  }
                 // $('#result-event').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+eid.key+"' name='check' checked /><label for='"+eid.key+"'></label></div></td><td class='mdl-data-table__cell--non-numeric'>"+name+"</td><td class='mdl-data-table__cell--non-numeric'>"+venue+"</td><td class='mdl-data-table__cell--non-numeric'>"+time+"</td><td>"+amount+"</td></tr>");
                $('#result-event').prepend("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+eid.key+"' name='check' checked /><label for='"+eid.key+"'></label></div></td><td>"+name+"</td><td>"+venue+"</td><td>"+time+"</td><td>"+amount+"</td><td>"+eid.child('status').val()+"</td></tr>");
                });
               
                
              });
              /*selected Event of each user*/
             //console.log(eventnames);
            display_bio(name,college,mobile,gender);   
           
    } ,function(error){
        console.log("Wrong entry"+error);
    });
  
});

/*Search button triggered event end*/

/*Confirm button triggered event start*/

$('#confirm-button').click(function(){
    if(uid){
     eventconfirm=false;
     workshopconfirm=false;
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
  
  rootset.child('workshops').once('value',function(snapworkshops){
    snapworkshops.forEach(function(wid){
        
            var workshopset=firebase.database().ref('/tathva17/workshops_participants/'+wid.key+'/'+uid);
            workshopset.update({status:'registered'});
            
            var workshopset=firebase.database().ref('/tathva17/users/'+uid+'/workshops/'+wid.key);
            workshopset.update({status:'registered'});
        
    });
    
});
};
    
/*confirming workshops*/
rootset.child('workshops').once('value',function(snapworkshops){
    snapworkshops.forEach(function(wid){
        if($('#'+wid.key).prop('checked')){
            var workshopset=firebase.database().ref('/tathva17/workshops_participants/'+wid.key+'/'+uid);
            workshopset.update({status:'confirmed'});
            
            var workshopset=firebase.database().ref('/tathva17/users/'+uid+'/workshops/'+wid.key);
            workshopset.update({status:'confirmed'});
        }
        else{
            var workshopset=firebase.database().ref('/tathva17/workshops_participants/'+wid.key+'/'+uid);
            workshopset.update({status:'cancelled'});
            
            var workshopset=firebase.database().ref('/tathva17/users/'+uid+'/workshops/'+wid.key);
            workshopset.update({status:'cancelled'}); 
        }
    });
    var data={
            message: 'Workshop Registration successfull',
            timeout: 1000,
            actionHandler: undo,
            actionText: 'Undo'
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
},function(error){
    console.log(error);
    var data={
            message: 'Workshop Registration failed',
            timeout: 1000,
            actionHandler: undo,
            actionText: 'Undo'
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
});

//console.log(uid+'1');
/*confirming events*/
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
            message: 'Event Registration successfull',
            timeout: 1000,
            actionHandler: undo,
            actionText: 'Undo'
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);  
    
},function(error){
    console.log(error);
    var data={
            message: 'Event Registration failed',
            timeout: 1000,
            actionHandler: undo,
            actionText: 'Undo'
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
  });
    }
});
/*Confirm button triggered event end*/

});