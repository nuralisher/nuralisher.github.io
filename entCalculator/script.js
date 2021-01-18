

window.onload = ()=>{
    // const trueAnswersInput = document.getElementById('trueAnswers');
    // const selectedAnswersInput = document.getElementById('selectedAnswers');
    const calculate = document.getElementById('calculate');
    const addStudent = document.getElementById('adds');
    const studentsBlock = document.getElementById('students');
    const addQuestion = document.getElementById('addq');
    const questionsBlock = document.getElementById('question_item');

    let students = [new Student('Alisher'),];
    let questionsNumber = 1;

    students.forEach((student)=>{
        student.draw();
    })

    document.querySelector('#trueAnswers').focus();


    addQuestion.onclick = ()=>{
        questionsNumber++;
        let qInput = document.createElement('input');
        qInput.className = 'trueAnswers';
        qInput.id = 'trueAnswers';
        qInput.placeholder = '???';
        qInput.maxLength = 3;
        questionsBlock.appendChild(qInput);
        
        let studentQuestions = [...document.getElementsByClassName('student_item')];
        let i = 1;

        studentQuestions.forEach((e)=>{
            let stqinput = document.createElement('input');
            stqinput.className = `selectedAnswers selectedAnswers${i}`;
            stqinput.placeholder = '???';
            // stqinput.maxLength =3;
            e.appendChild(stqinput);
            i++;
        })
    }

    addStudent.onclick = ()=>{
        let newStudent = new Student((students.length+1).toString());
        students.push(newStudent);
        newStudent.draw();
    }


    calculate.onclick = ()=>{
        const trueAnswersInputs = [...document.getElementsByClassName('trueAnswers')];

        for(let st in students){
            const id = parseInt(st)+1;
            const selectedAnswersInputs = [...document.querySelectorAll(`.selectedAnswers${id}`)];
            const score = document.querySelector(`.stScore${id}`);
            let scoreValue = 0;
            for(let i in trueAnswersInputs){
                scoreValue = scoreValue + calc(trueAnswersInputs[i], selectedAnswersInputs[i]);
            }
            score.innerHTML = scoreValue;
        }

    }



    function calc(trueAnswersInput, selectedAnswersInput){
        const trueAnswers = trueAnswersInput.value.trim().toUpperCase();
        const selectedAnswers = selectedAnswersInput.value.trim().toUpperCase();
        

        if(!trueAnswers || !selectedAnswers){
            return 0;
        }

        let missedAnswers = 0;

        for(el of trueAnswers){
            let isExist =  false;
            for(e of selectedAnswers){
                if(el===e){ isExist = true }
            }
            if(!isExist){ missedAnswers++ }
        }


        let wrongAnswers = 0

        for(e of selectedAnswers){
            let isExist = false;
            for(el of trueAnswers){
                if(el===e){ isExist = true }
            }
            if(!isExist){ wrongAnswers++ }
        }

        if(missedAnswers+wrongAnswers===0){
            return 2;
        }else if(wrongAnswers>=2){
            return 0;
        }else if(missedAnswers>trueAnswers.length/2){
            return 0;
        }else{
            return 1;
        }
    }



    function Student(name){
        this.name = name;
        this.score = 0;
    
        this.changeName = function(newName){
            this.name = newName;
        }

        this.addPoint = function(point){
            this.score = this.score + point;
        }
    
        this.draw = function(){       
            let block = document.createElement('div');
            block.className = "student_item";
    
            let header = document.createElement('div');
            header.className = 'header';
            let name = document.createElement('input');
            name.className = `stName${(students.length).toString()}`;
            name.value = this.name;
            name.id = (students.length).toString();

            name.oninput = (e)=>{
                this.changeName(e.target.value.trim());
            }
    
            let score = document.createElement('span');
            score.className = `stScore stScore${(students.length).toString()}`;
            score.id = (students.length).toString();
            score.innerHTML = this.score;
    
            let span1 = document.createElement('span');
            let span2 = document.createElement('span');
            span1.innerHTML = 'Student name:';
            span2.innerHTML = 'Score:'
    
            header.appendChild(span1);
            header.appendChild(name);
            header.appendChild(span2);
            header.appendChild(score);
    
            block.appendChild(header);
    
            for(let i=1; i<=questionsNumber; i++){
                let answer = document.createElement('input');
                answer.className = `selectedAnswers selectedAnswers${(students.length).toString()}`;
                answer.placeholder = '???';
                // answer.maxLength =3;
                block.appendChild(answer);
            }
    
            studentsBlock.appendChild(block);
        }
    }
}