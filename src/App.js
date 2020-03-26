import React, { useEffect, useCallback, useState } from 'react';
// import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { useSelector, useDispatch } from "react-redux";
import { increaseCount, updateAllDataSubjectUET } from "./redux/reducerAndAction";

const qs = require("qs");

const styleDayOfWeek = {
  background: "#ff3a3a"
}

const styleSubject = {
  background: "#12d412"
}

const stylePending = {
  height: "100%",
  width: "100%",
  position: "fixed",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "rgba(174, 174, 235, 0.5)",
  flexDirection: "column"
}

const styleWheel = {
  height: "100px",
  width: "100px",
  border: "10px solid",
  borderRadius: "50%",
  borderStyle: "dashed"
}

function getAPI(str, callback) {
  axios.defaults.headers["Content-Type"] =
    "application/x-www-form-urlencoded";

  axios.get(str).then(_res => {
    callback(_res);
  })
    .catch(function (error) {
      // console.log(error);
      callback([]);
    });
}

function postAPI(strAPI, data, callback) {

  axios.defaults.headers["Content-Type"] =
    "application/x-www-form-urlencoded";

  axios({
    method: "post",
    url: strAPI,
    data: qs.stringify({ mssv: data }),
    config: {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  }).then(data => {
    callback(data)
  }).catch(function (error) {

  });

}


function App() {
  const { count, dataAllSubject } = useSelector(state => ({
    ...state.reducer
  }));

  var [mssv, setMssv] = useState("");
  var [allSubject, setDataAllSubject] = useState([]);
  var [loading, setLoading] = useState(false);
  var [pending, setPending] = useState(true);
  var [isGetingData, setIsGetingData] = useState(false);
  var [infoStudent, setInfoStudent] = useState({});
  var [TKB, setTKB] = useState([]);
  const dispatch = useDispatch();
  const increase = useCallback(() => dispatch(increaseCount()), [dispatch]);
  const updateAllDataSubject = useCallback(() => dispatch(updateAllDataSubjectUET(allSubject)), [dispatch]);
  const DAY_OF_WEEK = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
  const [sizeWidth, setSizeWidth] = useState(window.innerWidth);
  const [isCollapse, setIsCollapse] = useState(false);
  const [TKB_Collapse, setTKBCollapse] = useState([]);

  function getResizeScreen() {
    return window.innerWidth;
  }

  useEffect(() => {

    getAPI("https://uet-subject.herokuapp.com/get-data-subject", function (res) {
      // console.log(res);
      setDataAllSubject(res.data);
      setPending(false);
    });

    function handleResize() {
      // console.log(getResizeScreen());
      setSizeWidth(getResizeScreen);
    }

    window.addEventListener('resize', handleResize);

    return () => { window.addEventListener('resize', handleResize) }


  }, []);

  function checkInSubStudent(allSubjectOfStudent, codeFull, group) {
    for (var i = 0; i < allSubjectOfStudent.length; i++) {
      if (allSubjectOfStudent[i].codeFull == codeFull && allSubjectOfStudent[i].group == group) {
        return true;
      }
      if (allSubjectOfStudent[i].codeFull == codeFull && group == "CL") {
        return true;
      }
    }
    return false;
  }

  function handleGetData() {
    setIsGetingData(true);
    postAPI("https://uet-subject.herokuapp.com/get-data-subject-from-mssv", mssv, function (res) {
      getData(res.data);

      setInfoStudent({
        name: res.data[0].name,
        dob: res.data[0].dateOfbirth,
        class: res.data[0].class
      });

      setIsGetingData(false);
    })

  }

  async function getData(allSubjectOfStudent) {
    var sessionToLearn = [];
    sessionToLearn = await allSubject.filter((item) => {
      return checkInSubStudent(allSubjectOfStudent, item.codeFull, item.group);
    })

    handleBuildTKB(sessionToLearn);
  }

  function handleBuildTKB(sessionToLearn) {
    var arrTKB = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    for (var i = 0; i < sessionToLearn.length; i++) {

      for (var j = 2; j <= 7; j++) {
        if (sessionToLearn[i].daysOfTheWeek == j) {
          var tmp = sessionToLearn[i].lession.split("-");
          arrTKB[parseInt(tmp[0]) - 1][j - 2] = sessionToLearn[i];
        }
      }

    }

    // console.log(arrTKB);

    setTKB(arrTKB);
    setIsCollapse(false);
    setLoading(true);

  }

  function handChangeMssv(e) {
    // console.log(e.target.value);
    setMssv(e.target.value);
  }

  function collapseMatrix(arr) {

    var a = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ];

    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a[0].length; j++) {
        a[i][j] = arr[i][j];
      }
    }

    for (var i = 0; i < a.length; i++) {
      for (var j = 0; j < a[0].length; j++) {
        if (a[i][j] != 0) {
          for (var k = 0; k < i; k++) {
            if (a[k][j] == 0) {
              let tmp = a[i][j];
              a[i][j] = a[k][j];
              a[k][j] = tmp;
            }
          }
        }
      }
    }

    return a;
  }

  function handleCollapse() {
    setIsCollapse(true);
    setTKBCollapse(collapseMatrix(TKB));
  }

  function handleCancelCollapse() {
    setIsCollapse(false);
  }

  function getTime(lession){
    var arr = lession.split("-");
    // console.log(arr);
    for(var i = 0; i<arr.length; i++){
      arr[i] = parseInt(arr[i])+6;
    }
    return arr[0]+"h-"+arr[1]+"h";
  }

  function renderSubject(obj) {
    return (
      <div>
        <div className="px-90-prs">{obj.name}</div>
        <div className="px-90-prs" >Tiết: {obj.lession}</div>
        <div className="px-90-prs" >Thời gian: {getTime(obj.lession)} </div>
        <div className="px-90-prs" >Phòng:{obj.classRoom}</div>
        <div className="px-90-prs" >Nhóm: {obj.group}</div>
      </div>
    );
  }

  function renderTKB(TKB) {
    return (
      TKB.map((item, index) => {
        return (
          <tr key={index} >
            {
              item.map((obj) => {
                if (obj.stt == undefined) {
                  return <td></td>;
                }
                else {
                  return (
                    <td style={styleSubject} className="b-td b-radius-5 p-10 fw-500"  >
                      {renderSubject(obj)}
                    </td>
                  );
                }
              })
            }
          </tr>
        );
      })
    );
  }

  function pendingWait() {
    return (
      <div style={stylePending} >
        <div style={{ margin: "10px" }} className="color-blue-bold text-bold" > Đợi chút nhé ... </div>
        <div style={styleWheel} className="wheel color-blue" >
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {
        pending ? pendingWait() :
          <>
            <div className="px-2 text-bold color-blue-bold-medium mt-10" >Thời Khóa Biểu</div>
            <div className="flex center column w-100 mt-20" >
              <div className="px-1 text-bold" >
                Mã số sinh viên UET:
              </div>
              <div className="flex center row w-100 flex-wrap" >
                <input className="app-input b-radius-10" onChange={(e) => { handChangeMssv(e) }} />
                <div>
                  {
                    sizeWidth > 700 ?
                      <button className="app-button b-radius-10 text-bold" onClick={handleGetData} >
                        Tạo thời khóa biểu
                    </button>
                      :
                      <button className="app-button b-radius-10 text-bold" onClick={handleGetData} >
                        Tạo TKB
                    </button>
                  }
                  {
                    isCollapse == false ?
                      <button className="app-button b-radius-10 text-bold" onClick={handleCollapse} >Thu gọn</button>
                      :
                      <button className="app-button b-radius-10 text-bold" onClick={handleCancelCollapse} >Bỏ thu gọn</button>
                  }
                </div>

              </div>
            </div>

            <div className="flex center column w-100 mt-10" >
              {
                isGetingData ?
                  <>
                    <div style={styleWheel} className="wheel color-blue" >
                    </div>
                  </> :
                  <>
                    {
                      loading ?
                        <>
                          <div className="flex row mb-10" >
                            <div className="text-bold p-10 ">{infoStudent.name}</div>
                            <div className="text-bold p-10" >{infoStudent.dob}</div>
                            <div className="text-bold p-10" >{infoStudent.class}</div>
                          </div>
                          <table className="w-100" >
                            <tr>

                              {
                                DAY_OF_WEEK.map((item) => {
                                  return (
                                    <td style={styleDayOfWeek} className="b-td b-radius-5 p-10 text-bold px-90-prs" >{item}</td>
                                  );
                                })
                              }
                            </tr>
                            {
                              isCollapse ? renderTKB(TKB_Collapse) : renderTKB(TKB)
                            }
                          </table>
                        </> : ""
                    }
                  </>
              }
            </div>


          </>
      }
    </div>
  );
}

export default App;
