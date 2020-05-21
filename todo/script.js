
function add(){
    let input = document.getElementById('input').value;
    let lists = document.getElementById('lists');
    let text = document.createTextNode(input);
    let elem = document.createElement('div');
    let checbox = document.createElement('input');
    checbox.type='checkbox';
    checbox.className='checkbox';
    let box = document.createElement('div');
    let span = document.createElement('span');
    span.className = 'line';
    

    if(input!=''){
        
        elem.className='elements';
        btn = document.createElement('img');
        btn.src='trash.svg';
        btn.className='icon';
        span.appendChild(text);
        box.appendChild(checbox);
        box.appendChild(span);
        elem.appendChild(box);
        elem.appendChild(btn);
        lists.append(elem);
        document.getElementById('input').value='';
        
        
    }
    btn.onclick = function (){
        lists.removeChild(elem);
    }
}