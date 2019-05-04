from practicum import find_mcu_boards, McuBoard, PeriBoard
from time import sleep
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import json
import threading
import time
from apscheduler.schedulers.background import BackgroundScheduler
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
score = 99
isBall = False
haveX2 = False
haveTimeStop = False
skill_score_x = 1
time_stop = False
SKILLTIME = 3
LISTENFREQ = 2
def ButtonListener():
    global haveX2, haveTimeStop
    print("listen---", haveX2, haveTimeStop)
    threading.Timer(LISTENFREQ, ButtonListener).start()
def Initial():
    global score, isBall, skill_score_x, haveX2, haveTimeStop
    score = 0
    isBall = False
    haveX2 = False
    haveTimeStop = False
    skill_score_x = 1

def ResetX2():
    global skill_score_x
    skill_score_x = 1
    print("set x to", skill_score_x)

def ResetTimeStop():
    global time_stop
    time_stop = False
    print("set timestop to ", time_stop)

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

def ActivateX2():
    global skill_score_x, haveX2
    if(haveX2):
        skill_score_x = 2
        print("set x to", skill_score_x)
        timer = threading.Timer(SKILLTIME, ResetX2)
        timer.start()

def ActivateTimeStop():
    global haveTimeStop, time_stop
    if(haveTimeStop):
        time_stop = True
        print("set time_stop to", time_stop)
        threading.Timer(SKILLTIME, ResetTimeStop).start()

    #if pressed handle ActivateX2

####### Listiner #########
ButtonListener()

@app.route('/')
def GameStart():
    global score, isBall, time_stop
    # light = peri.get_light()
    # if(light < length_ball_score):
    #     isBall = True
    # else:
    #     if(isBall):
    #         score += skill_score_x
    #     isBall = False
    # print(light, score, isBall)
    # return str(score)
    return jsonify({"score": score, "haveTimeStop": time_stop})
    ##### ADD SKILL TIME STOP ######

@app.route('/test')
def test():
    global haveX2, skill_score_x
    haveX2 = True
    ActivateX2()
    return jsonify({"score": 99, "haveTimeStop": time_stop})

@app.route('/timeout', methods = ['POST', 'GET'])
def Timeout():
    global score
    data = request.data
    newName = (json.loads(data))['name']
    scoreBoard = ReadScore()
    scoreBoard[newName] = score
    UpdateScore(scoreBoard)
    Initial() # Initial ofr next round
    return jsonify(scoreBoard)

@app.route('/skill', methods = ['POST', 'GET'])
def HaveSkillX():
    global haveX2, haveTimeStop
    data = request.data
    skill = (json.loads(data))['skill']
    print(skill)
    if(skill == 'x2'):
        haveX2 = True
    elif(skill == 'timeStop'):
        haveTimeStop = True
    return "asd"
# app.run(use_reloader=False)