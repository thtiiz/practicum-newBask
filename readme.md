# Practicum_Project_SmartRoom
เนื่องจากปัจจุบันการเล่น basketball จำเป็นต้องใช้สนาม และอุปกรณ์ เช่น ลูกบาสในการเล่น
โครงงานนี้จึงพัฒนามาเพื่อตอบโจทย์คนที่อยากเล่นบาส แต่ ไม่มีสถานที่ หรือ อุปกรณ์ในการเล่น ซึ่งเล่นเพื่อความบันเทิง
## Developers
  * Thitiwat Naprom
  * Sivakorn Thaitare 
  
01204223 Practicum for Computer Engineering
Department of Computer Engineering, Faculty of Engineering, Kasetsart University.

## File Description
  * Python : Backend with Flask and pyusb
  * newbask : Frontend with React
  * firmware : firmware for Practicum_Board
  * schematic.pdf : schematic diagram
  
## Upload firmware
```
cd firmware
make flash
```

## Backend
```
cd python
flask run
```

## Frontend
```
cd newbask
npm start
```
Web will Live on (http://localhost:3000)

## Hardware
 * ATmega168 microcontroller
 * TCRT5000 sensor
 * Switch
