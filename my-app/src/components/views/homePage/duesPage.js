import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Modal } from 'antd';
import dayjs from 'dayjs';
import backgroud from '../../images/noti.jpg'

function DuesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(dayjs().format('YYYY'));
  const [month, setMonth] = useState(null);
  const [result, setResult] = useState({});
  const years = useRef([]);
  const months = useRef([]);
  const scrollRef = useRef(null);
  const buttonRefs = useRef({});
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    async function getDate() {
      setLoading(true);
      try {
        const duesData = (await Axios.get(`/api/dues`)).data;
        if (duesData.length === 0) throw new Error(null);
        years.current = [...new Set(duesData.map(dues => dues.date.slice(0, 4)))].sort();
        setResult(duesData.at(-1));
        setYear(years.current.at(-1));
      } catch {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
          alert('회비 내역이 존재하지 않습니다.');
          navigate('/');
        }
        return;
      } finally {
        setLoading(false);
      }
    }
    getDate();
  }, [navigate]);

  useEffect(() => {
    async function getMonths() {
      try {
        if (buttonRefs.current[year]) {
          buttonRefs.current[year].scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        } else {
          return;
        }

        const duesData = (await Axios.get(`/api/dues/date/${year}`)).data;
        if (duesData.length === 0) throw new Error(null);
        months.current = duesData.reverse().map((dues) => dues.date);
        setMonth(months.current[0]);
      } catch {
        alert('회비 내역이 존재하지 않습니다.');
        window.location.reload();
      }
    }
    getMonths();
  }, [navigate, loading, year]);

  useEffect(() => {
    async function getResult() {
      if (!month) return;

      try {
        setResult((await Axios.get(`/api/dues/date/${month}`)).data[0]);
      } catch (err) {
        alert('회비 내역 가져오기를 실패하였습니다.');
        window.location.reload();
        throw err;
      }
    }
    getResult();
  }, [month]);

  const fileUpload = async () => {
    alert('동일한 달의 데이터는 덮어써집니다.');

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";

    input.onchange = async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        await Axios.post('/api/dues', formData);

        alert('파일 업로드 성공했습니다.');
        window.location.reload();
      } catch (err) {
        alert('파일 업로드 실패했습니다.');
        window.location.reload();
      }
    };

    input.click();
  };

  const summary = async () => {
    const categorys = [ "구장비", "회비", "식음료비" ]
    const summary = {
      입금: { 기타: 0 },
      출금: { 기타: 0 },
    };
    categorys.forEach(category => {
      summary["입금"][category] = summary["출금"][category] = 0;
    });

    const parseMoney = (str) => {
      const num = Number(String(str).replace(/,/g, ""));
      return isNaN(num) ? 0 : num;
    };

    result.history.forEach((item) => {
      const type = item["구분"];
      const content = String(item["메모"] || "").trim();
      const memo = String(item["메모"] || "").trim();
      const amount = Math.abs(parseMoney(item["거래금액"]));

      summary[type]["기타"] += amount;
      for (const category of categorys) {
        if ((content.includes(category) || memo.includes(category))) {
          summary[type][category] += amount;
          summary[type]["기타"] -= amount;
        }
      }
    });

    Modal.info({
      title: "입금/출금별 지출 요약",
      width: 500,
      content: (
        <div style={{ marginTop: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>항목</th>
                <th style={thStyle}>입금</th>
                <th style={thStyle}>출금</th>
              </tr>
            </thead>
            <tbody>
              {[...categorys, "기타"].map((key) => (
                <tr key={key}>
                  <td style={tdStyle}>{key}</td>
                  <td style={tdStyle}>{`${summary.입금[key].toLocaleString()}원`}</td>
                  <td style={tdStyle}>{`${summary.출금[key].toLocaleString()}원`}</td>
                </tr>
              ))}
              <tr>
                <td style={{ ...tdStyle, fontWeight: "bold", borderTop: "2px solid #666" }}>합계</td>
                <td style={{ ...tdStyle, fontWeight: "bold", borderTop: "2px solid #666" }}>
                  {`${Object.values(summary.입금).reduce((acc, v) => acc + v, 0).toLocaleString()}원`}
                </td>
                <td style={{ ...tdStyle, fontWeight: "bold", borderTop: "2px solid #666" }}>
                  {`${Object.values(summary.출금).reduce((acc, v) => acc + v, 0).toLocaleString()}원`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
      okText: '확인'
    });
  };

  const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    textAlign: "center"
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "center"
  };

  const Table = ({ dues }) => {
    return (
      <div>
        <h2 style={{ color: "white", paddingTop: "30px" }}>잔액: {dues.money.balance.toLocaleString()}원</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ color: "white", margin: 0 }}>입금: {dues.money.in.toLocaleString()}원</h3>
          <h3 style={{ color: "white", margin: 0 }}>출금: {dues.money.out.toLocaleString()}원</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
            <thead>
            <tr>
              {dues.history.length > 0 &&
                Object.keys(dues.history[0]).map((key) => (
                  <th key={key} style={thStyle}>{key}</th>
                ))}
            </tr>
            </thead>
            <tbody>
              {dues.history.map((item, idx) => (
                <tr
                  key={idx}
                  style={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
                >
                  {Object.keys(item).map((key) => (
                    <td key={key} style={tdStyle}>
                      {item[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const buttonStyle = (isActive) => ({
    marginRight: '10px',
    padding: '10px 20px',
    border: 'none',
    backgroundColor: isActive ? '#007bff' : 'rgb(227 227 227)',
    color: isActive ? 'white' : 'black',
    cursor: 'pointer',
    fontSize: '16px'
  });

  const scrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    backgroundColor: 'yellow',
    padding: '10px 0'
  };

  if (loading) return <p>⏳ loading...</p>;

  return (
    <div>
      {(years.current.length > 0) && (
        <div>
          <div style={scrollContainerStyle} ref={scrollRef}>
            {years.current.map((y) => (
              <button
                key={y}
                style={buttonStyle(year === y)}
                onClick={() => setYear(y)}
                ref={(el) => buttonRefs.current[y] = el}
              >
                {y}년
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'yellow', padding: '5px' }}>
            <button style={{ marginRight: '10px' }}
              onClick={() => summary()}
            >
              요약
            </button>
            {(localStorage.getItem('isLoggedIn') === 'true') && (
              <button
                onClick={() => fileUpload()}
              >
                파일 업로드
              </button>
            )}

            <select
              onChange={e => setMonth(e.target.value)}
              style={{ height: '30px', width: '100px', marginLeft: 'auto' }}

            >
              {months.current.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div style={{ minHeight: "100vh", padding: "10px", backgroundImage: `url(${backgroud})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "10px", color: "white", fontSize: "34px" }}>💵회비 내역💵</h1>
          <p style={{ fontSize: '15px', color: "#fff", marginBottom: '20px' }}>💡월별로 회비의 거래내역과 잔액을 확인할 수 있습니다.</p>
          {isLoggedIn && (
            <p style={{ fontSize: '15px', color: "#fff", marginBottom: '20px' }}>💡거래내역 파일을 업로드할 수 있습니다.</p>
          )}
        </div>
        {(years.current.length > 0) ? (
          <Table dues={result} />
        ) : isLoggedIn && (
          <div style={{ backgroundColor: '#f5f5f5', minHeight: '300px', marginTop: '20px', borderRadius: '5px', padding: '20px' }}>
            <div
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '460px', color: '#999', textAlign: 'center' }}
            >
              <div style={{ paddingBottom: '20px' }}>
                회비 내역이 존재하지 않습니다.
                <br />
                파일 업로드를 해주세요.
              </div>
              <button style={{ textAlign: 'center', padding: '50px', color: '#999' }}
                onClick={() => fileUpload()}
              >
                파일 업로드
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DuesPage;

