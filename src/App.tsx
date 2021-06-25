import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';

import { AuthContextProvider } from './contexts/authContext'; 
import { AdminRoom } from './pages/AdminRoom';

function App() {

  // tudo que está dentro do provider vai ter acesso a informação, por exemplo as duas rotas.
  return (
    <BrowserRouter>
    <AuthContextProvider>
      {/* usado para garantir que quando achar uma página não irá abrir outra junto */}
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/rooms/new" exact component={NewRoom}/>
        <Route path="/rooms/:id" component={Room}/>
        <Route path="/admin/rooms/:id" component={AdminRoom}/>
      </Switch>
    </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
