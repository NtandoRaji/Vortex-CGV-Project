class Greeter {
    private _message: string;

    constructor(message: string){
        this._message = message;
    }

    public greet = () : void => {
        console.log(this._message);
    }
}


const greeter : Greeter = new Greeter("Hello, World!!!");
greeter.greet();
