import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestions =  Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>


export function useRoom(roomId: string){

    // para buscar todas as questions
     const [questions, setQuestions] = useState<QuestionType[]>([]);

    // para alterar o title
    const [title, setTitle] = useState('');

    //dados do usuário
    const {user} = useAuth();


    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on('value', room => {

            const databaseRoom = room.val()
            const firebaseQuestions = databaseRoom.questions as FirebaseQuestions ?? {}

            // transforma um json em uma matriz
            const parsedQuestions =  Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    // para capturar os linkes
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId == user?.id)?.[0]
                }
            }); 

            setQuestions(parsedQuestions);
            setTitle(databaseRoom.title);
        
        })

        return () => roomRef.off('value');

        // user é uma dependência, por isso precisa colocar no parâmetro
        // se o id mudar, precisa recarregar as perguntas

    }, [roomId, user?.id]);

    return {questions, title}
}