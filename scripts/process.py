import os
import sys
from astropy.io import fits

def process(f):
  hdulist = fits.open(f, mode='update')
  hdulist[0].data = hdulist[0].data.astype("float32")
  hdulist.flush()


if __name__ == '__main__':
  
  if len(sys.argv) != 2:
    sys.exit()
  
  directory = sys.argv[1]
  files = os.listdir(directory)
  for f in files:
    path = os.path.join(directory, f)
    process(path)