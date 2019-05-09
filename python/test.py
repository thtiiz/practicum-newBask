from practicum import find_mcu_boards, McuBoard, PeriBoard
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import json
import threading
app = Flask(__name__)
CORS(app)
def ReadScore():
    filename = "score.json"
    with open(filename) as file:
        data = json.load(file)
        return data
@app.route('/scoreboard')
def Scoreboard():
    scoreBoard = ReadScore()
    return jsonify(scoreBoard)