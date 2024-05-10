import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import Store from './store/store.ts'
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
     <ChakraProvider>
          <Provider store={Store}>
               <App />
          </Provider>
     </ChakraProvider>
)
