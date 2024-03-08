import * as THREE from "three";
import { createContext, useContext, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Clouds,
  Cloud,
  CameraShake,
  Environment,
  OrbitControls,
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import {
  CuboidCollider,
  BallCollider,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { random } from "maath";
import NavAlbums from "../NavAlbums/NavAlbums";
import styles from "./Progressbar.module.scss";
import { AudioContext } from "../../context/AudioContext";

const context = createContext();

export default function Thundering2Clouds() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showAlbums, setShowAlbums] = useState(false);
  const { stopAndReset } = useContext(AudioContext);

  useEffect(() => {
    stopAndReset();
  }, []);

  const shake = useRef();

  useEffect(() => {
    const loadClouds = () => {
      const interval = setInterval(() => {
        setLoadingProgress((prevProgress) => prevProgress + 5);
      }, 1000);

      setTimeout(() => {
        clearInterval(interval);
        setLoadingProgress(100);
        setShowAlbums(true);
      }, 5000);
    };

    loadClouds();

    return () => clearInterval(loadClouds);
  }, []);

  return (
    <>
      {loadingProgress < 100 ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <div
          style={{
            position: "absolute",
            zIndex: "6",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
          }}
        >
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <PerspectiveCamera
              makeDefault
              position={[0, -4, 18]}
              fov={90}
              onUpdate={(self) => self.lookAt(0, 0, 0)}
            >
              <spotLight
                position={[0, 40, 2]}
                angle={0.5}
                decay={1}
                distance={45}
                penumbra={1}
                intensity={2000}
              />
              <spotLight
                position={[-19, 0, -8]}
                color="red"
                angle={0.25}
                decay={0.75}
                distance={185}
                penumbra={-1}
                intensity={400}
              />
            </PerspectiveCamera>
            <context.Provider value={shake}>
              <CameraShake
                ref={shake}
                decay
                decayRate={0.95}
                maxYaw={0.05}
                maxPitch={0.01}
                yawFrequency={4}
                pitchFrequency={2}
                rollFrequency={2}
                intensity={0}
              />
              <Clouds limit={400} material={THREE.MeshLambertMaterial}>
                <Physics gravity={[0, 0, 0]}>
                  <Pointer />
                  <Puffycloud seed={10} position={[50, 0, 0]} />
                  <Puffycloud seed={20} position={[0, 50, 0]} />
                  <Puffycloud seed={30} position={[50, 0, 50]} />
                  <Puffycloud seed={40} position={[0, 0, -50]} />
                  <CuboidCollider
                    position={[0, -15, 0]}
                    args={[400, 10, 400]}
                  />
                </Physics>
              </Clouds>
            </context.Provider>
            <mesh scale={200}>
              <sphereGeometry />
              <meshStandardMaterial
                color="#999"
                roughness={0.7}
                side={THREE.BackSide}
              />
            </mesh>
            <ContactShadows
              opacity={0.25}
              color="black"
              position={[0, -10, 0]}
              scale={50}
              blur={2.5}
              far={40}
            />
            <OrbitControls
              makeDefault
              autoRotate
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 1.7}
              maxPolarAngle={Math.PI / 1.7}
            />
            <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/blue_lagoon_night_1k.hdr" />
          </Canvas>
        </div>
      )}
      {showAlbums && <NavAlbums />}
    </>
  );
}

function LoadingScreen() {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: "7",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        animation: "progressAnimation 3s linear infinite",
      }}
    >
      <div
        style={{ width: "50%", border: "1px solid #ccc", borderRadius: "5px" }}
      >
        <div className={styles.progressbar} />
      </div>
    </div>
  );
}

function Puffycloud({ seed, vec = new THREE.Vector3(), ...props }) {
  const api = useRef();
  const light = useRef();
  const rig = useContext(context);
  const [flash] = useState(
    () => new random.FlashGen({ count: 10, minDuration: 40, maxDuration: 200 })
  );
  const contact = (payload) =>
    payload.other.rigidBodyObject.userData?.cloud &&
    payload.totalForceMagnitude / 1000 > 100 &&
    flash.burst();
  useFrame((state, delta) => {
    const impulse = flash.update(state.clock.elapsedTime, delta);
    light.current.intensity = impulse * 15000;
    if (impulse === 1) rig?.current?.setIntensity(1);
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(10)
    );
  });
  return (
    <RigidBody
      ref={api}
      userData={{ cloud: true }}
      onContactForce={contact}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      {...props}
      colliders={false}
    >
      <BallCollider args={[4]} />
      <Cloud
        seed={seed}
        fade={30}
        speed={0.1}
        growth={4}
        segments={40}
        volume={6}
        opacity={0.6}
        bounds={[4, 3, 1]}
      />
      <Cloud
        seed={seed + 1}
        fade={30}
        position={[0, 1, 0]}
        speed={0.5}
        growth={4}
        volume={10}
        opacity={1}
        bounds={[6, 2, 1]}
      />
      <pointLight position={[0, 0, 0.5]} ref={light} color="blue" />
    </RigidBody>
  );
}

function Pointer({ vec = new THREE.Vector3(), dir = new THREE.Vector3() }) {
  const ref = useRef();
  useFrame(({ pointer, viewport, camera }) => {
    vec.set(pointer.x, pointer.y, 0.5).unproject(camera);
    dir.copy(vec).sub(camera.position).normalize();
    vec.add(dir.multiplyScalar(camera.position.length()));
    ref.current?.setNextKinematicTranslation(vec);
  });
  return (
    <RigidBody
      userData={{ cloud: true }}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[4]} />
    </RigidBody>
  );
}
