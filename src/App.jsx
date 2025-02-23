import StrokeMessageGenerator from './components/StrokeMessageGenerator'

function App() {  // Changed from StrokeMessageGenerator to App
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <StrokeMessageGenerator />  // Added the actual component
    </div>
  )
}

export default App