import { ButtonHTMLAttributes} from 'react';

import '../styles/button.scss';

// vai receber as propriedades de um botão e um outro objeto que personalizamos
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
};

// passando um valor default para o atributo isOutlined
export function Button({isOutlined = false, ...props}:ButtonProps){
    return(
        // condição para alterar o valor de uma propriedade (classe que irá compor a formatação)
        <button className={`button ${isOutlined ? 'outlined': ''}`} {...props}/>
    )
}

//named export