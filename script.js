var hasMuneem = (function () {
    function initFirebase(config){
        firebase.initializeApp(config); 
    }

    function initAccordion(accordionElem){
        //when panel is clicked, handlePanelClick is called.          
        function handlePanelClick(event){
            showPanel(event.currentTarget);
        }
        //Hide currentPanel and show new panel.  
        
        function showPanel(panel){
            //Hide current one. First time it will be null. 
            var expandedPanel = accordionElem.querySelector(".active");
            if (expandedPanel){
                expandedPanel.classList.remove("active");
            }
            //Show new one
            panel.classList.add("active");
        }
        var allPanelElems = accordionElem.querySelectorAll(".panel");
        for (var i = 0, len = allPanelElems.length; i < len; i++){
                allPanelElems[i].addEventListener("click", handlePanelClick);
        }
        //By Default Show first panel
        showPanel(allPanelElems[0])
    }
    
    return {
        initFirebase:initFirebase,
        initAccordion:initAccordion
    }; 
})(); 
hasMuneem.initFirebase(config);
hasMuneem.initAccordion(document.getElementById("accordion"));