$(document).ready(function(){
 
 const root=firebase.database().ref('tathva17/Participants');
 
$('#search-button').click(function(){
    const search_name=$('#search').val();
    root.orderByChild('Name').equalTo(search_name).once('value',function(snap){
        console.log(snap.val().Name);
    });
    
    
});

});