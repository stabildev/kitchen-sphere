import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const hdrTextureUrl = new URL(
  './img/MR_INT-003_Kitchen_Pierre.hdr',
  import.meta.url
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.autoRotate = true

camera.position.set(0, 0, 7)
orbit.update()

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.8

const loader = new RGBELoader()
loader.load(hdrTextureUrl, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.background = texture
  scene.environment = texture

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0.1,
    })
  )
  scene.add(sphere)
  sphere.position.y = -1.25
  const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 50, 50),
    new THREE.MeshStandardMaterial({
      roughness: 0,
      metalness: 1,
    })
  )
  scene.add(sphere2)
  sphere2.position.y = 1.25
})

const animate = () => {
  orbit.update()
  renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
