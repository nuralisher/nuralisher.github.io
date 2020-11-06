let givenInput = document.getElementById('given');
let resultInput = document.getElementById('result');
let leftSelectItems = [...document.querySelectorAll('.left .select_item')];
let rightSelectItems = [...document.querySelectorAll('.right .select_item')];
let leftBtnMore = document.getElementById('left_btn_more');
let rightBtnMore = document.getElementById('right_btn_more');
let leftMore = document.getElementById('left_more');
let rightMore = document.getElementById('right_more');
let rightMoreOptions = document.querySelectorAll('.right .more_option');
let leftMoreOptions = document.querySelectorAll('.left .more_option');

const countingSystem = {
  decimal:10,
  binary: 2,
};

let inputCountingSystem = countingSystem.binary;
let resultCountingSystem = countingSystem.decimal;

givenInput.focus();


leftBtnMore.onclick = (event)=>{
    leftMore.style.display === "block"? leftMore.style.display='none': leftMore.style.display='block';
    rightMore.style.display = 'none';
    event.stopPropagation();
}

rightBtnMore.onclick = (event)=>{
    rightMore.style.display === "block"? rightMore.style.display='none': rightMore.style.display='block';
    leftMore.style.display = 'none';
    event.stopPropagation();
}

window.onclick = (event)=>{
    if(event.target != leftBtnMore || event.target!=rightBtnMore){
        leftMore.style.display = 'none';
        rightMore.style.display = 'none';
    }
}

leftSelectItems.forEach((item)=>{
    item.onclick = select.bind(this, leftSelectItems, leftMoreOptions);
})

rightSelectItems.forEach((item)=>{
    item.onclick = select.bind(this, rightSelectItems, rightMoreOptions);
})

givenInput.oninput = (event)=>{
    let input  = event.target.value;

    if(!input){
        resultInput.value = "";
        return;
    }else if(input.length>1023){
        event.target.value = input.slice(0, -1);
        alert('max length of char 1023');
        return;
    }

    let result = convert(input);
    resultInput.value = result;
}

function convert(input){
    let result = "";
    isValidInput(input)?
    result = isFinite(parseInt(input, inputCountingSystem))?
        parseInt(input, inputCountingSystem).toString(resultCountingSystem)
        :
        "Too big number"
    :
    result = "Invalid input"
    return result;
}

function isValidInput(input){
    const check  = input.split("").filter((char)=>{
        for(let i=0; i<inputCountingSystem; i++){
            let digit = i;
            let capital = "";

            if(i>=10){
                digit = String.fromCharCode(97+(i-10));
                capital = String.fromCharCode(65+(i-10));
            }
            if(char==digit || char===capital){
                return true;
            }
        }
        return false;
    });

    return check.length===input.length;
}

function a(event){
    leftSelectItems.forEach(item=>item.classList.remove('selected'));
    event.target.classList.add('selected');
    inputCountingSystem = parseInt(event.target.value);
    if(givenInput.value) resultInput.value = convert(givenInput.value);
    givenInput.focus();
}

function selectRight(event){
    rightSelectItems.forEach(item=>item.classList.remove('selected'));
    event.target.classList.add('selected');
    resultCountingSystem = parseInt(event.target.value);
    if(givenInput.value) resultInput.value = convert(givenInput.value);
    givenInput.focus();
}


leftMoreOptions.forEach(item=>{
    item.onclick = select.bind(this, leftSelectItems, leftMoreOptions);
});

rightMoreOptions.forEach(item=>{
    item.onclick = select.bind(this, rightSelectItems, rightMoreOptions);
})

function select(selecItems, moreOptions, event){
    const find = selecItems.find(item=>(item.value===event.target.value && window.getComputedStyle(item).display==='block'));

    if(!find){
        selecItems[0].innerHTML = event.target.innerHTML;
        selecItems[0].value = event.target.value;
    }
    
    
    selecItems.forEach(item=>{
        item.value===event.target.value? item.classList.add('selected'): item.classList.remove('selected')
    });

    moreOptions.forEach(item=>{
        item.value===event.target.value? item.classList.add('selected'): item.classList.remove('selected');
    })

    selecItems===leftSelectItems? inputCountingSystem = parseInt(event.target.value)
    :
    resultCountingSystem = parseInt(event.target.value);

    if(givenInput.value) resultInput.value = convert(givenInput.value);
    givenInput.focus();
}