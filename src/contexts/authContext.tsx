import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

// tipo do contexto que será passado para as outras páginas
type AuthContextType = {
    // por que a primeiro momento não existe usuário logado 
    user: User | undefined;
    // como é assincrono, precisa alterar para retornar uma Promise
    signInWithGoogle: () => Promise<void>;
}
  
// tipo do objeto que a autenticação irá retornar que nós mapeamos
type User = {
    id: string;
    name: string;
    avatar: string;
}
  
// propriedades que esse contexto pode receber
type AuthContextProviderProps = {
    children: ReactNode;
}

//o valor  passado é o tipo de valor que será utilizado 
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props:AuthContextProviderProps){

//criar um estado para pegar as informações do usuário
  const [user, setUser] = useState<User>();

  // primeiro parâmetro -> qual função será executada
  // segundo parametro -> qual informação quero ficar monitorando, quando ela alterar eu vou executar algo
  // verificar se o usuário já tinha feito login na aplicação
  // antigo componentDidMount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user){

        const { displayName, photoURL, uid}  = user;

        if(!displayName || !photoURL){
          throw new Error ('Missing information from Google Account');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })

      }
    })

    // para se descadastrar do evento
    // para não ficar ouvindo sempre
    // componentWillMount
    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle(){
    //autenticação do usuário
    const provider = new firebase.auth.GoogleAuthProvider();
    //abrir uma tela de popup para login

    const result = await auth.signInWithPopup(provider);

      if(result.user){
        const { displayName, photoURL, uid}  = result.user;

        if(!displayName || !photoURL){
          throw new Error ('Missing information from Google Account');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })

      }

  }

    return(
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}