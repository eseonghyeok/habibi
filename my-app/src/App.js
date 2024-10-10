import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/views/homePage/homePage";
import Bar from "./components/views/homePage/bar"
import monthChartTable from "./components/views/chartPage/monthPage/MonthChartTable"
import yearChartTable from "./components/views/chartPage/yearPage/YearChartTable"
import dailyChartTable from "./components/views/chartPage/dayPage/DailyChartTable"
import minusChartTable from "./components/views/chartPage/dayPage/MinusChartTable"
import awardPage from "./components/views/homePage/awardPage"
import attendancePage from "./components/views/adminPage/attendancePage"
import notiPage from "./components/views/homePage/notiPage"
import logPage from "./components/views/homePage/logPage"
import Footer from "./components/views/homePage/footer"

import './App.css';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <Bar />
      <div>
        <Routes>
          <Route exact path="/" Component={HomePage} />
          <Route exact path="/chart/month" Component={monthChartTable} />
          <Route exact path="/chart/year" Component={yearChartTable} />
          <Route exact path="/chart/daily" Component={dailyChartTable} />
          <Route exact path="/chart/minus" Component={minusChartTable} />
          <Route exact path="/award" Component={awardPage} />
          <Route exact path="/attendance" Component={attendancePage} />
          <Route exact path="/notification" Component={notiPage} />
          <Route exact path="/logcheck" Component={logPage} />
        </Routes>
      </div>
      <Footer/>
    </Suspense>
  );
}

export default App;