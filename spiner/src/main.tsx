import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import DiscountBox from './components/Spin.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    < DiscountBox/>
  </StrictMode>,
)
