import React from "react";
import Quill from "react-quill";
import "react-quill/dist/quill.snow.css";
import constants from './constants'

const modules = {
  toolbar: false
};

const formats = [
  "header",
  "bold",
  "color",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "align",
  "indent",
  "link",
  "image"
];

const ContentEditor = ({ content, lang }) => {
    const currentSelection = {
        content:'',
        selectedText:''
    }
    const ref = React.useRef(null);
    const getData = async (text) => {
        var data = new FormData();
            data.append( "text", text );
            data.append( "lang", lang );
        const rawResponse = await fetch(constants.baseUrl, {
          method: 'POST',
          body: data
        });
        return await rawResponse.json();  
    }
    const setQuilValue = (e) => {
        let quill= ref.current.editor; 
        let selectedTLiext = ((e.target).innerHTML).replace(/<\/?[^>]+(>|$)/g, "");
        let rText = (currentSelection.content).replace(currentSelection.selectedText,selectedTLiext);
        quill.setContents(quill.clipboard.convert(rText), 'silent');

    }
    const onChangeSelection = async (range, oldRange, source) => {
        var tooltipControls = document.getElementById("tooltip-controls"+lang);
        tooltipControls.style.display = 'none';
        tooltipControls.classList.remove("active");
        if (range === null) return;
        let quill= ref.current.editor;   // get current  Quill
        currentSelection.content = (quill.getText()).replace('\n','');;
        let _data = await getData( currentSelection.content); // Get The Data from API
        var selection = window.getSelection();
        currentSelection.selectedText = ''; // Reset Sellection text
        if (selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            var documentFragment = range.cloneContents();
            var div = document.createElement('div');
            div.appendChild( documentFragment.cloneNode(true) );
            currentSelection.selectedText = div.innerHTML;
            let _s = _data.filter((_s) => _s.original === currentSelection.selectedText);
            if(_s.length > 0){              
                let _list = [];
                for(let _ss of _s[0].suggestions){
                    _list.push('<li>'+_ss+'</li>'); 
                    
                }
                document.getElementById("list-group"+lang).innerHTML = _list.join('');;
            }else{
                currentSelection.selectedText = '';
                document.getElementById("list-group"+lang).innerHTML = '';
            }
        }

        if(currentSelection.selectedText === ''){
            return false; // return if no selection
        }
        if (range.length === 0) {
            tooltipControls.style.display = 'none';
            tooltipControls.classList.remove("active");
        } else {
            tooltipControls.style.display = 'none';
            tooltipControls.classList.remove("active");
            let rangeBounds = quill.getBounds(range);
            tooltipControls.style.display = 'block';
            tooltipControls.style.left = (rangeBounds.left + rangeBounds.width/2 - 250/2)+"px";
            tooltipControls.style.top = (rangeBounds.bottom + 10)+"px";
        }
        
    };

    React.useEffect(() => {
      ref.current.editor.root.setAttribute("spellcheck", "true");
      ref.current.editor.root.setAttribute("lang", lang);
      ref.current.editor.addContainer( document.getElementById('tooltip-controls'+lang));
    }, [lang]);
  
    return (
        <div className="quill-wrap">
        <div id={"tooltip-controls"+lang} className="tooltip-controls">
         <ul className="list-group" id={"list-group"+lang} onClick={setQuilValue}>
         </ul>
         <button>Add to dictionary</button>
         <button>Ignore</button>

        </div>
        <Quill
            ref={ref}
            theme="snow"
            value={content}
            onChangeSelection={onChangeSelection}
            modules={modules}
            formats={formats}
        />
        </div>
   
    );
};

  export default ContentEditor;