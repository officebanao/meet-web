import './App.css';
import { BrowserRouter, Switch, Route, Link, useLocation } from 'react-router-dom'
import { useTransition, animated } from 'react-spring'
import Home from './views/Home';
import Leave from './views/Leave';
import Meeting from './views/Meeting';

import ReactGA from 'react-ga4';		
ReactGA.initialize('G-R8QNV9RCFF');		
ReactGA.send("pageview");

function App() {
    const location = useLocation() || {};
    const transitions = useTransition(location, location => location.pathname, {
      from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
      enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
      leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })

    return transitions.map(({ item: location, props, key }) => (
      <animated.div key={key} style={props}>
        <Switch location={location}>
            <Route path="/:meetingId" component={Meeting} />
            <Route path="/" exact component={Home} />
            <Route path="/leave" component={Leave} />
        </Switch>
      </animated.div>
    ))
}

export default App;
