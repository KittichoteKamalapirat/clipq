import { useEffect, useState } from 'react'
import { clipboard } from 'electron'

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
    clipboard.writeText(item)
    setClipboardHistory(clipboardHistory.filter((i) => i !== item))
  }

  return (
    <div>
      {clipboardHistory.map((text, index) => (
        <p key={`clip-${index}`}>{text}</p>
      ))}
      <button onClick={restoreFromHistory}>Restore</button>
    </div>
    // Your UI here, using restoreFromHistory as an onClick handler for the items.
  )
}

export default Clipboard
