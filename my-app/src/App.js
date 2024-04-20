import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/views/homePage/homePage";
import Bar from "./components/views/homePage/bar"
import monthChartTable from "./components/views/chartPage/monthPage/MonthChartTable"
import yearChartTable from "./components/views/chartPage/yearPage/YearChartTable"
import dailyChartTable from "./components/views/chartPage/dayPage/DailyChartTable"
import minusChartTable from "./components/views/chartPage/dayPage/MinusChartTable"
import starTable from "./components/views/homePage/famePage"
import AttendancePage from "./components/views/adminPage/attendancePage"
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
          <Route exact path="/star" Component={starTable} />
          <Route exact path="/attendance" Component={AttendancePage} />
        </Routes>
      </div>
      <Footer/>
    </Suspense>
  );
}

export default App;