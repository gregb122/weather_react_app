import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import {Home} from './pages/Home';
import {Favorites} from './pages/Favorites';
import {Details} from './pages/Details';
import {TemperatureToggle} from './components';
import {Provider} from 'react-redux';
import {store} from './store';

import './App.css';

const App = () => {
    return (
        <Provider store={store}>
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
        </Provider>
    );
};

export default App;
