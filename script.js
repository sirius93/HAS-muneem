var hasMuneem = (function () {
    function initFirebase(config){
        firebase.initializeApp(config); 
    }
    function firebaseDatabase(){
        database.ref('users').once('value').then(function(snapshot) {
            var users = (snapshot.val() && snapshot.val()) || 'Anonymous';
            var template = document.getElementById('accordion-render');
            var accordionList = document.getElementById('accordion');
            var templateHtml = template.innerHTML;
            var listHtml = '';
            for(var user in users){
                listHtml += templateHtml.replace(/{{employee-name}}/g, users[user].Name);
                console.log(user,users);
            }
            accordionList.innerHTML += listHtml;
            hasMuneem.initAccordion(document.getElementById('accordion'));
        });
    }

    function writeData(){
        database().ref('users/' + Nandan).set({
            'money-count' :20
          });
    }
    function initAccordion(accordionElem){
        //when panel is clicked, handlePanelClick is called.          
        function handlePanelClick(event){
            showPanel(event.currentTarget);
        }
        //Hide currentPanel and show new panel.  
        
        var allPanelElems = accordionElem.querySelectorAll(".panel");
        for (var i = 0, len = allPanelElems.length; i < len; i++){
                allPanelElems[i].addEventListener("click", handlePanelClick);
        }
        //By Default Show first panel
        showPanel(allPanelElems[0]);

        function showPanel(panel){
            //Hide current one. First time it will be null. 
            var expandedPanel = accordionElem.querySelector(".active");
            if (expandedPanel){
                expandedPanel.classList.remove("active");
            }
            //Show new one
            if(panel){
                panel.classList.add("active");
            }
        }
    }

    return {
        initFirebase:initFirebase,
        initAccordion:initAccordion,
        firebaseData:firebaseDatabase
    }; 
})(); 
hasMuneem.initFirebase(config);
var database = firebase.database();
hasMuneem.firebaseData();

function submitData(){
    this.event.preventDefault();
    console.log(this)
}