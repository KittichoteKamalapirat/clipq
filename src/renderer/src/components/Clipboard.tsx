import { useState } from 'react'

declare global {
  interface Window {
    api: {
      send: (channel: string, ...arg: any) => void
      receive: (channel: string, func: (event: any, ...arg: any) => void) => void
    }
  }
}

function Clipboard(): JSX.Element {
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([])

  // This effect runs whenever the component is updated.
  // useEffect(() => {
  //   // Add to the clipboard history whenever something new is copied.
  //   clipboard.on('text-changed', () => {
  //     setClipboardHistory([clipboard.readText(), ...clipboardHistory])
  //   })
  // }, [clipboardHistory])

  // This function will be used to restore items from the clipboard history.
  const restoreFromHistory = (item) => {
    // clipboard.writeText(item)
    setClipboardHistory(clipboardHistory.filter((i) => i !== item))
    return true
  }

  return (
    <div>
      {clipboardHistory.map((item, index) => (
        <div key={index} onClick={() => window.api.send('clipboard-set', item)}>
          {item}
        </div>
      ))}
    </div>
    // Your UI here, using restoreFromHistory as an onClick handler for the items.
  )
}

export default Clipboard
