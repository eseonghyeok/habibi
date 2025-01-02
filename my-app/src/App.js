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
import Footer from "./components/views/homePage/footer"
//2025 new version
import pastHabibiPage from "./components/views/homePage/pastHabibiPage"
import monthRecordTable from "./components/views/recordPage/monthPage/MonthRecordTable"
import yearRecordTable from "./components/views/recordPage/yearPage/YearRecordTable"
import dailyTeamPage from "./components/views/recordPage/dayPage/DailyTeamPage"
import dailyResultPage from "./components/views/recordPage/dayPage/DailyResultPage"
import plusRecordPage from "./components/views/recordPage/dayPage/PlusRecordPage"
import minusRecordPage from "./components/views/recordPage/dayPage/MinusRecordPage"

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
          <Route exact path="/record/month" Component={monthRecordTable} />
          <Route exact path="/record/year" Component={yearRecordTable} />
          <Route exact path="/record/teams" Component={dailyTeamPage} />
          <Route exact path="/record/result" Component={dailyResultPage} />
          <Route exact path="/record/plus" Component={plusRecordPage} />
          <Route exact path="/record/minus" Component={minusRecordPage} />
          <Route exact path="/past" Component={pastHabibiPage} />
        </Routes>
      </div>
      <Footer/>
    </Suspense>
  );
}

export default App;