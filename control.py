import linuxcnc
import sys
# print(len(sys.argv))
s = linuxcnc.stat()
c = linuxcnc.command()

def ok_for_mdi():
    s.poll()
    return not s.estop and s.enabled and s.homed and (s.interp_state == linuxcnc.INTERP_IDLE)

xMove=-5
yMove=-5
zMove=5
feedRate = 70

if(len(sys.argv)>1):
	xMove=sys.argv[1]
if(len(sys.argv)>2):
	yMove=sys.argv[2]
if(len(sys.argv)>3):
	zMove=sys.argv[3]
if(len(sys.argv)>4):
	feedRate=sys.argv[4]



control = "G91 G01 x"+str(xMove)+" Y"+str(yMove)+" Z"+str(zMove)+" F70"

print(control)
if ok_for_mdi():
   c.mode(linuxcnc.MODE_MDI)
   c.wait_complete() # wait until mode switch executed
   print("Starting")
   c.mdi(control)