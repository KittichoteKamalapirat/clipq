import icons from './assets/icons.svg'
import Clipboard from './components/Clipboard'

function App(): JSX.Element {
  return (
    <div className="container">
      <svg className="hero-logo" viewBox="0 0 900 300">
        <use xlinkHref={`${icons}#electron`} />
      </svg>
      <h2 className="hero-text">
        You{"'"}ve successfully created an Electron project with React and TypeScript
      </h2>
      <p className="hero-tagline">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <Clipboard />
    </div>
  )
}

export default App
