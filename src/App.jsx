import {useEffect} from 'react';
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import {Home} from './pages/Home';
import {Favorites} from './pages/Favorites';
import {Details} from './pages/Details';
import {TemperatureToggle} from './components';
import {Provider, useDispatch} from 'react-redux';
import {store} from './store';
import {fetchFavorites} from './slices/favoritesSlice';

import './App.css';

const AppShell = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                <header className="app-header">
                    <h1 className="app-title">Weather App</h1>
                    <nav className="app-nav">
                        <Link to="/">Favorites</Link>
                        <Link to="/selection">Selection</Link>
                    </nav>
                    <TemperatureToggle />
                </header>
                <Routes>
                    <Route path="/" element={<Favorites />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/selection" element={<Home />} />
                    <Route path="/details/:cityId" element={<Details />} />
                </Routes>
            </div>
        </Router>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <AppShell />
        </Provider>
    );
};

export default App;
