import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import { FooterWithSocialLinks } from "./components/Footer";

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="">
        <Outlet />
      </div>
      <div className="">
        <FooterWithSocialLinks />
      </div>
    </>
  );
};

export default App;
