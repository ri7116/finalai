import sys
import json
import numpy as np
#try:
    # Node.js에서 전달된 JSON 데이터를 읽기
    #buffer = sys.stdin.read()

    # JSON 디코딩
    #data = json.loads(buffer)

data = {
"a": 10,
"b": 20,
"c": 30,
"d": 40,
"e": 50,
"f": 60,
"g": 70,
}

list=[[data["a"],data["b"],data["c"],data["d"],data["e"],data["f"],data["g"]]]
print(list)
array =np.array(list)
print(type(array))
print(array)

    # 결과를 JSON 형식으로 출력 (Node.js로 반환)
    #print(json.dumps(processed_data))

#except Exception as e:
    # 에러 메시지를 Node.js에 반환
    #print(f"Error: {str(e)}", file=sys.stderr)
    #sys.exit(1)
