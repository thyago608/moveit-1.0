import Cookie from 'js-cookie';
import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

//Tipagem da propriedade `activeChallenge` 
interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

//Tipagem do contexto

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
    experienceToNextLevel: number;
}

//context
export const ChallengesContext = createContext({} as ChallengesContextData);



//Tipagem das propriedades do Provider
interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
    //Level do usuário
    const [level, setLevel] = useState(rest.level ?? 1);
    //Esperiência atual do usuário          Se existir valor em rest.level, irá ser usado o valor, caso contrário irá ser utilizado 1
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    //Desafios completados
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    //Desafios propostos ao usuário
    const [activeChallenge, setActiveChallenge] = useState(null);
    //Experiência do usuário para o próximo nível
    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
    useEffect(() => {
        //API do Navegador, que irá executar o método de pedir permissão de notificação ao usuário
        Notification.requestPermission();
    }, []);


    //Armazenando informações nos cookies
    //A função irá ser executada sempre que o level, xp atual, e desafios completos mudarem
    useEffect(() => {
        //Método SET é utilizado para salvar uma informação em Cookie,
        //O mesmo recebe duas string como argumento
        //Chave, valor
        Cookie.set('level', String(level));
        Cookie.set('currentExperience', String(currentExperience));
        Cookie.set('challengesCompleted', String(challengesCompleted))
    }, [level, currentExperience, challengesCompleted]);




    //Subindo de level
    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        //Gera-se um número randômico entre 0|1, 
        //o mesmo é multiplicado pela quantidade de itens no vetor de challengs, dps é arredondado esse valor para baixo
        //Isso irá retornar um número inteiro, o mesmo será utilizado como index para acessar um valor qualquer no vetor.
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)

        //challenges => É um array de objetos
        //Está sendo capturado um obj desse array, 
        //O index que está sendo utilizado, é o que foi gerado anteriormente. 
        const challenge = challenges[randomChallengeIndex];

        //ActiveChallenge irá armazenar o obj que está em challenge
        setActiveChallenge(challenge);

        //ActiveChallenge => Inicia em null.
        //A troca de valor dessa variável de estado influência os demais componentes que fazem uso desse contexto.


        //Executando Audio de Notificação
        new Audio('/notification.mp3').play();

        //Se o usuário deu permissões de notificações
        if (Notification.permission === "granted") {
            //Irá exibir essa notificação
            new Notification('Novo Desafio', {
                body: `Valendo ${challenge.amount} xp`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
        //A função irá mudar o valor da variável de estado ActiveChallenge para null.
        //Acarretando mudança na exibição dos demais componentes que fazem uso do contexto.
    }


    function completeChallenge() {
        //Se não existir desafio
        if (!activeChallenge) {
            return;
        }

        //amount => xp que o usuário irá receber caso cumpra o desafio
        const { amount } = activeChallenge;

        //xp final => xp atual + xp que usuário irá receber caso cumpra o desafio.
        let finalExperience = currentExperience + amount;

        //Se o xp final > o xp necessário pra subir de nível
        if (finalExperience >= experienceToNextLevel) {
            //xp final => xp final - xp necessário pra subir de nível
            finalExperience = finalExperience - experienceToNextLevel;
            //sobe de nível
            levelUp();
        }


        //Atualizado o xp do usuário
        setCurrentExperience(finalExperience);
        //Zerando o desafio
        setActiveChallenge(null);
        //atualizando o total de desafios completos
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider value={{
            level,  // inicia em 1
            currentExperience,  // inicia em 0
            challengesCompleted,  //  inicia em 0
            levelUp,  //
            startNewChallenge,  //
            activeChallenge,  // inicia em null, mas irá armazenar um obj quando muda de estado
            resetChallenge,  // é uma função que alterar a variável de estado `ActiveChallenge` para null 
            experienceToNextLevel,  // Contém o level do usuário
            completeChallenge,
            closeLevelUpModal,
        }}>
            {children}
            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}