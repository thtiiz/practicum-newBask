from practicum import find_mcu_boards, McuBoard, PeriBoard
from time import sleep

devs = find_mcu_boards()

if len(devs) == 0:
    print("*** No practicum board found.")
    exit(1)

mcu = McuBoard(devs[0])
print("*** Practicum board found")
print("*** Manufacturer: %s" % \
        mcu.handle.getString(mcu.device.iManufacturer, 256))
print("*** Product: %s" % \
        mcu.handle.getString(mcu.device.iProduct, 256))
peri = PeriBoard(mcu)

while True:
    sw_left = peri.get_switch_left()
    sw_right = peri.get_switch_right()
    light = peri.get_light()
    # light = 1
    print("Switch left state: %-8s | Switch right state: %-8s | Light value: %d" % (
            sw_left, sw_right, light))
    sleep(0.2)


