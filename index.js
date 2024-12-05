const express = require("express");
const { spawn } = require("child_process");
const fs = require("fs"); // 파일 시스템 모듈 추가
const path = require("path");
const app = express();
const port = 4000;

app.use(express.json()); // JSON 요청 파싱

app.post("/predict", (req, res) => {
  //이미지 생성
  console.log("AI URL 호출");

  // 요청에서 유저의 PK(ID) 가져오기
  const userId = req.body.device_number; // 클라이언트에서 post로 device넘버를 보내야됨
  if (!userId) {
    return res.status(400).send("기기 번호가 필요합니다.");
  }

  // 파일명 생성 (유저 ID 기반)
  const outputFileName = `${userId}.png`; // 파일명 생성
  const outputFilePath = path.resolve("./aimg", outputFileName); // 저장 경로

  // Python 스크립트 실행
  const pythonOne = spawn("python", ["lstm.py", outputFilePath]);

  let pythonOutput = ""; // Python 출력 저장

  // Python stdout 데이터 수신
  pythonOne.stdout.on("data", (data) => {
    pythonOutput += data.toString();
  });

  // Python stderr 데이터 (에러 처리)
  pythonOne.stderr.on("data", (data) => {
    console.error(`Python Error: ${data.toString()}`);
  });

  // Python 프로세스 종료 후 응답 전송
  pythonOne.on("close", (code) => {
    //console.log(pythonOutput);
    const lines = pythonOutput.trim().split("\n"); // 모든 줄을 배열로 분리
    const lastLine = lines[lines.length - 1]; // 마지막 줄 가져오기
    //console.log(lastLine);
    // 이미지 생성 완료 응답
    res.json({
      device_number: userId,
      predicted_SOH: lastLine,
      file: outputFileName,
    });
  });
});

// 이미지 전송
app.post("/image", (req, res) => {
  const device = req.body.device_number; // URL에서 유저 ID 추출
  const filePath = path.resolve("./aimg", `${device}.png`);
  console.log(req.body.device_number);
  // 파일 존재 여부 확인
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`파일 없음: ${filePath}`);
      return res.status(404).send("이미지 파일을 찾을 수 없습니다.");
    }

    console.log(`이미지 전송: ${filePath}`);
    res.sendFile(filePath);
  });
});

app.listen(port, () => {
  console.log(`서버 실행 중: http://localhost:${port}`);
});
