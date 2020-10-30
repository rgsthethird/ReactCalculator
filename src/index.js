import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Calc extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // history: [{
            //  expression: [],
            //  status: "",   
            // }],
            expression: [],
            status: "",
        }
    }

    handleClick(i) {
        const modifiers = ["√","^2",".","%"];
        const symbols = ["+","-","*","/"];
        const expression = this.state.expression;
        const status = this.state.status;
        let newStatus;
        let newExpression;
        if(Number.isInteger(i)) {
            newStatus = status+i;
            newExpression = this.handleNums(i);
        } else if (modifiers.includes(i)) {
            const modified = this.handleModifiers(i);
            newStatus = modified[0];
            newExpression = modified[1];
        } else if (symbols.includes(i)) {
            newStatus = status+" "+i+" ";
            newExpression = expression.concat([i]);
        } else if (i === "=" || i === "Enter") {
            const total = this.calculate();
            newStatus = total;
            newExpression = [total]
        } else if (i === "CE" || i === "c" || i === "C") {
            newStatus = ""
            newExpression = [];
        }

        this.setState({
            expression: newExpression,
            status: newStatus,
        });
    }

    handleKeyPress = (event) => {
        const pressedKey = event.key;
        if(pressedKey === "Enter") {
            event.preventDefault();
        }
        const numbers = ["0","1","2","3","4","5","6","7","8","9"];
        const modifiers = ["√","^2",".","%"];
        const symbols = ["+","-","*","/","=","CE","Enter","c","C"];
        if(numbers.includes(pressedKey)) {
            this.handleClick(parseInt(pressedKey));
        } else if (modifiers.includes(pressedKey) || symbols.includes(pressedKey)) {
            this.handleClick(pressedKey);
        }
    }

    handleNums(i) {
        const expression = this.state.expression;
        let priorVal = expression[expression.length-1];
        if(Number.isInteger(priorVal)) {
            expression[expression.length-1] = priorVal*10+i;
            return expression;
        } else if(priorVal === ".") {
            if(Number.isInteger(expression[expression.length-2])) {
                expression[expression.length-2] += i/10;
                expression.pop()
            }
            else {
                expression[expression.length-1] = i/10;
            }
            return expression;
        } else if(!isNaN(priorVal)) {
            const numDecimals = this.countDecimals(priorVal);
            expression[expression.length-1] += i/Math.pow(10,numDecimals+1);
            return expression;
        }
        else {
            return expression.concat([i]);
        } 
    }

    handleModifiers(i) {
        const expression = this.state.expression;
        const status = this.state.status;
        if(i === "%") {
            expression[expression.length-1] = expression[expression.length-1]/100;
            return [status+i, expression];
        } else if (i === "√") {
            let total = Math.sqrt(this.calculate());
            total = Number.isInteger(total) ? total : total.toFixed(5);
            return [total,[total]]
        } else if (i === "^2") {
            let total = Math.pow(this.calculate(),2);
            return [total,[total]]
        }
        else {
            return [status+i,  expression.concat([i])];
        }
    }

    countDecimals(value) {
        let count = 0;
        while(!Number.isInteger(value)) {
            value = value*10;
            count = count+1;
        }
        return count;
    }

    calculate() {
        const expression = this.state.expression;
        let total = expression[0];
        let index = 1;
        while(index < expression.length) {
            const val = expression[index];
            if(!Number.isInteger(val)) {
                index += 1;
                switch(val) {
                    case "+":
                        total += expression[index];
                        break;
                    case "-":
                        total -= expression[index];
                        break;
                    case "*":
                        total *= expression[index];
                        break;
                    case "/":
                        total /= expression[index];
                        break;
                    default:
                        total = -1;
                        break;
                }
            }
            index += 1;
        }
        return total;
    }

    renderButton(i) {
        return (
            <Button value={i} onClick={() => this.handleClick(i)}/>
        );
    }

    render() {
        return (
            <div className="calcbox" onKeyPress={this.handleKeyPress}>
                <div className="visbox">{this.state.status}</div>
                <div className="buttoncontainer">
                    <div className="buttonrow">
                        {this.renderButton("√")}
                        {this.renderButton("^2")}
                        {this.renderButton("%")}
                        {this.renderButton("CE")}
                    </div>
                    <div className="buttonrow">
                        {this.renderButton(1)}
                        {this.renderButton(2)}
                        {this.renderButton(3)}
                        {this.renderButton("+")}
                    </div>
                    <div className="buttonrow">
                        {this.renderButton(4)}
                        {this.renderButton(5)}
                        {this.renderButton(6)}
                        {this.renderButton("-")}
                    </div>
                    <div className="buttonrow">
                        {this.renderButton(7)}
                        {this.renderButton(8)}
                        {this.renderButton(9)}
                        {this.renderButton("*")}
                    </div>
                    <div className="buttonrow">
                        {this.renderButton(0)}
                        {this.renderButton(".")}
                        {this.renderButton("=")}
                        {this.renderButton("/")}
                    </div>
                    <div className="bottomrow">
                        {this.renderButton("<")}
                        {this.renderButton(">")}
                    </div>
                </div>
            </div>
        );
    }
}

function Button(props) {
    return (
        <button 
        className="calcbutton" 
        onClick={props.onClick}
        onKeyPress={props.onKeyPress}
        >
            {props.value}
        </button>
    );
}

// ========================================

ReactDOM.render(
    <Calc />,
    document.getElementById('root')
);
