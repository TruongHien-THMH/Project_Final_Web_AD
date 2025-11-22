import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { userRouter } from './routes/userRoutes';
import  { adminRouter} from './routes/adminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          {userRouter}
          {adminRouter} 
      </Routes>
    </BrowserRouter>
  );
}

export default App;