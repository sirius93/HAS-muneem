var hasMuneem = (function () {
    function initFirebase(config){
        firebase.initializeApp(config); 
    }
    function firebaseDatabase(){
        database.ref('users').once('value').then(function(snapshot) {
            var users = (snapshot.val() && snapshot.val()) || 'Anonymous';
            var template = document.getElementById('accordion-render');
            var accordionList = document.getElementById('accordion');
            var templateHtml = template?template.innerHTML:'';
            var listHtml = '';
            for(var user in users){
                listHtml += templateHtml.replace(/{{employee-name}}/g, users[user].Name)
                .replace(/{{employee-id}}/g, user)
                .replace(/{{moneyCount}}/g, users[user].moneyCount);;
            }
            if(accordionList){
                accordionList.innerHTML += listHtml;
            }
            hasMuneem.initAccordion(document.getElementById('accordion'));
        });
    }
    function fireBaseLogin(_that){
        var targetForm = _that.event.target.parentNode;
        var targerUsername = targetForm.elements[0].value;
        var targerPassword = targetForm.elements[1].value;
        auth.signInWithEmailAndPassword(targerUsername, targerPassword)
        .catch(function(error) {            
            console.log(error.message);
        })
        auth.onAuthStateChanged(user => {
            if(user) {
              window.location = 'amount-update.html';
            }
        });
    }
    function formData(_that){
        var targetForm = _that.event.target.parentNode;
        var targerUser = targetForm.name;
        var oldCount = targetForm.dataset.moneycount;
        var formDataObject = {};
        var newCount = parseInt(oldCount) + parseInt(targetForm.elements[0].value);
        formDataObject['moneyCount'] = newCount;
        formDataObject['lastDate'] = new Date();
        hasMuneem.writeData(formDataObject,targerUser);
    }
    function writeData(data,user){
        database.ref('users/' + user)
        .update(data,
        function(error){
            if(error){
                console.log(error);
            }else{
                console.log('data saved successfully');
                location.reload();
            }
        })
    }
    function initAccordion(accordionElem){
        if(accordionElem){
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
            // showPanel(allPanelElems[0]);

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
    }

    return {
        initFirebase:initFirebase,
        initAccordion:initAccordion,
        firebaseData:firebaseDatabase,
        formData : formData,
        writeData: writeData,
        fireBaseLogin:fireBaseLogin
    }; 
})(); 
hasMuneem.initFirebase(config);
var database = firebase.database();
var auth = firebase.auth();
hasMuneem.firebaseData();

function submitData(_this){
    let _this = this;
    // _this.event.preventdefault();
    hasMuneem.formData(_this);
}
function loginUser(_this){
    let _thiscon = this;
    hasMuneem.fireBaseLogin(_thiscon);
}