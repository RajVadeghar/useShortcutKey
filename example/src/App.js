import React from 'react'
import { useMyHook } from 'use-shortcut-key'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App