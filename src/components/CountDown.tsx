import { useContext } from 'react';
import { CountDownContext } from '../contexts/CountDownContext';
import styles from '../styles/components/CountDown.module.css';

export function CountDown() {

    const {
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountDown,
        resetCountDown,
    } = useContext(CountDownContext);
    /*
        É convertido os minutos em string
        split() => Irá partir uma string em um array, apartir de um caractere especifico dentro da string.
                     Nesse caso, nada é informado, logo cada caractere da string irá ocupar uma posição no array. 
                     ex: 05 => [0,5] 
    
        padStart() => Verifica se existe informação na primeira parte do array.
                      Se existir recupera essa primeira parte, caso contrário coloca '0'
    */
    const [minutesLeft, minutesRight] = String(minutes).padStart(2, '0').split('');

    //O mesmo acontece com os segundos
    const [secondsLeft, secondsRight] = String(seconds).padStart(2, '0').split('');

    return (
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minutesLeft}</span>
                    <span>{minutesRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondsLeft}</span>
                    <span>{secondsRight}</span>
                </div>
            </div>

            {
                hasFinished ? (<button disabled className={styles.countdownButton}>
                    Ciclo Encerrado
                </button>) : (
                        <>
                            {
                                isActive ?
                                    (
                                        <button type="button" className={`${styles.countdownButton} ${styles.countdownButtonActive}`} onClick={resetCountDown}>
                                            Abandonar ciclo
                                        </button>
                                    ) : (
                                        <button type="button" className={styles.countdownButton} onClick={startCountDown}>
                                            Iniciar ciclo
                                        </button>
                                    )
                            }
                        </>
                    )
            }
        </div>
    );
}