

window.onload = ()=>{
    // const trueAnswersInput = document.getElementById('trueAnswers');
    // const selectedAnswersInput = document.getElementById('selectedAnswers');
    const calculate = document.getElementById('calculate');
    const addStudent = document.getElementById('adds');
    const studentsBlock = document.getElementById('students');
    const addQuestion = document.getElementById('addq');
    const questionsBlock = document.getElementById('question_item');
    const excel = document.getElementById('table');

    let students = [new Student("Alisher", 1)];
    let questionsNumber = 1;

    students.forEach((student)=>{
        student.draw();
    })


    excel.oninput = (e)=>{
        let input = e.target.value;
        let rows = input.split(/\r\n|\r|\n/g);

        for(i in rows){
            if(i==0){
                rowExcel(rows[i], 1);
            }else{
                addStudentClick();
                rowExcel(rows[i], parseInt(i)+1);
            }
        }
    }

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

    addStudent.onclick = addStudentClick;
    
    function addStudentClick(){
        let newStudent = new Student((students.length+1).toString(), students.length+1);
        students.push(newStudent);
        newStudent.draw();
    }


    calculate.onclick = ()=>{
        const trueAnswersInputs = [...document.getElementsByClassName('trueAnswers')];

        for(let st in students){
            const id = parseInt(st)+1;
            const selectedAnswersInputs = [...document.querySelectorAll(`.selectedAnswers${id}`)];
            const score = document.querySelector(`.stScore${id}`);
            let scoreValue = parseInt(students[st].score);
            for(let i in trueAnswersInputs){
                scoreValue = scoreValue + parseInt(calc(trueAnswersInputs[i], selectedAnswersInputs[i]));
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


    function rowExcel(genAns, id){
        let answers = genAns.split("	");

                answers.forEach((ans)=>{
                    const selectedAnswersInputs = [...document.querySelectorAll(`.selectedAnswers${id}`)];
                    const name = document.querySelector(`.stName${id}`);
                    let i =0;
                    selectedAnswersInputs.forEach((el)=>{
                        el.value = answers[i];
                        i++;
                    });

                    for(i in answers){
                        if(i==0){
                            let scoreRow = answers[i];
                            let scoreValue = `${scoreRow[0]}${scoreRow[1]}`;
                            students[id-1].score = parseInt(scoreValue);
                        }else if(i==1){
                            name.value = answers[i];
                        }else{
                            selectedAnswersInputs[i-2].value = answers[i];
                        }
                    }
                })
    }

    function Student(name, id){
        this.name = name;
        this.score = 0;
        this.id = id;

        this.setScore = function(score){
            this.score = score;
        }
    
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

            let generalAns = document.createElement('input');
            generalAns.placeholder = 'excel row';
            generalAns.className = "genAns";

            generalAns.oninput = (e)=>{
                let genAns = e.target.value;
                rowExcel(genAns, this.id);
            }
    
            header.appendChild(span1);
            header.appendChild(name);
            header.appendChild(span2);
            header.appendChild(score);
            header.appendChild(generalAns);
    
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