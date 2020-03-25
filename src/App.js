import React, { useEffect, useCallback, useState } from 'react';
// import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import { useSelector, useDispatch } from "react-redux";
import { increaseCount, updateAllDataSubjectUET } from "./redux/reducerAndAction";

const qs = require("qs");

function getAPI(str, callback) {
  axios.defaults.headers["Content-Type"] =
    "application/x-www-form-urlencoded";

  axios.get(str).then(_res => {
    callback(_res);
  })
    .catch(function (error) {
      console.log(error);
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
  var [TKB, setTKB] = useState([]);
  const dispatch = useDispatch();
  const increase = useCallback(() => dispatch(increaseCount()), [dispatch]);
  const updateAllDataSubject = useCallback(() => dispatch(updateAllDataSubjectUET(allSubject)), [dispatch]);

  useEffect(() => {

    getAPI("https://uet-subject.herokuapp.com/get-data-subject", function (res) {
      // console.log(res);
      setDataAllSubject(res.data);
      setPending(false);
    });


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

    console.log(arrTKB);

    setTKB(arrTKB);
    setLoading(true);

  }

  function handChangeMssv(e) {
    console.log(e.target.value);
    setMssv(e.target.value);
  }

  function renderSubject(obj) {
    return (
      <div>
        <div>{obj.name}</div>
        <div>Tiết: {obj.lession}</div>
        <div>{obj.classRoom}</div>
        <div>Nhóm: {obj.group}</div>
      </div>
    );
  }

  return (
    <div className="App">
      {
        pending ? "Pending" :
          <>
            Your MSSV:
            <input onChange={(e) => { handChangeMssv(e) }} />
            <button onClick={handleGetData} >
              Get TKB
            </button>

            {
              isGetingData ? "System is getting data" :
                <>
                  {
                    loading ?
                      <table>
                        <tr>
                          <td style={{ border: "1px solid" }}>Monday</td>
                          <td style={{ border: "1px solid" }}>Tuesday</td>
                          <td style={{ border: "1px solid" }}>Wednesday</td>
                          <td style={{ border: "1px solid" }}>Thursday</td>
                          <td style={{ border: "1px solid" }}>Friday</td>
                          <td style={{ border: "1px solid" }}>Saturday</td>
                          <td style={{ border: "1px solid" }}>Sunday</td>
                        </tr>
                        {
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
                                        <td style={{ border: "1px solid" }} >
                                          {renderSubject(obj)}
                                        </td>
                                      );
                                    }
                                  })
                                }
                              </tr>
                            );
                          })
                        }
                      </table> : ""
                  }
                </>
            }
          </>
      }
    </div>
  );
}

export default App;
