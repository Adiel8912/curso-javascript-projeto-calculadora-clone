class CalCrontroller{//Aqui criamos a nossa classe, que é onde será criada uma função para a calculadora

    constructor(){//Aqui declaramos nossos atributos e metodos que serão utilizados dentro da função em uma instancia

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operations = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector('#display');
        this._dateEl = document.querySelector('#data');
        this._timeEl = document.querySelector('#hora');
        this._currentDate;
        this.refreshDateTime();
        this.initButtonsEvents();
        this.initKeyboards();
    }
    //------------------------------------------------------------------------------------
    //Para um atributo privado, ele precisa do 'get e set', assim ele poderá  ser chamado de uma maneira especifica
    get displayCalc(){//Metodo utilizado para pegar/recuperar/chamar um atributo
        
        return this._displayCalcEl.innerHTML;
        
    }
    
    set displayCalc(value){//Metodo utilizado para atribuir um novo value para um atributo
        
        if(value.toString().length>10){

            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;

    }
    //------------------------------------------------------------------------------------
    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        this._timeEl.innerHTML=value;
        
    }
    //------------------------------------------------------------------------------------
    get displayDate(){

        return this._dateEl.innerHTML;
        
    }
    
    set displayDate(value){
        
        this._dateEl.innerHTML = value;
        
    }
    //------------------------------------------------------------------------------------
    get currentDate(){
        
        return new Date();
        
    }
    
    set currentDate(value){
        
        this._currentDate = value;
        
    }
    //------------------------------------------------------------------------------------
    setDisplayDateTime(){
        
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{day:'2-digit',month:'short',year:'numeric'});
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    //------------------------------------------------------------------------------------

    refreshDateTime(){
        
        this.setDisplayDateTime();

        //Serve para definir um tempo de atuaização, no caso, são 1000 milisegundos, ou 1 segundo
        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000)

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick',e=>{
                this.toggleAudio();
            });
        });
    }
    //------------------------------------------------------------------------------------
    toggleAudio(){

        this._audioOnOff = !this._audioOnOff

    }
    //------------------------------------------------------------------------------------
    playAudio(){

        if (this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    //------------------------------------------------------------------------------------
    
    clearAll(){
        this._operations = [];
        this._lastNumber='';
        this._lastOperator='';
        this.setLastNumberToDisplay();
    }
    
    clearEntry(){
        
        this._operations.pop();
        this.setLastNumberToDisplay();
        
        //posso utilizar o pop para retirar o ultimo item de um array
    }
    //------------------------------------------------------------------------------------
    setError(){

        this.displayCalc = 'Error';

    }
    //------------------------------------------------------------------------------------

    getLastOperation(){

        return this._operations[this._operations.length-1];

    }

    //------------------------------------------------------------------------------------

    isOperator(value){

    return (['-','+','%','*','/'].indexOf(value) > -1);//indexOf serve como forma de conferir se um valor está dentro de algo, no caso, dentro do array
    }
    //------------------------------------------------------------------------------------

    changeLastOperation(value){

        this._operations[this._operations.length-1] = value;

    }
    //------------------------------------------------------------------------------------

    pushOperation(value){

        this._operations.push(value);

        if(this._operations.length > 3){
        
            this.calc();
            this.setLastNumberToDisplay();
            
        }
    }
    //------------------------------------------------------------------------------------

    calc(){

        let last = '';
        
        this._lastOperator = this.getLastItem(true);

        if(this._operations.length<3){

            let firstItem = this._operations[0];
            this._operations = [firstItem,this._lastOperator, this._lastNumber]

        }

        if(this._operations.length>3){
            
            last = this._operations.pop();
            this._lastNumber = this.getResult();

        }else if(this._operations.length == 3){

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();//join funciona como o toString, porém esse ultimo mantém as virgulas

        if(last == '%'){

            result /= 100;//Significa que ele é igual a ele mesmo dividido por 100
            this._operations = [result];

        }else{
        
            this._operations = [result];

            if(last) this._operations.push(last);// "if(last)" = se last existir, ou seja,não for undefined
        }

        this.setLastNumberToDisplay();
    }
    //------------------------------------------------------------------------------------
    
    getResult(){

        try{
        return eval(this._operations.join(''));
        }catch(e){

            setTimeout(()=>{

                this.setError();
            }, 1);
        }
    }
    //------------------------------------------------------------------------------------

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operations.length-1; i >= 0; i--){
   
            if (this.isOperator(this._operations[i]) == isOperator ){//exclamação serve como negação de algo, no caso, não é operador
                lastItem = this._operations[i];
                break;
            }
        } 

        if(!lastItem){

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }
        return lastItem;
    }

    //------------------------------------------------------------------------------------

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0; //O '!' também significa não existir(undefined), ou seja, se lastNumber for indefinido, atribua o '0'
        this.displayCalc = lastNumber;

    }

    //------------------------------------------------------------------------------------
    addOperation(value){
        
        if (isNaN(this.getLastOperation())){

            if(this.isOperator(value)){
                
                this.changeLastOperation(value);

            }else{//Esse serve para adicionar o primeiro numero, ja que a array está vazio
                
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        }else{
        
            if( this.isOperator(value)){//Esse trecho pode dar problema, confira na aula 16

            this.pushOperation(value);

            }else{

            let newValue = this.getLastOperation().toString() + value.toString();
            this.changeLastOperation(newValue);//Adiciona um dado a um array

            this.setLastNumberToDisplay();
            
            };
        
        }
        console.log(this._operations);

    }
    //------------------------------------------------------------------------------------

        addDot(){

            let lastOperation = this.getLastOperation();

            if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.')>-1) return;//Split não funciona com numero, então precisa confirmar se é uma string

            if(this.isOperator(lastOperation) || !lastOperation){
                this.pushOperation('0.');
            }else{
                this.changeLastOperation(lastOperation.toString()+'.')
            }

            this.setLastNumberToDisplay();
        }

    //------------------------------------------------------------------------------------
    execBtn(value){

        this.playAudio();
        
        switch (value){
            
            case 'ac':
                this.clearAll()
                break;
                
            case 'ce':
                this.clearEntry();
                break;
                
            case 'porcento':
                this.addOperation('%');
                break;

            case 'divisao':
                this.addOperation('/');
                break;
                
            case 'multiplicacao':
                this.addOperation('*');
                break;
                
            case 'subtracao':
                this.addOperation('-');
                break;
                
            case 'soma':
                this.addOperation('+');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;
                    
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6': 
            case '7':
            case '8':
            case '9':   
            this.addOperation(parseInt(value));
            break;

            default:
                this.setError();
                break;
        }

    }
    //------------------------------------------------------------------------------------
    addEventListenerAll(element,events,fn){
        
        events.split(' ').forEach((event)=>{//Split serve para definir um separador para algo, transforma num array
            
            element.addEventListener(event, fn, false);//False serve para que não haja click duplo, que poderia acontecer pois ao clicar na camada superior (do numero) a de baixo(do botão) tbm sofreria o click
        })
    }
    //------------------------------------------------------------------------------------

    initButtonsEvents(){

        let buttons = document.querySelectorAll('#buttons > g, #parts > g');

        buttons.forEach((btn,index)=> {
            
            this.addEventListenerAll(btn,'click drag', (e)=>{

                let textBtn = btn.className.baseVal.replace('btn-','');//replace serve para substituir, className dá acesso a classe e o baseVal serve para conseguir acessar a classe de um SGV
            
                this.execBtn(textBtn);
            });

            this.addEventListenerAll(btn,"mouseover mousedown mouseup", (e)=>{

                btn.style.cursor = 'pointer';

            })
        });
    }

    //------------------------------------------------------------------------------------

    pasteFromClipboard(){//Aqui ele não pegou o valor e adicionou ao array, apenas colocou no display

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            console.log(text);
        });

    }
    //------------------------------------------------------------------------------------

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand('Copy');

        input.remove;

    }

    //------------------------------------------------------------------------------------

    initKeyboards(){

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch (e.key){
            
                case 'Escape':
                    this.clearAll()
                    break;
                    
                case 'Backspace':
                    this.clearEntry();
                    break;
                    
                case '%':
                case '+':
                case '-':
                case '/':
                case '*':
                    this.addOperation(e.key);
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
                        
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6': 
                case '7':
                case '8':
                case '9':   
                this.addOperation(parseInt(e.key));
                break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                break;
            }
        });
    }

}