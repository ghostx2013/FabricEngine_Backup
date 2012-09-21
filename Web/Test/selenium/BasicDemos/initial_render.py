from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import filecmp
import os

viewport_png = "viewport.png"
baseUrl = "http://localhost/Fabric/Apps/Sample/"

# set this to True to do the initial generation of resource files
regen = False

def testDemo( driver, drivername, testname, url ):
  driver.get( baseUrl + url )

  # wait for Fabric to say the scene is loaded
  WebDriverWait(driver, 10).until(lambda driver : driver.execute_script(" return typeof(fabricDemoSceneLoaded) != 'undefined' && fabricDemoSceneLoaded "))

  screen_grab_js = "\
    var viewport = scene.getSceneGraphNode('Viewport');\
    var screenGrabber = scene.constructNode('ScreenGrab', { viewport: viewport });\
    setTimeout( function(){\
      screenGrabber.writeImageFile('"+ os.path.join( ".", viewport_png ) +"');\
      scene.captured = true;\
    }, 100 );\
  "
  driver.execute_script( screen_grab_js )

  # since there's a delay in the screen grab, wait for it to complete
  WebDriverWait(driver, 10).until(lambda driver : driver.execute_script(" return scene.captured "))
 
  orig_viewport_png = os.path.join( "resources", testname + "-" + viewport_png )

  # for regenerating resource files
  if regen:
    if not os.path.exists( "resources" ):
      os.mkdir( "resources" )
    os.rename( viewport_png, orig_viewport_png )
    return

  if not filecmp.cmp( viewport_png, orig_viewport_png ):
    print drivername + ": " + testname + ": viewport FAIL"
    os.rename( viewport_png, "Failed-" + drivername + "-" + testname + "-" + viewport_png )
    # take a screenshot on failure too
    driver.save_screenshot( "Failed-" + drivername + "-" + testname + "-screen.png" )
  else:
    print drivername + ": " + testname + ": viewport OK"
    os.unlink( viewport_png )

  # do additional testing here

def basicDemosTest( driver, drivername ):
  # open a fixed-size window for testing
  driver.execute_script( "window.open('','testwindow','width=1024,height=768')" )
  driver.close()
  driver.switch_to_window( "testwindow" )

  testDemo( driver, drivername, "Background", "BasicDemos/BackgroundTexture.html" )
  testDemo( driver, drivername, "Skeleton", "BasicDemos/CharacterSkeleton.html" )
  testDemo( driver, drivername, "Skinning", "BasicDemos/CharacterSkinning.html" )
  testDemo( driver, drivername, "Keyframe", "BasicDemos/KeyframeAnimation.html" )
  testDemo( driver, drivername, "Manipulators", "BasicDemos/Manipulators.html" )
  testDemo( driver, drivername, "Materials", "BasicDemos/Materials.html" )
  testDemo( driver, drivername, "ModelViewer", "BasicDemos/ModelViewer.html" )
  testDemo( driver, drivername, "ModelViewer", "BasicDemos/ModelViewer.html" )
  testDemo( driver, drivername, "MouseEvents", "BasicDemos/MouseEvents.html" )
  testDemo( driver, drivername, "Painting", "BasicDemos/Painting.html" )
  testDemo( driver, drivername, "PerPoint", "BasicDemos/PerPointDeformation.html" )
#  testDemo( driver, drivername, "Primitives", "BasicDemos/Primitives.html" )
#  testDemo( driver, drivername, "Tesselation", "BasicDemos/Tesselation.html" )
  testDemo( driver, drivername, "Transform", "BasicDemos/TransformAnimation.html" )
  testDemo( driver, drivername, "Video", "BasicDemos/Video.html" )
#  testDemo( driver, drivername, "Face", "BasicDemos/OpenCV.html" )
  testDemo( driver, drivername, "Selection", "BasicDemos/Selection.html" )
  testDemo( driver, drivername, "WebSockets", "BasicDemos/WebSockets.html" )

  driver.quit()

basicDemosTest( webdriver.Firefox(), "Firefox" )
if not regen:
  basicDemosTest( webdriver.Chrome(), "Chrome" )

