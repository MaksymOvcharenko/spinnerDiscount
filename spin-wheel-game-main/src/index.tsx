import { ISegments, ISpinWheelProps } from "./components/SpinWheel.interface"
import SpinWheel from "./components/SpinWheel"
import React from "react";
import ReactDOM from "react-dom/client";
import DiscountBox from "./components/Spin";




ReactDOM.createRoot(document.getElementById("root")!).render(
    
  <React.StrictMode>
        {/* <MySpinWheel/> */}
        <DiscountBox/>
  </React.StrictMode>
);
export type { ISegments, ISpinWheelProps }
export { SpinWheel }