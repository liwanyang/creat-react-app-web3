import React, { Suspense } from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import Home from './pages/home'
import Pages from './pages/pages'
import {Headers} from './components/header'

const App = () => (
  <div>
    <header>
      <Headers></Headers>
      <Link to="/">Home</Link>&#x3000;
      <Link to="/pages">Pages</Link>
    </header>
    <main>
      <Suspense fallback={null}>
        <Switch>
          <Route exact strict path="/" component={Home} />
          <Route exact strict path="/pages" component={Pages} />
        </Switch>
      </Suspense>
    </main>
  </div>
)

export default App