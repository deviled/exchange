import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import Exchange from './pages/Exchange/Exchange';
import {Provider} from 'react-redux';
import {store} from './store';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Exchange/>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
