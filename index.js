const express = require("express");
const { spawn } = require("child_process");
const app = express();
const port = 4000;
const path = require("path");

app.get("/ai", (req, res) => {
  console.log("ai url 호출");

  // Node.js에서 Python으로 전달할 JSON 데이터
  let realdata = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
  };

  // Python 스크립트를 실행 (우분투에서는 python3 사용)
  const pythonOne = spawn("python", ["file1.py"]);

  // JSON 데이터를 문자열로 직렬화하여 Python으로 전달
  pythonOne.stdin.write(JSON.stringify(realdata));
  pythonOne.stdin.end();

  //ai Python 코드 진입
  // Python 출력 처리
  let pythonOutput = ""; // Python 출력 데이터를 저장할 변수
  pythonOne.stdout.on("data", (data) => {
    pythonOutput += data.toString(); // Python의 표준 출력을 읽음
  });

  // Python 프로세스 종료 후 클라이언트 응답 전송
  pythonOne.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    res.send(`Python Output: ${pythonOutput}`); // Python의 결과를 클라이언트로 응답 ##파이썬 실행 테스트
    //res.sendFile(path.join(__dirname, "aimg", "test.jpg")); //dirname은 절대경로임
  });

  // Python 에러 처리
  pythonOne.stderr.on("data", (data) => {
    console.error(`Python Error: ${data.toString()}`);
  });
});

app.listen(port, () => console.log(`서버 가동 on port ${port}`));
