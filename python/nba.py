from practicum import find_mcu_boards, McuBoard, PeriBoard
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import json
import threading
app = Flask(__name__)
CORS(app)

devs = find_mcu_boards()
if len(devs) == 0:
    print("*** No practicum board found.")
    exit(1)

mcu = McuBoard(devs[0])
print("*** Practicum board found")
print("*** Manufacturer: %s" % \
        mcu.handle.getString(mcu.device.iManufacturer, 256))
print("*** Product: %s" % \
        mcu.handle.getString(mcu.device.iProduct, 256)  )
peri = PeriBoard(mcu)

length_ball_score = peri.get_light()-160
score = 0
isBall = False
haveSkill = ['no', 'no']
activateSkill = ['', '']
sw_left = False
sw_right = False
LISTENFREQ = 0.02

def ButtonListener():
    global sw_left, sw_right
    sw_left = peri.get_switch_left()
    sw_right = peri.get_switch_right()
    threading.Timer(LISTENFREQ, ButtonListener).start()
def Initial():
    global score, isBall, haveSkill, activateSkill, sw_left, sw_right
    score = 0
    isBall = False
    haveSkill = ['no', 'no']
    activateSkill = ['', '']
    sw_left = False
    sw_right = False

def ReadScore():
    filename = "score.json"
    with open(filename) as file:
        data = json.load(file)
        return data

def UpdateScore(scoreBoard):
    filename = "score.json"
    with open(filename, "w") as file:
        json.dump(scoreBoard, file, ensure_ascii=False, indent=4)

def ResetSkill(i):
    global activateSkill
    activateSkill[i] = ''
    print("set x to", activateSkill[i])

def ActivateSkill(i):
    global haveSkill, activateSkill
    if(haveSkill[i] != 'no'):
        activateSkill[i] = haveSkill[i]
        haveSkill[i] = 'no'
        print("Activate skill:", i+1)
        if(activateSkill[i]=='x2'):
            time = 10
        else:
            time = 6
        threading.Timer(time, ResetSkill, [i]).start()

####### Listiner #########
ButtonListener()
##########################

@app.route('/game')
def GameStart():
    global score, isBall, sw_left, sw_right, haveSkill, activateSkill
    light = peri.get_light()
    new_score = 1
    countX2 = activateSkill.count('x2')
    if(countX2==1):
        new_score = 2
    elif(countX2==2):
        new_score = 5
    if(light < length_ball_score):
        isBall = True
    else:
        if(isBall):
            score += new_score
        isBall = False
    if (sw_left):
        ActivateSkill(0)
    elif (sw_right):
        ActivateSkill(1)
    print(light, score, isBall, sw_left, sw_right)
    return jsonify({"score": score, "activateSkill": activateSkill, "haveSkill": haveSkill})

@app.route('/initial')
def test():
    Initial()
    return "Initial!!"

@app.route('/skill', methods = ['POST', 'GET'])
def HaveSkillX():
    global haveSkill
    data = request.data
    skill = (json.loads(data))['skill']
    print(skill)
    if(haveSkill[0] == 'no'):
        haveSkill[0] = skill
    elif(haveSkill[1] == 'no'):
        haveSkill[1] = skill
    return "Active " + skill

@app.route('/timeout', methods = ['POST', 'GET'])
def Timeout():
    global score
    data = request.data
    newName = (json.loads(data))['name']
    scoreBoard = ReadScore()
    scoreBoard[newName] = score
    UpdateScore(scoreBoard)
    Initial()
    return jsonify(scoreBoard)

@app.route('/scoreboard')
def Scoreboard():
    scoreBoard = ReadScore()
    return jsonify(scoreBoard)