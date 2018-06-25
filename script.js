var hasMuneem = (function () {
    function initFirebase(config){
        firebase.initializeApp(config); 
    }
    initFirebase(config);
    var database = firebase.database();
    var auth = firebase.auth();
    function initUI(){
        document.getElementById('loadingDiv').style.display = "none";
        firebaseDatabase();

        let loginButton = document.querySelector('.login-btn');
        if(loginButton){
            loginButton.addEventListener('click',function(e){
                e.preventDefault();
                fireBaseLogin(e);
            });
        }
        let hamburger = document.querySelector('.menu-icon.border-icon');
        let overlay = document.querySelector('.overlay');
        let navbar =  document.querySelector('.nav-bar-container');
        hamburger.addEventListener('click', function(e){
            e.preventDefault();
            navbar.className += " show";
            overlay.className += " show";
        })
        overlay.addEventListener('click',function(e){
            e.preventDefault();
            navbar.classList.remove('show');
            overlay.classList.remove('show');
        })
    }
    function firebaseDatabase(){
        if(document.cookie.indexOf('loginuser=nandan.1345@gmail.com') >= 0){
            database.ref('users').once('value').then(function(snapshot) {
                var users = (snapshot.val() && snapshot.val()) || 'Anonymous';
                var template = document.getElementById('accordion-render');
                var accordionList = document.getElementById('accordion');
                var templateHtml = template?template.innerHTML:'';
                var listHtml = '';
                for(var user in users){
                    listHtml += templateHtml.replace(/{{employee-name}}/g, users[user].Name)
                    .replace(/{{employee-id}}/g, user)
                    .replace(/{{emailId}}/g, users[user].email)
                    .replace(/{{moneyCount}}/g, users[user].moneyCount);;
                }
                if(accordionList){
                    accordionList.innerHTML += listHtml;
                }
                hasMuneem.initAccordion(document.getElementById('accordion'));
                var allPanelElems = document.querySelectorAll('.submit-btn');
                if(allPanelElems){
                    allPanelElems.forEach(panel=>{
                        panel.addEventListener('click',function(e){
                            e.preventDefault();
                            hasMuneem.formData(e);
                        })
                    })
                }
            });
        }else if(location.href.indexOf('amount-update.html') >= 0 && document.cookie.indexOf('loginuser=nandan.1345@gmail.com') < 0){
            window.location = 'index.html';
        }
    }
    function fireBaseLogin(event){
        var targetForm = event.target.parentNode;
        var targerUsername = targetForm.elements[0].value;
        var targerPassword = targetForm.elements[1].value;
        auth.signInWithEmailAndPassword(targerUsername, targerPassword)
        .then(resp=> {
            console.log(resp)
            if(resp.user.email === 'nandan.1345@gmail.com'){
                document.cookie = "loginuser=nandan.1345@gmail.com";
                window.location = 'amount-update.html';
            }
        })
        .catch(error=> console.log(error.message))
    }
    function formData(event){
        var targetForm = event.target.parentNode;
        var targerUser = targetForm.name;
        var oldCount = targetForm.dataset.moneycount;
        var email = targetForm.dataset.email;
        var fineamt = targetForm.elements[0].value;
        var formDataObject = {};
        var newCount = parseInt(oldCount) + parseInt(fineamt);
        formDataObject['moneyCount'] = newCount;
        formDataObject['lastDate'] = new Date();
        hasMuneem.writeData(formDataObject,targerUser,fineamt,email);
    }
    function writeData(data,user,fineamt,email){
        document.getElementById('loadingDiv').style.display = "block";
        emailJSdata = {
            to_name : user,
            to_email : email,
            fine_amt : fineamt,
            updated_amt : data.moneyCount,
            date : data.lastDate
        }
        database.ref('users/' + user)
        .update(data,
        function(error){
            if(error){
                console.log(error);
            }else{
                console.log('data saved successfully');
                emailjs.send('helios_muneem', 'template_ZP1fEY63', emailJSdata)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    document.getElementById('loadingDiv').style.display = "none";
                    location.reload();
                }, function(error) {
                    console.log('FAILED...', error);
                });
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

    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=0'
    }    
    return {
        initUI : initUI,
        initFirebase:initFirebase,
        initAccordion:initAccordion,
        firebaseDatabase:firebaseDatabase,
        formData : formData,
        writeData: writeData,
        fireBaseLogin:fireBaseLogin,
        eraseCookie: eraseCookie
    }; 
})();

hasMuneem.initUI();
function logOut(){
    hasMuneem.eraseCookie('loginuser');
    window.location.href = '/'
}