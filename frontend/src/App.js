import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { userRouter } from './routes/userRoutes';
import  { adminRouter} from './routes/adminRoutes';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './ components/ui/AuthModal'; 

function App() {
  return (
    <BrowserRouter>
     <AuthProvider> 
        
        <Routes>
            {userRouter}
            {adminRouter} 
        </Routes>

        
        <AuthModal />
        
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;