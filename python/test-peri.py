from practicum import find_mcu_boards, McuBoard, PeriBoard
from time import sleep
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import json
app = Flask(__name__)
CORS(app)

length_ball_score = 500

# devs = find_mcu_boards()
# if len(devs) == 0:
#     print("*** No practicum board found.")
#     exit(1)

# mcu = McuBoard(devs[0])
# print("*** Practicum board found")
# print("*** Manufacturer: %s" % \
#         mcu.handle.getString(mcu.device.iManufacturer, 256))
# print("*** Product: %s" % \
#         mcu.handle.getString(mcu.device.iProduct, 256))
# peri = PeriBoard(mcu)

# count = 0
score = 9
isBall = False

def ReadScore():
    filename = "score.json"
    with open(filename) as file:
        data = json.load(file)
        return data

def UpdateScore(scoreBoard):
    #### Sort scoreBoard with Value ####
    scoreBoard = sorted(scoreBoard.items(), key=lambda x: (-x[1], x[0]))
    newScoreBoard = {}
    for i in scoreBoard:
        newScoreBoard[i[0]] = i[1]
    ####################################
    filename = "score.json"
    with open(filename, "w") as file:
        json.dump(newScoreBoard, file, ensure_ascii=False, indent=4)

@app.route('/')
def GameStart():
    global score, isBall
    light = peri.get_light()
    if(light < length_ball_score):
        isBall = True
    else:
        if(isBall):
            score += 1
        isBall = False
    print(light, score, isBall)
    return str(score)

@app.route('/light')
def Light():
    # light = peri.get_light()
    return str(800)

@app.route('/timeout', methods = ['POST', 'GET'])
def Timeout():
    global score
    data = request.data
    newName = (json.loads(data))['name']
    scoreBoard = ReadScore()
    scoreBoard[newName] = score
    UpdateScore(scoreBoard)
    score = 0 # reset score to 0
    return jsonify(scoreBoard)