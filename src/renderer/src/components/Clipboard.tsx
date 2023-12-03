import { useEffect, useState } from 'react'
import { SHARED_EVENT } from '../../../shared/sharedEvent'

function Clipboard(): JSX.Element {
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([])

  // This effect runs whenever the component is updated.
  useEffect(() => {
    window.electron.ipcRenderer.on(SHARED_EVENT.CLIPBOARD_UPDATE, (event, history: string[]) => {
      setClipboardHistory([...history])
    })
  }, [clipboardHistory])

  // This function will be used to restore items from the clipboard history.
  const clearClipboard = () => {
    window.electron.ipcRenderer.send(SHARED_EVENT.CLEAR)
    setClipboardHistory([])
  }

  // first set
  useEffect(() => {
    window.electron.ipcRenderer.send(SHARED_EVENT.INITIAL_CLIPBOARD_REQ)
    window.electron.ipcRenderer.on(
      SHARED_EVENT.INITIAL_CLIPBOARD_RES,
      (event, history: string[]) => {
        setClipboardHistory([...history])
      }
    )
  }, [])

  return (
    <div>
      {clipboardHistory.map((item, index) => (
        <div
          key={index}
          onClick={() => window.electron.ipcRenderer.send(SHARED_EVENT.CLIPBOARD_SET, item)}
          // className="text-white"
        >
          {item}
        </div>
      ))}

      <button onClick={clearClipboard}>clear</button>
    </div>
  )
}

export default Clipboard
