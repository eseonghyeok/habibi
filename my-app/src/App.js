import React, { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/views/homePage/homePage";
import Bar from "./components/views/homePage/bar"
// import awardPage from "./components/views/homePage/awardPage"
import attendancePage from "./components/views/adminPage/attendancePage"
import notiPage from "./components/views/homePage/notiPage"
import playerListPage from "./components/views/playerPage/playerListPage"
import Footer from "./components/views/homePage/footer"
import pastHabibiPage from "./components/views/homePage/pastHabibiPage"
import dailyRecordTable from "./components/views/recordPage/dayPage/DailyRecordTable"
import monthRecordTable from "./components/views/recordPage/monthPage/MonthRecordTable"
import yearRecordTable from "./components/views/recordPage/yearPage/YearRecordTable"
import dailyTeamPage from "./components/views/recordPage/dayPage/DailyTeamPage"
import attendanceCheckPage from "./components/views/recordPage/dayPage/AttendanceCheckPage"

import './App.css';

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <Bar />
      <div>
        <Routes>
          <Route exact path="/" Component={HomePage} />
          {/* <Route exact path="/award" Component={awardPage} /> */}
          <Route exact path="/notification" Component={notiPage} />
          <Route exact path="/player/list" Component={playerListPage} />
          <Route exact path="/record/year" Component={yearRecordTable} />
          <Route exact path="/record/month" Component={monthRecordTable} />
          <Route exact path="/record/day" Component={dailyRecordTable} />
          <Route exact path="/attendance" Component={attendancePage} />
          <Route exact path="/record/teams" Component={dailyTeamPage} />
          <Route exact path="/record/attendanceCheck" Component={attendanceCheckPage} />
          <Route exact path="/past" Component={pastHabibiPage} />
        </Routes>
      </div>
      <Footer/>
    </Suspense>
  );
}

export default App;