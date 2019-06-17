(function() {
  "use strict" 

  var scene, camera, renderer 

  var container,
    HEIGHT,
    WIDTH,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    windowHalfX,
    windowHalfY,
    cubes = [],
    animationHash = {}; 

  init() 
  animate() 

  function init() {
    HEIGHT = window.innerHeight 
    WIDTH = window.innerWidth 
    windowHalfX = WIDTH / 2 
    windowHalfY = HEIGHT / 2 

    fieldOfView = 75 
    aspectRatio = WIDTH / HEIGHT 
    nearPlane = 1 
    farPlane = 3000 

    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    ) 
    camera.position.set(15, 15, 10) 

    scene = new THREE.Scene() 

    container = document.createElement("div") 
    document.body.appendChild(container) 
    document.body.style.margin = 0 
    document.body.style.overflow = "hidden" 

    var positions = [] 
    var directionalLight = new THREE.PointLight(0xffffff, 1) 
    scene.add(directionalLight) 
    for (var i = 0;  i < 30;  i++) {
      for (var j = 0;  j < 30;  j++) {
        var y = j 
        var x = i 
        var z = 0 
        positions.push(x, y, z) 
        let cubeGeo = new THREE.CubeGeometry(1, 1, 1) 
        var cubeMat = new THREE.MeshPhongMaterial({
          color: 0xffffff
        }) 
        let indiCube = new THREE.Mesh(cubeGeo, cubeMat) 
        indiCube.position.x = x 
        indiCube.position.y = y + 35
        indiCube.position.z = z 
        scene.add(indiCube) 
        cubes.push(indiCube) 
        let dropT = new TWEEN.Tween(indiCube.position)
        .to({ y: y }, x * 100)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start() 
        rotateAndScale(indiCube)
      }
    }
    directionalLight.position.set(
      cubes[60].position.x,
      cubes[60].position.y,
      cubes[60].position.z + 200
    ) 

    renderer = new THREE.WebGLRenderer() 
    renderer.setPixelRatio(window.devicePixelRatio) 
    renderer.setSize(WIDTH, HEIGHT) 

    container.appendChild(renderer.domElement) 

    window.addEventListener("resize", onWindowResize, false) 
    document.addEventListener("mousemove", onDocumentMouseMove, false) 
    document.addEventListener("touchstart", onDocumentTouchStart, false) 
    document.addEventListener("touchmove", onDocumentTouchMove, false) 
  }

  function animate() {
    requestAnimationFrame(animate) 
    render() 
  }

  function render() {
    TWEEN.update() 

    if (windowHalfX < 500) {
      let randomCube = cubes[Math.floor(Math.random() * cubes.length)] 
      rotateAndScale(randomCube)
    }

    renderer.render(scene, camera) 
  }

  function rotateAndScale(item) {
    let rotateT = new TWEEN.Tween(item.rotation)
      .to({ y: Math.PI, x: Math.PI }, 2000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start() 
    rotateT.onComplete(() => {
      let rotateT = new TWEEN.Tween(item.rotation)
        .to({ y: 0, x: 0 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start() 
      animationHash[item.uuid] = false 
    }) 
    let scaleT = new TWEEN.Tween(item.scale)
      .to({ y: 0.1, x: 0.1, z: 0.1 }, 2000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start() 
    scaleT.onComplete(() => {
      let scaleT = new TWEEN.Tween(item.scale)
        .to({ y: 1, x: 1, z: 1 }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start() 
      animationHash[item.uuid] = false 
    }) 
  }

  function raycastDoc(event) {
    let mouse = new THREE.Vector3(),
    INTERSECTED 
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1 
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 
  let raycaster = new THREE.Raycaster() 
  raycaster.setFromCamera(mouse, camera) 

  var intersects = raycaster.intersectObjects(scene.children) 
  if (intersects.length > 0) {
    if (intersects[0].object != INTERSECTED) {
      INTERSECTED = intersects[0].object 
      if (animationHash[INTERSECTED.uuid]) return 
      animationHash[INTERSECTED.uuid] = true 

      rotateAndScale(INTERSECTED)
    }
  } else {
    if (INTERSECTED) INTERSECTED = null 
  }
  }

  function onDocumentMouseMove(e) {
    event.preventDefault() 
    raycastDoc(event)
  }

  function onDocumentTouchStart(e) {
    if (e.touches.length === 1) {
      e.preventDefault() 
      mouseX = e.touches[0].pageX - windowHalfX 
      mouseY = e.touches[0].pageY - windowHalfY 
      raycastDoc(e)
    }
  }

  function onDocumentTouchMove(e) {
    if (e.touches.length === 1) {
      e.preventDefault() 
      mouseX = e.touches[0].pageX - windowHalfX 
      mouseY = e.touches[0].pageY - windowHalfY 
      raycastDoc(e)
    }
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2 
    windowHalfY = window.innerHeight / 2 

    camera.aspect = window.innerWidth / window.innerHeight 
    camera.updateProjectionMatrix() 
    renderer.setSize(window.innerWidth, window.innerHeight) 
  }
})() 
