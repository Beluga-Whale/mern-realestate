import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import SignUp from './pages/SignUp';

import PrivateRoute from './components/PrivateRoute';
import UpdateListing from './pages/UpdateListing';
import CreateListing from './pages/CreateListing';
import Listing from './pages/Listing';

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/about" element={<About />} />
                <Route path="/listing/:id" element={<Listing />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-listing" element={<CreateListing />} />
                    <Route
                        path="/update-listing/:id"
                        element={<UpdateListing />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
