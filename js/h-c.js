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
    $('#result-bio').html("");
    $('#result-name').html("");
    $('#result-stay').html("");
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
           var status=snap.child('hospitality/status').val();
           uid=snap.key;
           hid='';
           total=0;
           display_bio(name,college,mobile,gender); 
           available=0;
           
           if(status=='booked'){
               const hostelref=firebase.database().ref('/tathva17/hospitality');
               const gender=snap.child('bio/gender').val();
               allocated=false;
               hostelref.orderByKey().once('value',function(snaphostels){
                   
                     
                   snaphostels.forEach(function(hid){
                         
                        if(hid.child('for').val()==gender){
                             
                             if(hid.child('available').val()>0){
                                 if(allocated==false){
                                     window.available=hid.child('available').val();
                                     var location=hid.child('location').val();
                                     var amount=hid.child('amount').val();
                                     var name=hid.child('name').val();
                                     $('#result-stay').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+hid.key+"' name='check' checked /><label for='"+hid.key+"'></label></div></td><td>"+name+"</td><td>"+location+"</td><td>"+amount+"</td><td>"+status+"</td></tr>");
                                     window.hid=hid.key;
                                     total=amount;
                                     $('#total-amt').html(total);
                                     allocated=true;
                                     window.available-=1;
                                 }
                             }
                         }
                     });
                     
                       if(allocated==false){
                         var data={
                           message: 'Hostel spaces are OVER',
                           timeout: 4000
                           };
                         var container=document.querySelector('#msgbar');
                         container.MaterialSnackbar.showSnackbar(data);
                       }           
              });
           }
            else if(status=='confirmed'){
               const findstay=firebase.database().ref('/tathva17/users/'+uid+'/hospitality');
               
               findstay.once('child_added',function(hid){
                 $('#confirm-button').hide();
                 $('#undo-button').show();
                 window.hid=hid.key;
                 var status=snap.child('hospitality').child(hid.key).child('status').val();
                 const stay=firebase.database().ref('/tathva17/hospitality/'+hid.key);
                 stay.once('value',function(hid2){
                     window.available=hid2.child('available').val();
                     var location=hid2.child('location').val();
                     var amount=hid2.child('amount').val();
                     var name=hid2.child('name').val();
                     total=amount;
                     $('#total-amt').html(total);
                     $('#result-stay').append("<tr><td><div class='squaredOne'><input type='checkbox' class='checkall' value='None' id='"+hid2.key+"' name='check' checked /><label for='"+hid2.key+"'></label></div></td><td>"+name+"</td><td>"+location+"</td><td>"+amount+"</td><td>"+status+"</td></tr>");
                });
             });
        }
        else{
                    var data={
                           message: 'User have not booked',
                           timeout: 4000
                           };
                         var container=document.querySelector('#msgbar');
                         container.MaterialSnackbar.showSnackbar(data);
        }
            
    },function(error){
        console.log("Wrong entry"+error);
    });
 
});

/*Search button triggered event end*/

/*confirm button triggered event start*/

$('#confirm-button').click(function(){
    function undo(){
        if(uid && hid){
      const hostelref=firebase.database().ref('/tathva17/hospitality_participants/'+hid);
      const stayref=firebase.database().ref('/tathva17/hospitality/'+hid);
      const userref=firebase.database().ref('/tathva17/users/'+uid);
      hostelref.child(uid).set({});
      userref.child('hospitality/'+hid).set({});
      stayref.update({available:available+1});
      userref.child('hospitality').update({status:'booked'});
        }
    }
    
      console.log('uid:'+uid+'hid:'+hid);
      if(uid && hid){
      const hostelref=firebase.database().ref('/tathva17/hospitality_participants/'+hid);
      const stayref=firebase.database().ref('/tathva17/hospitality/'+hid);
      const userref=firebase.database().ref('/tathva17/users/'+uid);
      hostelref.child(uid).update({status:'confirmed'});
      userref.child('hospitality/'+hid).update({status:'confirmed'});
      stayref.update({available:available});
      userref.child('hospitality').update({status:'confirmed'});
      
       var data={
            message: 'Hostel Booking Confirmed',
            timeout: 4000,
            actionHandler: undo,
            actionText: 'Undo'
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
     }
     else{
         console.log('not booked');
         
     }
  });

/*confirm button triggered event end*/

/*undo button triggered event start*/

$('#undo-button').click(function(){
  if(uid && hid){
      const hostelref=firebase.database().ref('/tathva17/hospitality_participants/'+hid);
      const stayref=firebase.database().ref('/tathva17/hospitality/'+hid);
      const userref=firebase.database().ref('/tathva17/users/'+uid);
      hostelref.child(uid).set({});
      userref.child('hospitality/'+hid).set({});
      stayref.update({available:available+1});
      userref.child('hospitality').update({status:'booked'});
      
         var data={
            message: 'Confirmation cancelled',
            timeout: 1000           
          };
          var container=document.querySelector('#msgbar');
          container.MaterialSnackbar.showSnackbar(data);
     }
    
});
/*undo button triggered event end*/

});