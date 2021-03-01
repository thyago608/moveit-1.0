import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ChallengesContext } from './ChallengesContext';

//Formato dos dados do Contexto
interface CountDownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean
    isActive: boolean;
    startCountDown: () => void;
    resetCountDown: () => void;
}

//Criando contexto
export const CountDownContext = createContext({} as CountDownContextData);


//Formato da prop children de CountDownContextProvider
type CountDownContextProviderProps = {
    children: ReactNode;
}


export function CountDownContextProvider({ children }: CountDownContextProviderProps) {
    //context
    const { startNewChallenge } = useContext(ChallengesContext);

    /*
        Estado que guarda se o cronômetro está ativo
        true => ativo  || false => não ativo
    */
    const [isActive, setIsActive] = useState(false);


    /* 
        Estado que guarda se o cronômetro chegou em zero
        true => chegou   || false => não chegou
    */
    const [hasFinished, setHasFinished] = useState(false);

    /*
        Estado com 25 milisegundos  -> 25 min
        25 => minutos      60 => segundos
    */
    const [time, setTime] = useState(0.1 * 60);


    //Arredondando para baixo para não ter minutos quebrados
    const minutes = Math.floor(time / 60);

    //segundos
    const seconds = time % 60;

    //countdownTimeOut é do tipo NodeJs.TimeOut
    //É uma tipagem global, essa variável irá referênciar um setTimeOut

    let countdownTimeOut: NodeJS.Timeout;

    //Quando o botão 'iniciar ciclo' for clicado irá executar essa função
    function startCountDown() {
        setIsActive(true);
    }

    /*
        Quando o botão 'abandonar ciclo' for clicado irá executar essa função
        Irá ser limpo o setTimeOut
        O cronômetro para
        Os minutos voltarão para os 25min
    */
    function resetCountDown() {
        clearTimeout(countdownTimeOut);
        setIsActive(false);
        setTime(0.1 * 60);
        setHasFinished(false);
    }

    /*
        Essa função é disparada após o active mudar de estado ou quando time mudar de estado
    
        Se o crônometro estiver ativo e o tempo for maior que zero irá ser executado o setTimeOut
        Caso crônometro esteja ativo e o tempo for 0,  o cronômetro irá ser desativado e hashFinished irá pra true (chegou ao fim)
    */
    useEffect(() => {
        if (isActive && time > 0) {
            countdownTimeOut = setTimeout(() => {
                setTime(time - 1)
            }, 1000);
        } else if (isActive && time === 0) {
            setIsActive(false);
            setHasFinished(true);
            startNewChallenge();
        }
    }, [isActive, time]);




    return (
        <CountDownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountDown,
            resetCountDown,
        }}>
            {children}
        </CountDownContext.Provider>
    )
}

